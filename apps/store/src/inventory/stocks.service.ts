import { Injectable, NotFoundException } from '@nestjs/common';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { StocksRepository } from './stocks.repository';
import { STOCK_PAGINATION_CONFIG } from './pagination-config';
import { WarehousesRepository } from '../warehouse/warehouses.repository';
import { In, Not } from 'typeorm';
import { UpdateInventoryStockVirtualyDto } from './dto/update-inventory-stock-virtualy.dto';
import { Stock } from '@app/store';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class StocksService {
  constructor(
    private readonly stocksRepository: StocksRepository,
    private readonly warehousesRepository: WarehousesRepository,
    private readonly ordersService: OrdersService,
  ) {}

  async findAllStock2(_query: PaginateQuery) {
    _query;
    const items = await this.stocksRepository.entityRepository
      .createQueryBuilder('stock')
      .select('stock.warehouse_id', 'warehouse_id')
      .addSelect('stock.product_id', 'product_id')
      .addSelect(
        'SUM(CASE WHEN stock.quantity > 0 THEN stock.quantity ELSE 0 END)',
        'inward',
      )
      .addSelect(
        'SUM(CASE WHEN stock.quantity < 0 THEN -stock.quantity ELSE 0 END)',
        'outward',
      )
      .addSelect('SUM(stock.quantity)', 'stock')
      .addSelect('product.name', 'product_name')
      .addSelect('product.product_code', 'product_code')
      .innerJoin('product', 'product', 'product.id = stock.product_id')
      .addSelect('warehouse.title', 'warehouse_title')
      .innerJoin('warehouse', 'warehouse', 'warehouse.id = stock.warehouse_id')
      .groupBy('stock.warehouse_id')
      .addGroupBy('stock.product_id')
      .addGroupBy('product.name')
      .addGroupBy('product.product_code')
      .addGroupBy('warehouse.title')
      .orderBy('warehouse_title', 'ASC')
      .addOrderBy('product_code', 'ASC')
      .getRawMany();

    return {
      data: items,
      meta: {
        itemsPerPage: items.length,
        totalItems: items.length,
        currentPage: 1,
        totalPages: 1,
      },
      links: {},
    };
  }

  async findAllStock(query: PaginateQuery) {
    const { filter } = query;

    const warehouseId = filter?.warehouse_id
      ? String(filter.warehouse_id).split(':')[1]
      : undefined;
    const productId = filter?.product_id
      ? String(filter.product_id).split(':')[1]
      : undefined;
    const productCode = filter?.product_code
      ? String(filter.product_code).split(':')[1]
      : undefined;

    const queryBuilder = this.stocksRepository.entityRepository
      .createQueryBuilder('stock')
      .select('stock.warehouse_id', 'warehouse_id')
      .addSelect('stock.product_id', 'product_id')
      .addSelect('SUM(stock.quantity)', 'total_quantity')
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .leftJoinAndSelect('stock.product', 'product')
      .groupBy('stock.warehouse_id')
      .addGroupBy('stock.product_id')
      .addGroupBy('warehouse.id')
      .addGroupBy('product.id');

    if (warehouseId) {
      queryBuilder.andWhere('stock.warehouse_id = :warehouseId', {
        warehouseId,
      });
    }
    if (productId) {
      queryBuilder.andWhere('stock.product_id = :productId', { productId });
    }
    if (productId) {
      queryBuilder.andWhere('stock.product_code = :productCode', {
        productCode,
      });
    }

    const items = await queryBuilder.getRawMany();

    return {
      data: items,
      meta: {
        itemsPerPage: items.length,
        totalItems: items.length,
        currentPage: 1,
        totalPages: 1,
      },
      links: {},
    };
  }

  async findAllStockInfo(query: PaginateQuery) {
    return paginate(
      query,
      this.stocksRepository.entityRepository,
      STOCK_PAGINATION_CONFIG,
    );
  }

  async findStockProduct(product_id: number) {
    // Read virtualy warehouse
    const warehouses = await this.warehousesRepository.find({
      is_virtualy: true,
    });
    const warehouseIds = warehouses?.map((_) => _.id);

    const quantity = await this.stocksRepository.sum('quantity', {
      product_id,
      warehouse_id: Not(In(warehouseIds)),
    });

    const available_quantity = await this.stocksRepository.sum(
      'available_quantity',
      {
        product_id,
        warehouse_id: In(warehouseIds),
      },
    );

    const result = {
      quantity: quantity ? quantity : 0,
      available_quantity: available_quantity ? available_quantity : 0,
    };

    return result;
  }

  async getStockProductVirtualy(product_id: number) {
    // Read virtualy warehouse
    const warehouse = await this.warehousesRepository.findOneNoCheck({
      is_virtualy: true,
    });

    if (!warehouse) {
      return { quantity: 0 };
    }

    const warehouse_id = warehouse.id;

    const available_quantity = await this.stocksRepository.sum(
      'available_quantity',
      {
        product_id,
        warehouse_id,
      },
    );

    return { available_quantity: available_quantity ? available_quantity : 0 };
  }

  async updateStockProductVirtualy(
    product_id: number,
    updateInventoryStockVirtualyDto: UpdateInventoryStockVirtualyDto,
  ) {
    // Read virtualy warehouse
    const warehouse = await this.warehousesRepository.findOneNoCheck({
      is_virtualy: true,
    });

    if (!warehouse) {
      throw new NotFoundException('انبار مجازی یافت نشد!');
    }

    const warehouse_id = warehouse.id;
    const available_quantity =
      updateInventoryStockVirtualyDto.available_quantity;

    // Find stock
    let stock = await this.stocksRepository.findOneNoCheck({
      product_id,
      warehouse_id,
    });

    // Update
    if (stock) {
      stock.available_quantity =
        updateInventoryStockVirtualyDto.available_quantity;
      stock = await this.stocksRepository.save(stock);
    }
    // Create a new
    else {
      stock = new Stock({
        quantity: 0,
        available_quantity,
        warehouse_id,
        product_id,
      });
      stock = await this.stocksRepository.create(stock);
    }

    return { available_quantity: available_quantity ? available_quantity : 0 };
  }

  async updateStockProductVirtualyAvailableQuantityByOrder(
    order_id: number,
    is_paid: boolean,
  ) {
    // Read virtualy warehouse
    const warehouse = await this.warehousesRepository.findOneNoCheck({
      is_virtualy: true,
    });

    if (!warehouse) {
      return;
    }
    const warehouse_id = warehouse.id;

    // Read order data
    const order = await this.ordersService.findOneWithOrderItemsData({
      id: order_id,
    });

    order.order_items?.map(async (item) => {
      const product_id = item.product_id;
      const quantity = item.quantity;

      if (!product_id) return;

      // Find stock
      let stock = await this.stocksRepository.findOneNoCheck({
        product_id,
        warehouse_id,
      });

      // Update
      if (stock && is_paid && stock.available_quantity > 0) {
        stock.available_quantity -= quantity;
        stock = await this.stocksRepository.save(stock);
      }
    });

    return;
  }

  async updateStockProductVirtualyAvailableQuantityByScrape(
    product_id: number,
    available_quantity: number,
  ) {
    // Read virtualy warehouse
    const warehouse = await this.warehousesRepository.findOneNoCheck({
      is_virtualy: true,
    });

    if (!warehouse) {
      return;
    }
    const warehouse_id = warehouse.id;

    // Find stock
    let stock = await this.stocksRepository.findOneNoCheck({
      product_id,
      warehouse_id,
    });

    // Update
    if (stock) {
      stock.available_quantity = available_quantity;
      stock = await this.stocksRepository.save(stock);
    }
    // Create a new
    else {
      stock = new Stock({
        quantity: 0,
        available_quantity,
        warehouse_id,
        product_id,
      });
      stock = await this.stocksRepository.create(stock);
    }

    return;
  }
}

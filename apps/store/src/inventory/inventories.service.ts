import { Injectable } from '@nestjs/common';
import { InventoriesRepository } from './inventories.repository';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoryType, OperatorType, getStartOfDate } from '@app/common';
import { GetInventoryDto } from './dto/get-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { INVENTORY_PAGINATION_CONFIG } from './pagination-config';
import { InventoryItemsRepository } from './inventory-items.repository';
import {
  Inventory,
  InventoryItem,
  Product,
  Stock,
  User,
  Warehouse,
} from '@app/store';
import { StocksRepository } from './stocks.repository';

@Injectable()
export class InventoriesService {
  constructor(
    private readonly inventoriesRepository: InventoriesRepository,
    private readonly inventoryItemsRepository: InventoryItemsRepository,
    private readonly stocksRepository: StocksRepository,
  ) {}

  async create(createInventoryDto: CreateInventoryDto, user: User) {
    const inventory_date =
      createInventoryDto.inventory_date || getStartOfDate();
    const inventory_number =
      createInventoryDto.inventory_number ||
      (await this.generateInventoryNumber(createInventoryDto));
    const inventory_type = createInventoryDto.inventory_type;
    const inventory_description = createInventoryDto.inventory_description;
    const created_by = new User({ id: user.id });
    const warehouse_to = new Warehouse({
      id: createInventoryDto.warehouse_to_id,
    });
    const warehouse_from = new Warehouse({
      id: createInventoryDto.warehouse_from_id,
    });

    const stock_data = await Promise.all(
      createInventoryDto.inventory_items.map(async (inventory_item) => {
        let stock = await this.stocksRepository.findOneNoCheck({
          warehouse: { id: createInventoryDto.warehouse_to_id },
          product: { id: inventory_item.product_id },
        });

        if (!stock) {
          stock = new Stock({
            warehouse: new Warehouse({
              id: createInventoryDto.warehouse_to_id,
            }),
            product: new Product({ id: inventory_item.product_id }),
            quantity: 0, // Initialize quantity if stock doesn't exist
          });
        }

        if (inventory_type === InventoryType.INPUT) {
          stock.quantity += inventory_item.quantity;
        } else if (inventory_type === InventoryType.OUTPUT) {
          stock.quantity -= inventory_item.quantity;

          if (stock.quantity < 0) {
            throw new Error(
              `Insufficient stock for product ID ${inventory_item.product_id} in warehouse ID ${createInventoryDto.warehouse_to_id}`,
            );
          }
        } else if (inventory_type === InventoryType.TRANSFER) {
          stock.warehouse = new Warehouse({
            id: createInventoryDto.warehouse_to_id,
          });
        }

        return stock;
      }),
    );

    const inventory_items = [];

    createInventoryDto.inventory_items?.map((inventory_item) => {
      if (inventory_type === InventoryType.INPUT) {
        inventory_items.push(
          new InventoryItem({
            ...inventory_item,
            product: new Product({ id: inventory_item.product_id }),
            operator_type: OperatorType.NEGATIVE,
            warehouse: warehouse_to,
            warehouse_to,
          }),
        );
      } else if (inventory_type === InventoryType.OUTPUT) {
        inventory_items.push(
          new InventoryItem({
            ...inventory_item,
            product: new Product({ id: inventory_item.product_id }),
            operator_type: OperatorType.NEGATIVE,
            warehouse: warehouse_from,
            warehouse_from,
          }),
        );
      } else {
        inventory_items.push(
          new InventoryItem({
            ...inventory_item,
            product: new Product({ id: inventory_item.product_id }),
            operator_type: OperatorType.NEGATIVE,
            warehouse: warehouse_from,
            warehouse_to,
            warehouse_from,
          }),
        );
        inventory_items.push(
          new InventoryItem({
            ...inventory_item,
            product: new Product({ id: inventory_item.product_id }),
            operator_type: OperatorType.POSITIVE,
            warehouse: warehouse_to,
            warehouse_to,
            warehouse_from,
          }),
        );
      }
    });

    const inventory = new Inventory({
      inventory_date,
      inventory_number,
      inventory_type,
      inventory_description,
      created_by,
      inventory_items,
    });

    //
    let result;
    await this.inventoriesRepository.runInTransaction(async () => {
      // create or edit stock
      for (let i = 0; i < stock_data.length; i++) {
        await this.stocksRepository.create(stock_data[i]);
      }

      // inventory creating
      result = await this.inventoriesRepository.create(inventory);
    });
    //

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.inventoriesRepository.entityRepository,
      INVENTORY_PAGINATION_CONFIG,
    );
  }

  async findOne(inventoryDto: GetInventoryDto) {
    return this.inventoriesRepository.findOne(inventoryDto, {
      inventory_items: true,
    });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.findOne({ id });

    // Update main properties
    inventory.inventory_number =
      updateInventoryDto.inventory_number ?? inventory.inventory_number;
    inventory.inventory_date =
      updateInventoryDto.inventory_date ?? inventory.inventory_date;
    inventory.inventory_type =
      updateInventoryDto.inventory_type ?? inventory.inventory_type;
    inventory.inventory_description =
      updateInventoryDto.inventory_description ??
      inventory.inventory_description;

    // Save the updated Bonus entity
    const result = await this.inventoriesRepository.save(inventory);

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.inventoriesRepository.findOneAndDelete({ id });
  }

  private generateInventoryNumber = async (
    createInventoryDto: CreateInventoryDto,
  ) => {
    const lastInventory = await this.inventoriesRepository.findLast({
      inventory_type: createInventoryDto.inventory_type,
    });

    const lastNumber = lastInventory ? +lastInventory.inventory_number : 0;

    return lastNumber + 1;
  };
}

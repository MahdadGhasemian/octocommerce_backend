import {
  AvailableQuantityUpdateByOrderingEvent,
  AvailableQuantityUpdateByRenewProcessEvent,
  CurrentUser,
  EVENT_NAME_AVAILABLE_QUANTITY_BY_ORDERING_UPDATE,
  EVENT_NAME_AVAILABLE_QUANTITY_BY_RENEW_PROCESS_UPDATE,
  GeneralCache,
  JwtAuthAccessGuard,
  MessageAckInterceptor,
  NoCache,
  Serialize,
} from '@app/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InventoriesService } from './inventories.service';
import { GetInventoryDto } from './dto/get-inventory.dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import {
  INVENTORY_ITEM_PAGINATION_CONFIG,
  INVENTORY_PAGINATION_CONFIG,
  STOCK_PAGINATION_CONFIG,
} from './pagination-config';
import { InventoryItemsService } from './inventory-items.service';
import { GetInventoryItemDto } from './dto/get-inventory-item.dto';
import { GetStockDto } from './dto/get-stock.dto';
import { StocksService } from './stocks.service';
import { User } from '@app/store';
import { ListInventoryDto } from './dto/list-inventory.dto';
import { GetStockProductDto } from './dto/get-stock-product.dto';
import { UpdateInventoryStockVirtualyDto } from './dto/update-inventory-stock-virtualy.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@ApiTags('Inventories')
@GeneralCache()
@Controller('inventories')
export class InventoriesController {
  constructor(
    private readonly inventoriesService: InventoriesService,
    private readonly inventoryItemsService: InventoryItemsService,
    private readonly stocksService: StocksService,
  ) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetInventoryDto)
  @ApiOkResponse({
    type: GetInventoryDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    return this.inventoriesService.create(createInventoryDto, user);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListInventoryDto)
  @ApiOkPaginatedResponse(GetInventoryDto, INVENTORY_PAGINATION_CONFIG)
  @ApiPaginationQuery(INVENTORY_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.inventoriesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetInventoryDto)
  @ApiOkResponse({
    type: GetInventoryDto,
  })
  async findOne(@Param('id') id: string) {
    return this.inventoriesService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetInventoryDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetInventoryDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoriesService.update(+id, updateInventoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.inventoriesService.remove(+id);
  }

  @Get('items/items/:inventory_type')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkPaginatedResponse(GetInventoryItemDto, INVENTORY_ITEM_PAGINATION_CONFIG)
  @ApiPaginationQuery(INVENTORY_ITEM_PAGINATION_CONFIG)
  async findAllItems(
    @Param('inventory_type') inventory_type: string,
    @Paginate() query: PaginateQuery,
  ) {
    return this.inventoryItemsService.findAll(query, inventory_type);
  }

  @Get('items/stock/stock')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkPaginatedResponse(GetStockDto, STOCK_PAGINATION_CONFIG)
  @ApiPaginationQuery(STOCK_PAGINATION_CONFIG)
  async findAllStock(@Paginate() query: PaginateQuery) {
    return this.stocksService.findAllStock(query);
  }

  @Get('items/stock/stock/info')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkPaginatedResponse(GetStockDto, STOCK_PAGINATION_CONFIG)
  @ApiPaginationQuery(STOCK_PAGINATION_CONFIG)
  async findAllStockInfo(@Paginate() query: PaginateQuery) {
    return this.stocksService.findAllStockInfo(query);
  }

  @Get('stock/stock/product/:product_id')
  @NoCache()
  @Serialize(GetStockProductDto)
  @ApiOkResponse({
    type: GetStockProductDto,
  })
  async findStockProduct(@Param('product_id') product_id: string) {
    return this.stocksService.findStockProduct(+product_id);
  }

  @Get('stock/stock/product/:product_id/virtualy')
  @Serialize(GetStockProductDto)
  @NoCache()
  @ApiOkResponse({
    type: GetStockProductDto,
  })
  async getStockProductVirtualy(@Param('product_id') product_id: string) {
    return this.stocksService.getStockProductVirtualy(+product_id);
  }

  @Patch('stock/stock/product/:product_id/virtualy')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetStockProductDto)
  @ApiOkResponse({
    type: GetStockProductDto,
  })
  async updateAvailableQuantity(
    @Param('product_id') product_id: string,
    @Body() updateInventoryStockVirtualyDto: UpdateInventoryStockVirtualyDto,
  ) {
    return this.stocksService.updateStockProductVirtualy(
      +product_id,
      updateInventoryStockVirtualyDto,
    );
  }

  @EventPattern(EVENT_NAME_AVAILABLE_QUANTITY_BY_ORDERING_UPDATE)
  @UseInterceptors(MessageAckInterceptor)
  async updateStockProductVirtualyAvailableQuantityByOrdering(
    @Payload() payload: AvailableQuantityUpdateByOrderingEvent,
  ) {
    const { order_id, is_paid } = payload;

    await this.stocksService.updateStockProductVirtualyAvailableQuantityByOrder(
      order_id,
      is_paid,
    );
  }

  @EventPattern(EVENT_NAME_AVAILABLE_QUANTITY_BY_RENEW_PROCESS_UPDATE)
  @UseInterceptors(MessageAckInterceptor)
  async updateStockProductVirtualyAvailableQuantityByRenewProcess(
    @Payload() payload: AvailableQuantityUpdateByRenewProcessEvent,
  ) {
    const { product_id, available_quantity } = payload;

    await this.stocksService.updateStockProductVirtualyAvailableQuantityByScrape(
      product_id,
      available_quantity,
    );
  }
}

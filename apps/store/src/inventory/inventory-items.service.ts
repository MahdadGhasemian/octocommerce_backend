import { Injectable } from '@nestjs/common';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { INVENTORY_ITEM_PAGINATION_CONFIG } from './pagination-config';
import { InventoryItemsRepository } from './inventory-items.repository';

@Injectable()
export class InventoryItemsService {
  constructor(
    private readonly inventoryItemsRepository: InventoryItemsRepository,
  ) {}

  async findAll(query: PaginateQuery, inventory_type: string) {
    query.filter = { 'inventory.inventory_type': inventory_type };

    return paginate(
      query,
      this.inventoryItemsRepository.entityRepository,
      INVENTORY_ITEM_PAGINATION_CONFIG,
    );
  }
}

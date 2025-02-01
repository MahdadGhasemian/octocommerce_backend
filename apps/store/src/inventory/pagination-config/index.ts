import { Inventory, InventoryItem, Stock } from '@app/store';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export const INVENTORY_PAGINATION_CONFIG: PaginateConfig<Inventory> = {
  sortableColumns: [
    'id',
    'inventory_number',
    'inventory_date',
    'inventory_type',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['inventory_number', 'inventory_type'],
  filterableColumns: {
    inventory_number: true,
    inventory_date: true,
    inventory_type: true,
  },
  maxLimit: 1000,
};

export const INVENTORY_ITEM_PAGINATION_CONFIG: PaginateConfig<InventoryItem> = {
  sortableColumns: [
    'id',
    'unit',
    'quantity',
    'description',
    'operator_type',
    'inventory_id',
    'inventory',
    'product_id',
    'product',
    'order_item_id',
    'order_item',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  relations: [
    'inventory',
    'warehouse',
    'warehouse_from',
    'warehouse_to',
    'inventory.created_by',
    'inventory.updated_by',
    'product',
    'order_item',
  ],
  filterableColumns: {
    'inventory.inventory_type': [FilterOperator.EQ],
    description: true,
  },
  maxLimit: 1000,
};

export const STOCK_PAGINATION_CONFIG: PaginateConfig<Stock> = {
  sortableColumns: ['id', 'warehouse_id', 'product_id', 'quantity'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['warehouse_id', 'product_id', 'quantity'],
  relations: ['warehouse', 'product'],
  filterableColumns: {
    warehouse_id: true,
    quantity: true,
  },
  maxLimit: 1000,
};

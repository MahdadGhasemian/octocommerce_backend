import { Product } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const PRODUCT_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: [
    'id',
    'product_code',
    'name',
    'description',
    'available_quantity',
    'sale_price',
    'discount_percentage',
    'unit',
    'is_active',
    'is_online_payment_allowed',
    'category_id',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  // select: ['id', 'name', 'description', 'image'],
  relations: ['category', 'specifications', 'packaging_cost'],
  filterableColumns: {
    id: true,
    name: true,
    description: true,
    available_quantity: true,
    sale_price: true,
    is_active: true,
    is_online_payment_allowed: true,
    product_code: true,
    'category.id': true,
    'category.name': true,
    'specifications.key': true,
    'specifications.value': true,
  },
  maxLimit: 1000,
};

export const PRODUCT_ADMIN_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: [
    'id',
    'product_code',
    'name',
    'description',
    'available_quantity',
    'sale_price',
    'discount_percentage',
    'unit',
    'is_active',
    'is_online_payment_allowed',
    'category_id',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  // select: ['id', 'name', 'description', 'image'],
  relations: [
    'category',
    'specifications',
    'external_sellers',
    'packaging_cost',
  ],
  filterableColumns: {
    id: true,
    name: true,
    description: true,
    available_quantity: true,
    sale_price: true,
    is_active: true,
    is_online_payment_allowed: true,
    product_code: true,
    'category.id': true,
    'category.name': true,
    'specifications.key': true,
    'specifications.value': true,
    'external_sellers.name': true,
  },
  maxLimit: 1000,
};

export const PRODUCT_ADMIN_RESOURCE_MANAGING_PAGINATION_CONFIG: PaginateConfig<Product> =
  {
    sortableColumns: ['id'],
    nullSort: 'last',
    defaultSortBy: [['id', 'ASC']],
    searchableColumns: ['name'],
    relations: ['external_sellers'],
    filterableColumns: {
      id: true,
    },
    maxLimit: 100,
  };

export const PRODUCT_SITEMAP_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: ['id'],
  nullSort: 'last',
  defaultSortBy: [['id', 'ASC']],
  select: ['id', 'product_code', 'name', 'image', 'images', 'updated_at'],
  filterableColumns: {
    is_active: true,
  },
  maxLimit: 10000,
};

export const PRODUCT_FAST_SEARCH_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: ['id', 'name', 'sale_price'],
  nullSort: 'last',
  defaultSortBy: [['sale_price', 'ASC']],
  searchableColumns: ['name', 'description'],
  select: ['id', 'product_code', 'name', 'sale_price', 'image'],
  filterableColumns: {
    id: true,
    name: true,
    is_active: true,
    product_code: true,
  },
  maxLimit: 100,
};

export const PRODUCT_TO_SCRAPE_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: ['id'],
  nullSort: 'last',
  defaultSortBy: [['id', 'ASC']],
  relations: ['external_sellers'],
  filterableColumns: {
    id: true,
  },
  maxLimit: 100,
};

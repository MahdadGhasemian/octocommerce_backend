import { Category } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const CATEGORY_PAGINATION_CONFIG: PaginateConfig<Category> = {
  sortableColumns: ['id', 'name', 'description', 'image'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  // select: ['id', 'name', 'description', 'image'],
  filterableColumns: {
    id: true,
    name: true,
    description: true,
  },
  maxLimit: 1000,
};

export const CATEGORY_ADMIN_PAGINATION_CONFIG: PaginateConfig<Category> = {
  sortableColumns: ['id', 'name', 'description', 'image'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['name', 'description'],
  relations: ['external_category_sellers'],
  filterableColumns: {
    id: true,
    name: true,
    description: true,
    'external_category_sellers.store_name': true,
    'external_category_sellers.store_category_english_name': true,
    'external_category_sellers.store_category_persian_name': true,
  },
  maxLimit: 1000,
};

export const CATEGORY_SITEMAP_PAGINATION_CONFIG: PaginateConfig<Category> = {
  sortableColumns: ['id'],
  nullSort: 'last',
  defaultSortBy: [['id', 'ASC']],
  select: ['id', 'updated_at'],
  maxLimit: 1000,
};

export const CATEGORY_FAST_SEARCH_PAGINATION_CONFIG: PaginateConfig<Category> =
  {
    sortableColumns: ['id', 'name'],
    nullSort: 'last',
    defaultSortBy: [['name', 'ASC']],
    searchableColumns: ['name'],
    select: ['id', 'name', 'image'],
    filterableColumns: {
      id: true,
      name: true,
    },
    maxLimit: 100,
  };

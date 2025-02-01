import { Warehouse } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const WAREHOUSE_PAGINATION_CONFIG: PaginateConfig<Warehouse> = {
  sortableColumns: ['id', 'title', 'description'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'address', 'description'],
  filterableColumns: {
    title: true,
    address: true,
    description: true,
  },
  maxLimit: 1000,
};

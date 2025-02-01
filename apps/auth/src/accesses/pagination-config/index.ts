import { Access } from '@app/auth';
import { PaginateConfig } from 'nestjs-paginate';

export const ACCESS_PAGINATION_CONFIG: PaginateConfig<Access> = {
  sortableColumns: ['id', 'title'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title'],
  relations: ['endpoints'],
  filterableColumns: {
    title: true,
  },
  maxLimit: 1000,
};

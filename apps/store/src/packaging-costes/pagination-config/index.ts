import { PackagingCost } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const PACKAGING_COST_PAGINATION_CONFIG: PaginateConfig<PackagingCost> = {
  sortableColumns: ['id', 'title', 'cost', 'shared_packaging'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'cost', 'shared_packaging'],
  filterableColumns: {
    title: true,
    name: true,
  },
  maxLimit: 100,
};

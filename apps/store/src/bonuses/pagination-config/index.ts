import { Bonus } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const BONUS_PAGINATION_CONFIG: PaginateConfig<Bonus> = {
  sortableColumns: ['id', 'title', 'description'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'description'],
  // select: ['id', 'title'],
  filterableColumns: {
    title: true,
  },
  maxLimit: 1000,
};

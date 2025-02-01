import { Scrape } from '@app/bot';
import { PaginateConfig } from 'nestjs-paginate';

export const SCRAPE_PAGINATION_CONFIG: PaginateConfig<Scrape> = {
  sortableColumns: ['id'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['id'],
  filterableColumns: {
    id: true,
  },
  maxLimit: 100,
};

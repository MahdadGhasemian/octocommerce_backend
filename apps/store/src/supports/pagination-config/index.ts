import { ShortMessage } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const SHORT_MESSAGE_PAGINATION_CONFIG: PaginateConfig<ShortMessage> = {
  sortableColumns: ['id', 'title_type', 'mobile_phone'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title_type'],
  relations: ['user'],
  filterableColumns: {
    mobile_phone: true,
    title_type: true,
  },
  maxLimit: 100,
};

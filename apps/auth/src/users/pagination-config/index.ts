import { User } from '@app/auth';
import { PaginateConfig } from 'nestjs-paginate';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['id', 'mobile_phone', 'email'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['first_name', 'last_name', 'mobile_phone', 'email'],
  relations: ['accesses'],
  filterableColumns: {
    mobile_phone: true,
    email: true,
    'accesses.title': true,
    'accesses.is_internal_user': true,
  },
  maxLimit: 1000,
};

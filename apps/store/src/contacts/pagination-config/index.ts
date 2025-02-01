import { Contact } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const CONTACT_PAGINATION_CONFIG: PaginateConfig<Contact> = {
  sortableColumns: [
    'id',
    'title',
    'name',
    'phone',
    'mobile_phone',
    'address',
    'city',
    'postal_code',
    'national_code',
    'economic_code',
    'latitude',
    'longitude',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  relations: ['user'],
  searchableColumns: [
    'title',
    'name',
    'phone',
    'mobile_phone',
    'address',
    'city',
    'postal_code',
    'national_code',
    'economic_code',
    'latitude',
    'longitude',
  ],
  filterableColumns: {
    title: true,
    name: true,
    user_id: true,
  },
  maxLimit: 1000,
};

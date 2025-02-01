import { Payment } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const PAYMENT_PAGINATION_CONFIG: PaginateConfig<Payment> = {
  sortableColumns: [
    'id',
    'payment_status',
    'payment_type',
    'amount',
    'description',
    'rejected_note',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'payment_status',
    'payment_type',
    'amount',
    'description',
    'rejected_note',
  ],
  relations: ['user', 'order'],
  filterableColumns: {
    amount: true,
  },
  maxLimit: 1000,
};

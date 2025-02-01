import { WalletTransaction } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const WALLET_TRANSACTION_PAGINATION_CONFIG: PaginateConfig<WalletTransaction> =
  {
    sortableColumns: ['id', 'amount', 'transaction_type', 'transaction_note'],
    nullSort: 'last',
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['amount'],
    relations: ['user', 'order'],
    filterableColumns: {
      amount: true,
    },
    maxLimit: 1000,
  };

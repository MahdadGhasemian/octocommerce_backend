import { DeliveryMethod } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const DELIVERY_METHOD_PAGINATION_CONFIG: PaginateConfig<DeliveryMethod> =
  {
    sortableColumns: [
      'id',
      'delivery_type',
      'delivery_charge_type',
      'delivery_pricing_type',
      'fixed_price',
      'per_kilometer',
      'is_enabled',
      'description',
    ],
    nullSort: 'last',
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['delivery_type'],
    filterableColumns: {
      id: true,
      delivery_type: true,
      is_enabled: true,
    },
    maxLimit: 100,
  };

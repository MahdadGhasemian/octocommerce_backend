import { Review } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const REVIEW_PAGINATION_CONFIG: PaginateConfig<Review> = {
  sortableColumns: ['id', 'title'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'content'],
  relations: ['user', 'product', 'product.category'],
  filterableColumns: {
    title: true,
    content: true,
    'product.id': true,
    'product.name': true,
    'product.description': true,
    'product.product_code': true,
  },
  maxLimit: 1000,
};

import { Question } from '@app/store';
import { PaginateConfig } from 'nestjs-paginate';

export const REVIEW_PAGINATION_CONFIG: PaginateConfig<Question> = {
  sortableColumns: ['id', 'question_text'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['question_text'],
  relations: ['answers', 'answers.user', 'user', 'product', 'product.category'],
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

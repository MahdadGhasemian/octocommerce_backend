import { Label } from '@app/task';
import { PaginateConfig } from 'nestjs-paginate';

export const LABEL_PAGINATION_CONFIG: PaginateConfig<Label> = {
  sortableColumns: ['id', 'title', 'description', 'background_color', 'groups'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'description'],
  relations: ['groups'],
  filterableColumns: {
    title: true,
    description: true,
  },
  maxLimit: 1000,
};

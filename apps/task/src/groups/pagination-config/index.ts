import { Group } from '@app/task';
import { PaginateConfig } from 'nestjs-paginate';

export const GROUP_PAGINATION_CONFIG: PaginateConfig<Group> = {
  sortableColumns: [
    'id',
    'title',
    'description',
    'sequence_number',
    'label_id',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'description'],
  relations: ['label'],
  filterableColumns: {
    title: true,
    description: true,
  },
  maxLimit: 1000,
};

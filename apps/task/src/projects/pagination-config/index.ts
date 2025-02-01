import { Project } from '@app/task';
import { PaginateConfig } from 'nestjs-paginate';

export const PROJECT_PAGINATION_CONFIG: PaginateConfig<Project> = {
  sortableColumns: ['id', 'title', 'description'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: [
    'title',
    'description',
    'users.first_name',
    'users.last_name',
  ],
  relations: ['users', 'owned_by'],
  filterableColumns: {
    title: true,
    description: true,
    'users.first_name': true,
    'users.last_name': true,
  },
  maxLimit: 1000,
};

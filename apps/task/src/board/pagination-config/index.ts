import { Board } from '@app/task';
import { PaginateConfig } from 'nestjs-paginate';

export const BOARD_PAGINATION_CONFIG: PaginateConfig<Board> = {
  sortableColumns: [
    'id',
    'priority',
    'title',
    'description',
    'board_sequence_number',
    'created_at',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'description', 'project.title', 'project.id'],
  relations: ['project', 'assigned_to', 'created_by'],
  filterableColumns: {
    priority: true,
    title: true,
    description: true,
    'project.title': true,
    'project.id': true,
  },
  maxLimit: 1000,
};

export const BOARD_FULL_PAGINATION_CONFIG: PaginateConfig<Board> = {
  sortableColumns: [
    'id',
    'priority',
    'title',
    'description',
    'board_sequence_number',
    'created_at',
  ],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'description'],
  relations: [
    'project',
    'group',
    'group.label',
    'comments',
    'comments.content',
    'comments.content.user',
    'created_by',
    'assigned_to',
    'flow_users',
  ],
  filterableColumns: {
    priority: true,
    title: true,
    description: true,
    'project.title': true,
  },
  maxLimit: 1000,
};

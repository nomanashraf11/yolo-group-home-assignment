import { Task } from '../../tasks/models/task.model';

export interface Category {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CategoryFilterOptions {
  title?: string;
  sortBy?: 'title' | 'createdAt' | null;
  sortDirection?: 'asc' | 'desc' | null;
}

export interface CategoriesResponse {
  data: Category[];
  count: number;
}

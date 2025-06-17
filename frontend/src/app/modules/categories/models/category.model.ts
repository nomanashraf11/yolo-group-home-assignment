import { Task } from '../../tasks/models/task.model';

export interface Category {
  id: string;
  title: string;
  description?: string;
  task: Task[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CategoriesResponse {
  data: Category[];
  count: number;
}

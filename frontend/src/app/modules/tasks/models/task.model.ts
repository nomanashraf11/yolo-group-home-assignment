export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | string;
  status: TaskStatus;
  categoryId?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TaskFilterOptions {
  status?: TaskStatus;
  fromDate?: Date | null;
  toDate?: Date | null;
  title?: string;
  categoryId?: string | null;
}

export interface TasksResponse {
  data: Task[];
  count: number;
}

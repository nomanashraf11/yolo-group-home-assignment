import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskFilterOptions, TasksResponse } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl = 'tasks';

  constructor(private http: HttpClient) {}

  getTasks(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilterOptions
  ): Observable<TasksResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    console.log(filters);
    if (filters) {
      if (filters.sortBy && filters.sortDirection) {
        if (filters.sortBy === 'title') {
          params = params.set(
            'sortByTitle',
            filters.sortDirection === 'asc' ? 'ASC' : 'DESC'
          );
        }
        if (filters.sortBy === 'dueDate') {
          params = params.set(
            'sortByDueDate',
            filters.sortDirection === 'asc' ? 'ASC' : 'DESC'
          );
        }
      }
      if (filters.status) params = params.set('status', filters.status);
      if (filters.title) params = params.set('title', filters.title);
      if (filters.categoryId)
        params = params.set('categoryId', filters.categoryId);
      if (filters.fromDate)
        params = params.set(
          'fromDate',
          new Date(filters.fromDate).toISOString()
        );
      if (filters.toDate)
        params = params.set('toDate', new Date(filters.toDate).toISOString());
    }

    return this.http.get<TasksResponse>(this.baseUrl, { params });
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changeTaskCategory(
    taskId: string,
    categoryId: string | null
  ): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${taskId}/category`, {
      categoryId,
    });
  }
}

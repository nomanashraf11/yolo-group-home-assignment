import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CategoriesResponse,
  Category,
  CategoryFilterOptions,
} from '../../modules/categories/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = 'categories';

  constructor(private http: HttpClient) {}

  getCategories(
    page: number = 1,
    limit: number = 10,
    filters?: CategoryFilterOptions
  ): Observable<CategoriesResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.sortBy && filters.sortDirection) {
        if (filters.sortBy === 'title') {
          params = params.set(
            'sortByTitle',
            filters.sortDirection === 'asc' ? 'ASC' : 'DESC'
          );
        }
        if (filters.sortBy === 'createdAt') {
          params = params.set(
            'sortByCreatedAt',
            filters.sortDirection === 'asc' ? 'ASC' : 'DESC'
          );
        }
      }
      if (filters.title) params = params.set('title', filters.title);
    }

    return this.http.get<CategoriesResponse>(this.baseUrl, { params });
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  createCategory(
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(
    id: string,
    category: Partial<Category>
  ): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

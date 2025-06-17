import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriesResponse, Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl = 'categories';

  constructor(private http: HttpClient) {}

  getCategories(
    page: number = 1,
    limit: number = 10,
    title?: string,
    sortBy?: string,
    sortDirection?: string
  ): Observable<CategoriesResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (title) {
      params = params.set('title', title);
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortDirection) {
      params = params.set('sortDirection', sortDirection);
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

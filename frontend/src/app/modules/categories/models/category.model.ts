export interface Category {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}

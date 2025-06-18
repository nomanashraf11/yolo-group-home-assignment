import { Component, OnInit } from '@angular/core';

import {
  Category,
  CategoriesResponse,
  CategoryFilterOptions,
} from '../../models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from '../../services/category.service';
import { CategoryFormComponent } from '../../components/category-form/category-form';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CategoriesListComponent } from '../../components/categories-list/categories-list';
import {
  FilterPanelComponent,
  FilterConfig,
} from '../../../../shared/components/filter-panel/filter-panel';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.html',
  styleUrls: ['./categories-page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CategoriesListComponent,
    UiComponentsModule,
    FilterPanelComponent,
    PaginationComponent,
  ],
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = [];
  totalCategories = 0;
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  filters: CategoryFilterOptions = {};
  sortBy: 'title' | 'createdAt' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  filterConfig: FilterConfig = {
    showTitle: true,
    showStatus: false,
    showCategory: false,
    showDateRange: false,
    titleLabel: 'Search categories',
    titlePlaceholder: 'Search by category title',
  };

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    const params = {
      ...this.filters,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };

    this.isLoading = true;
    this.categoriesService
      .getCategories(this.currentPage, this.itemsPerPage, params)
      .subscribe({
        next: (response) => {
          this.categories = response.data;
          this.totalCategories = response.count;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  onFilterChange(filters: CategoryFilterOptions): void {
    this.filters = filters;
    this.currentPage = 1;
    this.loadCategories();
  }

  onSortChange(event: {
    sortBy: 'title' | 'createdAt';
    sortDirection: 'asc' | 'desc';
  }) {
    this.sortBy = event.sortBy;
    this.sortDirection = event.sortDirection;
    this.loadCategories();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  openCategoryForm(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '600px',
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (category) {
          this.categoriesService.updateCategory(category.id, result).subscribe({
            next: () => {
              this.loadCategories();
            },
            error: (error) => {
              console.error('Error updating category:', error);
            },
          });
        } else {
          this.categoriesService.createCategory(result).subscribe({
            next: () => {
              this.loadCategories();
            },
            error: (error) => {
              console.error('Error creating category:', error);
            },
          });
        }
      }
    });
  }

  deleteCategory(categoryId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Category',
        message:
          'Are you sure you want to delete this category? This will unassign all tasks from this category.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.categoriesService.deleteCategory(categoryId).subscribe(() => {
          this.loadCategories();
        });
      }
    });
  }
}

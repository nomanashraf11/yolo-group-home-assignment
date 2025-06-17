import { Component, OnInit } from '@angular/core';

import { Category, CategoriesResponse } from '../../models/category.model';
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
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';

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
  ],
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = [];
  totalCategories = 0;
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  searchTitle = '';

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService
      .getCategories(this.currentPage, this.itemsPerPage, this.searchTitle)
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
        this.loadCategories();
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

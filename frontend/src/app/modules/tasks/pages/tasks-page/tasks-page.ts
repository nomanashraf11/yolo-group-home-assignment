import { Component, OnInit } from '@angular/core';

import { Task, TaskFilterOptions } from '../../models/task.model';

import { MatDialog } from '@angular/material/dialog';

import { TasksService } from '../../services/task.service';
import { Category } from '../../../categories/models/category.model';
import { CategoriesService } from '../../../categories/services/category.service';
import { TaskFormComponent } from '../../components/task-form/task-form';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  FilterPanelComponent,
  FilterConfig,
} from '../../../../shared/components/filter-panel/filter-panel';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonComponent } from '../../../../shared/ui-components/button/button';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';
import { TasksListComponent } from '../../components/tasks-list/tasks-list';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.html',
  styleUrls: ['./tasks-page.scss'],
  imports: [
    MatIconModule,
    FilterPanelComponent,
    CommonModule,
    PaginationComponent,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    UiComponentsModule,
    TasksListComponent,
  ],
})
export class TasksPageComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  totalTasks = 0;
  totalCategories = 0;
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  filters: TaskFilterOptions = {};
  sortBy: 'title' | 'dueDate' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  filterConfig: FilterConfig = {
    showTitle: true,
    showStatus: true,
    showCategory: true,
    showDateRange: true,
    titleLabel: 'Search tasks',
    titlePlaceholder: 'Search by title',
  };

  constructor(
    private tasksService: TasksService,
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadCategories();
  }

  loadTasks(): void {
    const params = {
      ...this.filters,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };

    this.isLoading = true;
    this.tasksService
      .getTasks(this.currentPage, this.itemsPerPage, params)
      .subscribe({
        next: (response) => {
          this.tasks = response.data;
          this.totalTasks = response.count;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  loadCategories(): void {
    this.categoriesService.getCategories(1, 100).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.totalCategories = response.count;
      },
      error: () => {},
    });
  }
  toggleSort(field: 'title' | 'dueDate') {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.loadTasks();
  }

  onSortChange(event: {
    sortBy: 'title' | 'dueDate';
    sortDirection: 'asc' | 'desc';
  }) {
    this.sortBy = event.sortBy;
    this.sortDirection = event.sortDirection;
    this.loadTasks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  onFilterChange(filters: TaskFilterOptions): void {
    this.filters = filters;
    this.currentPage = 1;
    this.loadTasks();
  }

  openTaskForm(categories: Category[], task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: {
        task,
        categories,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  deleteTask(taskId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.tasksService.deleteTask(taskId).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }

  // changeTaskCategory(taskId: string, categoryId: string | null): void {
  //   this.tasksService.changeTaskCategory(taskId, categoryId).subscribe(() => {
  //     this.loadTasks();
  //   });
  // }
}

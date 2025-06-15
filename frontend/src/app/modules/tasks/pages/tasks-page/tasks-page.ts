import { Component, OnInit } from '@angular/core';

import {
  Task,
  TaskFilterOptions,
  TasksResponse,
} from '../../models/task.model';
import { CategoriesService } from '../../../categories/services/categories.service';
import { Category } from '../../../categories/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TasksService } from '../../services/task.service';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
})
export class TasksPageComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  totalTasks = 0;
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  filters: TaskFilterOptions = {};

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
    this.isLoading = true;
    this.tasksService
      .getTasks(this.currentPage, this.itemsPerPage, this.filters)
      .subscribe({
        next: (response) => {
          this.tasks = response.tasks;
          this.totalTasks = response.total;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  loadCategories(): void {
    this.categoriesService.getCategories(1, 100).subscribe((response) => {
      this.categories = response.categories;
    });
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

  openTaskForm(task?: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { task, categories: this.categories },
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

  changeTaskCategory(taskId: string, categoryId: string | null): void {
    this.tasksService.changeTaskCategory(taskId, categoryId).subscribe(() => {
      this.loadTasks();
    });
  }
}

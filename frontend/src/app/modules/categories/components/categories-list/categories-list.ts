import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SharedModule } from '../../../../shared/shared-module';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';
import { TasksService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.scss'],
  animations: [
    trigger('expandCollapse', [
      state('true', style({ height: '*', opacity: 1 })),
      state('false', style({ height: '0', opacity: 0 })),
      transition(
        'false <=> true',
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ),
    ]),
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
    UiComponentsModule,
  ],
})
export class CategoriesListComponent {
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Input() sortBy: 'title' | 'createdAt' | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<string>();
  @Output() refreshCategories = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<{
    sortBy: 'title' | 'createdAt';
    sortDirection: 'asc' | 'desc';
  }>();

  expandedCategoryId: string | null = null;
  draggedTaskId: string | null = null;
  dragOverCategoryId: string | null = null;

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    console.log('CategoriesListComponent initialized');
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  onSort(field: 'title' | 'createdAt') {
    let direction: 'asc' | 'desc' = 'asc';
    if (this.sortBy === field) {
      direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortChange.emit({ sortBy: field, sortDirection: direction });
  }

  toggleCategory(categoryId: string): void {
    this.expandedCategoryId =
      this.expandedCategoryId === categoryId ? null : categoryId;
  }

  isCategoryExpanded(categoryId: string): boolean {
    return this.expandedCategoryId === categoryId;
  }

  onTaskDragStart(event: DragEvent, taskId: string): void {
    this.draggedTaskId = taskId;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', taskId);
    }
  }

  onCategoryDragOver(event: DragEvent, categoryId: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverCategoryId = categoryId;
  }

  onCategoryDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverCategoryId = null;
  }

  onCategoryDrop(event: DragEvent, categoryId: string): void {
    event.preventDefault();
    event.stopPropagation();

    const task = this.categories
      .flatMap((cat) => cat.tasks)
      .find((t) => t.id === this.draggedTaskId);

    if (this.draggedTaskId && task && task.categoryId !== categoryId) {
      this.tasksService
        .changeTaskCategory(this.draggedTaskId, categoryId)
        .subscribe({
          next: (response) => {
            console.log('Response:', response);
            this.refreshCategories.emit();
          },
          error: (error) => {
            console.log('Error status:', error.status);
            console.log('Error message:', error.message);
          },
        });
    } else {
      console.log('Invalid drop');
    }
    this.draggedTaskId = null;
    this.dragOverCategoryId = null;
  }

  isDragOver(categoryId: string): boolean {
    return this.dragOverCategoryId === categoryId;
  }

  showMoveOptions(taskId: string): void {
    console.log('Show move options for task:', taskId);

    const currentCategory = this.categories.find((cat) =>
      cat.tasks?.some((task) => task.id === taskId)
    );

    if (currentCategory) {
      const targetCategory = this.categories.find(
        (cat) => cat.id !== currentCategory.id
      );
      if (targetCategory) {
        console.log(
          `Moving task ${taskId} from ${currentCategory.title} to ${targetCategory.title}`
        );
        this.handleMoveTask(taskId, targetCategory.id);
      }
    }
  }

  private handleMoveTask(taskId: string, categoryId: string): void {
    console.log('=== MOVING TASK ===');
    console.log('Task ID:', taskId);
    console.log('Category ID:', categoryId);

    this.tasksService.changeTaskCategory(taskId, categoryId).subscribe({
      next: (response) => {
        console.log('response', response);
        this.refreshCategories.emit();
      },
      error: (error) => {
        console.error('error', error);
      },
    });
  }
}

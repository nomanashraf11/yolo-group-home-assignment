import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../../categories/models/category.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared-module';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.html',
  styleUrls: ['./tasks-list.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, UiComponentsModule, MatIconModule],
})
export class TasksListComponent {
  @Input() tasks: Task[] = [];
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Input() showCategory = true;
  @Input() sortBy: 'title' | 'dueDate' | null = 'dueDate';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Output() taskClick = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() createTask = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<{
    sortBy: 'title' | 'dueDate';
    sortDirection: 'asc' | 'desc';
  }>();
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  onSort(field: 'title' | 'dueDate') {
    let direction: 'asc' | 'desc' = 'asc';
    if (this.sortBy === field) {
      direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortChange.emit({ sortBy: field, sortDirection: direction });
  }

  onTaskClick(task: Task, event: Event) {
    if (!(event.target as HTMLElement).closest('app-button, button')) {
      this.taskClick.emit(task);
    }
  }

  onEditTask(task: Task, event: Event) {
    event.stopPropagation();
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: string, event: Event) {
    event.stopPropagation();
    this.deleteTask.emit(taskId);
  }

  onCreateTask() {
    this.createTask.emit();
  }
}

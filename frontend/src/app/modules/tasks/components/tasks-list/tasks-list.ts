import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../../categories/models/category.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared-module';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.html',
  styleUrls: ['./tasks-list.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, UiComponentsModule],
})
export class TasksListComponent {
  @Input() tasks: Task[] = [];
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Input() showCategory = true;

  @Output() taskClick = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() createTask = new EventEmitter<void>();

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.title : '';
  }

  getCategoryColor(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return '#4f46e5';
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

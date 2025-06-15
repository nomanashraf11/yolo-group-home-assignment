import { Component, Input } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../../categories/models/category.model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; // if using tooltips in actions
import { SharedModule } from '../../../../shared/shared-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.html',
  styleUrls: ['./tasks-list.scss'],
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SharedModule,
    CommonModule,
  ],
})
export class TasksListComponent {
  @Input() tasks: Task[] = [];
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Input() showCategoryColumn = true;

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
  displayedColumns: string[] = ['title', 'dueDate', 'category', 'actions'];

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.title : '';
  }
}

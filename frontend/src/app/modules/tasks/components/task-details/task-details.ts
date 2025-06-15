import { Component, Input } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../../categories/models/category.model';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../../../shared/shared-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.html',
  styleUrls: ['./task-details.scss'],
  imports: [MatIconModule, SharedModule, CommonModule],
})
export class TaskDetailsComponent {
  @Input() task: Task | null = null;
  @Input() categories: Category[] = [];

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.title : 'No category';
  }
}

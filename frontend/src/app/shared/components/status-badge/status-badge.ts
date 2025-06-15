import { Component, Input } from '@angular/core';
import { TaskStatus } from '../../../modules/tasks/models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.scss'],
  imports: [CommonModule],
})
export class StatusBadgeComponent {
  @Input() status: TaskStatus = 'To Do';
  @Input() size: 'sm' | 'lg' | '' = '';

  get statusClass(): string {
    const map: Record<TaskStatus, string> = {
      'To Do': 'todo',
      'In Progress': 'in-progress',
      Done: 'done',
    };
    return map[this.status];
  }
}

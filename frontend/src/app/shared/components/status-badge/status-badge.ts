import { Component, Input } from '@angular/core';
import { TaskStatus } from '../../../modules/tasks/models/task.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrls: ['./status-badge.scss'],
})
export class StatusBadgeComponent {
  @Input() status: TaskStatus = 'To Do';

  get statusClass(): string {
    const map: Record<TaskStatus, string> = {
      'To Do': 'todo',
      'In Progress': 'in-progress',
      Done: 'done',
    };
    return map[this.status];
  }
}

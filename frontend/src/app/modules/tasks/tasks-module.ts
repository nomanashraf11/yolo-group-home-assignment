import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';

@NgModule({
  declarations: [
    TasksListComponent,
    TaskFormComponent,
    TaskDetailsComponent,
    TasksPageComponent,
  ],
  imports: [CommonModule, TasksRoutingModule, SharedModule],
})
export class TasksModule {}

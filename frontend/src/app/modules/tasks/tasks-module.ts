import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TasksListComponent } from './components/tasks-list/tasks-list';
import { TaskFormComponent } from './components/task-form/task-form';
import { TaskDetailsComponent } from './components/task-details/task-details';
import { TasksPageComponent } from './pages/tasks-page/tasks-page';
import { TasksRoutingModule } from './tasks-routing-module';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
    MatDialogModule,
    TasksListComponent,
    TaskFormComponent,
    TaskDetailsComponent,
    TasksPageComponent,
  ],
})
export class TasksModule {}

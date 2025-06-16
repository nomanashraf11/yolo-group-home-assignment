import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Category } from '../../../categories/models/category.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared-module';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { TasksService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    UiComponentsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  statusOptions = [
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];
  // categoryOptions: { value: string; label: string; color: string }[] = [];
  minDate = new Date();

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: Task; categories: Category[] }
  ) {}

  ngOnInit(): void {
    // this.categoryOptions = this.data.categories.map((category) => ({
    //   value: category.id,
    //   label: category.title,
    //   color: '#4f46e5',
    // }));

    this.initForm();

    if (this.data?.task) {
      this.isEditMode = true;
      this.taskForm.patchValue({
        ...this.data.task,
        dueDate: new Date(this.data.task.dueDate),
      });
    }
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      dueDate: [new Date(), Validators.required],
      status: ['To Do', Validators.required],
      categoryId: [null],
    });
  }

  get title(): FormControl {
    return this.taskForm.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.taskForm.get('description') as FormControl;
  }

  get dueDate(): FormControl {
    return this.taskForm.get('dueDate') as FormControl;
  }

  get status(): FormControl {
    return this.taskForm.get('status') as FormControl;
  }

  // get categoryId(): FormControl {
  //   return this.taskForm.get('categoryId') as FormControl;
  // }
  onSubmit(): void {
    console.log('call to submit form');

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;

    if (this.isEditMode && this.data.task) {
      this.tasksService
        .updateTask(this.data.task.id, formValue)
        .subscribe((updatedTask) => {
          this.dialogRef.close(updatedTask);
        });
    } else {
      this.tasksService.createTask(formValue).subscribe((createdTask) => {
        this.dialogRef.close(createdTask);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

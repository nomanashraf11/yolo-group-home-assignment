import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
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
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { TasksService } from '../../../../core/services/task.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
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
  categoryOptions: { value: string; label: string }[] = [];
  minDate = new Date();

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: Task; categories: Category[] }
  ) {
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.categoryOptions = [
      ...this.data.categories.map((category) => ({
        value: category.id,
        label: category.title,
      })),
    ];

    this.initForm();

    if (this.data?.task) {
      this.isEditMode = true;

      this.taskForm.patchValue({
        ...this.data.task,
        dueDate: new Date(this.data.task.dueDate),
        categoryId: this.data.task.categoryId ?? '',
        status: this.data.task.status ?? '',
      });

      this.dueDate.setValidators([
        Validators.required,
        this.pastDateValidator(),
      ]);
      this.dueDate.updateValueAndValidity();
    }
  }

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !this.isEditMode) {
        return null;
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return selectedDate < today ? { pastDate: true } : null;
    };
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z0-9\s]*$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5),
        ],
      ],
      dueDate: [null, Validators.required],
      status: ['', Validators.required],
      categoryId: [null],
    });
  }

  get title() {
    return this.taskForm.get('title') as FormControl;
  }
  get description() {
    return this.taskForm.get('description') as FormControl;
  }
  get dueDate() {
    return this.taskForm.get('dueDate') as FormControl;
  }
  get status() {
    return this.taskForm.get('status') as FormControl;
  }
  get categoryId() {
    return this.taskForm.get('categoryId') as FormControl;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    if (formValue.categoryId === '' || formValue.categoryId === 0) {
      formValue.categoryId = null;
    }

    const snackBarConfig = {
      duration: 2500,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
    };

    if (this.isEditMode && this.data.task) {
      this.tasksService.updateTask(this.data.task.id, formValue).subscribe({
        next: (updatedTask) => {
          this.snackBar.open(
            'Task updated successfully!',
            'Close',
            snackBarConfig
          );
          this.dialogRef.close(updatedTask);
        },
        error: () => {
          this.snackBar.open('Failed to update task.', 'Close', snackBarConfig);
        },
      });
    } else {
      this.tasksService.createTask(formValue).subscribe({
        next: (createdTask) => {
          this.snackBar.open(
            'Task created successfully!',
            'Close',
            snackBarConfig
          );
          this.dialogRef.close(createdTask);
        },
        error: () => {
          this.snackBar.open('Failed to create task.', 'Close', snackBarConfig);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

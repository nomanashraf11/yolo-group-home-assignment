import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Category } from '../../../categories/models/category.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  statusOptions: Task['status'][] = ['To Do', 'In Progress', 'Done'];
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: Task; categories: Category[] }
  ) {}

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.dialogRef.close(this.taskForm.value);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get dueDate() {
    return this.taskForm.get('dueDate');
  }

  get status() {
    return this.taskForm.get('status');
  }
}

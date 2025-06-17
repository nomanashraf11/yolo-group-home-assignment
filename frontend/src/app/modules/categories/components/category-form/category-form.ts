import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared-module';
import { UiComponentsModule } from '../../../../shared/ui-components/ui-components.module';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    UiComponentsModule,
  ],
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: Category }
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data?.category) {
      this.isEditMode = true;
      this.categoryForm.patchValue(this.data.category);
    }
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.categoryForm.value);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get title(): FormControl {
    return this.categoryForm.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.categoryForm.get('description') as FormControl;
  }
}

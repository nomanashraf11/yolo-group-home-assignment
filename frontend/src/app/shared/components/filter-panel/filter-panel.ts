import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../../../modules/categories/models/category.model';

import { CommonModule } from '@angular/common';
import { UiComponentsModule } from '../../ui-components/ui-components.module';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { OnInit } from '@angular/core';
interface StatusOption {
  value: 'To Do' | 'In Progress' | 'Done' | '';
  label: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.html',
  styleUrls: ['./filter-panel.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiComponentsModule],
})
export class FilterPanelComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  @Input() categories: Category[] = [];

  statusOptions: StatusOption[] = [
    { value: '', label: 'All statuses' },
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];

  categoryOptions: CategoryOption[] = [];

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      title: [''],
      status: [''],
      categoryId: [''],
      fromDate: [null],
      toDate: [null],
    });
  }
  private emitFilters(): void {
    setTimeout(() => {
      const filters = {
        title: this.filterForm.value.title || undefined,
        status: this.filterForm.value.status || undefined,
        categoryId: this.filterForm.value.categoryId || undefined,
        fromDate: this.filterForm.value.fromDate || undefined,
        toDate: this.filterForm.value.toDate || undefined,
      };
      this.filterChange.emit(filters);
    });
  }
  ngOnInit(): void {
    // it is used for debounceTime for user typing
    this.titleControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.emitFilters());

    this.statusControl.valueChanges
      .pipe(startWith(''))
      .subscribe(() => this.emitFilters());

    this.categoryIdControl.valueChanges
      .pipe(startWith(''))
      .subscribe(() => this.emitFilters());

    this.filterForm
      .get('fromDate')
      ?.valueChanges.pipe(startWith(null))
      .subscribe(() => this.emitFilters());

    this.filterForm
      .get('toDate')
      ?.valueChanges.pipe(startWith(null))
      .subscribe(() => this.emitFilters());
  }
  ngOnChanges() {
    if (this.categories && Array.isArray(this.categories)) {
      this.categoryOptions = this.categories.map((c) => ({
        value: c.id,
        label: c.title,
      }));
    } else {
      this.categoryOptions = [];
    }
  }
  get titleControl(): FormControl {
    return this.filterForm.get('title') as FormControl;
  }

  get statusControl(): FormControl {
    return this.filterForm.get('status') as FormControl;
  }

  get categoryIdControl(): FormControl {
    return this.filterForm.get('categoryId') as FormControl;
  }

  onFilter(): void {
    const filters = {
      title: this.filterForm.value.title || undefined,
      status: this.filterForm.value.status || undefined,
      categoryId: this.filterForm.value.categoryId || undefined,
      fromDate: this.filterForm.value.fromDate || undefined,
      toDate: this.filterForm.value.toDate || undefined,
    };
    this.filterChange.emit(filters);
  }

  onReset(): void {
    console.log('onReset');
    this.filterForm.reset({
      title: '',
      status: '',
      categoryId: '',
      fromDate: null,
      toDate: null,
    });
    this.filterChange.emit({});
  }
}

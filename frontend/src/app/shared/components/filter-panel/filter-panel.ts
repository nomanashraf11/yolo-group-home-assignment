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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

interface StatusOption {
  value: 'To Do' | 'In Progress' | 'Done' | '';
  label: string;
}

interface CategoryOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  showTitle?: boolean;
  showStatus?: boolean;
  showCategory?: boolean;
  showDateRange?: boolean;
  titleLabel?: string;
  titlePlaceholder?: string;
  searchLabel?: string;
}

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.html',
  styleUrls: ['./filter-panel.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    UiComponentsModule,
  ],
})
export class FilterPanelComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any>();
  @Input() categories: Category[] = [];
  @Input() config: FilterConfig = {
    showTitle: true,
    showStatus: true,
    showCategory: true,
    showDateRange: true,
    titleLabel: 'Search tasks',
    titlePlaceholder: 'Search by title',
    searchLabel: 'Search',
  };

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
      const filters: any = {};

      if (this.config.showTitle && this.filterForm.value.title) {
        filters.title = this.filterForm.value.title;
      }
      if (this.config.showStatus && this.filterForm.value.status) {
        filters.status = this.filterForm.value.status;
      }
      if (this.config.showCategory && this.filterForm.value.categoryId) {
        filters.categoryId = this.filterForm.value.categoryId;
      }
      if (this.config.showDateRange) {
        if (this.filterForm.value.fromDate) {
          filters.fromDate = this.filterForm.value.fromDate;
        }
        if (this.filterForm.value.toDate) {
          filters.toDate = this.filterForm.value.toDate;
        }
      }

      this.filterChange.emit(filters);
    });
  }

  private initialized = false;

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(() => {
        if (this.initialized) {
          this.emitFilters();
        }
      });

    setTimeout(() => {
      this.initialized = true;
    });
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
    const filters: any = {};

    if (this.config.showTitle && this.filterForm.value.title) {
      filters.title = this.filterForm.value.title;
    }
    if (this.config.showStatus && this.filterForm.value.status) {
      filters.status = this.filterForm.value.status;
    }
    if (this.config.showCategory && this.filterForm.value.categoryId) {
      filters.categoryId = this.filterForm.value.categoryId;
    }
    if (this.config.showDateRange) {
      if (this.filterForm.value.fromDate) {
        filters.fromDate = this.filterForm.value.fromDate;
      }
      if (this.filterForm.value.toDate) {
        filters.toDate = this.filterForm.value.toDate;
      }
    }

    this.filterChange.emit(filters);
  }

  onReset(): void {
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

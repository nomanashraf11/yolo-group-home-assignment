import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StatusBadgeComponent } from './components/status-badge/status-badge';
import { PaginationComponent } from './components/pagination/pagination';
import { FilterPanelComponent } from './components/filter-panel/filter-panel';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StatusBadgeComponent,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    PaginationComponent,
    FilterPanelComponent,
  ],
  exports: [
    PaginationComponent,
    FilterPanelComponent,
    StatusBadgeComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class SharedModule {}

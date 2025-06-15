import { Component, Input } from '@angular/core';
import { Category } from '../../models/category.model';
import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.scss'],
  imports: [
    CommonModule,
    NgTemplateOutlet,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class CategoriesListComponent {
  @Input() categories: Category[] = [];
  @Input() isLoading = false;

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}

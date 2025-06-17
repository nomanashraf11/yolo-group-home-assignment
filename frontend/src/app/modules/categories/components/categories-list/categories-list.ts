import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../models/category.model';
import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { SharedModule } from '../../../../shared/shared-module';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.scss'],
  animations: [
    trigger('expandCollapse', [
      state('true', style({ height: '*', opacity: 1 })),
      state('false', style({ height: '0', opacity: 0 })),
      transition(
        'false <=> true',
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ),
    ]),
  ],
  imports: [
    CommonModule,
    NgTemplateOutlet,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
})
export class CategoriesListComponent {
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<string>();

  expandedCategoryId: string | null = null;

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  toggleCategory(categoryId: string): void {
    this.expandedCategoryId =
      this.expandedCategoryId === categoryId ? null : categoryId;
  }

  isCategoryExpanded(categoryId: string): boolean {
    return this.expandedCategoryId === categoryId;
  }
}

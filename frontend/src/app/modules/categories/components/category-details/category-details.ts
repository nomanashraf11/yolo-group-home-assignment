import { Component, Input } from '@angular/core';
import { Category } from '../../models/category.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.html',
  styleUrls: ['./category-details.scss'],
  imports: [MatIconModule, CommonModule],
})
export class CategoryDetailsComponent {
  @Input() category: Category | null = null;
}

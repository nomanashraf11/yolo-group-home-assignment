import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListComponent } from './components/categories-list/categories-list';
import { CategoryFormComponent } from './components/category-form/category-form';
import { CategoryDetailsComponent } from './components/category-details/category-details';
import { CategoriesPageComponent } from './pages/categories-page/categories-page';
import { SharedModule } from '../../shared/shared-module';
import { CategoriesRoutingModule } from './categories-routing-module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    CategoriesListComponent,
    CategoryFormComponent,
    CategoryDetailsComponent,
    CategoriesPageComponent,
  ],
})
export class CategoriesModule {}

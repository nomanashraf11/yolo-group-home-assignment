import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing-module';
import { CategoriesPageComponent } from './pages/categories-page/categories-page';
import { CategoriesListComponent } from './components/categories-list/categories-list';
import { CategoryFormComponent } from './components/category-form/category-form';
import { SharedModule } from '../../shared/shared-module';
import { UiComponentsModule } from '../../shared/ui-components/ui-components.module';

@NgModule({
  declarations: [
    CategoriesPageComponent,
    CategoriesListComponent,
    CategoryFormComponent,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    UiComponentsModule,
  ],
})
export class CategoriesModule {}

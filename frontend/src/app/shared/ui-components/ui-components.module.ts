import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button';
import { InputFieldComponent } from './input-field/input-field';
import { SelectComponent } from './select/select';
import { NavbarComponent } from './header/header';

@NgModule({
  declarations: [ButtonComponent, InputFieldComponent, SelectComponent],
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  exports: [
    ButtonComponent,
    InputFieldComponent,
    SelectComponent,
    NavbarComponent,
  ],
})
export class UiComponentsModule {}

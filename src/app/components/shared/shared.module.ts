// Importa los módulos necesarios
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatetimepickerComponent } from '../datetimepicker/datetimepicker.component';
import { IonicModule } from '@ionic/angular';

// Importa y declara tus componentes, directivas y pipes

@NgModule({
  declarations: [
    DatetimepickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    // Otros módulos que necesites
  ],
  exports: [
    DatetimepickerComponent
  ],
})
export class SharedModule { }

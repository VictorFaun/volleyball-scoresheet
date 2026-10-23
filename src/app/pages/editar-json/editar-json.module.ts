import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EditarJsonPageRoutingModule } from './editar-json-routing.module';

import { EditarJsonPage } from './editar-json.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EditarJsonPageRoutingModule
  ],
  declarations: [EditarJsonPage]
})
export class EditarJsonPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePartidoPageRoutingModule } from './detalle-partido-routing.module';

import { DetallePartidoPage } from './detalle-partido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePartidoPageRoutingModule
  ],
  declarations: [DetallePartidoPage]
})
export class DetallePartidoPageModule {}

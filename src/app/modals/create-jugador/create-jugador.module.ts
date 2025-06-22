import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateJugadorPageRoutingModule } from './create-jugador-routing.module';

import { CreateJugadorPage } from './create-jugador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateJugadorPageRoutingModule
  ],
  declarations: [CreateJugadorPage]
})
export class CreateJugadorPageModule {}

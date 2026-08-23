import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FechaPageRoutingModule } from './fecha-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { FechaPage } from './fecha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    FechaPageRoutingModule
  ],
  declarations: [FechaPage]
})
export class FechaPageModule {}

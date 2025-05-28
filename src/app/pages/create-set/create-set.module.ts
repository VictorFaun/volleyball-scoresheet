import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSetPageRoutingModule } from './create-set-routing.module';

import { CreateSetPage } from './create-set.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSetPageRoutingModule
  ],
  declarations: [CreateSetPage]
})
export class CreateSetPageModule {}

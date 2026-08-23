import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompetenciaConfigPageRoutingModule } from './competencia-config-routing.module';

import { CompetenciaConfigPage } from './competencia-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompetenciaConfigPageRoutingModule
  ],
  declarations: [CompetenciaConfigPage]
})
export class CompetenciaConfigPageModule {}

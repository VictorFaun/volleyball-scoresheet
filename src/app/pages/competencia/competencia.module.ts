import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompetenciaPageRoutingModule } from './competencia-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { CompetenciaPage } from './competencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CompetenciaPageRoutingModule
  ],
  declarations: [CompetenciaPage]
})
export class CompetenciaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompetenciaEquipoPageRoutingModule } from './competencia-equipo-routing.module';

import { CompetenciaEquipoPage } from './competencia-equipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompetenciaEquipoPageRoutingModule
  ],
  declarations: [CompetenciaEquipoPage]
})
export class CompetenciaEquipoPageModule {}

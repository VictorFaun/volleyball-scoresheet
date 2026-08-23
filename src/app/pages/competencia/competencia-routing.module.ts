import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetenciaPage } from './competencia.page';

const routes: Routes = [
  {
    path: '',
    component: CompetenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetenciaPageRoutingModule {}

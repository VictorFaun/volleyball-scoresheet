import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetenciaConfigPage } from './competencia-config.page';

const routes: Routes = [
  {
    path: '',
    component: CompetenciaConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetenciaConfigPageRoutingModule {}

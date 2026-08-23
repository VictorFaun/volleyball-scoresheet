import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivadosPage } from './archivados.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivadosPageRoutingModule {}

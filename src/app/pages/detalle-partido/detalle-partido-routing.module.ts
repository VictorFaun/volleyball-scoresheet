import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePartidoPage } from './detalle-partido.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePartidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePartidoPageRoutingModule {}

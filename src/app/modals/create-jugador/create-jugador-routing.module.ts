import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateJugadorPage } from './create-jugador.page';

const routes: Routes = [
  {
    path: '',
    component: CreateJugadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateJugadorPageRoutingModule {}

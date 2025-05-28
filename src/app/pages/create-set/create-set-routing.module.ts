import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSetPage } from './create-set.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSetPageRoutingModule {}

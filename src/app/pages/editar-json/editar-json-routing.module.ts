import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarJsonPage } from './editar-json.page';
import { CanDeactivateGuard } from 'src/app/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: EditarJsonPage,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarJsonPageRoutingModule {}

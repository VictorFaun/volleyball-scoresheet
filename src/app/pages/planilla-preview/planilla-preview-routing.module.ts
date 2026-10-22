import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanillaPreviewPage } from './planilla-preview.page';

const routes: Routes = [
  {
    path: '',
    component: PlanillaPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanillaPreviewPageRoutingModule {}

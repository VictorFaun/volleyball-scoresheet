import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PlanillaPreviewPageRoutingModule } from './planilla-preview-routing.module';

import { PlanillaPreviewPage } from './planilla-preview.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PlanillaPreviewPageRoutingModule
  ],
  declarations: [PlanillaPreviewPage]
})
export class PlanillaPreviewPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivadosPageRoutingModule } from './archivados-routing.module';

import { ArchivadosPage } from './archivados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivadosPageRoutingModule
  ],
  declarations: [ArchivadosPage]
})
export class ArchivadosPageModule {}

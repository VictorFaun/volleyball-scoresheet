import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./pages/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'informacion',
    loadChildren: () => import('./pages/informacion/informacion.module').then( m => m.InformacionPageModule)
  },
  {
    path: 'team',
    loadChildren: () => import('./pages/team/team.module').then( m => m.TeamPageModule)
  },
  {
    path: 'sorteo',
    loadChildren: () => import('./pages/sorteo/sorteo.module').then( m => m.SorteoPageModule)
  },
  {
    path: 'create-set',
    loadChildren: () => import('./pages/create-set/create-set.module').then( m => m.CreateSetPageModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('./pages/signature/signature.module').then( m => m.SignaturePageModule)
  },
  {
    path: 'detalle-partido',
    loadChildren: () => import('./pages/detalle-partido/detalle-partido.module').then( m => m.DetallePartidoPageModule)
  },
  {
    path: 'competencia',
    loadChildren: () => import('./pages/competencia/competencia.module').then( m => m.CompetenciaPageModule)
  },
  {
    path: 'competencia-config',
    loadChildren: () => import('./pages/competencia-config/competencia-config.module').then( m => m.CompetenciaConfigPageModule)
  },
  {
    path: 'fecha',
    loadChildren: () => import('./pages/fecha/fecha.module').then( m => m.FechaPageModule)
  },
  {
    path: 'archivados',
    loadChildren: () => import('./pages/archivados/archivados.module').then( m => m.ArchivadosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot({
    mode: 'ios',
    // Desactivado: el gesto de deslizar desde el borde retrocede por el
    // historial real de navegación (vista por vista), no según la lógica
    // de cada botón "volver" (que siempre redirige a Home). Ver
    // AppComponent.initBackButton() para el manejo del botón físico/gesto
    // de retroceso de Android, que sigue la misma regla.
    swipeBackEnabled: false
  }), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

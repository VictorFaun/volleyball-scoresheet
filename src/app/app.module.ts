import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GameService } from './services/game/game.service';

// Los partidos/competencias ahora se leen desde Filesystem (async), en vez
// de localStorage (sync). Para que el resto de la app pueda seguir leyendo
// GameService.partidos/competencias como arrays ya listos apenas arranca
// (igual que antes), se espera esta carga una sola vez acá, antes de que
// Angular termine de arrancar la app.
function inicializarDatos(gameService: GameService) {
  return () => gameService.cargarDatosIniciales();
}

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
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_INITIALIZER, useFactory: inicializarDatos, deps: [GameService], multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

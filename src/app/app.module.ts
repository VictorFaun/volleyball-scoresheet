import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GameService } from './services/game/game.service';

// Los partidos/competencias ahora se leen desde Filesystem (async), en vez
// de localStorage (sync). Para que el resto de la app pueda seguir leyendo
// GameService.partidos/competencias como arrays ya listos apenas arranca
// (igual que antes), se espera esta carga una sola vez acá, antes de que
// Angular termine de arrancar la app.
//
// Con un límite de tiempo: si el plugin de Filesystem tardara demasiado o
// se quedara colgado en un dispositivo real (nunca resuelve ni rechaza),
// Angular jamás terminaría de arrancar -pantalla en blanco/negra
// indefinida-. cargarDatosIniciales() sigue corriendo en segundo plano y
// completa partidos/competencias apenas termine, aunque llegue tarde; esto
// solo evita que bloquee el arranque para siempre.
function inicializarDatos(gameService: GameService) {
  return () => Promise.race([
    gameService.cargarDatosIniciales(),
    new Promise<void>(resolve => setTimeout(resolve, 4000))
  ]);
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
    swipeBackEnabled: false,
    // Habilita HTML (saneado por Ionic: solo bloquea tags peligrosos y
    // atributos no listados en su allowlist) en el "message" de ion-alert,
    // para poder armar alertas con varias líneas (ver <br> en las tablas
    // de resultados de competencia-config/competencia).
    innerHTMLTemplatesEnabled: true
  }), AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: !isDevMode(),
    registrationStrategy: 'registerWhenStable:30000'
  })],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_INITIALIZER, useFactory: inicializarDatos, deps: [GameService], multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

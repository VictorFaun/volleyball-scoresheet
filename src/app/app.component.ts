import { Component, Renderer2 } from '@angular/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {

  constructor(private platform : Platform, private router: Router, private location: Location, private themeService: ThemeService) {
    this.init()
  }


  async init(){
    await this.showSplashScreen();
    // El splash nativo se muestra por encima de todo (incluida la barra de
    // estado) y, al ocultarse, la deja en su color por defecto en vez del
    // que ThemeService ya había pedido al arrancar. Se vuelve a pedir acá,
    // justo después de que el splash se oculta, para que quede como
    // corresponde en vez de lo que dejó la transición del splash.
    await this.themeService.aplicarBarraDeEstado();
    await this.enableKeepAwake();
    this.initBackButton();
    this.initPopstateTrap();
  }

  // El truco de "reemplazar en vez de apilar" (ver GameService.redireccionar)
  // hace que el gesto/botón "atrás" del navegador aterrice en Home. Pero
  // retroceder no borra la entrada "hacia adelante" del historial: sigue
  // apuntando al último paso del asistente. Si desde Home se repite el
  // gesto (o se usa "adelante"), el navegador reaparece ahí. Location.go()
  // solo dispara para popstate real (no para navegación programática), así
  // que cuando el navegador nos trae de vuelta a Home, empujamos una nueva
  // entrada idéntica: eso descarta cualquier entrada "hacia adelante".
  initPopstateTrap() {
    this.location.subscribe((event) => {
      if (event.url === '/home' || event.url === '/') {
        this.location.go('/home');
      }
    });
  }

  // El botón/gesto de retroceso del sistema (Android) debe comportarse igual
  // que los botones "volver" de cada vista: siempre va a Home, sin importar
  // en qué paso del flujo se esté. Si ya se está en Home, no navega a
  // ninguna vista (se entiende que el usuario salió del torneo) y se sale
  // de la app. Prioridad 10: los alerts/modales de Ionic se registran con
  // prioridad más alta y siguen cerrándose primero con el botón de
  // retroceso, antes de que esto se ejecute.
  initBackButton() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/home' || this.router.url === '/') {
        App.exitApp();
      } else {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });
  }

  async enableKeepAwake() {
    if(this.platform.is("capacitor"))
    await KeepAwake.keepAwake();
  }

  async showSplashScreen() {
    if(this.platform.is("capacitor"))
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
    });
  }

}

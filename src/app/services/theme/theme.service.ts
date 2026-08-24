import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly STORAGE_KEY = 'volleyball_dark_mode';
  // Clase que activa la paleta oscura (@ionic/angular/css/palettes/dark.class.css).
  private readonly DARK_CLASS = 'ion-palette-dark';

  // Mismo --ion-background-color de variables.scss para cada modo. La API
  // de color de la barra de estado necesita un hex literal (no puede leer
  // variables CSS); si esos colores cambian ahí, hay que actualizar también
  // estos dos.
  private readonly FONDO_CLARO = '#ffffff';
  private readonly FONDO_OSCURO = '#121212';

  darkMode = false;

  // Tamaño de letra: la app usa tamaños en px "a mano" en casi todas las
  // vistas (no rem), así que cambiar el font-size de <html> no alcanzaría a
  // afectar nada. En cambio, escalamos todo el documento con la propiedad
  // CSS "zoom" (soportada por Chromium/WebView de Android y por Safari/
  // WKWebView de iOS, que son los dos motores donde corre esta app): texto,
  // íconos y espaciados crecen/achican juntos y proporcionalmente, sin
  // romper layouts pensados en píxeles fijos.
  private readonly STORAGE_KEY_LETRA = 'volleyball_tamano_letra';
  // 5 niveles; el índice 2 (medio) es "Normal" = el tamaño actual de la app.
  readonly nivelesTamanoLetra = [
    { etiqueta: 'Muy pequeña', escala: 0.85 },
    { etiqueta: 'Pequeña', escala: 0.925 },
    { etiqueta: 'Normal', escala: 1 },
    { etiqueta: 'Grande', escala: 1.1 },
    { etiqueta: 'Muy grande', escala: 1.2 },
  ];
  readonly NIVEL_LETRA_DEFAULT = 2;

  nivelTamanoLetra = this.NIVEL_LETRA_DEFAULT;

  constructor() {
    const guardado = localStorage.getItem(this.STORAGE_KEY);
    this.darkMode = guardado !== null
      ? guardado === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    const nivelGuardado = localStorage.getItem(this.STORAGE_KEY_LETRA);
    this.nivelTamanoLetra = nivelGuardado !== null
      ? Math.min(Math.max(parseInt(nivelGuardado, 10), 0), this.nivelesTamanoLetra.length - 1)
      : this.NIVEL_LETRA_DEFAULT;

    this.aplicar();
    this.aplicarTamanoLetra();
  }

  setDarkMode(activo: boolean) {
    this.darkMode = activo;
    localStorage.setItem(this.STORAGE_KEY, String(activo));
    this.aplicar();
  }

  setNivelTamanoLetra(nivel: number) {
    this.nivelTamanoLetra = nivel;
    localStorage.setItem(this.STORAGE_KEY_LETRA, String(nivel));
    this.aplicarTamanoLetra();
  }

  private aplicar() {
    document.documentElement.classList.toggle(this.DARK_CLASS, this.darkMode);
    this.aplicarBarraDeEstado();
  }

  // Deja la barra de estado del sistema del mismo color que el fondo de la
  // app, para que se sienta parte de la misma pantalla en vez de una franja
  // aparte. Solo existe en nativo (Android/iOS); en web no hay barra de
  // estado que tocar.
  //
  // Esta app apunta a targetSdk 36 (Android 16): ahí Android fuerza la barra
  // de estado a ser "edge-to-edge" sin posibilidad de desactivarlo, y
  // StatusBar.setOverlaysWebView()/setBackgroundColor() quedan sin efecto
  // (confirmado con un Xiaomi más nuevo, corriendo justo esa versión: ahí
  // funciona solo, vía el WebView dibujando hasta el borde + el color de
  // fondo de body en global.scss). PERO en un Android más viejo -confirmado
  // con un Xiaomi Mi 10T- ese forzado de edge-to-edge no existe, y ahí esas
  // dos llamadas SÍ funcionan y son las que realmente pintan la barra
  // (sin ellas, esos dispositivos se quedan con la barra en negro por
  // defecto). Como en Android 15+ son no-ops inofensivos, se piden siempre;
  // cada dispositivo usa el mecanismo que le corresponda según su versión.
  //
  // Público (no solo llamado desde acá adentro): el splash screen nativo se
  // muestra encima de todo apenas arranca la app -antes de que termine este
  // constructor siquiera- y al ocultarse pisa lo que ya habíamos pedido acá,
  // dejándolo en su estado por defecto. Por eso AppComponent vuelve a llamar
  // a este método después de que el splash se oculta (ver
  // showSplashScreen()), para que lo nuestro sea lo último que se aplica.
  async aplicarBarraDeEstado() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await StatusBar.setStyle({ style: this.darkMode ? Style.Dark : Style.Light });
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: this.darkMode ? this.FONDO_OSCURO : this.FONDO_CLARO });
    } catch (error) {
      console.error('Error al ajustar la barra de estado:', error);
    }
  }

  private aplicarTamanoLetra() {
    const escala = this.nivelesTamanoLetra[this.nivelTamanoLetra]?.escala ?? 1;
    (document.documentElement.style as any).zoom = escala;
  }
}

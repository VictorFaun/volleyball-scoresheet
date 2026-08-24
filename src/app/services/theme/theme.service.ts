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
  // Android 15+ (esta app apunta a targetSdk 35) fuerza la barra de estado a
  // ser "edge-to-edge": el sistema directamente ignora
  // StatusBar.setBackgroundColor(), sin importar qué le pidamos. La forma
  // que sí funciona ahí -y que además funciona igual en versiones viejas de
  // Android y en iOS- es dejar que el WebView se dibuje hasta el borde
  // (overlay:true, más viewport-fit=cover en index.html) y asegurarnos de
  // que el color de fondo de la propia página (body, en global.scss) sea el
  // correcto: la barra de estado queda transparente y "muestra" ese fondo
  // por debajo, en vez de depender de una API que la plataforma ya no
  // respeta. Acá solo queda pedir el estilo de los íconos/texto (claros u
  // oscuros), que sí sigue funcionando.
  private async aplicarBarraDeEstado() {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: this.darkMode ? Style.Dark : Style.Light });
    } catch (error) {
      console.error('Error al ajustar la barra de estado:', error);
    }
  }

  private aplicarTamanoLetra() {
    const escala = this.nivelesTamanoLetra[this.nivelTamanoLetra]?.escala ?? 1;
    (document.documentElement.style as any).zoom = escala;
  }
}

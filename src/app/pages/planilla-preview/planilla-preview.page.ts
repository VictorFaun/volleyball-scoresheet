import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { GameService } from 'src/app/services/game/game.service';

// Vista previa de la planilla recién exportada. El PDF se genera en memoria
// (GameService.planillaGenerada) y se dibuja con pdf.js en un canvas, igual
// en web que en Android/iOS (el WebView nativo no muestra PDFs embebidos).
// Recién al apretar Descargar/Compartir se crea un archivo; al salir de la
// vista el PDF en memoria se descarta, así no se acumulan versiones.
@Component({
  selector: 'app-planilla-preview',
  templateUrl: './planilla-preview.page.html',
  styleUrls: ['./planilla-preview.page.scss'],
  standalone: false,
})
export class PlanillaPreviewPage {

  @ViewChild('lienzo', { static: false }) lienzo?: ElementRef<HTMLCanvasElement>;
  @ViewChild('contenedor', { static: false }) contenedor?: ElementRef<HTMLDivElement>;

  readonly esNativo = Capacitor.isNativePlatform();
  cargando = true;
  error = false;

  // Zoom relativo al ancho disponible (1 = la hoja completa a lo ancho).
  readonly NIVELES_ZOOM = [1, 1.5, 2, 3];
  nivelZoom = 0;

  private pagina: any = null;

  constructor(private _game_: GameService, private navCtrl: NavController) { }

  get nombreArchivo(): string {
    return this._game_.planillaGenerada?.nombre || 'planilla.pdf';
  }

  async ionViewDidEnter() {
    const generada = this._game_.planillaGenerada;
    if (!generada) {
      this.navCtrl.back();
      return;
    }
    try {
      const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
      // URLs absolutas (resueltas contra el <base href> de la app): con una
      // ruta relativa, pdf.js la toma como nombre de módulo al cargar el
      // worker ("Failed to resolve module specifier").
      const urlAsset = (ruta: string) => new URL(ruta, document.baseURI).href;
      pdfjs.GlobalWorkerOptions.workerSrc = urlAsset('assets/pdfjs/pdf.worker.min.mjs');
      // pdf.js se queda con el buffer que recibe: se le pasa una copia. La
      // planilla usa Helvetica sin incrustar: standard_fonts trae sus datos
      // para que se dibuje igual en cualquier dispositivo.
      const documento = await pdfjs.getDocument({
        data: generada.bytes.slice(),
        standardFontDataUrl: urlAsset('assets/pdfjs/standard_fonts/'),
      }).promise;
      this.pagina = await documento.getPage(1);
      await this.dibujar();
    } catch (e) {
      console.error('Error mostrando la vista previa de la planilla:', e);
      this.error = true;
    } finally {
      this.cargando = false;
    }
  }

  ionViewWillLeave() {
    this._game_.planillaGenerada = null;
  }

  async cambiarZoom(delta: number) {
    const nuevo = Math.min(this.NIVELES_ZOOM.length - 1, Math.max(0, this.nivelZoom + delta));
    if (nuevo === this.nivelZoom) return;
    this.nivelZoom = nuevo;
    await this.dibujar();
  }

  // Dibuja la página al ancho del contenedor por el zoom actual, con la
  // resolución de la pantalla (devicePixelRatio) para que se vea nítida.
  private async dibujar() {
    const canvas = this.lienzo?.nativeElement;
    const contenedor = this.contenedor?.nativeElement;
    if (!this.pagina || !canvas || !contenedor) return;
    const base = this.pagina.getViewport({ scale: 1 });
    const anchoCss = contenedor.clientWidth * this.NIVELES_ZOOM[this.nivelZoom];
    const escalaCss = anchoCss / base.width;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const viewport = this.pagina.getViewport({ scale: escalaCss * dpr });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${Math.floor(anchoCss)}px`;
    canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
    await this.pagina.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
  }

  // Web: descarga el archivo. Nativo: hoja de compartir del sistema (desde
  // ahí se puede guardar o enviar).
  async descargarOCompartir() {
    const generada = this._game_.planillaGenerada;
    if (generada) await this._game_.descargarPdf(generada.bytes, generada.nombre);
  }

  volver() {
    this.navCtrl.back();
  }
}

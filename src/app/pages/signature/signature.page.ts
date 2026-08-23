import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { GameService } from 'src/app/services/game/game.service';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
  standalone: false,
})
export class SignaturePage implements OnInit {

  num:any;
  text:any
  firmaImage:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _game_: GameService,
    private alertController: AlertController
  ) { }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  ngOnInit() {
    
    this.route.queryParams.subscribe(async params => {
      this.clearCanvas()
      this.num = params['num'];
      if(this.num == 1){
        this.text = "Capitan A"
        this.firma = this._game_.partido.firma_inicio_capitan_a;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_inicio_capitan_a);
        this.resultado_firma = this._game_.partido.firma_inicio_capitan_a;
      }
      if(this.num == 2){
        this.text = "Entrenador A"
        this.firma = this._game_.partido.firma_entrenador_a;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_entrenador_a);
        this.resultado_firma = this._game_.partido.firma_entrenador_a;
      }
      if(this.num == 3){
        this.text = "Capitan B"
        this.firma = this._game_.partido.firma_inicio_capitan_b;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_inicio_capitan_b);
        this.resultado_firma = this._game_.partido.firma_inicio_capitan_b;
      }
      if(this.num == 4){
        this.text = "Entrenador B"
        this.firma = this._game_.partido.firma_entrenador_b;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_entrenador_b);
        this.resultado_firma = this._game_.partido.firma_entrenador_b;
      }
      if(this.num == 5){
        this.text = "Capitan A"
        this.firma = this._game_.partido.firma_fin_capitan_a;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_fin_capitan_a);
        this.resultado_firma = this._game_.partido.firma_fin_capitan_a;
      }
      if(this.num == 6){
        this.text = "Capitan B"
        this.firma = this._game_.partido.firma_fin_capitan_b;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_fin_capitan_b);
        this.resultado_firma = this._game_.partido.firma_fin_capitan_b;
      }
      if(this.num == 7){
        this.text = "Planillero"
        this.firma = this._game_.partido.firma_planillero;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_planillero);
        this.resultado_firma = this._game_.partido.firma_planillero;
      }
      if(this.num == 8){
        this.text = "A. Planillero"
        this.firma = this._game_.partido.firma_asistente_planillero;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_asistente_planillero);
        this.resultado_firma = this._game_.partido.firma_asistente_planillero;
      }
      if(this.num == 9){
        this.text = "Segundo Arbitro"
        this.firma = this._game_.partido.firma_segundo_arbitro;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_segundo_arbitro);
        this.resultado_firma = this._game_.partido.firma_segundo_arbitro;
      }
      if(this.num == 10){
        this.text = "Primer Arbitro"
        this.firma = this._game_.partido.firma_primer_arbitro;
        this.firmaImage = await this.getSignatureImage(this._game_.partido.firma_primer_arbitro);
        this.resultado_firma = this._game_.partido.firma_primer_arbitro;
      }
    });
  }

  firma: any;

  @ViewChild('canvas', { static: false }) canvasRef: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private drawing = false;

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.canvasRef) return;

      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) return;

      const scale = window.devicePixelRatio || 6; // O usa 2 directamente
      const width = canvas.offsetWidth || window.innerWidth;
      const height = canvas.offsetHeight || window.innerHeight;

      // Aumentar resolución real del canvas
      canvas.width = width * scale;
      canvas.height = height * scale;

      // Mantener tamaño visual (CSS)
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      // Escalar el contexto para dibujar como si fuera normal
      this.ctx.scale(scale, scale);

      this.ctx.lineWidth = 1.5; // Ajusta según el nuevo DPI
      this.ctx.lineCap = 'round';
      // Get the CSS variable value for the dark color
      const darkColor = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-dark').trim();
      this.ctx.strokeStyle = darkColor || '#000'; // Fallback to black if variable not found

      this.addListeners(canvas);
    }, 100);
  }


  private addListeners(canvas: HTMLCanvasElement) {
    let lastPos: { x: number, y: number } | null = null;
    let moved = false;

    const getPos = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = (e instanceof TouchEvent) ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = (e instanceof TouchEvent) ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      if (!this.ctx) return;
      this.drawing = true;
      moved = false;
      lastPos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(lastPos.x, lastPos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.ctx || !this.drawing) return;
      const pos = getPos(e);
      moved = true;
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => {
      if (!this.ctx || !lastPos) return;
      if (!moved) {
        // Dibujar punto
        this.ctx.beginPath();
        this.ctx.arc(lastPos.x, lastPos.y, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
      }
      this.drawing = false;
    });

    canvas.addEventListener('mouseout', () => this.drawing = false);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!this.ctx) return;
      this.drawing = true;
      moved = false;
      lastPos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(lastPos.x, lastPos.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.ctx || !this.drawing) return;
      const pos = getPos(e);
      moved = true;
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      if (!this.ctx || !lastPos) return;
      if (!moved) {
        this.ctx.beginPath();
        this.ctx.arc(lastPos.x, lastPos.y, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
      }
      this.drawing = false;
    });
  }


  async clearCanvas() {
    if (!this.canvasRef) {
      return;
    }
    const canvas = this.canvasRef.nativeElement;

    if (this.ctx) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Clear the current signature
    if (this.firma) {
      this.firma = null;
      this.firmaImage = null;
    }
    this.resultado_firma = null;
  }

  async saveCanvas() {
    if (!this.canvasRef) {
      return null;
    }
    const canvas = this.canvasRef.nativeElement;
    const dataURL = canvas.toDataURL('image/png');
    
    try {
      const fileName = `signature_${new Date().getTime()}.png`;
      const base64Data = dataURL.split(',')[1];
      
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      this.firma = fileName; // Store only the filename
      this.resultado_firma = fileName;
      this.firmaImage = await this.getSignatureImage(fileName);
      return fileName;
    } catch (e) {
      console.error('Error saving signature:', e);
      return null;
    }
  }

  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }

  volver() {
    this._game_.guardar();
    this._game_.volverAOrigen();
  }

  resultado_firma:any;

  async imageCropped(event: ImageCroppedEvent) {
    try {
      const base64Data = await this.blobToBase64(event.blob);
      const fileName = `signature_cropped_${new Date().getTime()}.png`;
      
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data.split(',')[1],
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      this.resultado_firma = fileName; // Store only the filename
    } catch (e) {
      console.error('Error saving cropped image:', e);
    }
  }
  imageLoaded(image: LoadedImage) {
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  blobToBase64(blob: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('Error al leer el blob como base64');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // convierte a base64
    });
  }
  // Function to get signature image as base64
  async getSignatureImage(filename: string): Promise<string | undefined> {
    if (!filename) return undefined;
    console.log(filename);
    try {
      const contents = await Filesystem.readFile({
        path: filename,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      return `data:image/png;base64,${contents.data}`;
    } catch (e) {
      console.error('Error reading signature file:', e);
      return undefined;
    }
  }

  // Nombre del campo de "partido" donde se guarda la firma correspondiente a
  // cada número de paso del flujo de firmas.
  private campoFirma(num: any): string | null {
    switch (Number(num)) {
      case 1: return 'firma_inicio_capitan_a';
      case 2: return 'firma_entrenador_a';
      case 3: return 'firma_inicio_capitan_b';
      case 4: return 'firma_entrenador_b';
      case 5: return 'firma_fin_capitan_a';
      case 6: return 'firma_fin_capitan_b';
      case 7: return 'firma_planillero';
      case 8: return 'firma_asistente_planillero';
      case 9: return 'firma_segundo_arbitro';
      case 10: return 'firma_primer_arbitro';
      default: return null;
    }
  }

  // Guarda resultado_firma en el campo correspondiente del partido,
  // eliminando el archivo de la firma anterior si existía.
  private async guardarFirmaActual() {
    const campo = this.campoFirma(this.num);
    if (!campo) return;
    if (this._game_.partido[campo]) {
      await this._game_.deleteSignatureFile(this._game_.partido[campo]);
    }
    this._game_.partido[campo] = this.resultado_firma;
  }

  private avanzarDespuesDeFirma() {
    this._game_.avanzarDespuesDeFirma(this.num);
  }

  async siguiente(){
    if(this.resultado_firma == null){
      await this.saveCanvas();
    }

    // alert con mensaje para confirmar la firma y muestrala ahi en el alert
    const signatureBase64 = await this.getSignatureImage(this.resultado_firma);

    if(!signatureBase64){
      //alert con mensaje de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo obtener la firma',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Si ya había una firma guardada para este campo y no cambió (mismo
    // contenido de imagen), se omite la confirmación y se avanza directo.
    const campo = this.campoFirma(this.num);
    const firmaGuardada = campo ? this._game_.partido[campo] : null;
    if (firmaGuardada) {
      const firmaGuardadaBase64 = await this.getSignatureImage(firmaGuardada);
      if (firmaGuardadaBase64 === signatureBase64) {
        this.avanzarDespuesDeFirma();
        return;
      }
    }

    // Create alert with image
    const alert = await this.alertController.create({
      cssClass: 'no-padding-header no-padding-message',
      htmlAttributes: {
        innerHTML: `
        <h2 class="alert-title sc-ion-alert-ios" style="text-align: center;padding-top: 12px;">Confirmar firma</h2>
        <div style="text-align: center; padding: 10px;">
          <div class="alert-message sc-ion-alert-ios">¿Estás seguro de guardar esta firma?</div>
          ${signatureBase64 ? `<img src="${signatureBase64}" style="max-width: 100% margin: 10px auto; display: block;" />` : ''}
        </div>
      `,
      },
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Firma cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: async () => {
            await this.guardarFirmaActual();
            this.avanzarDespuesDeFirma();
          }
        }
      ]
    });

    await alert.present();
  }

}

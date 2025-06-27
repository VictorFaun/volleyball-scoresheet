import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
  standalone: false,
})
export class SignaturePage implements OnInit {

  num:any;
  text:any

  constructor(private router: Router, private navCtrl: NavController,private route: ActivatedRoute,private _game_: GameService) { }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.clearCanvas()
      this.num = params['num'];
      if(this.num == 1){
        this.text = "Capitan Equipo A"
        this.firma = this._game_.partido.firma_inicio_capitan_a;
        this.resultado_firma = this._game_.partido.firma_inicio_capitan_a;
      }
      if(this.num == 2){
        this.text = "Entrenador Equipo A"
        this.firma = this._game_.partido.firma_entrenador_a;
        this.resultado_firma = this._game_.partido.firma_inicio_capitan_a;
      }
      if(this.num == 3){
        this.text = "Capitan Equipo B"
        this.firma = this._game_.partido.firma_inicio_capitan_b;
        this.resultado_firma = this._game_.partido.firma_inicio_capitan_b;
      }
      if(this.num == 4){
        this.text = "Entrenador Equipo B"
        this.firma = this._game_.partido.firma_entrenador_b;
        this.resultado_firma = this._game_.partido.firma_inicio_capitan_a;
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
      this.ctx.strokeStyle = '#000';

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


  clearCanvas() {
    if (!this.canvasRef) {
      return
    }
    const canvas = this.canvasRef.nativeElement;

    if (!this.ctx) {
      return
    }
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.firma = null;
    this.resultado_firma = null

  }

  saveCanvas() {
    if (!this.canvasRef) {
      return
    }
    const canvas = this.canvasRef.nativeElement;
    const dataURL = canvas.toDataURL('image/png');

    this.firma = dataURL;
  }

  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }

  volver() {
    this.router.navigate(["home"]);
  }

  resultado_firma:any;

  async imageCropped(event: ImageCroppedEvent) {
    this.resultado_firma = await this.blobToBase64(event.blob);
  }
  imageLoaded(image: LoadedImage) {
      // show cropper
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

  siguiente(){
    if(this.num == 1){
      this._game_.partido.firma_inicio_capitan_a = this.resultado_firma;
      this._game_.new_firma(2)
    }
    if(this.num == 2){
      this._game_.partido.firma_entrenador_a = this.resultado_firma;
      this._game_.new_firma(3)
    }
    if(this.num == 3){
      this._game_.partido.firma_inicio_capitan_b = this.resultado_firma;
      this._game_.new_firma(4)
    }
    if(this.num == 4){
      this._game_.partido.firma_entrenador_b = this.resultado_firma;
      this._game_.new_set(1);
    }
  }

}

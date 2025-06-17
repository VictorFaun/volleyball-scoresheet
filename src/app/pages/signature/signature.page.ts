import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
  standalone: false,
})
export class SignaturePage implements OnInit {

  constructor(private router: Router,private navCtrl: NavController) { }

  ngOnInit() {
  }


  @ViewChild('canvas', { static: false }) canvasRef: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private drawing = false;

  ngAfterViewInit() {
  setTimeout(() => {
    if (!this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    const scale = window.devicePixelRatio || 4; // O usa 2 directamente
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
    const getPos = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = (e instanceof TouchEvent) ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = (e instanceof TouchEvent) ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    canvas.addEventListener('mousedown', (e) => {
      if (!this.ctx) {
        return
      }
      this.drawing = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.ctx) {
        return
      }
      if (!this.drawing) return;
      const pos = getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => this.drawing = false);
    canvas.addEventListener('mouseout', () => this.drawing = false);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!this.ctx) {
        return
      }
      this.drawing = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.ctx) {
        return
      }
      if (!this.drawing) return;
      const pos = getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    }, { passive: false });

    canvas.addEventListener('touchend', () => this.drawing = false);
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
  }

  saveCanvas() {
    if (!this.canvasRef) {
      return
    }
    const canvas = this.canvasRef.nativeElement;
    const dataURL = canvas.toDataURL('image/png');

    this.redireccionar("home")
    console.log('Imagen base64:', dataURL);
    // Aquí puedes usar Capacitor para guardar la imagen o compartirla si lo deseas
  }

  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }

  volver() {
    this.navCtrl.back();
  }
}

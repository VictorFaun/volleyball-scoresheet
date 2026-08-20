import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  torneos: any = []

  constructor(private _game_: GameService,private alertController: AlertController, private router: Router) { }
  ngOnInit(): void {
  }

  async new_game(){
    await this._game_.new_game();
  }
  edit_game(index:any){
    console.log(index)
    this._game_.edit_game(index);
  }


  ionViewWillEnter() {
    this._game_.index = null;
    this.cargaPartidos()
  }

  cargaPartidos(){
    this.torneos = [];
    for (let index = 0; index < this._game_.partidos.length; index++) {
      let partido:any = {
        torneo: "",
        equipoA: "Equipo A",
        equipoB: "Equipo B",
        sets: [],
        estado: null,
        index: index,
        numero_partido: 0,
        fecha: ""
      }
      if(this._game_.partidos[index].competicion){
        partido.torneo = this._game_.partidos[index].competicion
      }
      if(this._game_.partidos[index].fecha){
        partido.fecha = this._game_.partidos[index].fecha
      }
      if(this._game_.partidos[index].numero_partido){
        partido.numero_partido = this._game_.partidos[index].numero_partido
      }
      // El equipo que juega como "A"/"B" se define recién en el R-5 del
      // set 1 (equipo.lado). Antes de eso, mostramos equipo_1/equipo_2 en
      // ese orden para no dejar la lista vacía mientras se configura.
      const equipo1 = this._game_.partidos[index].equipo_1;
      const equipo2 = this._game_.partidos[index].equipo_2;
      const equipoLadoA = [equipo1, equipo2].find((e: any) => e?.lado === 'A') || equipo1;
      const equipoLadoB = [equipo1, equipo2].find((e: any) => e?.lado === 'B') || equipo2;
      if(equipoLadoA?.nombre){
        partido.equipoA = equipoLadoA.nombre
      }
      if(equipoLadoB?.nombre){
        partido.equipoB = equipoLadoB.nombre
      }
      for (let numSet = 1; numSet <= 5; numSet++) {
        const set = this._game_.partidos[index][`set_${numSet}`];
        if (set && set.victoria) {
          partido.sets.push({
            a: this._game_.contarPuntos(set, 'A'),
            b: this._game_.contarPuntos(set, 'B'),
            victoria: set.victoria
          });
        }
      }
      if (this._game_.partidos[index].estado) {
        const estado = this._game_.partidos[index].estado;
        const estadosTexto:any = {
          1: 'Configuración',
          2: 'Configuración',
          3: 'Configuración',
          4: 'Configuración',
          5: 'Firmas',
          6: 'Firmas',
          7: 'Firmas',
          8: 'Firmas',
          9: 'Sorteo',
          10: 'R-5 Set 1',
          11: 'Inicio Set 1',
          12: 'Fin Set 1',
          13: 'R-5 Set 2',
          14: 'Inicio Set 2',
          15: 'Fin Set 2',
          16: 'Sorteo',
          17: 'R-5 Set 3',
          18: 'Inicio Set 3',
          19: 'Fin Set 3',
          20: 'R-5 Set 4',
          21: 'Inicio Set 4',
          22: 'Fin Set 4',
          23: 'Sorteo',
          24: 'R-5 Set 5',
          25: 'Inicio Set 5',
          26: 'Fin Set 5',
          27: 'Firmas',
          28: 'Firmas',
          29: 'Firmas',
          30: 'Firmas',
          31: 'Firmas',
          32: 'Firmas',
          33: 'Finalizado',
        };
      
        partido.estado = estadosTexto[estado] || 'Configuración';
      }else{
        partido.estado = 'Configuración';
      }
      
      let torneo = this.torneos.find((t:any) => t.torneo == partido.torneo)
      if(!torneo){
        this.torneos.push({torneo: partido.torneo, partidos: [partido]})
      }else{
        torneo.partidos.push(partido)
      }
    }

    // Ordenar torneos (primero los sin nombre, luego por fecha)
    this.torneos.sort((a: any, b: any) => {
      if (!a.torneo) return -1;
      if (!b.torneo) return 1;
      const fechaA = a.partidos[0]?.fecha ? new Date(a.partidos[0].fecha).getTime() : 0;
      const fechaB = b.partidos[0]?.fecha ? new Date(b.partidos[0].fecha).getTime() : 0;
      return fechaB - fechaA;
    });

  }
  async eliminarPartido(indexTorneo:number, indexPartido: number, index:number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este partido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {

            if (index >= 0 && index < this._game_.partidos.length) {
              const partidoAEliminar = this._game_.partidos[index];
              await this._game_.eliminarFirmasPartido(partidoAEliminar);
              this._game_.eliminarPartido(partidoAEliminar);
              this.torneos[indexTorneo].partidos.splice(indexPartido, 1);
              this.cargaPartidos()
            } else {
              console.warn('Índice inválido. No se eliminó el partido.');
            }
          }
        }
      ]
    });
  
    await alert.present();
    
  }

  continuar_partido(i:any){
    let estado = this._game_.partidos[i].estado
    this._game_.index = i;
    this._game_.partido = this._game_.partidos[i]
    if(estado == 1){
      this._game_.edit_game(i)
    }
    if(estado == 2){
      this._game_.new_informacion()
    }
    if(estado == 3){
      this._game_.new_equipo(1)
    }
    if(estado == 4){
      this._game_.new_equipo(2)
    }
    if(estado == 5){
      this._game_.new_firma(1)
    }
    if(estado == 6){
      this._game_.new_firma(2)
    }
    if(estado == 7){
      this._game_.new_firma(3)
    }
    if(estado == 8){
      this._game_.new_firma(4)
    }
    if(estado == 9){
      this._game_.new_sorteo(1)
    }
    if(estado == 10){
      this._game_.new_set(1)
    }
    if(estado == 11){
      this._game_.start_set(1)
    }
    if(estado == 12){
      this._game_.closeSet(1)
    }
    if(estado == 13){
      this._game_.new_set(2)
    }
    if(estado == 14){
      this._game_.start_set(2)
    }
    if(estado == 15){
      this._game_.closeSet(2)
    }
    if(estado == 16){
      this._game_.new_sorteo(3)
    }
    if(estado == 17){
      this._game_.new_set(3)
    }
    if(estado == 18){
      this._game_.start_set(3)
    }
    if(estado == 19){
      this._game_.closeSet(3)
    }
    if(estado == 20){
      this._game_.new_set(4)
    }
    if(estado == 21){
      this._game_.start_set(4)
    }
    if(estado == 22){
      this._game_.closeSet(4)
    }
    if(estado == 23){
      this._game_.new_sorteo(5)
    }
    if(estado == 24){
      this._game_.new_set(5)
    }
    if(estado == 25){
      this._game_.start_set(5)
    }
    if(estado == 26){
      this._game_.closeSet(5)
    }
    if(estado == 27){
      this._game_.new_firma(5)
    }
    if(estado == 28){
      this._game_.new_firma(6)
    }
    if(estado == 29){
      this._game_.new_firma(7)
    }
    if(estado == 30){
      this._game_.new_firma(8)
    }
    if(estado == 31){
      this._game_.new_firma(9)
    }
    if(estado == 32){
      this._game_.new_firma(10)
    }
    if(estado == 33){
      this.mostrarResumenPartido(i)
    }
  }

  // "Amonestación" agrupa demora, tarjeta amarilla/roja, solicitud
  // improcedente y expulsión (ver GamePage.amonestacion()).
  private readonly TIPOS_AMONESTACION = [5, 6, 7, 8, 9];

  private formatearDuracion(ms: number): string {
    if (!isFinite(ms) || ms < 0) return '-';
    const totalSegundos = Math.floor(ms / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    const mm = minutos.toString().padStart(horas > 0 ? 2 : 1, '0');
    const ss = segundos.toString().padStart(2, '0');
    return horas > 0 ? `${horas}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  // Duración de un set ya jugado, o null si falta alguna de las dos horas.
  private duracionSetMs(set: any): number | null {
    if (!set?.hora_inicio || !set?.hora_fin) return null;
    const ms = new Date(set.hora_fin).getTime() - new Date(set.hora_inicio).getTime();
    return isNaN(ms) ? null : ms;
  }

  // Muestra un resumen del partido finalizado (equipos, marcador, tiempos y
  // amonestaciones de cada set, duración y ganador), con el mismo estilo de
  // alert usado en el resto de la app (ver la confirmación de firma en
  // SignaturePage).
  async mostrarResumenPartido(index: any) {
    const partido = this._game_.partidos[index];
    const nombreA = this._game_.obtenerEquipoPorLado('A')?.nombre || 'Equipo A';
    const nombreB = this._game_.obtenerEquipoPorLado('B')?.nombre || 'Equipo B';

    let setsGanadosA = 0;
    let setsGanadosB = 0;
    let tiemposA = 0;
    let tiemposB = 0;
    let amonestacionesA = 0;
    let amonestacionesB = 0;
    let duracionTotalMs = 0;
    let filasSets = '';

    for (let numSet = 1; numSet <= 5; numSet++) {
      const set = partido[`set_${numSet}`];
      if (!set || !set.victoria) continue;

      const puntosA = this._game_.contarPuntos(set, 'A');
      const puntosB = this._game_.contarPuntos(set, 'B');
      if (set.victoria === 'A') setsGanadosA++;
      if (set.victoria === 'B') setsGanadosB++;

      const logs = set.logs || [];
      tiemposA += logs.filter((l: any) => l.tipo === 4 && l.equipo === 'A').length;
      tiemposB += logs.filter((l: any) => l.tipo === 4 && l.equipo === 'B').length;
      amonestacionesA += logs.filter((l: any) => this.TIPOS_AMONESTACION.includes(l.tipo) && l.equipo === 'A').length;
      amonestacionesB += logs.filter((l: any) => this.TIPOS_AMONESTACION.includes(l.tipo) && l.equipo === 'B').length;

      const duracionMs = this.duracionSetMs(set);
      if (duracionMs !== null) duracionTotalMs += duracionMs;

      const tiemposSetA = logs.filter((l: any) => l.tipo === 4 && l.equipo === 'A').length;
      const tiemposSetB = logs.filter((l: any) => l.tipo === 4 && l.equipo === 'B').length;
      const amonestacionesSetA = logs.filter((l: any) => this.TIPOS_AMONESTACION.includes(l.tipo) && l.equipo === 'A').length;
      const amonestacionesSetB = logs.filter((l: any) => this.TIPOS_AMONESTACION.includes(l.tipo) && l.equipo === 'B').length;

      const estiloGanador = 'color: var(--ion-color-primary); font-weight: 700;';
      const estiloSubLabel = 'padding: 2px 8px 2px 20px; text-align: left; font-size: 10px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.4);';
      const estiloSubValor = 'padding: 2px 8px; text-align: center; font-size: 12px; color: rgba(var(--ion-color-dark-rgb), 0.7);';
      filasSets += `
        <tr>
          <td style="padding: 6px 8px 2px; ${numSet > 1 ? 'border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.08);' : ''} font-size: 11px; color: rgba(var(--ion-color-dark-rgb), 0.5);">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span>Set ${numSet}</span>
              <span>${duracionMs !== null ? this.formatearDuracion(duracionMs) : ''}</span>
            </div>
          </td>
          <td style="padding: 6px 8px 2px; ${numSet > 1 ? 'border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.08);' : ''} text-align: center; ${set.victoria === 'A' ? estiloGanador : ''}">${puntosA}</td>
          <td style="padding: 6px 8px 2px; ${numSet > 1 ? 'border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.08);' : ''} text-align: center; ${set.victoria === 'B' ? estiloGanador : ''}">${puntosB}</td>
        </tr>
        <tr>
          <td style="${estiloSubLabel}">Tiempos</td>
          <td style="${estiloSubValor}">${tiemposSetA}</td>
          <td style="${estiloSubValor}">${tiemposSetB}</td>
        </tr>
        <tr>
          <td style="${estiloSubLabel}">Amonestaciones</td>
          <td style="${estiloSubValor}">${amonestacionesSetA}</td>
          <td style="${estiloSubValor}">${amonestacionesSetB}</td>
        </tr>`;
    }

    const ganador = this._game_.obtenerGanadorPartido();
    const textoGanador = ganador ? this._game_.textoEquipoGanador(ganador) : null;
    const filaBorde = 'border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.15);';

    const alert = await this.alertController.create({
      cssClass: 'no-padding-header no-padding-message',
      htmlAttributes: {
        innerHTML: `
        <h2 class="alert-title sc-ion-alert-ios" style="text-align: center; padding-top: 12px;">Resumen del Partido</h2>
        <div style="text-align: center; padding: 4px 16px 12px;">
          <div class="alert-message sc-ion-alert-ios" style="margin-bottom: 4px;">
            ${partido.competicion ? partido.competicion + ' &middot; ' : ''}Partido N° ${partido.numero_partido || ''}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px; table-layout: fixed;">
            <tr>
              <td style="padding: 4px 8px; width: 44%;"></td>
              <td style="padding: 4px 8px; width: 28%; text-align: center; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nombreA}</td>
              <td style="padding: 4px 8px; width: 28%; text-align: center; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nombreB}</td>
            </tr>
            ${filasSets}
            <tr>
              <td colspan="3" style="padding: 10px 8px 2px; ${filaBorde} text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(var(--ion-color-dark-rgb), 0.4);">Total</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; text-align: left; font-size: 11px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.5);">Sets</td>
              <td style="padding: 4px 8px; text-align: center; font-weight: 700;">${setsGanadosA}</td>
              <td style="padding: 4px 8px; text-align: center; font-weight: 700;">${setsGanadosB}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; text-align: left; font-size: 11px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.5);">Tiempos</td>
              <td style="padding: 4px 8px; text-align: center;">${tiemposA}</td>
              <td style="padding: 4px 8px; text-align: center;">${tiemposB}</td>
            </tr>
            <tr>
              <td style="padding: 4px 8px; text-align: left; font-size: 11px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.5);">Amonestaciones</td>
              <td style="padding: 4px 8px; text-align: center;">${amonestacionesA}</td>
              <td style="padding: 4px 8px; text-align: center;">${amonestacionesB}</td>
            </tr>
          </table>
          <div style="margin-top: 10px; font-size: 13px; color: rgba(var(--ion-color-dark-rgb), 0.6);">Duración total: ${this.formatearDuracion(duracionTotalMs)}</div>
          ${textoGanador ? `<div style="margin-top: 8px; font-weight: 600;">Ganador: ${textoGanador}</div>` : ''}
        </div>
      `,
      },
      buttons: [
        'Cerrar',
        {
          text: 'Más detalles',
          handler: () => {
            this.router.navigate(['detalle-partido']);
          }
        }
      ]
    });

    await alert.present();
  }
  async exportarPartido(index: number) {
    this.completarPlanilla(this._game_.partidos[index])
    
  }

  async copiarPartido(index: number) {
    try {
      const partido = this._game_.partidos[index];
      const partidoJson = JSON.stringify(partido, null, 2);
      
      // Use Capacitor Clipboard API
      await Clipboard.write({
        string: partidoJson
      });
      
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'El partido se ha copiado al portapapeles',
        buttons: ['Aceptar']
      });
      
      await alert.present();
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo copiar el partido al portapapeles',
        buttons: ['Aceptar']
      });
      
      await alert.present();
    }
  }

  async completarPlanilla(partido: any) {
  console.log(partido);

  // 1. Validar si el partido es de 3 sets como pide la regla
  if (partido.numero_sets !== 3) {
    try{

     const urlPlantilla = 'assets/planilla_5.pdf';
    const pdfBytesPlantilla = await fetch(urlPlantilla).then(res => res.arrayBuffer());

    if (!pdfBytesPlantilla) throw new Error('No se pudo cargar la plantilla PDF.');

    const pdfDoc = await PDFDocument.load(pdfBytesPlantilla);
    const paginas = pdfDoc.getPages();
    const primeraPagina = paginas[0]; 

    //completar partido 5 sets

    const pdfBytesModificado = await pdfDoc.save();
    this.descargarPdf(pdfBytesModificado, `planilla_partido_${partido.numero_partido || 'final'}.pdf`);
    } catch (error) {
    console.error('Error procesando la planilla PDF:', error);
  }

    return;
  }

  try {
    const urlPlantilla = 'assets/planilla_3.pdf';
    const pdfBytesPlantilla = await fetch(urlPlantilla).then(res => res.arrayBuffer());

    if (!pdfBytesPlantilla) throw new Error('No se pudo cargar la plantilla PDF.');

    const pdfDoc = await PDFDocument.load(pdfBytesPlantilla);
    const paginas = pdfDoc.getPages();
    const primeraPagina = paginas[0]; 

    // =========================================================================
    // 1. CABECERA PRINCIPAL (Dinámica desde el objeto partido)
    // =========================================================================
    
    
    // Nombre de la Competencia, Ciudad y Código de País
    primeraPagina.drawText(partido.competicion || '', { x: 140, y: 490, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(partido.ciudad || '', { x: 60, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(partido.pais === 'chile' ? 'CHL' : (partido.pais || ''), { x: 300, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });

    // Número de Partido
    if(partido.numero_partido > 10){

    primeraPagina.drawText(String(partido.numero_partido || ''), { x: 312, y: 518-57, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    }else{
    primeraPagina.drawText(String('0'), { x: 312, y: 518-57, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(String(partido.numero_partido || ''), { x: 325, y: 518-57, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    }

    // Fecha (D / M / Y)
    if (partido.fecha) {
      const [d, m, a] = partido.fecha.split('/');
      primeraPagina.drawText(d || '', { x: 364, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
      primeraPagina.drawText(m || '', { x: 386, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
      primeraPagina.drawText(a || '', { x: 411, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    }

    // Hora de programación de la planilla (H / mn)
    if (partido.hora) {
      const [h, mn] = partido.hora.split(':');
      primeraPagina.drawText(h || '', { x: 470, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
      primeraPagina.drawText(mn || '', { x: 495, y: 518 - 44, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    }

    // Nombres de los Equipos (Cabecera central A vs B)
    const equipoPlanillaA = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'A');
    const equipoPlanillaB = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'B');
    primeraPagina.drawText('A', { x: 358, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(equipoPlanillaA?.nombre || '', { x: 373, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText('B', { x: 500, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(equipoPlanillaB?.nombre || '', { x: 455, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });


    // =========================================================================
    // 2. CUADRANTES DE JUEGO (SET 1 & SET 2 extraídos dinámicamente)
    // =========================================================================

    // // --- SET 1 ---
    // if (partido.set_1) {
    //   // Horas extraídas del JSON
    //   primeraPagina.drawText(partido.set_1.hora_inicio || '', { x: 165, y: 472, size: 8 }); 
    //   primeraPagina.drawText(partido.set_1.hora_fin || '', { x: 322, y: 472, size: 8 }); 

    //   // Cuadros de Saque/Recepción basados en equipo_saque
    //   if (partido.set_1.equipo_saque === 'A') {
    //     primeraPagina.drawText('X', { x: 147, y: 456, size: 9 }); // S en Equipo A
    //     primeraPagina.drawText('X', { x: 350, y: 456, size: 9 }); // R en Equipo B
    //   } else if (partido.set_1.equipo_saque === 'B') {
    //     primeraPagina.drawText('X', { x: 147, y: 456, size: 9 }); // R en Equipo A
    //     primeraPagina.drawText('X', { x: 350, y: 456, size: 9 }); // S en Equipo B
    //   }

    //   // Formación inicial del Equipo A
    //   if (partido.set_1.alineacion_a) {
    //     partido.set_1.alineacion_a.forEach((num: number, index: number) => {
    //       primeraPagina.drawText(String(num), { x: 164 + (index * 24), y: 438, size: 9 });
    //     });
    //   }

    //   // Formación inicial del Equipo B
    //   if (partido.set_1.alineacion_b) {
    //     partido.set_1.alineacion_b.forEach((num: number, index: number) => {
    //       primeraPagina.drawText(String(num), { x: 368 + (index * 24), y: 438, size: 9 });
    //     });
    //   }
    // }

    // // --- SET 2 ---
    // if (partido.set_2) {
    //   // Horas del Set 2
    //   primeraPagina.drawText(partido.set_2.hora_inicio || '', { x: 592, y: 472, size: 8 }); 
    //   primeraPagina.drawText(partido.set_2.hora_fin || '', { x: 748, y: 472, size: 8 }); 

    //   // Saque/Recepción Set 2
    //   if (partido.set_2.equipo_saque === 'B') {
    //     primeraPagina.drawText('X', { x: 574, y: 456, size: 9 }); // S en Equipo B (Lado izquierdo del Set 2)
    //     primeraPagina.drawText('X', { x: 775, y: 456, size: 9 }); // R en Equipo A (Lado derecho del Set 2)
    //   } else if (partido.set_2.equipo_saque === 'A') {
    //     primeraPagina.drawText('X', { x: 574, y: 456, size: 9 }); // R en Equipo B
    //     primeraPagina.drawText('X', { x: 775, y: 456, size: 9 }); // S en Equipo A
    //   }

    //   // Formación inicial del Equipo A (en el cuadrante izquierdo del Set 2)
    //   if (partido.set_2.alineacion_a) {
    //     partido.set_2.alineacion_a.forEach((num: number, index: number) => {
    //       primeraPagina.drawText(String(num), { x: 590 + (index * 24), y: 438, size: 9 });
    //     });
    //   }

    //   // Formación inicial del Equipo B (en el cuadrante derecho del Set 2)
    //   if (partido.set_2.alineacion_b) {
    //     partido.set_2.alineacion_b.forEach((num: number, index: number) => {
    //       primeraPagina.drawText(String(num), { x: 794 + (index * 24), y: 438, size: 9 });
    //     });
    //   }
    // }


    // =========================================================================
    // 3. TABLA DE RESULTADOS DE SETS (RESULTS - Abajo a la derecha)
    // =========================================================================
    
    // Encabezados de la tabla pequeña de control
    // primeraPagina.drawText(partido.equipo_a?.nombre || '', { x: 590, y: 242, size: 9 });
    // primeraPagina.drawText(partido.equipo_b?.nombre || '', { x: 720, y: 242, size: 9 });

    // // --- Datos Dinámicos del Set 1 ---
    // if (partido.set_1) {
    //   primeraPagina.drawText(String(partido.set_1.puntos_a ?? '0'), { x: 635, y: 218, size: 9 });
    //   primeraPagina.drawText(String(partido.set_1.duracion || '0'), { x: 668, y: 218, size: 8 }); 
    //   primeraPagina.drawText(String(partido.set_1.puntos_b ?? '0'), { x: 695, y: 218, size: 9 });
      
    //   // Marcar 1 al ganador del Set 1 en la columna W (Won)
    //   if (partido.set_1.puntos_a > partido.set_1.puntos_b) {
    //     primeraPagina.drawText('1', { x: 618, y: 218, size: 8 }); // Ganó A
    //   } else {
    //     primeraPagina.drawText('1', { x: 712, y: 218, size: 8 }); // Ganó B
    //   }
    // }

    // // --- Datos Dinámicos del Set 2 ---
    // if (partido.set_2) {
    //   primeraPagina.drawText(String(partido.set_2.puntos_a ?? '0'), { x: 635, y: 204, size: 9 });
    //   primeraPagina.drawText(String(partido.set_2.duracion || '0'), { x: 668, y: 204, size: 8 }); 
    //   primeraPagina.drawText(String(partido.set_2.puntos_b ?? '0'), { x: 695, y: 204, size: 9 });
      
    //   // Marcar 1 al ganador del Set 2 en la columna W (Won)
    //   if (partido.set_2.puntos_a > partido.set_2.puntos_b) {
    //     primeraPagina.drawText('1', { x: 618, y: 204, size: 8 }); // Ganó A
    //   } else {
    //     primeraPagina.drawText('1', { x: 712, y: 204, size: 8 }); // Ganó B
    //   }
    // }

    // // --- Fila de Totales Generales ---
    // const totalPuntosA = (partido.set_1?.puntos_a || 0) + (partido.set_2?.puntos_a || 0);
    // const totalPuntosB = (partido.set_1?.puntos_b || 0) + (partido.set_2?.puntos_b || 0);
    // const totalDuracion = (partido.set_1?.duracion || 0) + (partido.set_2?.duracion || 0);

    // primeraPagina.drawText(String(totalPuntosA), { x: 635, y: 152, size: 10 }); 
    // primeraPagina.drawText(String(totalDuracion), { x: 668, y: 152, size: 9 });   
    // primeraPagina.drawText(String(totalPuntosB), { x: 695, y: 152, size: 10 }); 
    
    // // Suma total de sets ganados por cada uno
    // primeraPagina.drawText(String(partido.totales?.sets_ganados_a ?? '0'), { x: 618, y: 152, size: 9 });
    // primeraPagina.drawText(String(partido.totales?.sets_ganados_b ?? '0'), { x: 712, y: 152, size: 9 });


    // =========================================================================
    // 4. TIEMPOS GLOBALES Y CUADRO WINNER (100% Dinámicos)
    // =========================================================================
    
    // if (partido.totales?.hora_inicio_partido && partido.totales?.hora_fin_partido) {
    //   const [startH, startMn] = partido.totales.hora_inicio_partido.split(':');
    //   const [endH, endMn] = partido.totales.hora_fin_partido.split(':');
      
    //   primeraPagina.drawText(startH || '', { x: 595, y: 102, size: 8 });
    //   primeraPagina.drawText(startMn || '', { x: 612, y: 102, size: 8 });
    //   primeraPagina.drawText(endH || '', { x: 658, y: 102, size: 8 });
    //   primeraPagina.drawText(endMn || '', { x: 675, y: 102, size: 8 });
    // }

    // if (partido.totales?.duracion_total_partido) {
    //   const [totH, totMn] = partido.totales.duracion_total_partido.split(':');
    //   primeraPagina.drawText(totH || '00', { x: 724, y: 102, size: 8 });
    //   primeraPagina.drawText(totMn || '00', { x: 745, y: 102, size: 8 });
    // }

    // // Nombre del equipo ganador y su marcador final de sets
    // primeraPagina.drawText(partido.ganador?.nombre || '', { x: 625, y: 84, size: 11 }); 
    // primeraPagina.drawText(String(partido.ganador?.sets_totales || ''), { x: 742, y: 84, size: 11 });

    // 5. Compilar y descargar el documento resultante
    const pdfBytesModificado = await pdfDoc.save();
    this.descargarPdf(pdfBytesModificado, `planilla_partido_${partido.numero_partido || 'final'}.pdf`);

  } catch (error) {
    console.error('Error procesando la planilla PDF:', error);
  }
}

  // En navegador (web) fuerza la descarga del Blob. En un dispositivo móvil
  // (Capacitor nativo) el link de descarga no funciona dentro del WebView,
  // así que en su lugar el archivo se escribe en caché y se abre la hoja de
  // compartir nativa para que el usuario lo guarde o lo envíe.
  async descargarPdf(bytes: Uint8Array, nombreArchivo: string) {
    if (Capacitor.isNativePlatform()) {
      await this.compartirPdfNativo(bytes, nombreArchivo);
      return;
    }

    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private async compartirPdfNativo(bytes: Uint8Array, nombreArchivo: string) {
    try {
      const base64Data = this.arrayBufferToBase64(bytes.buffer as ArrayBuffer);
      const { uri } = await Filesystem.writeFile({
        path: nombreArchivo,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: nombreArchivo,
        dialogTitle: 'Compartir planilla',
        files: [uri]
      });
    } catch (error) {
      console.error('Error al compartir la planilla:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo compartir la planilla.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  // async completarPlanilla(partido:any) {
  //   console.log(partido)

  //   return
  //   const pdfBytes1 = await fetch('assets/ilovepdf_merged.pdf').then(r => r.arrayBuffer());
  //   const pdfDoc = await PDFDocument.load(pdfBytes1);
  
  //   // Obtener las dos páginas
  //   const [page1, page2] = pdfDoc.getPages();
  
  //   // --- Recortar las secciones que quieres ---
  //   page1.setCropBox(0, 0, 2000, 405);    // Parte inferior de la primera
  //   page2.setCropBox(0, 560, 2000, 350);  // Parte superior de la segunda
  
  //   // Crear nuevo PDF
  //   const newPdf = await PDFDocument.create();
  
  //   // Importar las páginas recortadas
  //   const [embeddedPage1] = await newPdf.embedPages([page1]);
  //   const [embeddedPage2] = await newPdf.embedPages([page2]);
  
  //   // Definir el ancho y alto del nuevo documento
  //   const width = Math.max(page1.getWidth(), page2.getWidth());
  //   const height = 405 + 350; // suma de ambas alturas recortadas
  
  //   const newPage = newPdf.addPage([width, height]);
  
  //   // Dibujar la parte de arriba (segunda página recortada)
  //   newPage.drawPage(embeddedPage2, { x: 0, y: 405 }); // encima
  //   // Dibujar la parte de abajo (primera página recortada)
  //   newPage.drawPage(embeddedPage1, { x: 0, y: 0 });
  
  //   // Guardar el resultado final
  //   const pdfBytes = await newPdf.save();

  //   const fileName = `planilla_temp_${Date.now()}.pdf`;
  //   await Filesystem.writeFile({
  //     path: fileName,
  //     data: this.arrayBufferToBase64(pdfBytes),
  //     directory: Directory.Cache,
  //   });

  //   const { uri } = await Filesystem.getUri({
  //     directory: Directory.Cache,
  //     path: fileName,
  //   });

  //   if (Capacitor.getPlatform() === 'web') {
  //     // WEB 👉 Crear blob temporal y abrir
  //     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //     const blobUrl = URL.createObjectURL(blob);
  //     window.open(blobUrl, '_blank');
  //   } else {
  //     // NATIVO 👉 Guardar en cache temporal y abrir con FileOpener
  //     const tempPath = `${Capacitor.convertFileSrc('cache')}/planilla_temp_${Date.now()}.pdf`;
  
  //     // En vez de usar Filesystem, escribimos el archivo directo en la ruta temporal si ya lo tienes como blob/uri
  //     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  //     const reader = new FileReader();
  
  //     reader.onloadend = async () => {
  //       const base64data = (reader.result as string).split(',')[1];
  
  //       // Guardar archivo temporalmente en la cache de Capacitor
  //       const { uri } = await Filesystem.writeFile({
  //         path: `planilla_temp_${Date.now()}.pdf`,
  //         data: base64data,
  //         directory: Directory.Cache,
  //       });
  
  //       await FileOpener.open({
  //         filePath: uri,
  //         contentType: 'application/pdf',
  //       });
  //     };
  
  //     reader.readAsDataURL(blob);
  //   }


  // }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary);
  }
}

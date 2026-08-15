import { Component, DoCheck, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';
import { LocalstorageService } from 'src/app/services/bd/localstorage.service';
import { Clipboard } from '@capacitor/clipboard';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, DoCheck {

  torneos: any = []

  constructor(private _game_: GameService,private alertController: AlertController, private _localStorage_: LocalstorageService) { }
  ngOnInit(): void {
  }
  
  
  ngDoCheck() {
    this._localStorage_.saveData(this._game_.partidos);
  }

  new_game(){
    this._game_.new_game();
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
        setsA: 0,
        equipoB: "Equipo B",
        setsB: 0,
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
      if(this._game_.partidos[index].equipo_a){
        if(this._game_.partidos[index].equipo_a.nombre){
          partido.equipoA = this._game_.partidos[index].equipo_a.nombre
        }
      }
      if(this._game_.partidos[index].equipo_b){
        if(this._game_.partidos[index].equipo_b.nombre){
          partido.equipoB = this._game_.partidos[index].equipo_b.nombre
        }
      }
      if( this._game_.partidos[index].set_1 && this._game_.partidos[index].set_1.victoria){
        if(this._game_.partidos[index].set_1.victoria == "A"){
          partido.setsA ++;
        }
        if(this._game_.partidos[index].set_1.victoria == "B"){
          partido.setsB ++;
        }
      }
      if( this._game_.partidos[index].set_2 && this._game_.partidos[index].set_2.victoria){
        if(this._game_.partidos[index].set_2.victoria == "A"){
          partido.setsA ++;
        }
        if(this._game_.partidos[index].set_2.victoria == "B"){
          partido.setsB ++;
        }
      }
      if( this._game_.partidos[index].set_3 && this._game_.partidos[index].set_3.victoria){
        if(this._game_.partidos[index].set_3.victoria == "A"){
          partido.setsA ++;
        }
        if(this._game_.partidos[index].set_3.victoria == "B"){
          partido.setsB ++;
        }
      }
      if( this._game_.partidos[index].set_4 && this._game_.partidos[index].set_4.victoria){
        if(this._game_.partidos[index].set_4.victoria == "A"){
          partido.setsA ++;
        }
        if(this._game_.partidos[index].set_4.victoria == "B"){
          partido.setsB ++;
        }
      }
      if( this._game_.partidos[index].set_5 && this._game_.partidos[index].set_5.victoria){
        if(this._game_.partidos[index].set_5.victoria == "A"){
          partido.setsA ++;
        }
        if(this._game_.partidos[index].set_5.victoria == "B"){
          partido.setsB ++;
        }
      }
      if (this._game_.partidos[index].estado) {
        const estado = this._game_.partidos[index].estado;
        const estadosTexto:any = {
          1: 'Configuración',
          2: 'Configuración',
          3: 'Configuración',
          4: 'Firmas',
          5: 'Firmas',
          6: 'Firmas',
          7: 'Firmas',
          8: 'R-5 Set 1',
          9: 'Inicio Set 1',
          10: 'Fin Set 1',
          11: 'R-5 Set 2',
          12: 'Inicio Set 2',
          13: 'Fin Set 2',
          14: 'R-5 Set 3',
          15: 'Inicio Set 3',
          16: 'Fin Set 3',
          17: 'R-5 Set 4',
          18: 'Inicio Set 4',
          19: 'Fin Set 4',
          20: 'R-5 Set 5',
          21: 'Inicio Set 5',
          22: 'Fin Set 5',
          23: 'Firmas',
          24: 'Firmas',
          25: 'Firmas',
          26: 'Firmas',
          27: 'Firmas',
          28: 'Firmas',
          29: 'Finalizado',
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
          handler: () => {

            if (index >= 0 && index < this._game_.partidos.length) {
              this._game_.partidos.splice(index, 1);
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
      this._game_.new_equipo("A")
    }
    if(estado == 3){
      this._game_.new_equipo("B")
    }
    if(estado == 4){
      this._game_.new_firma(1)
    }
    if(estado == 5){
      this._game_.new_firma(2)
    }
    if(estado == 6){
      this._game_.new_firma(3)
    }
    if(estado == 7){
      this._game_.new_firma(4)
    }
    if(estado == 8){
      this._game_.new_set(1)
    }
    if(estado == 9){
      this._game_.start_set(1)
    }

    if(estado == 10){
      this._game_.closeSet(1)
    }
    if(estado == 11){
      this._game_.new_set(2)
    }
    if(estado == 12){
      this._game_.start_set(2)
    }
    if(estado == 13){
      this._game_.closeSet(2)
    }
    if(estado == 14){
      this._game_.new_set(3)
    }
    if(estado == 15){
      this._game_.start_set(3)
    }
    if(estado == 16){
      this._game_.closeSet(3)
    }
    if(estado == 17){
      this._game_.new_set(4)
    }
    if(estado == 18){
      this._game_.start_set(4)
    }
    if(estado == 19){
      this._game_.closeSet(4)
    }
    if(estado == 20){
      this._game_.new_set(5)
    }
    if(estado == 21){
      this._game_.start_set(5)
    }
    if(estado == 22){
      this._game_.closeSet(5)
    }
    if(estado == 23){
      this._game_.new_firma(5)
    }
    if(estado == 24){
      this._game_.new_firma(6)
    }
    if(estado == 25){
      this._game_.new_firma(7)
    }
    if(estado == 26){
      this._game_.new_firma(8)
    }
    if(estado == 27){
      this._game_.new_firma(9)
    }
    if(estado == 28){
      this._game_.new_firma(10)
    }
    if(estado == 29){

    }
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
    primeraPagina.drawText('A', { x: 358, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(partido.equipo_a?.nombre || '', { x: 373, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText('B', { x: 500, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
    primeraPagina.drawText(partido.equipo_b?.nombre || '', { x: 455, y: 518 - 67, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });


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

  // Función auxiliar para forzar la descarga del Blob de manera limpia
  descargarPdf(bytes: Uint8Array, nombreArchivo: string) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

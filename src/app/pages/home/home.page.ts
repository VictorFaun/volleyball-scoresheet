import { Component, DoCheck, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';
import { LocalstorageService } from 'src/app/services/bd/localstorage.service';
import { Clipboard } from '@capacitor/clipboard';
import { PDFDocument, rgb } from 'pdf-lib';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';

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
    // try {
    //   const partido = this._game_.partidos[index];
    //   const partidoJson = JSON.stringify(partido, null, 2);
      
    //   // Use Capacitor Clipboard API
    //   await Clipboard.write({
    //     string: partidoJson
    //   });
      
    //   const alert = await this.alertController.create({
    //     header: 'Éxito',
    //     message: 'El partido se ha copiado al portapapeles',
    //     buttons: ['Aceptar']
    //   });
      
    //   await alert.present();
    // } catch (error) {
    //   console.error('Error al copiar al portapapeles:', error);
    //   const alert = await this.alertController.create({
    //     header: 'Error',
    //     message: 'No se pudo copiar el partido al portapapeles',
    //     buttons: ['Aceptar']
    //   });
      
    //   await alert.present();
    // }
  }

  async completarPlanilla(partido:any) {
    const pdfBase = await fetch('assets/scoresheet.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBase);
    const page = pdfDoc.getPages()[0];

    page.drawText('Equipo Local: Los Tigres', {
      x: 100,
      y: 700,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Equipo Visitante: Las Águilas', {
      x: 100,
      y: 680,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Fecha: 03/11/2025', {
      x: 400,
      y: 700,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    const fileName = `planilla_temp_${Date.now()}.pdf`;
    await Filesystem.writeFile({
      path: fileName,
      data: this.arrayBufferToBase64(pdfBytes),
      directory: Directory.Cache,
    });

    const { uri } = await Filesystem.getUri({
      directory: Directory.Cache,
      path: fileName,
    });

    if (Capacitor.getPlatform() === 'web') {
      // WEB 👉 Crear blob temporal y abrir
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } else {
      // NATIVO 👉 Guardar en cache temporal y abrir con FileOpener
      const tempPath = `${Capacitor.convertFileSrc('cache')}/planilla_temp_${Date.now()}.pdf`;
  
      // En vez de usar Filesystem, escribimos el archivo directo en la ruta temporal si ya lo tienes como blob/uri
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
  
        // Guardar archivo temporalmente en la cache de Capacitor
        const { uri } = await Filesystem.writeFile({
          path: `planilla_temp_${Date.now()}.pdf`,
          data: base64data,
          directory: Directory.Cache,
        });
  
        await FileOpener.open({
          filePath: uri,
          contentType: 'application/pdf',
        });
      };
  
      reader.readAsDataURL(blob);
    }


  }

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

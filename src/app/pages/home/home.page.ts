import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  partidos: any = []

  constructor(private _game_: GameService,private alertController: AlertController) { }
  ngOnInit(): void {
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
    this.partidos = [];
    for (let index = 0; index < this._game_.partidos.length; index++) {
      let partido:any = {
        torneo: "",
        equipoA: "Equipo A",
        setsA: 0,
        equipoB: "Equipo B",
        setsB: 0,
        estado: null,
        index: index,
        numero_partido: 0
      }
      if(this._game_.partidos[index].competicion){
        partido.torneo = this._game_.partidos[index].competicion
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
          1: 'Config',
          2: 'Config',
          3: 'Firmas',
          4: 'Firmas',
          5: 'Firmas',
          6: 'Firmas',
          7: 'Config Set 1',
          8: 'Inicio Set 1',
          9: 'Fin Set 1',
          10: 'Config Set 2',
          11: 'Inicio Set 2',
          12: 'Fin Set 2',
          13: 'Config Set 3',
          14: 'Inicio Set 3',
          15: 'Fin Set 3',
          16: 'Config Set 4',
          17: 'Inicio Set 4',
          18: 'Fin Set 4',
          19: 'Config Set 5',
          20: 'Inicio Set 5',
          21: 'Fin Set 5',
          22: 'Firmas',
          23: 'Firmas',
          24: 'Firmas',
          25: 'Firmas',
          26: 'Firmas',
          27: 'Firmas',
          28: 'Finalizado',
        };
      
        partido.estado = estadosTexto[estado] || 'Config';
      }else{
        partido.estado = 'Config';
      }
      
      
      this.partidos.push(partido)
    }
  }
  async eliminarPartido(index: number) {
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
              this.partidos.splice(index, 1); // si tienes un arreglo visual también
              this.cargaPartidos()
              console.log(`Partido ${index} eliminado`);
            } else {
              console.warn('Índice inválido. No se eliminó el partido.');
            }
          }
        }
      ]
    });
  
    await alert.present();
    
  }
}

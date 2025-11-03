import { Component, DoCheck, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import { LocalstorageService } from 'src/app/services/bd/localstorage.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: false,
})
export class TeamPage implements OnInit, DoCheck {

  lado: string = '';
  equipo: any;
  autocompletar: boolean = false;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController, private _localStorage_: LocalstorageService) { }
  volver() {
    this.navCtrl.navigateBack('/home');
  }


  ngDoCheck() {
    this._localStorage_.saveData(this._game_.partidos);
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.lado = params['lado'];
      if (this.lado == "A") {
        this.equipo = this._game_.partido.equipo_a;
      }
      if (this.lado == "B") {
        this.equipo = this._game_.partido.equipo_b;
      }
    });
  }

  siguiente() {
    if (this.lado == "A") {
      this._game_.new_equipo("B");
    }
    if (this.lado == "B") {
      this._game_.new_firma(1);
    }
  }

  async abrirModalJugador() {
    const alert = await this.alertController.create({
      cssClass: 'no-padding-message',
      header: 'Agregar Jugador',
      subHeader: 'Complete los datos del jugador',

      inputs: [
        {
          name: 'dorsal',
          type: 'number',
          placeholder: 'Número de camiseta',
          value: ''
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del jugador',
          value: ''
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (!data.nombre || !data.dorsal) {
              return false;
            }
  
            const dorsal = parseInt(data.dorsal, 10);
  
            // Verificar si el dorsal ya está en uso
            if (this.equipo.jugadores && this.equipo.jugadores.some((j: any) => j.numero === dorsal)) {
              this.mostrarError('Este número de camiseta ya está en uso');
              return false;
            }
  
            // Si todo está bien, agregar el jugador
            let jugador: any = this._game_.clean_jugador();
            jugador.numero = dorsal;
            jugador.nombre = data.nombre.trim();
            
            if (!this.equipo.jugadores) {
              this.equipo.jugadores = [jugador];
            } else {
              this.equipo.jugadores.push(jugador);
            }
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  // Método auxiliar para mostrar mensajes de error
  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  
  async editarJugador(i: any) {
    const jugadorActual = this.equipo.jugadores[i];
    const dorsalOriginal = jugadorActual.numero;
    
    const alert = await this.alertController.create({
      cssClass: 'no-padding-message',
      header: 'Editar Jugador',
      subHeader: 'Modifique los datos del jugador',
      inputs: [
        {
          name: 'dorsal',
          type: 'number',
          placeholder: 'Número de camiseta',
          value: dorsalOriginal
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del jugador',
          value: jugadorActual.nombre
        },
      ],
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const confirmAlert = await this.alertController.create({
              header: 'Confirmar',
              message: '¿Estás seguro de eliminar este jugador?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel'
                },
                {
                  text: 'Eliminar',
                  handler: () => {
                    this.equipo.jugadores.splice(i, 1);
                  }
                }
              ]
            });
            await confirmAlert.present();
            return false; // Prevent the alert from closing
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombre || !data.dorsal) {
              return false;
            }
  
            const nuevoDorsal = parseInt(data.dorsal, 10);
  
            // Si el dorsal cambió, verificar que no esté en uso
            if (nuevoDorsal !== dorsalOriginal) {
              const dorsalEnUso = this.equipo.jugadores.some(
                (j: any, index: number) => 
                  index !== i && j.numero === nuevoDorsal
              );
              
              if (dorsalEnUso) {
                this.mostrarError('Este número de camiseta ya está en uso');
                return false;
              }
            }
  
            // Si todo está bien, actualizar el jugador
            this.equipo.jugadores[i].nombre = data.nombre.trim();
            this.equipo.jugadores[i].numero = nuevoDorsal;
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }

  buscarTeam(){
    if (!this.equipo?.nombre || !this._game_.partidos) {
      this.autocompletar = false;
      return;
    }
    
    const existeEquipo = this._game_.partidos.some((partido: any, index: number) => 
      index !== this._game_.index &&
    partido.competicion == this._game_.partido.competicion &&
    (
      partido.equipo_a && 
      partido.equipo_a.nombre.toLowerCase() === this.equipo.nombre.toLowerCase() ||
      partido.equipo_b && 
      partido.equipo_b.nombre.toLowerCase() === this.equipo.nombre.toLowerCase()
    )
    );
    
    this.autocompletar = existeEquipo;
  }

  autocompletarDatos(){
    const partido = this.buscarPartido();
    let equipo = null;
    if (partido) {
      if (this.equipo && this.equipo.nombre && partido.equipo_a && partido.equipo_a.nombre && this.equipo.nombre.toLowerCase() == partido.equipo_a.nombre.toLowerCase()) {
        equipo = partido.equipo_a;
      }else{
        if (this.equipo && this.equipo.nombre && partido.equipo_b && partido.equipo_b.nombre && this.equipo.nombre.toLowerCase() == partido.equipo_b.nombre.toLowerCase()) {
          equipo = partido.equipo_b;
        }
      }
    }
    if (equipo) {
      this.equipo.jugadores = equipo.jugadores;
      this.equipo.entrenador = equipo.entrenador;
      this.equipo.primer_asistente = equipo.primer_asistente;
      this.equipo.segundo_asistente = equipo.segundo_asistente;
      this.equipo.medico = equipo.medico;
      this.equipo.fisioterapeuta = equipo.fisioterapeuta;
      this.equipo.nombre = equipo.nombre;
    }
    this.autocompletar = false;
  }

  buscarPartido(){
    const partidos = this._game_.partidos.filter((partido: any, index: number) => 
      index !== this._game_.index &&
      partido.competicion == this._game_.partido.competicion &&
      (
        partido.equipo_a && 
        partido.equipo_a.nombre.toLowerCase() === this.equipo.nombre.toLowerCase() ||
        partido.equipo_b && 
        partido.equipo_b.nombre.toLowerCase() === this.equipo.nombre.toLowerCase()
      )
    );

    if (partidos.length === 0) return null;
    if (partidos.length === 1) return partidos[0];

    partidos.sort((a: any, b: any) => {
      const numA = a.numero_partido || 0;
      const numB = b.numero_partido || 0;
      
      if (numA > 0 && numB > 0 && numA !== numB) {
        return numB - numA;
      }
      
      const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const timeA = a.hora ? new Date(`1970-01-01T${a.hora}`).getTime() : 0;
      const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
      const timeB = b.hora ? new Date(`1970-01-01T${b.hora}`).getTime() : 0;
      
      if (dateA > 0 && dateB > 0) {
        return dateB - dateA;
      }
      
      if (timeA > 0 && timeB > 0) {
        return timeB - timeA;
      }
      
      return 0;
    });

    return partidos[0];
  }
}

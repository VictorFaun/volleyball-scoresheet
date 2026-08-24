import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: false,
})
export class TeamPage implements OnInit {

  numero: any;
  titulo: string = '';
  equipo: any;
  autocompletar: boolean = false;

  // Equipo de prueba rápido para testing: al escribir "EP1" en el nombre
  // del equipo, se ofrece cargar estos datos precargados.
  private readonly equiposPrueba: { [clave: string]: any } = {
    EP1: {
      nombre: 'Equipo de Prueba',
      entrenador: 'Entrenador Prueba',
      primer_asistente: 'Primer Asistente Prueba',
      segundo_asistente: 'Segundo Asistente Prueba',
      medico: 'Médico Prueba',
      fisioterapeuta: 'Fisioterapeuta Prueba',
      jugadores: [
        { numero: 1, nombre: 'Jugador 1', capitan: false, libero: false },
        { numero: 2, nombre: 'Jugador 2', capitan: false, libero: false },
        { numero: 3, nombre: 'Jugador 3', capitan: true, libero: false },
        { numero: 4, nombre: 'Jugador 4', capitan: false, libero: false },
        { numero: 5, nombre: 'Jugador 5', capitan: false, libero: false },
        { numero: 6, nombre: 'Jugador 6', capitan: false, libero: false },
        { numero: 7, nombre: 'Jugador 7', capitan: false, libero: false },
        { numero: 8, nombre: 'Jugador 8', capitan: false, libero: false },
        { numero: 9, nombre: 'Jugador 9', capitan: false, libero: false },
        { numero: 10, nombre: 'Jugador 10', capitan: false, libero: false },
        { numero: 11, nombre: 'Jugador 11', capitan: false, libero: false },
        { numero: 12, nombre: 'Jugador 12', capitan: false, libero: true },
      ]
    }
  };

  // Evita reabrir la alerta repetidamente mientras el nombre siga igual
  // (por ejemplo si el evento ionInput se disparara más de una vez).
  private ultimoEquipoPruebaConsultado: string | null = null;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController) { }
  volver() {
    this._game_.guardar();
    this._game_.volverAOrigen();
  }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.numero = Number(params['numero']);
      if (this.numero == 1) {
        this.equipo = this._game_.partido.equipo_1;
        this.titulo = 'Equipo N°1';
      }
      if (this.numero == 2) {
        this.equipo = this._game_.partido.equipo_2;
        this.titulo = 'Equipo N°2';
      }
    });
  }

  siguiente() {
    if (this.numero == 1) {
      this._game_.new_equipo(2);
    }
    if (this.numero == 2) {
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
          id: 'input-dorsal-nuevo-jugador',
          type: 'number',
          placeholder: 'Número de camiseta',
          value: ''
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del jugador (opcional)',
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
            if (data.dorsal === '' || data.dorsal === null || data.dorsal === undefined) {
              return false;
            }

            const dorsal = parseInt(data.dorsal, 10);

            // Verificar si el dorsal ya está en uso
            if (this.equipo.jugadores && this.equipo.jugadores.some((j: any) => j.numero === dorsal)) {
              this.mostrarError('Este número de camiseta ya está en uso');
              return false;
            }

            // Si todo está bien, agregar el jugador (el nombre es opcional)
            let jugador: any = this._game_.clean_jugador();
            jugador.numero = dorsal;
            jugador.nombre = data.nombre?.trim() || null;

            if (!this.equipo.jugadores) {
              this.equipo.jugadores = [jugador];
            } else {
              this.equipo.jugadores.push(jugador);
            }
            this._game_.guardar();
            return true;
          }
        }
      ]
    });

    await alert.present();

    // Foco automático en el campo N° al crear (no al editar).
    const inputDorsal = alert.querySelector<HTMLInputElement>('#input-dorsal-nuevo-jugador');
    inputDorsal?.focus();
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
            if (this._game_.jugadorParticipoEnSets(this.equipo.lado, dorsalOriginal)) {
              this.mostrarError('No puedes eliminar a este jugador porque ya participó en un set (en la alineación o en un cambio). Si necesitas corregir sus datos, edita su nombre o dorsal en vez de eliminarlo.');
              return false;
            }

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
                    this._game_.guardar();
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
            if (data.dorsal === '' || data.dorsal === null || data.dorsal === undefined) {
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

            // Si el dorsal cambió y el jugador ya estuvo en algún set,
            // actualizamos las alineaciones y logs guardados para que sigan
            // apuntando al jugador correcto.
            if (nuevoDorsal !== dorsalOriginal) {
              this._game_.actualizarDorsalEnSets(this.equipo.lado, dorsalOriginal, nuevoDorsal);
            }

            // Si todo está bien, actualizar el jugador (el nombre es opcional)
            this.equipo.jugadores[i].nombre = data.nombre?.trim() || null;
            this.equipo.jugadores[i].numero = nuevoDorsal;
            this._game_.guardar();
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }

  buscarTeam(){
    const nombreNormalizado = (this.equipo?.nombre || '').trim().toUpperCase();

    if (nombreNormalizado === 'EP1') {
      this.autocompletar = false;
      if (this.ultimoEquipoPruebaConsultado !== nombreNormalizado) {
        this.ultimoEquipoPruebaConsultado = nombreNormalizado;
        this.confirmarCargarEquipoPrueba(nombreNormalizado);
      }
      return;
    }
    this.ultimoEquipoPruebaConsultado = null;

    // Solo entre partidos de la misma competencia (mismo competencia_id). Un
    // partido suelto no tiene competencia_id, así que nunca autocompleta.
    if (!this.equipo?.nombre || !this._game_.partidos || !this._game_.partido.competencia_id) {
      this.autocompletar = false;
      return;
    }

    const existeEquipo = this._game_.partidos.some((partido: any, index: number) =>
      index !== this._game_.index &&
    partido.competencia_id === this._game_.partido.competencia_id &&
    (
      partido.equipo_1 &&
      partido.equipo_1.nombre.toLowerCase() === this.equipo.nombre.toLowerCase() ||
      partido.equipo_2 &&
      partido.equipo_2.nombre.toLowerCase() === this.equipo.nombre.toLowerCase()
    )
    );

    this.autocompletar = existeEquipo;
  }

  autocompletarDatos(){
    const partido = this.buscarPartido();
    let equipo = null;
    if (partido) {
      if (this.equipo && this.equipo.nombre && partido.equipo_1 && partido.equipo_1.nombre && this.equipo.nombre.toLowerCase() == partido.equipo_1.nombre.toLowerCase()) {
        equipo = partido.equipo_1;
      }else{
        if (this.equipo && this.equipo.nombre && partido.equipo_2 && partido.equipo_2.nombre && this.equipo.nombre.toLowerCase() == partido.equipo_2.nombre.toLowerCase()) {
          equipo = partido.equipo_2;
        }
      }
    }
    if (equipo) {
      // Copia profunda: si se asignara el mismo array, editar jugadores en
      // este partido mutaría también el roster del partido de origen.
      this.equipo.jugadores = (equipo.jugadores || []).map((j: any) => ({ ...j }));
      this.equipo.entrenador = equipo.entrenador;
      this.equipo.primer_asistente = equipo.primer_asistente;
      this.equipo.segundo_asistente = equipo.segundo_asistente;
      this.equipo.medico = equipo.medico;
      this.equipo.fisioterapeuta = equipo.fisioterapeuta;
      this.equipo.nombre = equipo.nombre;
    }
    this.autocompletar = false;
    this._game_.guardar();
  }

  async confirmarCargarEquipoPrueba(clave: 'EP1') {
    const alert = await this.alertController.create({
      header: 'Equipo de prueba',
      message: `¿Deseas cargar el ${this.equiposPrueba[clave].nombre}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => this.cargarEquipoPrueba(clave)
        }
      ]
    });
    await alert.present();
  }

  cargarEquipoPrueba(clave: 'EP1') {
    const datos = this.equiposPrueba[clave];
    this.equipo.nombre = datos.nombre;
    this.equipo.entrenador = datos.entrenador;
    this.equipo.primer_asistente = datos.primer_asistente;
    this.equipo.segundo_asistente = datos.segundo_asistente;
    this.equipo.medico = datos.medico;
    this.equipo.fisioterapeuta = datos.fisioterapeuta;
    this.equipo.jugadores = datos.jugadores.map((j: any) => ({ ...this._game_.clean_jugador(), ...j }));
    this._game_.guardar();
  }

  buscarPartido(){
    // Mismo criterio que buscarTeam(): sin competencia_id (partido suelto)
    // no hay de dónde autocompletar.
    if (!this._game_.partido.competencia_id) return null;

    const partidos = this._game_.partidos.filter((partido: any, index: number) =>
      index !== this._game_.index &&
      partido.competencia_id === this._game_.partido.competencia_id &&
      (
        partido.equipo_1 &&
        partido.equipo_1.nombre.toLowerCase() === this.equipo.nombre.toLowerCase() ||
        partido.equipo_2 &&
        partido.equipo_2.nombre.toLowerCase() === this.equipo.nombre.toLowerCase()
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

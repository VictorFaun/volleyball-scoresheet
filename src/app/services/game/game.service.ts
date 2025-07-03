import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //funcion para buscar con input torneos ya creados y con este cargar configuraciones de equipos ya creadas

  //Estados partidos
  //1: registrar partido
  //2: registrar equipo a
  //3: registrar equipo b
  //4: firma capitan a
  //5: firma entrenador a 
  //6: firma capitan b
  //7: firma entrenador b
  //8: configurar set 1
  //9: inicio set 1
  //10: termino set 1 
  //11: configurar set 2
  //12: inicio set 2
  //13: termino set 2 
  //14: configurar set 3
  //15: inicio set 3
  //16: termino set 3 
  //17: configurar set 4
  //18: inicio set 4
  //19: termino set 4 
  //20: configurar set 5
  //21: inicio set 5
  //22: termino set 5
  //23: firma capitan a
  //24: firma capitan b
  //25: firma planillero
  //26: firma asistente planillero
  //27: firma segundo arbitro
  //28: firma primer arbitro
  //29: finalizado


  //tipos de log
  //1: + punto
  //2: cambio jugador
  //3: desaher cambio
  //4: Amonestación
  //5:

  partido: any
  partidos: any = []
  index: any

  constructor(private router: Router, private alertController: AlertController) { }

  async closeSet(set: any) {
    let confirmacion = false
    if (set == 1) {
      if (this.partido.estado < 10) {
        confirmacion = true;
      }
    }
    if (set == 2) {
      if (this.partido.estado < 13) {
        confirmacion = true;
      }
    }
    if (set == 3) {
      if (this.partido.estado < 16) {
        confirmacion = true;
      }
    }
    if (set == 4) {
      if (this.partido.estado < 19) {
        confirmacion = true;
      }
    }
    if (set == 5) {
      if (this.partido.estado < 22) {
        confirmacion = true;
      }
    }

    if (confirmacion) {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: `¿Está seguro que desea terminar el Set ${set}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelado');
            }
          },
          {
            text: 'Terminar',
            handler: () => {
              if (set == 1) {
                this.partido.set_1.hora_fin = new Date()
                if(this.partido.estado<10)
                this.partido.estado = 10
                this.new_set(2)
              }
              if (set == 2) {
                this.partido.set_2.hora_fin = new Date()
                if(this.partido.estado<13)
                this.partido.estado = 13
                this.new_set(3)
              }
              if (set == 3) {
                this.partido.set_3.hora_fin = new Date()
                if(this.partido.estado<16)
                this.partido.estado = 16
                if(this.partido.numero_sets == 3){
                  this.new_firma(5)
                }else{
                  this.new_set(4)
                }
              }
              if (set == 4) {
                this.partido.set_4.hora_fin = new Date()
                if(this.partido.estado<19)
                this.partido.estado = 19
                this.new_set(5)
              }
              if (set == 5) {
                this.partido.set_4.hora_fin = new Date()
                if(this.partido.estado<22)
                this.partido.estado = 22
                this.new_firma(5)
              }
            }
          }
        ]
      });

      await alert.present();
    } else {
      if (set == 1) {
        this.new_set(2)
      }
      if (set == 2) {
        this.new_set(3)
      }
      if (set == 3) {
        if(this.partido.numero_sets == 3){
          this.new_firma(5)
        }else{
          this.new_set(4)
        }
      }
      if (set == 4) {
        this.new_set(5)
      }
      if (set == 5) {
        this.new_firma(5)
      }
    }


  }

  deshacer(set: any) {
    if (set == 1) {
      this.partido.set_1.logs.shift()
    }
    if (set == 2) {
      this.partido.set_2.logs.shift()
    }
    if (set == 3) {
      this.partido.set_3.logs.shift()
    }
    if (set == 4) {
      this.partido.set_4.logs.shift()
    }
    if (set == 5) {
      this.partido.set_5.logs.shift()
    }
  }

  punto(set: any, equipo: any) {
    let log: any = this.clean_log()
    log.tipo = 1;
    log.hora = new Date();
    log.equipo = equipo;

    if (set == 1) {
      this.partido.set_1.logs.unshift(log)
    }
    if (set == 2) {
      this.partido.set_2.logs.unshift(log)
    }
    if (set == 3) {
      this.partido.set_3.logs.unshift(log)
    }
    if (set == 4) {
      this.partido.set_4.logs.unshift(log)
    }
    if (set == 5) {
      this.partido.set_5.logs.unshift(log)
    }
  }

  async confirm_set(set: any) {
    let confirmacion = false
    if (set == 1) {
      if (this.partido.estado < 9) {
        confirmacion = true;
      }
    }
    if (set == 2) {
      if (this.partido.estado < 12) {
        confirmacion = true;
      }
    }
    if (set == 3) {
      if (this.partido.estado < 15) {
        confirmacion = true;
      }
    }
    if (set == 4) {
      if (this.partido.estado < 18) {
        confirmacion = true;
      }
    }
    if (set == 5) {
      if (this.partido.estado < 21) {
        confirmacion = true;
      }
    }

    if (confirmacion) {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        cssClass: 'custom-alert',
        message: `¿Estás seguro de iniciar el set ${set}?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Iniciar',
            handler: () => {
              this.start_set(set)
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.start_set(set)
    }
  }

  start_set(set: any) {
    if (set == 1) {
      if (this.partido.estado < 9) {
        this.partido.estado = 9;
        this.partido.set_1.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 2) {
      if (this.partido.estado < 12) {
        this.partido.estado = 12;
        this.partido.set_2.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 3) {
      if (this.partido.estado < 15) {
        this.partido.estado = 15;
        this.partido.set_3.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 4) {
      if (this.partido.estado < 18) {
        this.partido.estado = 18;
        this.partido.set_4.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 5) {
      if (this.partido.estado < 21) {
        this.partido.estado = 21;
        this.partido.set_5.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
  }

  new_set(num: any) {
    if (num == 1) {
      if (this.partido.estado < 8)
        this.partido.estado = 8
      if (!this.partido.set_1)
        this.partido.set_1 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
    if (num == 2) {
      if (this.partido.estado < 11)
        this.partido.estado = 11
      if (!this.partido.set_2)
        this.partido.set_2 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
    if (num == 3) {
      if (this.partido.estado < 14)
        this.partido.estado = 14
      if (!this.partido.set_3)
        this.partido.set_3 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
    if (num == 4) {
      if (this.partido.estado < 17)
        this.partido.estado = 17
      if (!this.partido.set_4)
        this.partido.set_4 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
    if (num == 5) {
      if (this.partido.estado < 20)
        this.partido.estado = 20
      if (!this.partido.set_5)
        this.partido.set_5 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
  }

  async new_firma(num: any) {
    if (num == 1) {
      if (await this.validarJugadores("B")) {
        if (this.partido.estado < 4)
          this.partido.estado = 4
        this.redireccionar('signature', { num });
      }
    }
    if (num == 2) {
      if (this.partido.estado < 5)
        this.partido.estado = 5
      this.redireccionar('signature', { num });
    }
    if (num == 3) {
      if (this.partido.estado < 6)
        this.partido.estado = 6
      this.redireccionar('signature', { num });
    }
    if (num == 4) {
      if (this.partido.estado < 7)
        this.partido.estado = 7
      this.redireccionar('signature', { num });
    }
    if (num == 5) {
      if (this.partido.estado < 23)
        this.partido.estado = 23
      this.redireccionar('signature', { num });
    }
    if (num == 6) {
      if (this.partido.estado < 24)
        this.partido.estado = 24
      this.redireccionar('signature', { num });
    }
    if (num == 7) {
      if (this.partido.estado < 25)
        this.partido.estado = 25
      this.redireccionar('signature', { num });
    }
    if (num == 8) {
      if (this.partido.estado < 26)
        this.partido.estado = 26
      this.redireccionar('signature', { num });
    }
    if (num == 9) {
      if (this.partido.estado < 27)
        this.partido.estado = 27
      this.redireccionar('signature', { num });
    }
    if (num == 10) {
      if (this.partido.estado < 28)
        this.partido.estado = 28
      this.redireccionar('signature', { num });
    }
  }

  async terminoPartido() {
    if(this.partido.estado < 29){
      this.partido.estado = 29
      const alert = await this.alertController.create({
        header: 'Partido Finalizado',
        message: 'El partido se ha finalizado correctamente.',
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
    
    this.redireccionar('home');
  }

  async new_equipo(lado: any) {

    if (lado == "A") {
      if (this.partido.estado < 2)
        this.partido.estado = 2;
      if (!this.partido.equipo_a)
        this.partido.equipo_a = this.clean_equipo();
      this.redireccionar('team', { lado: "A" });
    }
    if (lado == "B") {
      if (await this.validarJugadores("A")) {
        if (this.partido.estado < 3)
          this.partido.estado = 3;
        if (!this.partido.equipo_b)
          this.partido.equipo_b = this.clean_equipo();
        this.redireccionar('team', { lado: "B" });
      }
    }
  }

  new_game() {

    this.partido = this.clean_partido();
    this.partidos.push(this.partido)
    this.redireccionar('create');
  }
  edit_game(index: any) {
    this.index = index
    this.partido = this.partidos[index]
    this.redireccionar('create');
  }

  async validarJugadores(equipo: 'A' | 'B') {
    const jugadores = equipo === 'A'
      ? this.partido.equipo_a.jugadores
      : this.partido.equipo_b.jugadores;

    const jugadoresNoLibero = jugadores.filter((j: any) => !j.libero);

    if (jugadoresNoLibero.length < 6) {
      const alerta = await this.alertController.create({
        header: 'Equipo incompleto',
        cssClass: 'custom-alert',
        message: `El Equipo ${equipo} debe tener al menos 6 jugadores que no sean líberos.`,
        buttons: ['Aceptar']
      });

      await alerta.present();
      return false;
    }

    return true;
  }

  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }

  clean_log() {
    return {
      id: null,
      tipo: null,
      hora: null,
      jugador: null,
      cambio: null,
      equipo: null
    }
  }

  clean_jugador() {
    return {
      id: null,
      numero: null,
      nombre: null,
      capitan: null,
      libero: null
    }
  }

  clean_partido() {
    return {
      id: null,
      numero_partido: null,
      competicion: null,
      ciudad: null,
      pais: null,
      gimnasio: null,
      division: null,
      categoria: null,
      fecha: null,
      hora: null,
      primer_arbitro: null,
      segundo_arbitro: null,
      planillero: null,
      asistente_planillero: null,
      primer_banderin: null,
      segundo_banderin: null,
      tercer_banderin: null,
      cuarto_banderin: null,
      numero_sets:3,
      set_1: null,
      set_2: null,
      set_3: null,
      set_4: null,
      set_5: null,
      equipo_a: null,
      equipo_b: null,
      firma_inicio_capitan_a: null,
      firma_inicio_capitan_b: null,
      firma_fin_capitan_a: null,
      firma_fin_capitan_b: null,
      firma_entrenador_a: null,
      firma_entrenador_b: null,
      firma_planillero: null,
      firma_asistente_planillero: null,
      firma_primer_arbitro: null,
      firma_segundo_arbitro: null,
      estado: 1
    }
  }

  clean_equipo() {
    return {
      id: null,
      nombre: null,
      jugadores: [],
      entrenador: null,
      primer_asistente: null,
      segundo_asistente: null,
      medico: null,
      fisioterapeuta: null
    }
  }

  clean_set() {
    return {
      equipo_saque: null,
      alineacion_a: [false, false, false, false, false, false],
      alineacion_b: [false, false, false, false, false, false],
      hora_inicio: null,
      hora_fin: null,
      logs: [],
      victoria: null
    }
  }
}

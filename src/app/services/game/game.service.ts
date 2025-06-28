import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GameService {

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

  partido: any
  partidos: any = [
    {
      "id": null,
      "numero_partido": 1,
      "competicion": "Test",
      "ciudad": null,
      "pais": null,
      "gimnasio": null,
      "division": null,
      "categoria": null,
      "fecha": null,
      "hora": null,
      "primer_arbitro": null,
      "segundo_arbitro": null,
      "planillero": null,
      "asistente_planillero": null,
      "primer_banderin": null,
      "segundo_banderin": null,
      "tercer_banderin": null,
      "cuarto_banderin": null,
      "set_1": {
        "equipo_saque": null,
        "alineacion_a": [
          false,
          false,
          false,
          false,
          false,
          false
        ],
        "alineacion_b": [
          false,
          false,
          false,
          false,
          false,
          false
        ],
        "hora_inicio": null,
        "hora_fin": null,
        "logs":[],
        "victoria": null
      },
      "set_2": null,
      "set_3": null,
      "set_4": null,
      "set_5": null,
      "equipo_a": {
        "id": null,
        "nombre": null,
        "jugadores": [
          {
            "id": null,
            "numero": 1,
            "nombre": "Jugador 1",
            "capitan": true,
            "libero": null
          },
          {
            "id": null,
            "numero": 2,
            "nombre": "Jugador 2",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 3,
            "nombre": "Jugador 3",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 4,
            "nombre": "Jugador 4",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 5,
            "nombre": "Jugador 5",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 6,
            "nombre": "Jugador 6",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 7,
            "nombre": "Jugador 1",
            "capitan": null,
            "libero": true
          }

        ],
        "entrenador": null,
        "primer_asistente": null,
        "segundo_asistente": null,
        "medico": null,
        "fisioterapeuta": null
      },
      "equipo_b": {
        "id": null,
        "nombre": null,
        "jugadores": [
          {
            "id": null,
            "numero": 1,
            "nombre": "Jugador 1",
            "capitan": true,
            "libero": null
          },
          {
            "id": null,
            "numero": 2,
            "nombre": "Jugador 2",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 3,
            "nombre": "Jugador 3",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 4,
            "nombre": "Jugador 4",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 5,
            "nombre": "Jugador 5",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 6,
            "nombre": "Jugador 6",
            "capitan": null,
            "libero": null
          }, {
            "id": null,
            "numero": 7,
            "nombre": "Jugador 1",
            "capitan": null,
            "libero": true
          }

        ],
        "entrenador": null,
        "primer_asistente": null,
        "segundo_asistente": null,
        "medico": null,
        "fisioterapeuta": null
      },
      "firma_inicio_capitan_a": null,
      "firma_inicio_capitan_b": null,
      "firma_fin_capitan_a": null,
      "firma_fin_capitan_b": null,
      "firma_entrenador_a": null,
      "firma_entrenador_b": null,
      "firma_planillero": null,
      "firma_asistente_planillero": null,
      "firma_primer_arbitro": null,
      "firma_segundo_arbitro": null,
      "estado": 9
    }
  ]
  index: any

  constructor(private router: Router,private alertController: AlertController) { }

  async confirm_set(set:any){
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
  }

  start_set(set:any){
    if(set == 1){
      if(this.partido.estado < 9){
        this.partido.estado = 9;
        this.partido.set_1.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if(set == 2){
      if(this.partido.estado < 12){
        this.partido.estado = 12;
        this.partido.set_2.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if(set == 3){
      if(this.partido.estado < 15){
        this.partido.estado = 15;
        this.partido.set_3.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if(set == 4){
      if(this.partido.estado < 18){
        this.partido.estado = 18;
        this.partido.set_4.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if(set == 5){
      if(this.partido.estado < 21){
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

  new_firma(num: any) {
    if (num == 1) {
      if (this.partido.estado < 4)
        this.partido.estado = 4
      this.redireccionar('signature', { num });
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
  }

  new_equipo(lado: any) {

    if (lado == "A") {
      if (this.partido.estado < 2)
        this.partido.estado = 2;
      if (!this.partido.equipo_a)
        this.partido.equipo_a = this.clean_equipo();
      this.redireccionar('team', { lado: "A" });
    }
    if (lado == "B") {
      if (this.partido.estado < 3)
        this.partido.estado = 3;
      if (!this.partido.equipo_b)
        this.partido.equipo_b = this.clean_equipo();
      this.redireccionar('team', { lado: "B" });
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
      jugadores: null,
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
      logs:[],
      victoria: null
    }
  }
}

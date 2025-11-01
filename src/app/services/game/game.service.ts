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
  //4: tiempo
  //5: amonestación demora
  //6: amonestación tarjeta amarilla (a un jugador de un equipo)
  //7: amonestación tarjeta roja (a un jugador de un equipo) + punto equipo contrario
  //8: amonestación solicitud improcedente (a un equipo) a la segunda se marca como demora
  //9: amonestación expulsion  (a un jugador de un equipo) (se hace sustitucion con otro jugador)

  partido: any
  partidos: any = [
  //   {
  //     "id": null,
  //     "numero_partido": 1,
  //     "competicion": "Test",
  //     "ciudad": null,
  //     "pais": null,
  //     "gimnasio": null,
  //     "division": null,
  //     "categoria": null,
  //     "fecha": null,
  //     "hora": null,
  //     "primer_arbitro": null,
  //     "segundo_arbitro": null,
  //     "planillero": null,
  //     "asistente_planillero": null,
  //     "primer_banderin": null,
  //     "segundo_banderin": null,
  //     "tercer_banderin": null,
  //     "cuarto_banderin": null,
  //     "numero_sets": 3,
  //     "set_1": {
  //         "equipo_saque": "A",
  //         "alineacion_a": [
  //             83,
  //             22,
  //             21,
  //             23,
  //             4,
  //             5
  //         ],
  //         "alineacion_b": [
  //             10,
  //             2,
  //             3,
  //             1,
  //             4,
  //             11
  //         ],
  //         "hora_inicio": "2025-11-01T03:42:42.569Z",
  //         "hora_fin": null,
  //         "logs": [],
  //         "victoria": null
  //     },
  //     "set_2": null,
  //     "set_3": null,
  //     "set_4": null,
  //     "set_5": null,
  //     "equipo_a": {
  //         "id": null,
  //         "nombre": "R UBB",
  //         "jugadores": [
  //             {
  //                 "id": null,
  //                 "numero": 83,
  //                 "nombre": "Ariel",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 22,
  //                 "nombre": "Faundez",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 21,
  //                 "nombre": "Marshall",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 23,
  //                 "nombre": "Olate",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 4,
  //                 "nombre": "Chino",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 5,
  //                 "nombre": "Dany",
  //                 "capitan": null,
  //                 "libero": null
  //             }
  //         ],
  //         "entrenador": null,
  //         "primer_asistente": null,
  //         "segundo_asistente": null,
  //         "medico": null,
  //         "fisioterapeuta": null
  //     },
  //     "equipo_b": {
  //         "id": null,
  //         "nombre": "Insama",
  //         "jugadores": [
  //             {
  //                 "id": null,
  //                 "numero": 10,
  //                 "nombre": "Akiles",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 2,
  //                 "nombre": "Paul",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 3,
  //                 "nombre": "Bicho",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 1,
  //                 "nombre": "Pinguino",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 4,
  //                 "nombre": "G. Rantul",
  //                 "capitan": null,
  //                 "libero": null
  //             },
  //             {
  //                 "id": null,
  //                 "numero": 11,
  //                 "nombre": "D. Rantul",
  //                 "capitan": null,
  //                 "libero": null
  //             }
  //         ],
  //         "entrenador": null,
  //         "primer_asistente": null,
  //         "segundo_asistente": null,
  //         "medico": null,
  //         "fisioterapeuta": null
  //     },
  //     "firma_inicio_capitan_a": null,
  //     "firma_inicio_capitan_b": null,
  //     "firma_fin_capitan_a": null,
  //     "firma_fin_capitan_b": null,
  //     "firma_entrenador_a": null,
  //     "firma_entrenador_b": null,
  //     "firma_planillero": null,
  //     "firma_asistente_planillero": null,
  //     "firma_primer_arbitro": null,
  //     "firma_segundo_arbitro": null,
  //     "estado": 9
  // }
  ]
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

    let equipoGanador = this.validarGanadorSet(set);
    if (!equipoGanador) {
      const alert = await this.alertController.create({
          header: 'Atención',
          message: 'Ningún equipo ha ganado el set aún. Debe haber un ganador para continuar.',
          buttons: ['Entendido']
      });
      await alert.present();
      await alert.onDidDismiss();
      return;
  }

    if (confirmacion) {
      const alert = await this.alertController.create({
        header: 'Confirmar',
        message: `¿Está seguro que desea terminar el Set ${set}? El equipo ${equipoGanador} ha ganado el set.`,
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
            handler: async () => {
              if (set == 1) {
                this.partido.set_1.hora_fin = new Date()
                this.partido.set_1.victoria = equipoGanador;
                if(this.partido.estado<10)
                this.partido.estado = 10
                this.new_set(2)
              }
              if (set == 2) {
                this.partido.set_2.hora_fin = new Date()
                this.partido.set_2.victoria = equipoGanador;
                if(this.partido.estado<13)
                this.partido.estado = 13
                
                let ganador = this.obtenerGanadorPartido()
                if(ganador){
                  const alert = await this.alertController.create({
                    header: 'Resultado',
                    message: `¡El equipo ${ganador} ha ganado el partido!`,
                    buttons: ['Aceptar']
                });
                await alert.present();
                await alert.onDidDismiss();
                this.new_firma(5);
                }else{
                  this.new_set(3)
                }
              }
              if (set == 3) {
                this.partido.set_3.hora_fin = new Date()
                this.partido.set_3.victoria = equipoGanador;
                if(this.partido.estado<16)
                this.partido.estado = 16
                let ganador = this.obtenerGanadorPartido()
                if(ganador){
                  const alert = await this.alertController.create({
                    header: 'Resultado',
                    message: `¡El equipo ${ganador} ha ganado el partido!`,
                    buttons: ['Aceptar']
                });
                await alert.present();
                await alert.onDidDismiss();
                this.new_firma(5);
                }else{
                  this.new_set(4)
                }
              }
              if (set == 4) {
                this.partido.set_4.hora_fin = new Date()
                this.partido.set_4.victoria = equipoGanador;
                if(this.partido.estado<19)
                this.partido.estado = 19
                let ganador = this.obtenerGanadorPartido()
                if(ganador){
                  const alert = await this.alertController.create({
                    header: 'Resultado',
                    message: `¡El equipo ${ganador} ha ganado el partido!`,
                    buttons: ['Aceptar']
                });
                await alert.present();
                await alert.onDidDismiss();
                this.new_firma(5);
                }else{
                  this.new_set(5)
                }
              }
              if (set == 5) {
                this.partido.set_5.hora_fin = new Date()
                this.partido.set_5.victoria = equipoGanador;
                if(this.partido.estado<22)
                this.partido.estado = 22
                let ganador = this.obtenerGanadorPartido()
                if(ganador){
                  const alert = await this.alertController.create({
                    header: 'Resultado',
                    message: `¡El equipo ${ganador} ha ganado el partido!`,
                    buttons: ['Aceptar']
                });
                await alert.present();
                await alert.onDidDismiss();
                this.new_firma(5);
                }else{
                  this.new_firma(5)
                }
              }
            }
          }
        ]
      });

      await alert.present();
    } else {
      if (set == 1) {
        this.partido.set_1.victoria = equipoGanador;
        this.new_set(2)
      }
      if (set == 2) { 
        this.partido.set_2.victoria = equipoGanador;
        if(this.partido.set_3){
          this.new_set(3)
        }else{
          this.new_firma(5)
        }
      }
      if (set == 3) {
        this.partido.set_3.victoria = equipoGanador;
        if(this.partido.set_4){
          this.new_set(4)
        }else{
          this.new_firma(5)
        }
      }
      if (set == 4) {
        this.partido.set_4.victoria = equipoGanador;
        if(this.partido.set_5){
          this.new_set(5)
        }else{
          this.new_firma(5)
        }
      }
      if (set == 5) {
        this.partido.set_5.victoria = equipoGanador;
        this.new_firma(5)
      }
    }


  }

  validarGanadorSet(set: number) {
    const currentSet = this.partido[`set_${set}`];
    if (!currentSet) return;

    const puntosA = this.contarPuntos(currentSet, 'A');
    const puntosB = this.contarPuntos(currentSet, 'B');
    
    const puntosParaGanar = (set == 5 || (set == 3 && this.partido.numero_sets == 3)) ? 15 : 25;
    
    if (puntosA >= puntosParaGanar && puntosA - puntosB >= 2) {
        return 'A';
    } else if (puntosB >= puntosParaGanar && puntosB - puntosA >= 2) {
        return 'B';
    }
    return false;
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
    const currentSet = this.partido[`set_${set}`];
    if (!currentSet) return;

    const log: any = this.clean_log();
    log.tipo = 1;
    log.hora = new Date();
    log.equipo = equipo;

    const puntosA = this.contarPuntos(currentSet, 'A');
    const puntosB = this.contarPuntos(currentSet, 'B');

    let puntosParaGanar = 25;
    if (set == 5 || (set == 3 && this.partido.numero_sets == 3)) {
        puntosParaGanar = 15;
    }

    if (puntosA >= puntosParaGanar && puntosA - puntosB >= 2) {
    } else if (puntosB >= puntosParaGanar && puntosB - puntosA >= 2) {
    }else{
      currentSet.logs.unshift(log);
    }
}

  contarPuntos(set:any,equipo: 'A' | 'B'): number {
      if (!set.logs || set.logs.length == 0) {
          return 0;
      }
      return set.logs.filter((log: any) => (log.tipo == 1 && log.equipo == equipo) || (log.tipo == 7 && log.equipo !== equipo)).length;
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

  obtenerGanadorPartido(): 'A' | 'B' | false {
    const setsGanados:any = { A: 0, B: 0 };
    const setsParaGanar = Math.ceil(this.partido.numero_sets / 2);
    
    // Count sets won by each team
    for (let i = 1; i <= this.partido.numero_sets; i++) {
        const set = this.partido[`set_${i}`];
        if (set?.victoria) {
            setsGanados[set.victoria]++;
            
            // Check if a team has won enough sets
            if (setsGanados[set.victoria] >= setsParaGanar) {
                return set.victoria;
            }
        }
    }
    
    // No winner yet
    return false;
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

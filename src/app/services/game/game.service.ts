import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalstorageService } from '../bd/localstorage.service';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //funcion para buscar con input torneos ya creados y con este cargar configuraciones de equipos ya creadas

  //Estados partidos
  //1: registrar partido
  //2: información
  //3: registrar primer equipo
  //4: registrar segundo equipo
  //5: firma capitan a
  //6: firma entrenador a
  //7: firma capitan b
  //8: firma entrenador b
  //9: sorteo (define equipo A/B y saque del set 1)
  //10: configurar set 1
  //11: inicio set 1
  //12: termino set 1
  //13: configurar set 2
  //14: inicio set 2
  //15: termino set 2
  //16: sorteo (define saque del set 3, solo si el partido es a 3 sets)
  //17: configurar set 3
  //18: inicio set 3
  //19: termino set 3
  //20: configurar set 4
  //21: inicio set 4
  //22: termino set 4
  //23: sorteo (define saque del set 5, decisivo en partidos a 5 sets)
  //24: configurar set 5
  //25: inicio set 5
  //26: termino set 5
  //27: firma capitan a
  //28: firma capitan b
  //29: firma planillero
  //30: firma asistente planillero
  //31: firma segundo arbitro
  //32: firma primer arbitro
  //33: finalizado


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
  //10: cambio de lado (set decisivo, al llegar a 8 puntos). "equipo" = equipo que queda a la izquierda.
  //    Siempre queda justo encima del punto n°8 que lo provocó (nada puede
  //    intercalarse: el alert que lo genera bloquea el resto de la pantalla),
  //    así que deshacer() los trata como una sola acción ligada.

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
  //     "equipo_1": {
  //         "id": null,
  //         "nombre": "R UBB",
  //         "lado": "A",
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
  //     "equipo_2": {
  //         "id": null,
  //         "nombre": "Insama",
  //         "lado": "B",
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

  constructor(private router: Router, private alertController: AlertController, private localStorageService: LocalstorageService) {
    this.partidos = this.localStorageService.getData();
  }

  // Guarda el partido activo en su propia clave de almacenamiento (no todo
  // el historial de partidos guardados). Se llama explícitamente al
  // confirmar acciones (punto, cambio, cierre de set, etc.) en lugar de en
  // cada ciclo de detección de cambios de Angular. Si el partido todavía es
  // un borrador sin confirmar (this.index sin definir), no hace nada: no
  // debe persistirse hasta que el usuario confirme con "Siguiente".
  guardar() {
    if (this.index === null || this.index === undefined) return;
    try {
      this.localStorageService.guardarPartido(this.partido);
    } catch (error) {
      console.error('Error al guardar el partido:', error);
      this.notificarErrorGuardado();
    }
  }

  // Elimina un partido tanto de la lista en memoria como de su clave en el
  // almacenamiento local.
  eliminarPartido(partido: any) {
    const idx = this.partidos.indexOf(partido);
    if (idx !== -1) {
      this.partidos.splice(idx, 1);
    }
    if (partido?.id) {
      this.localStorageService.eliminarPartido(partido.id);
    }
  }

  // guardar() se llama muy seguido (cada punto, cambio, tiempo, etc.), así
  // que si el guardado falla de forma repetida evitamos apilar una alerta
  // encima de otra: solo se muestra una a la vez.
  private alertaGuardadoMostrada = false;
  private async notificarErrorGuardado() {
    if (this.alertaGuardadoMostrada) return;
    this.alertaGuardadoMostrada = true;

    const alert = await this.alertController.create({
      header: 'Error al guardar',
      message: 'No se pudo guardar el partido en este dispositivo. Si cierras la app ahora, esta acción podría perderse. Es posible que el almacenamiento esté lleno.',
      buttons: [
        {
          text: 'Seguir jugando',
          role: 'cancel'
        },
        {
          text: 'Ir a borrar partidos',
          handler: () => {
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        }
      ]
    });
    alert.onDidDismiss().then(() => {
      this.alertaGuardadoMostrada = false;
    });
    await alert.present();
  }

  // Antes de crear un partido nuevo, calcula cuánto ocupa en promedio cada
  // partido ya guardado (usando los partidos existentes como referencia) y
  // lo compara contra el espacio estimado disponible. Si alcanzaría para
  // pocos partidos más, recomienda limpiar partidos antiguos.
  private async advertirSiPocoEspacio() {
    const partidosGuardados = this.partidos.filter((p: any) => p?.id);
    if (partidosGuardados.length === 0) return;

    const usoPromedio = partidosGuardados.reduce(
      (total: number, p: any) => total + this.localStorageService.tamanioEnBytes(p),
      0
    ) / partidosGuardados.length;

    if (usoPromedio <= 0) return;

    const disponible = this.localStorageService.espacioDisponibleEstimado();
    const partidosRestantesEstimados = Math.floor(disponible / usoPromedio);

    const UMBRAL_PARTIDOS_RESTANTES = 5;
    if (partidosRestantesEstimados < UMBRAL_PARTIDOS_RESTANTES) {
      const alert = await this.alertController.create({
        header: 'Poco espacio disponible',
        message: `Según el uso promedio de tus partidos guardados, el espacio de este dispositivo alcanzaría para aproximadamente ${Math.max(0, partidosRestantesEstimados)} partido(s) más. Te recomendamos eliminar partidos antiguos que ya no necesites desde el inicio.`,
        buttons: ['Entendido']
      });
      await alert.present();
    }
  }

  async closeSet(set: any) {
    let confirmacion = false
    if (set == 1) {
      if (this.partido.estado < 12) {
        confirmacion = true;
      }
    }
    if (set == 2) {
      if (this.partido.estado < 15) {
        confirmacion = true;
      }
    }
    if (set == 3) {
      if (this.partido.estado < 19) {
        confirmacion = true;
      }
    }
    if (set == 4) {
      if (this.partido.estado < 22) {
        confirmacion = true;
      }
    }
    if (set == 5) {
      if (this.partido.estado < 26) {
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
                if(this.partido.estado<12)
                this.partido.estado = 12
                this.new_set(2)
              }
              if (set == 2) {
                this.partido.set_2.hora_fin = new Date()
                this.partido.set_2.victoria = equipoGanador;
                if(this.partido.estado<15)
                this.partido.estado = 15

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
                  this.avanzarDespuesDeSet2()
                }
              }
              if (set == 3) {
                this.partido.set_3.hora_fin = new Date()
                this.partido.set_3.victoria = equipoGanador;
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
                  this.new_set(4)
                }
              }
              if (set == 4) {
                this.partido.set_4.hora_fin = new Date()
                this.partido.set_4.victoria = equipoGanador;
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
                  this.avanzarDespuesDeSet4()
                }
              }
              if (set == 5) {
                this.partido.set_5.hora_fin = new Date()
                this.partido.set_5.victoria = equipoGanador;
                if(this.partido.estado<26)
                this.partido.estado = 26
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
        if (this.obtenerGanadorPartido()) {
          this.new_firma(5)
        } else if (this.partido.set_3) {
          this.new_set(3)
        } else {
          this.avanzarDespuesDeSet2()
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
        if (this.obtenerGanadorPartido()) {
          this.new_firma(5)
        } else if (this.partido.set_5) {
          this.new_set(5)
        } else {
          this.avanzarDespuesDeSet4()
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
    const currentSet = this.partido[`set_${set}`];
    if (!currentSet || !currentSet.logs.length) {
      this.guardar();
      return;
    }

    const ultimoLog = currentSet.logs[0];
    currentSet.logs.shift();

    if (ultimoLog.tipo === 10) {
      // Cambio de lado: revertir el lado, y si el punto n°8 que lo provocó
      // quedó justo debajo (siempre debería), deshacerlo también en la
      // misma acción, ya que están ligados. Se reabre la posibilidad de
      // que se dispare de nuevo la alerta si se vuelve a llegar a 8.
      currentSet.lado_izquierda = this.alternarEquipo(currentSet.lado_izquierda);
      currentSet.cambio_lado_realizado = false;

      const logDelPunto = currentSet.logs[0];
      if (logDelPunto && logDelPunto.tipo === 1) {
        currentSet.logs.shift();
      }
    }

    this.guardar();
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
      this.guardar();
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
      if (this.partido.estado < 11) {
        confirmacion = true;
      }
    }
    if (set == 2) {
      if (this.partido.estado < 14) {
        confirmacion = true;
      }
    }
    if (set == 3) {
      if (this.partido.estado < 18) {
        confirmacion = true;
      }
    }
    if (set == 4) {
      if (this.partido.estado < 21) {
        confirmacion = true;
      }
    }
    if (set == 5) {
      if (this.partido.estado < 25) {
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
      if (this.partido.estado < 11) {
        this.partido.estado = 11;
        this.partido.set_1.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 2) {
      if (this.partido.estado < 14) {
        this.partido.estado = 14;
        this.partido.set_2.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 3) {
      if (this.partido.estado < 18) {
        this.partido.estado = 18;
        this.partido.set_3.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 4) {
      if (this.partido.estado < 21) {
        this.partido.estado = 21;
        this.partido.set_4.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
    if (set == 5) {
      if (this.partido.estado < 25) {
        this.partido.estado = 25;
        this.partido.set_5.hora_inicio = new Date()
      }
      this.redireccionar('game', { set });
    }
  }

  // Alterna entre "A" y "B". Se usa tanto para el saque como para el lado
  // de cancha: en el R-5 del set 1 y del set decisivo se definen a mano
  // (sorteo); en los demás sets se alternan automáticamente respecto al
  // set anterior.
  alternarEquipo(anterior: 'A' | 'B'): 'A' | 'B' {
    return anterior === 'A' ? 'B' : 'A';
  }

  new_set(num: any) {
    if (num == 1) {
      if (this.partido.estado < 10)
        this.partido.estado = 10
      // set_1 ya debería existir (creado en el sorteo, con equipo_saque y
      // lado_izquierda definidos). Este fallback es solo defensivo.
      if (!this.partido.set_1) {
        this.partido.set_1 = this.clean_set()
        this.partido.set_1.lado_izquierda = 'A'
      }
      this.redireccionar('create-set', { num });
    }
    if (num == 2) {
      if (this.partido.estado < 13)
        this.partido.estado = 13
      if (!this.partido.set_2) {
        this.partido.set_2 = this.clean_set()
        this.partido.set_2.equipo_saque = this.alternarEquipo(this.partido.set_1.equipo_saque)
        this.partido.set_2.lado_izquierda = this.alternarEquipo(this.partido.set_1.lado_izquierda)
      }
      this.redireccionar('create-set', { num });
    }
    if (num == 3) {
      if (this.partido.estado < 17)
        this.partido.estado = 17
      // Solo se llega aquí sin pasar por el sorteo cuando el set 3 no es el
      // decisivo (partido a 5 sets): el saque y el lado se alternan
      // respecto al set 2.
      if (!this.partido.set_3) {
        this.partido.set_3 = this.clean_set()
        this.partido.set_3.equipo_saque = this.alternarEquipo(this.partido.set_2.equipo_saque)
        this.partido.set_3.lado_izquierda = this.alternarEquipo(this.partido.set_2.lado_izquierda)
      }
      this.redireccionar('create-set', { num });
    }
    if (num == 4) {
      if (this.partido.estado < 20)
        this.partido.estado = 20
      if (!this.partido.set_4) {
        this.partido.set_4 = this.clean_set()
        this.partido.set_4.equipo_saque = this.alternarEquipo(this.partido.set_3.equipo_saque)
        this.partido.set_4.lado_izquierda = this.alternarEquipo(this.partido.set_3.lado_izquierda)
      }
      this.redireccionar('create-set', { num });
    }
    if (num == 5) {
      if (this.partido.estado < 24)
        this.partido.estado = 24
      // set_5 ya debería existir (creado en el sorteo, con equipo_saque y
      // lado_izquierda definidos). Este fallback es solo defensivo.
      if (!this.partido.set_5)
        this.partido.set_5 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
  }

  // Avanza después de terminar el set 2: si el partido es a 3 sets, el set 3
  // es el decisivo y requiere un nuevo sorteo; si es a 5 sets, el saque del
  // set 3 se alterna automáticamente (ver new_set).
  avanzarDespuesDeSet2() {
    if (this.partido.numero_sets == 3) {
      this.new_sorteo(3);
    } else {
      this.new_set(3);
    }
  }

  // El set 4 nunca es decisivo (solo existe en partidos a 5 sets), así que
  // siempre avanza directo. El set 5, en cambio, siempre es el decisivo y
  // requiere un nuevo sorteo.
  avanzarDespuesDeSet4() {
    this.new_sorteo(5);
  }

  async new_firma(num: any) {
    if (num == 1) {
      if (await this.validarJugadores(2)) {
        if (this.partido.estado < 5)
          this.partido.estado = 5
        this.redireccionar('signature', { num });
      }
    }
    if (num == 2) {
      if (this.partido.estado < 6)
        this.partido.estado = 6
      this.redireccionar('signature', { num });
    }
    if (num == 3) {
      if (this.partido.estado < 7)
        this.partido.estado = 7
      this.redireccionar('signature', { num });
    }
    if (num == 4) {
      if (this.partido.estado < 8)
        this.partido.estado = 8
      this.redireccionar('signature', { num });
    }
    if (num == 5) {
      if (this.partido.estado < 27)
        this.partido.estado = 27
      this.redireccionar('signature', { num });
    }
    if (num == 6) {
      if (this.partido.estado < 28)
        this.partido.estado = 28
      this.redireccionar('signature', { num });
    }
    if (num == 7) {
      if (this.partido.estado < 29)
        this.partido.estado = 29
      this.redireccionar('signature', { num });
    }
    if (num == 8) {
      if (this.partido.estado < 30)
        this.partido.estado = 30
      this.redireccionar('signature', { num });
    }
    if (num == 9) {
      if (this.partido.estado < 31)
        this.partido.estado = 31
      this.redireccionar('signature', { num });
    }
    if (num == 10) {
      if (this.partido.estado < 32)
        this.partido.estado = 32
      this.redireccionar('signature', { num });
    }
  }

  async terminoPartido() {
    if(this.partido.estado < 33){
      this.partido.estado = 33
      const alert = await this.alertController.create({
        header: 'Partido Finalizado',
        message: 'El partido se ha finalizado correctamente.',
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
    
    this.redireccionar('home');
  }

  // Muestra el sorteo previo a un set: siempre antes del set 1 (ahí también
  // se define cuál equipo juega como A y cuál como B, algo que solo ocurre
  // una vez, en este primer sorteo) y antes del set decisivo (el set 3 si
  // el partido es a 3 sets, o el set 5 si es a 5 sets), donde solo se
  // registra el equipo al saque.
  new_sorteo(set: 1 | 3 | 5) {
    if (set == 1 && this.partido.estado < 9)
      this.partido.estado = 9;
    if (set == 3 && this.partido.estado < 16)
      this.partido.estado = 16;
    if (set == 5 && this.partido.estado < 23)
      this.partido.estado = 23;
    this.redireccionar('sorteo', { set });
  }

  // Muestra la vista de información del partido (entre la configuración
  // inicial y el registro del Equipo A).
  new_informacion() {
    if (this.partido.estado < 2)
      this.partido.estado = 2;
    this.redireccionar('informacion');
  }

  // Registra el primer o segundo equipo del partido. La asignación de cuál
  // de los dos jugará como "Equipo A" y cuál como "Equipo B" en la planilla
  // se decide después, en el R-5 del set 1 (ver create-set.page.ts).
  async new_equipo(numero: 1 | 2) {

    if (numero == 1) {
      if (this.partido.estado < 3)
        this.partido.estado = 3;
      if (!this.partido.equipo_1)
        this.partido.equipo_1 = this.clean_equipo();
      this.redireccionar('team', { numero: 1 });
    }
    if (numero == 2) {
      if (await this.validarJugadores(1)) {
        if (this.partido.estado < 4)
          this.partido.estado = 4;
        if (!this.partido.equipo_2)
          this.partido.equipo_2 = this.clean_equipo();
        this.redireccionar('team', { numero: 2 });
      }
    }
  }

  async new_game() {
    await this.advertirSiPocoEspacio();
    // Solo se crea un borrador en memoria. No se agrega a "partidos" (ni se
    // persiste) hasta que el usuario confirme con "Siguiente" en la primera
    // vista, para evitar partidos vacíos creados por error.
    this.partido = this.clean_partido();
    this.index = null;
    this.redireccionar('create');
  }

  // Confirma el borrador de partido y lo agrega a la lista, si aún no está en ella.
  crearPartido() {
    if (this.index === null || this.index === undefined) {
      this.partidos.push(this.partido);
      this.index = this.partidos.length - 1;
    }
  }

  edit_game(index: any) {
    this.index = index
    this.partido = this.partidos[index]
    this.redireccionar('create');
  }

  async validarJugadores(numero: 1 | 2) {
    const equipo = numero === 1 ? this.partido.equipo_1 : this.partido.equipo_2;
    const jugadoresNoLibero = equipo.jugadores.filter((j: any) => !j.libero);

    if (jugadoresNoLibero.length < 6) {
      const nombreEquipo = numero === 1 ? 'Primer Equipo' : 'Segundo Equipo';
      const alerta = await this.alertController.create({
        header: 'Equipo incompleto',
        cssClass: 'custom-alert',
        message: `El ${nombreEquipo} debe tener al menos 6 jugadores que no sean líberos.`,
        buttons: ['Aceptar']
      });

      await alerta.present();
      return false;
    }

    return true;
  }

  // Resuelve cuál de los dos equipos registrados (equipo_1/equipo_2) juega
  // como "Equipo A" o "Equipo B" en la planilla, según lo definido en el
  // R-5 del set 1. Devuelve null si aún no se ha definido.
  obtenerEquipoPorLado(lado: 'A' | 'B') {
    if (this.partido.equipo_1?.lado === lado) return this.partido.equipo_1;
    if (this.partido.equipo_2?.lado === lado) return this.partido.equipo_2;
    return null;
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

  // Navega dentro del flujo. Salir de Home hacia el asistente empuja una
  // única entrada nueva al historial; cualquier otra transición (entre
  // pasos del asistente, o el regreso a Home) reemplaza la entrada actual
  // en vez de apilar una nueva. Así el historial del navegador nunca
  // acumula los pasos intermedios, y el gesto/botón "atrás" del navegador
  // (que no pasa por GameService.guardar()/las páginas, sino directo por el
  // historial) siempre aterriza en Home en vez de retroceder paso a paso.
  redireccionar(ruta: string, parametros?: any) {
    this.guardar();
    const saliendoDeHome = this.router.url === '/home' || this.router.url === '/';
    const extras: any = (saliendoDeHome && ruta !== 'home') ? {} : { replaceUrl: true };
    if (parametros) {
      extras.queryParams = parametros;
    }
    this.router.navigate([ruta], extras);
  }

  // Elimina el archivo de firma (PNG) guardado en el filesystem del dispositivo.
  async deleteSignatureFile(filename: string) {
    if (!filename) return;
    try {
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
    } catch (e) {
      console.error('Error deleting signature file:', e);
    }
  }

  // Elimina todas las firmas (hasta 10) asociadas a un partido, para no dejar
  // archivos huérfanos en el filesystem cuando el partido se borra.
  async eliminarFirmasPartido(partido: any) {
    const campos = [
      'firma_inicio_capitan_a',
      'firma_inicio_capitan_b',
      'firma_fin_capitan_a',
      'firma_fin_capitan_b',
      'firma_entrenador_a',
      'firma_entrenador_b',
      'firma_planillero',
      'firma_asistente_planillero',
      'firma_primer_arbitro',
      'firma_segundo_arbitro'
    ];
    for (const campo of campos) {
      if (partido?.[campo]) {
        await this.deleteSignatureFile(partido[campo]);
      }
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
      equipo_1: null,
      equipo_2: null,
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
      estado: 1,
      // Si está activo, en el set decisivo se avisa con una alerta y se
      // cambia de lado cuando un equipo llega a 8 puntos. Apagado por
      // defecto (se configura en la primera vista).
      cambio_lado_ultimo_set: false
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
      fisioterapeuta: null,
      // 'A' | 'B' | null — a qué lado de la planilla corresponde este
      // equipo. Se define en el R-5 del set 1, no al momento de registrarlo.
      lado: null
    }
  }

  clean_set() {
    return {
      equipo_saque: null,
      // 'A' | 'B' | null — qué equipo empieza el set del lado izquierdo de
      // la cancha (tal como se ve en la vista de juego).
      lado_izquierda: null,
      // Evita repetir la alerta de cambio de lado más de una vez por set.
      cambio_lado_realizado: false,
      alineacion_a: [false, false, false, false, false, false],
      alineacion_b: [false, false, false, false, false, false],
      hora_inicio: null,
      hora_fin: null,
      logs: [],
      victoria: null
    }
  }
}

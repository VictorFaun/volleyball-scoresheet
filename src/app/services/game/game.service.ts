import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalstorageService } from '../bd/localstorage.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { PDFDocument, rgb } from 'pdf-lib';

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

  // Competencias (torneos): agrupan partidos por id, opcionalmente en fechas.
  // Igual que "partido"/"index", "competencia" es la que se está editando/viendo.
  competencias: any = []
  competencia: any

  constructor(private router: Router, private alertController: AlertController, private localStorageService: LocalstorageService) {
    this.partidos = this.localStorageService.getData();
    this.competencias = this.localStorageService.getCompetencias();
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
                    message: `¡El equipo ${this.textoEquipoGanador(ganador)} ha ganado el partido!`,
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
                    message: `¡El equipo ${this.textoEquipoGanador(ganador)} ha ganado el partido!`,
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
                    message: `¡El equipo ${this.textoEquipoGanador(ganador)} ha ganado el partido!`,
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
                    message: `¡El equipo ${this.textoEquipoGanador(ganador)} ha ganado el partido!`,
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
    // Un set ya finalizado no se puede reabrir a golpe de "deshacer".
    if (!currentSet || !currentSet.logs.length || currentSet.victoria) {
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
    // Un set ya finalizado no puede seguir sumando puntos.
    if (!currentSet || currentSet.victoria) return;

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

  // Una firma está habilitada salvo que se haya desactivado explícitamente
  // en la configuración del partido (los partidos guardados antes de que
  // existiera esta opción no tienen el campo, y se tratan como activadas).
  firmaHabilitada(num: any): boolean {
    return this.partido.firmas_habilitadas?.[num] !== false;
  }

  // A qué paso del flujo se avanza después de resolver (o saltar) la firma
  // "num". Usado tanto por SignaturePage al confirmar una firma como por
  // new_firma() cuando la firma está desactivada.
  avanzarDespuesDeFirma(num: any) {
    if (num == 1) this.new_firma(2);
    if (num == 2) this.new_firma(3);
    if (num == 3) this.new_firma(4);
    if (num == 4) this.new_sorteo(1);
    if (num == 5) this.new_firma(6);
    if (num == 6) this.new_firma(7);
    if (num == 7) this.new_firma(8);
    if (num == 8) this.new_firma(9);
    if (num == 9) this.new_firma(10);
    if (num == 10) this.terminoPartido();
  }

  async new_firma(num: any) {
    if (num == 1) {
      if (await this.validarJugadores(2)) {
        if (this.partido.estado < 5)
          this.partido.estado = 5
        if (this.firmaHabilitada(1)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(1);
      }
    }
    if (num == 2) {
      if (this.partido.estado < 6)
        this.partido.estado = 6
      if (this.firmaHabilitada(2)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(2);
    }
    if (num == 3) {
      if (this.partido.estado < 7)
        this.partido.estado = 7
      if (this.firmaHabilitada(3)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(3);
    }
    if (num == 4) {
      if (this.partido.estado < 8)
        this.partido.estado = 8
      if (this.firmaHabilitada(4)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(4);
    }
    if (num == 5) {
      if (this.partido.estado < 27)
        this.partido.estado = 27
      if (this.firmaHabilitada(5)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(5);
    }
    if (num == 6) {
      if (this.partido.estado < 28)
        this.partido.estado = 28
      if (this.firmaHabilitada(6)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(6);
    }
    if (num == 7) {
      if (this.partido.estado < 29)
        this.partido.estado = 29
      if (this.firmaHabilitada(7)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(7);
    }
    if (num == 8) {
      if (this.partido.estado < 30)
        this.partido.estado = 30
      if (this.firmaHabilitada(8)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(8);
    }
    if (num == 9) {
      if (this.partido.estado < 31)
        this.partido.estado = 31
      if (this.firmaHabilitada(9)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(9);
    }
    if (num == 10) {
      if (this.partido.estado < 32)
        this.partido.estado = 32
      if (this.firmaHabilitada(10)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(10);
    }
  }

  async terminoPartido() {
    if(this.partido.estado < 33){
      this.partido.estado = 33
      const ganador = this.obtenerGanadorPartido();
      const mensaje = ganador
        ? `El partido ha finalizado. ¡El equipo ${this.textoEquipoGanador(ganador)} ha ganado el partido!`
        : 'El partido se ha finalizado correctamente.';
      const alert = await this.alertController.create({
        header: 'Partido Finalizado',
        message: mensaje,
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

  // A dónde debe volver el botón "volver" de cualquier vista del asistente
  // de partido (create, informacion, team, sorteo, create-set, game,
  // signature, detalle-partido). Se define una sola vez al entrar al
  // asistente (crear, editar o continuar un partido desde Home, una
  // Competencia o una Fecha) y se mantiene mientras se navega de un paso al
  // siguiente dentro de la misma sesión.
  origenPartido: { ruta: string; queryParams?: any } = { ruta: '/home' };

  setOrigenHome() {
    this.origenPartido = { ruta: '/home' };
  }

  setOrigenCompetencia(competenciaId: string) {
    this.origenPartido = { ruta: '/competencia', queryParams: { id: competenciaId } };
  }

  setOrigenFecha(competenciaId: string, fechaId: string) {
    this.origenPartido = { ruta: '/fecha', queryParams: { competenciaId, fechaId } };
  }

  // Usado por el botón "volver" de todas las vistas del asistente, en vez de
  // navegar siempre a Home.
  volverAOrigen() {
    const extras: any = { replaceUrl: true };
    if (this.origenPartido.queryParams) extras.queryParams = this.origenPartido.queryParams;
    this.router.navigate([this.origenPartido.ruta], extras);
  }

  async new_game() {
    this.setOrigenHome();
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

  // Nombre del equipo ganador seguido de su letra entre paréntesis (A/B),
  // para usar en los mensajes que anuncian el resultado del partido.
  textoEquipoGanador(lado: 'A' | 'B'): string {
    const nombre = this.obtenerEquipoPorLado(lado)?.nombre || `Equipo ${lado}`;
    return `${nombre} (${lado})`;
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
      // cambia de lado cuando un equipo llega a 8 puntos. Activado por
      // defecto (se configura en la primera vista).
      cambio_lado_ultimo_set: true,
      // Qué firmas del flujo se piden. Activadas por defecto; al
      // desactivar una, new_firma() la salta directo al siguiente paso.
      firmas_habilitadas: this.clean_firmas_habilitadas(),
      // Relación opcional a una competencia/fecha (por id). El partido en sí
      // no cambia de estructura más allá de estos 3 campos.
      competencia_id: null,
      fecha_id: null,
      archivado: false
    }
  }

  clean_firmas_habilitadas() {
    return { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true };
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

  // true si el set N ya tiene algo registrado (alineación cargada, ya se
  // inició o ya tiene logs/resultado). Se usa para bloquear cambios que ya
  // no deberían tocarse una vez que se empezó a armar el set (ver
  // partidoEnCurso). Para saber si el set ya se JUGÓ (y por eso su R-5 ya no
  // se puede editar), usar setYaIniciado().
  setTieneProgreso(set: number): boolean {
    const s = this.partido[`set_${set}`];
    if (!s) return false;
    if (s.hora_inicio || s.victoria || (s.logs && s.logs.length > 0)) return true;

    const alineacionCargada = (arr: any[]) =>
      Array.isArray(arr) && arr.some((n: any) => n !== false && n !== null && n !== undefined);

    return alineacionCargada(s.alineacion_a) || alineacionCargada(s.alineacion_b);
  }

  // true si el set N ya se empezó a JUGAR (tiene hora de inicio, resultado o
  // algún punto/evento registrado). A diferencia de setTieneProgreso(), no
  // considera la alineación cargada como progreso: mientras el set no se
  // haya iniciado (botón "Iniciar"), la alineación en create-set se puede
  // seguir editando aunque ya esté completa.
  setYaIniciado(set: number): boolean {
    const s = this.partido[`set_${set}`];
    if (!s) return false;
    return !!(s.hora_inicio || s.victoria || (s.logs && s.logs.length > 0));
  }

  // true si algún set del partido ya se inició o tiene alineación cargada.
  // Se usa para bloquear cambios a la cantidad de sets del partido una vez
  // que el formato (3 o 5 sets) ya empezó a jugarse.
  partidoEnCurso(): boolean {
    for (let i = 1; i <= 5; i++) {
      if (this.setTieneProgreso(i)) return true;
    }
    return false;
  }

  // Continúa el flujo después de un set que YA estaba finalizado (se llegó
  // a esta vista reabriendo el partido con "editar"). A diferencia de
  // closeSet(), no vuelve a tocar logs/victoria/hora_fin ni muestra alertas:
  // solo decide a qué paso seguir, replicando la misma ramificación que
  // closeSet() usa una vez que un set ya fue confirmado.
  continuarDespuesDeSetFinalizado(set: any) {
    if (set == 1) {
      this.new_set(2);
    }
    if (set == 2) {
      if (this.obtenerGanadorPartido()) {
        this.new_firma(5);
      } else if (this.partido.set_3) {
        this.new_set(3);
      } else {
        this.avanzarDespuesDeSet2();
      }
    }
    if (set == 3) {
      if (this.partido.set_4) {
        this.new_set(4);
      } else {
        this.new_firma(5);
      }
    }
    if (set == 4) {
      if (this.obtenerGanadorPartido()) {
        this.new_firma(5);
      } else if (this.partido.set_5) {
        this.new_set(5);
      } else {
        this.avanzarDespuesDeSet4();
      }
    }
    if (set == 5) {
      this.new_firma(5);
    }
  }

  // true si el dorsal ya figura en la alineación o en algún log (cambio,
  // amonestación, etc.) de algún set ya creado para ese lado. Se usa para
  // impedir borrar jugadores que ya estuvieron activos en el partido.
  jugadorParticipoEnSets(lado: 'A' | 'B' | null, numero: number): boolean {
    if (!lado || numero === null || numero === undefined) return false;
    const claveAlineacion = lado === 'A' ? 'alineacion_a' : 'alineacion_b';

    for (let i = 1; i <= 5; i++) {
      const set = this.partido[`set_${i}`];
      if (!set) continue;

      if (set[claveAlineacion]?.includes(numero)) return true;

      const enLogs = (set.logs || []).some((log: any) =>
        log.equipo === lado && (log.jugador === numero || log.cambio === numero)
      );
      if (enLogs) return true;
    }

    return false;
  }

  // Reemplaza un dorsal por otro en las alineaciones y logs ya guardados de
  // los sets del partido, para el lado indicado. Se usa al editar el número
  // de camiseta de un jugador que ya participó en el juego.
  actualizarDorsalEnSets(lado: 'A' | 'B' | null, dorsalAnterior: number, dorsalNuevo: number) {
    if (!lado || dorsalAnterior === null || dorsalAnterior === undefined) return;
    const claveAlineacion = lado === 'A' ? 'alineacion_a' : 'alineacion_b';

    for (let i = 1; i <= 5; i++) {
      const set = this.partido[`set_${i}`];
      if (!set) continue;

      if (set[claveAlineacion]) {
        set[claveAlineacion] = set[claveAlineacion].map((n: any) => n === dorsalAnterior ? dorsalNuevo : n);
      }

      (set.logs || []).forEach((log: any) => {
        if (log.equipo !== lado) return;
        if (log.jugador === dorsalAnterior) log.jugador = dorsalNuevo;
        if (log.cambio === dorsalAnterior) log.cambio = dorsalNuevo;
      });
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

  // ===========================================================================
  // Competencias (torneos)
  // ===========================================================================

  clean_configuracion_default() {
    return {
      ciudad: null,
      pais: null,
      gimnasio: null,
      division: null,
      categoria: null,
      primer_arbitro: null,
      segundo_arbitro: null,
      planillero: null,
      asistente_planillero: null,
      primer_banderin: null,
      segundo_banderin: null,
      tercer_banderin: null,
      cuarto_banderin: null,
      numero_sets: 3,
      cambio_lado_ultimo_set: true,
      firmas_habilitadas: this.clean_firmas_habilitadas()
    };
  }

  nuevaCompetencia(nombre: string) {
    const competencia = {
      id: null,
      nombre,
      configuracionDefault: this.clean_configuracion_default(),
      fechas: []
    };
    this.competencias.push(competencia);
    this.guardarCompetencia(competencia);
    return competencia;
  }

  guardarCompetencia(competencia: any) {
    try {
      this.localStorageService.guardarCompetencia(competencia);
    } catch (error) {
      console.error('Error al guardar la competencia:', error);
      this.notificarErrorGuardado();
    }
  }

  // Cambia el nombre de la competencia y lo replica en el campo "competicion"
  // de sus partidos ya creados (no archivados), para que no queden con un
  // nombre desactualizado.
  renombrarCompetencia(competencia: any, nuevoNombre: string) {
    competencia.nombre = nuevoNombre;
    this.partidos
      .filter((p: any) => p.competencia_id === competencia.id && !p.archivado)
      .forEach((p: any) => {
        p.competicion = nuevoNombre;
        this.localStorageService.guardarPartido(p);
      });
    this.guardarCompetencia(competencia);
  }

  // Partidos asociados a una competencia (todas las fechas, incluida "sin fecha"),
  // sin contar los archivados.
  partidosDeCompetencia(competenciaId: string): any[] {
    return this.partidos.filter((p: any) => p.competencia_id === competenciaId && !p.archivado);
  }

  partidosDeFecha(competenciaId: string, fechaId: string | null): any[] {
    return this.partidosDeCompetencia(competenciaId).filter((p: any) => (p.fecha_id || null) === fechaId);
  }

  // Partidos que no pertenecen a ninguna competencia (y no están archivados).
  partidosSueltos(): any[] {
    return this.partidos.filter((p: any) => !p.competencia_id && !p.archivado);
  }

  partidosArchivados(): any[] {
    return this.partidos.filter((p: any) => p.archivado);
  }

  // Siguiente número de partido sugerido dentro de una fecha (o del bucket
  // "sin fecha" de una competencia si fechaId es null). Siempre editable
  // después por el usuario.
  siguienteNumeroPartido(competenciaId: string, fechaId: string | null): number {
    const bucket = this.partidosDeFecha(competenciaId, fechaId);
    const max = bucket.reduce((m: number, p: any) => Math.max(m, p.numero_partido || 0), 0);
    return max + 1;
  }

  aplicarConfiguracionDefault(partido: any, competencia: any) {
    const config = competencia.configuracionDefault || this.clean_configuracion_default();
    partido.ciudad = config.ciudad;
    partido.pais = config.pais;
    partido.gimnasio = config.gimnasio;
    partido.division = config.division;
    partido.categoria = config.categoria;
    partido.primer_arbitro = config.primer_arbitro;
    partido.segundo_arbitro = config.segundo_arbitro;
    partido.planillero = config.planillero;
    partido.asistente_planillero = config.asistente_planillero;
    partido.primer_banderin = config.primer_banderin;
    partido.segundo_banderin = config.segundo_banderin;
    partido.tercer_banderin = config.tercer_banderin;
    partido.cuarto_banderin = config.cuarto_banderin;
    partido.numero_sets = config.numero_sets;
    partido.cambio_lado_ultimo_set = config.cambio_lado_ultimo_set;
    partido.firmas_habilitadas = { ...config.firmas_habilitadas };
  }

  // Igual que new_game(), pero el borrador queda precargado con la configuración
  // por defecto de la competencia y ya vinculado a ella (y a la fecha, si aplica).
  // Sigue sin persistirse hasta que el usuario confirme con "Siguiente".
  async new_game_en_competencia(competencia: any, fechaId: string | null) {
    await this.advertirSiPocoEspacio();
    this.partido = this.clean_partido();
    this.aplicarConfiguracionDefault(this.partido, competencia);
    this.partido.competicion = competencia.nombre;
    this.partido.competencia_id = competencia.id;
    this.partido.fecha_id = fechaId;
    this.partido.numero_partido = this.siguienteNumeroPartido(competencia.id, fechaId);
    this.index = null;
    this.redireccionar('create');
  }

  // Crea una fecha dentro de la competencia y, de inmediato, "cantidad" partidos
  // ya persistidos y autocompletados con la configuración por defecto (a
  // diferencia de new_game_en_competencia, aquí no hay wizard: se crean listos
  // para completarse/jugarse más tarde desde la lista).
  crearFecha(competencia: any, nombre: string, cantidad: number) {
    const fecha = { id: this.generarIdFecha(), nombre };
    if (!competencia.fechas) competencia.fechas = [];
    competencia.fechas.push(fecha);

    for (let i = 0; i < cantidad; i++) {
      const partido: any = this.clean_partido();
      this.aplicarConfiguracionDefault(partido, competencia);
      partido.competicion = competencia.nombre;
      partido.competencia_id = competencia.id;
      partido.fecha_id = fecha.id;
      partido.numero_partido = i + 1;
      this.partidos.push(partido);
      this.localStorageService.guardarPartido(partido);
    }

    this.guardarCompetencia(competencia);
    return fecha;
  }

  private generarIdFecha(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Marca partidos como archivados (ocultos de las listas normales, recuperables
  // desde "Archivados"). Limpia referencias a competencia/fecha que ya no
  // existan, para no dejar ids colgando tras borrar la competencia/fecha dueña.
  archivarPartidos(lista: any[]) {
    for (const partido of lista) {
      partido.archivado = true;
      const competenciaExiste = this.competencias.some((c: any) => c.id === partido.competencia_id);
      if (!competenciaExiste) {
        partido.competencia_id = null;
        partido.fecha_id = null;
      } else if (partido.fecha_id) {
        const competencia = this.competencias.find((c: any) => c.id === partido.competencia_id);
        const fechaExiste = competencia?.fechas?.some((f: any) => f.id === partido.fecha_id);
        if (!fechaExiste) partido.fecha_id = null;
      }
      this.localStorageService.guardarPartido(partido);
    }
  }

  async eliminarPartidosDefinitivo(lista: any[]) {
    for (const partido of lista) {
      await this.eliminarFirmasPartido(partido);
      this.eliminarPartido(partido);
    }
  }

  async eliminarCompetencia(competencia: any, archivar: boolean) {
    const partidosDeLaCompetencia = this.partidos.filter((p: any) => p.competencia_id === competencia.id);
    if (archivar) {
      this.archivarPartidos(partidosDeLaCompetencia);
    } else {
      await this.eliminarPartidosDefinitivo(partidosDeLaCompetencia);
    }

    const idx = this.competencias.indexOf(competencia);
    if (idx !== -1) this.competencias.splice(idx, 1);
    this.localStorageService.eliminarCompetencia(competencia.id);
  }

  async eliminarFecha(competencia: any, fecha: any, archivar: boolean) {
    const partidosDeLaFecha = this.partidos.filter((p: any) => p.competencia_id === competencia.id && p.fecha_id === fecha.id);
    if (archivar) {
      this.archivarPartidos(partidosDeLaFecha);
    } else {
      await this.eliminarPartidosDefinitivo(partidosDeLaFecha);
    }

    const idx = competencia.fechas.indexOf(fecha);
    if (idx !== -1) competencia.fechas.splice(idx, 1);
    this.guardarCompetencia(competencia);
  }

  restaurarPartido(partido: any) {
    partido.archivado = false;
    this.localStorageService.guardarPartido(partido);
  }

  // Alert con un input de texto: solo confirma si el usuario escribe
  // exactamente "palabra" (sin distinguir mayúsculas ni espacios extra).
  // Se usa antes de cualquier eliminación (partido suelto, competencia, fecha).
  async confirmarConPalabra(opciones: { header: string; message: string; textoBoton?: string; palabra?: string; onConfirm: () => void | Promise<void> }) {
    const palabra = opciones.palabra || 'confirmo';
    const alert = await this.alertController.create({
      header: opciones.header,
      message: opciones.message,
      inputs: [
        {
          name: 'confirmacion',
          type: 'text',
          placeholder: `Escribe "${palabra}"`
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: opciones.textoBoton || 'Eliminar',
          role: 'destructive',
          handler: async (data) => {
            const texto = (data?.confirmacion || '').trim().toLowerCase();
            if (texto !== palabra) return false;
            await opciones.onConfirm();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  // ===========================================================================
  // Continuar partido / resumen / exportación — usado tanto por Home como por
  // la vista de Competencia, para no duplicar esta lógica en cada página.
  // ===========================================================================

  continuarPartido(i: any) {
    let estado = this.partidos[i].estado
    this.index = i;
    this.partido = this.partidos[i]
    if(estado == 1){
      this.edit_game(i)
    }
    if(estado == 2){
      this.new_informacion()
    }
    if(estado == 3){
      this.new_equipo(1)
    }
    if(estado == 4){
      this.new_equipo(2)
    }
    if(estado == 5){
      this.new_firma(1)
    }
    if(estado == 6){
      this.new_firma(2)
    }
    if(estado == 7){
      this.new_firma(3)
    }
    if(estado == 8){
      this.new_firma(4)
    }
    if(estado == 9){
      this.new_sorteo(1)
    }
    if(estado == 10){
      this.new_set(1)
    }
    if(estado == 11){
      this.start_set(1)
    }
    if(estado == 12){
      this.closeSet(1)
    }
    if(estado == 13){
      this.new_set(2)
    }
    if(estado == 14){
      this.start_set(2)
    }
    if(estado == 15){
      this.closeSet(2)
    }
    if(estado == 16){
      this.new_sorteo(3)
    }
    if(estado == 17){
      this.new_set(3)
    }
    if(estado == 18){
      this.start_set(3)
    }
    if(estado == 19){
      this.closeSet(3)
    }
    if(estado == 20){
      this.new_set(4)
    }
    if(estado == 21){
      this.start_set(4)
    }
    if(estado == 22){
      this.closeSet(4)
    }
    if(estado == 23){
      this.new_sorteo(5)
    }
    if(estado == 24){
      this.new_set(5)
    }
    if(estado == 25){
      this.start_set(5)
    }
    if(estado == 26){
      this.closeSet(5)
    }
    if(estado == 27){
      this.new_firma(5)
    }
    if(estado == 28){
      this.new_firma(6)
    }
    if(estado == 29){
      this.new_firma(7)
    }
    if(estado == 30){
      this.new_firma(8)
    }
    if(estado == 31){
      this.new_firma(9)
    }
    if(estado == 32){
      this.new_firma(10)
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
    const partido = this.partidos[index];
    const nombreA = this.obtenerEquipoPorLado('A')?.nombre || 'Equipo A';
    const nombreB = this.obtenerEquipoPorLado('B')?.nombre || 'Equipo B';

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

      const puntosA = this.contarPuntos(set, 'A');
      const puntosB = this.contarPuntos(set, 'B');
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
      const estiloSubLabel = 'padding: 2px 4px 2px 16px; text-align: left; font-size: 10px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.4);';
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

    const ganador = this.obtenerGanadorPartido();
    const textoGanador = ganador ? this.textoEquipoGanador(ganador) : null;
    const filaBorde = 'border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.15);';

    const alert = await this.alertController.create({
      cssClass: 'no-padding-header no-padding-message',
      htmlAttributes: {
        innerHTML: `
        <h2 class="alert-title sc-ion-alert-ios" style="text-align: center; padding-top: 12px;">Resumen del Partido</h2>
        <div style="text-align: center; padding: 4px 16px 12px;">
          <div class="alert-message sc-ion-alert-ios" style="margin-bottom: 4px;">
            ${partido.competicion ? partido.competicion + ' &middot; ' : ''}Partido N° ${partido.numero_partido || 0}
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px; table-layout: fixed;">
            <tr>
              <td style="padding: 4px 4px 4px 8px; width: 34%;"></td>
              <td style="padding: 4px 8px; width: 33%; text-align: center; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nombreA}</td>
              <td style="padding: 4px 8px; width: 33%; text-align: center; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nombreB}</td>
            </tr>
            ${filasSets}
            <tr>
              <td colspan="3" style="padding: 10px 8px 2px; ${filaBorde} text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(var(--ion-color-dark-rgb), 0.4);">Total</td>
            </tr>
            <tr>
              <td style="padding: 4px 4px 4px 8px; text-align: left; font-size: 11px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.5);">Sets</td>
              <td style="padding: 4px 8px; text-align: center; font-weight: 700;">${setsGanadosA}</td>
              <td style="padding: 4px 8px; text-align: center; font-weight: 700;">${setsGanadosB}</td>
            </tr>
            <tr>
              <td style="padding: 4px 4px 4px 8px; text-align: left; font-size: 11px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.5);">Tiempos</td>
              <td style="padding: 4px 8px; text-align: center;">${tiemposA}</td>
              <td style="padding: 4px 8px; text-align: center;">${tiemposB}</td>
            </tr>
            <tr>
              <td style="padding: 4px 4px 4px 8px; text-align: left; font-size: 11px; white-space: nowrap; color: rgba(var(--ion-color-dark-rgb), 0.5);">Amonestaciones</td>
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
    this.completarPlanilla(this.partidos[index])
  }

  async copiarPartido(index: number) {
    try {
      const partido = this.partidos[index];
      const partidoJson = JSON.stringify(partido, null, 2);

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
      try {

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
      if (partido.numero_partido > 10) {

        primeraPagina.drawText(String(partido.numero_partido || ''), { x: 312, y: 518 - 57, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
      } else {
        primeraPagina.drawText(String('0'), { x: 312, y: 518 - 57, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
        primeraPagina.drawText(String(partido.numero_partido || ''), { x: 325, y: 518 - 57, size: 10, color: rgb(0 / 255, 91 / 255, 172 / 255) });
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

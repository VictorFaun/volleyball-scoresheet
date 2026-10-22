import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocalstorageService } from '../bd/localstorage.service';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';
import { mapearPartidoParaVista } from './partido-view.util';

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
  //5: sorteo (define equipo A/B y saque del set 1). Va antes de las firmas
  //   iniciales: recién con el sorteo se sabe qué equipo es A y cuál B.
  //6: firma capitan a
  //7: firma entrenador a
  //8: firma capitan b
  //9: firma entrenador b
  //   (partidos guardados antes de este orden pueden tener 5-9 con el
  //   sorteo aún pendiente; ver continuarPartido)
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

  constructor(private router: Router, private alertController: AlertController, private localStorageService: LocalstorageService) {}

  // Carga inicial de partidos/competencias desde el almacenamiento
  // (Filesystem, ahora asíncrono). Se espera una sola vez al arrancar la
  // app, antes de que se renderice cualquier página (ver APP_INITIALIZER en
  // app.module.ts), para que el resto del código pueda seguir leyendo
  // this.partidos/this.competencias como arrays ya listos, igual que antes.
  async cargarDatosIniciales() {
    try {
      this.partidos = await this.localStorageService.getData();
      this.competencias = await this.localStorageService.getCompetencias();
    } catch (error) {
      // Si el almacenamiento falla acá, más vale arrancar con listas vacías
      // que dejar sin resolver la promesa que bloquea el arranque de toda
      // la app (ver APP_INITIALIZER en app.module.ts).
      console.error('Error cargando datos iniciales (partidos/competencias):', error);
      this.partidos = this.partidos || [];
      this.competencias = this.competencias || [];
    }
  }

  // Guarda el partido activo en su propia clave de almacenamiento (no todo
  // el historial de partidos guardados). Se llama explícitamente al
  // confirmar acciones (punto, cambio, cierre de set, etc.) en lugar de en
  // cada ciclo de detección de cambios de Angular. Si el partido todavía es
  // un borrador sin confirmar (this.index sin definir), no hace nada: no
  // debe persistirse hasta que el usuario confirme con "Siguiente".
  async guardar() {
    if (this.index === null || this.index === undefined) return;
    // Modo solo vista (partido finalizado): nunca se persiste nada.
    if (this.soloLectura) return;
    try {
      await this.localStorageService.guardarPartido(this.partido);
    } catch (error) {
      // Ya no se avisa con una alerta interruptiva: eso era de la época de
      // localStorage, donde el motivo casi siempre era la cuota chica del
      // navegador (~5-10MB) llenándose. Ahora se guarda vía Filesystem (ver
      // FilesystemStorageService), con harto más margen y sin esa cuota, así
      // que un fallo acá es la excepción, no algo esperable por espacio
      // lleno. Igual queda el guardado en consola para poder diagnosticarlo.
      console.error('Error al guardar el partido:', error);
    }
  }

  // Elimina un partido tanto de la lista en memoria como de su clave en el
  // almacenamiento local.
  async eliminarPartido(partido: any) {
    const idx = this.partidos.indexOf(partido);
    if (idx !== -1) {
      this.partidos.splice(idx, 1);
    }
    if (partido?.id) {
      await this.localStorageService.eliminarPartido(partido.id);
    }
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

    const disponible = await this.localStorageService.espacioDisponibleEstimado();
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
                this.new_firma(5);
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
        if (this.partido.set_3) {
          this.irASetExistente(3)
        } else if (this.obtenerGanadorPartido()) {
          this.new_firma(5)
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
        if (this.partido.set_5) {
          this.irASetExistente(5)
        } else if (this.obtenerGanadorPartido()) {
          this.new_firma(5)
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
    if (num == 4) this.new_set(1);
    if (num == 5) this.new_firma(6);
    if (num == 6) this.new_firma(7);
    if (num == 7) this.new_firma(8);
    if (num == 8) this.new_firma(9);
    if (num == 9) this.new_firma(10);
    if (num == 10) this.terminoPartido();
  }

  async new_firma(num: any) {
    if (num == 1) {
      if (this.partido.estado < 6)
        this.partido.estado = 6
      if (this.firmaHabilitada(1)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(1);
    }
    if (num == 2) {
      if (this.partido.estado < 7)
        this.partido.estado = 7
      if (this.firmaHabilitada(2)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(2);
    }
    if (num == 3) {
      if (this.partido.estado < 8)
        this.partido.estado = 8
      if (this.firmaHabilitada(3)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(3);
    }
    if (num == 4) {
      if (this.partido.estado < 9)
        this.partido.estado = 9
      if (this.firmaHabilitada(4)) this.redireccionar('signature', { num }); else this.avanzarDespuesDeFirma(4);
    }
    if (num == 5) {
      // Antes de las firmas finales se piden las observaciones (REMARKS),
      // una sola vez: null/undefined = todavía no se pidieron; '' = se
      // confirmó sin observaciones. Si se cancela, no se avanza.
      if (!this.soloLectura && (this.partido.observaciones === null || this.partido.observaciones === undefined)) {
        if (!await this.pedirObservaciones()) return;
      }
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

    this.volverAOrigen();
  }

  // Muestra el sorteo previo a un set: siempre antes del set 1 (ahí también
  // se define cuál equipo juega como A y cuál como B, algo que solo ocurre
  // una vez, en este primer sorteo) y antes del set decisivo (el set 3 si
  // el partido es a 3 sets, o el set 5 si es a 5 sets), donde solo se
  // registra el equipo al saque.
  new_sorteo(set: 1 | 3 | 5) {
    if (set == 1 && this.partido.estado < 5)
      this.partido.estado = 5;
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
    // Se puede avanzar sin jugadores cargados: los que falten se agregan
    // después desde el R-5 o desde un cambio en el set (ver
    // agregarJugadorRapido). La alineación completa se exige en el R-5.
    if (numero == 2) {
      if (this.partido.estado < 4)
        this.partido.estado = 4;
      if (!this.partido.equipo_2)
        this.partido.equipo_2 = this.clean_equipo();
      this.redireccionar('team', { numero: 2 });
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
    this.setSoloLectura(false);
    const extras: any = { replaceUrl: true };
    if (this.origenPartido.queryParams) extras.queryParams = this.origenPartido.queryParams;
    this.router.navigate([this.origenPartido.ruta], extras);
  }

  async new_game() {
    this.setSoloLectura(false);
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

  // Un partido finalizado (estado 33) queda cerrado: ya no se puede reabrir
  // el asistente para editarlo, solo ver su resumen/detalle y exportarlo.
  partidoFinalizado(partido: any): boolean {
    return partido?.estado === 33;
  }

  async edit_game(index: any) {
    if (this.partidoFinalizado(this.partidos[index])) {
      const alert = await this.alertController.create({
        header: 'Partido finalizado',
        message: 'Este partido ya finalizó y no se puede editar.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }
    this.setSoloLectura(false);
    this.index = index
    this.partido = this.partidos[index]
    this.redireccionar('create');
  }

  // Modo "solo vista" de un partido finalizado (botón del ojo en la
  // tarjeta): recorre el mismo asistente (create -> ... -> firmas) pero sin
  // poder modificar nada. guardar() no persiste, el guard de rutas deja
  // pasar aunque el partido esté finalizado, y la clase "modo-solo-lectura"
  // en <body> desactiva los controles del contenido (ver global.scss); la
  // navegación (volver / Siguiente) vive en el header y sigue activa. Se
  // apaga al volver al origen o al entrar a cualquier otro partido.
  soloLectura = false;

  setSoloLectura(valor: boolean) {
    this.soloLectura = valor;
    document.body.classList.toggle('modo-solo-lectura', valor);
  }

  ver_partido(index: any) {
    this.index = index;
    this.partido = this.partidos[index];
    this.setSoloLectura(true);
    this.redireccionar('create');
  }

  // Observaciones (REMARKS de la planilla), pedidas al terminar el partido
  // antes de las firmas finales. Resuelve true si se confirmó (con o sin
  // texto) y false si se canceló.
  pedirObservaciones(): Promise<boolean> {
    return new Promise(async resolve => {
      let confirmado = false;
      const alert = await this.alertController.create({
        cssClass: 'alert-observaciones',
        header: 'Observaciones',
        subHeader: 'Se anotarán en "Remarks" de la planilla. Si no hay nada que observar, deja el campo vacío.',
        message: 'Escribe solo hechos, de forma breve y objetiva, indicando siempre set, equipo (A/B) y marcador. Por ejemplo: protestas del capitán, lesiones o atención médica, interrupciones (duración y motivo), sanciones a oficiales, problemas de equipamiento o del recinto, y cualquier situación excepcional.',
        inputs: [{
          name: 'observaciones',
          type: 'textarea',
          placeholder: 'Ej: Set 2, A 14:12 B — protesta formal del capitán A por decisión del 1er árbitro.',
          value: this.partido.observaciones || '',
          attributes: { rows: 6, maxlength: 600 }
        }],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Continuar',
            handler: (data) => {
              this.partido.observaciones = (data?.observaciones || '').trim();
              this.guardar();
              confirmado = true;
              return true;
            }
          }
        ]
      });
      alert.onDidDismiss().then(() => resolve(confirmado));
      await alert.present();
    });
  }

  // Límites del O-2 bis de un partido: hasta 14 jugadores que no son
  // líberos y hasta 2 líberos. Devuelve cuántos cupos quedan de cada tipo.
  readonly MAX_JUGADORES_PARTIDO = 14;
  readonly MAX_LIBEROS_PARTIDO = 2;

  cuposEquipo(equipo: any): { jugadores: number, liberos: number } {
    const jugadores: any[] = equipo?.jugadores || [];
    const liberos = jugadores.filter(j => j.libero).length;
    return {
      jugadores: this.MAX_JUGADORES_PARTIDO - (jugadores.length - liberos),
      liberos: this.MAX_LIBEROS_PARTIDO - liberos,
    };
  }

  // El alta rápida (R-5, cambios, amonestaciones) agrega jugadores comunes,
  // así que solo se ofrece mientras quede cupo de no líberos.
  puedeAgregarJugadorRapido(equipo: any): boolean {
    return this.cuposEquipo(equipo).jugadores > 0;
  }

  // Agrega rápido un jugador a un equipo del partido (por ejemplo, uno que
  // el equipo olvidó anotar), desde el R-5 o desde un cambio en el set.
  // Valida que el dorsal no esté repetido en el equipo y que quede cupo
  // (ver cuposEquipo). Resuelve con el jugador agregado, o null si el
  // usuario canceló.
  agregarJugadorRapido(equipo: any): Promise<any | null> {
    return new Promise(async resolve => {
      if (!this.puedeAgregarJugadorRapido(equipo)) {
        const aviso = await this.alertController.create({
          header: 'Equipo completo',
          message: `El equipo ya tiene ${this.MAX_JUGADORES_PARTIDO} jugadores (sin contar líberos), el máximo permitido.`,
          buttons: ['Aceptar']
        });
        aviso.onDidDismiss().then(() => resolve(null));
        await aviso.present();
        return;
      }
      let agregado: any = null;
      const alert = await this.alertController.create({
        cssClass: 'no-padding-message',
        header: 'Agregar Jugador',
        subHeader: `Nuevo jugador para ${equipo?.nombre || 'el equipo'}`,
        inputs: [
          { name: 'dorsal', id: 'input-dorsal-jugador-rapido', type: 'number', placeholder: 'Número de camiseta', value: '' },
          { name: 'nombre', type: 'text', placeholder: 'Nombre del jugador (opcional)', value: '' },
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Agregar',
            handler: (data) => {
              const dorsal = parseInt(data?.dorsal, 10);
              if (isNaN(dorsal)) return false;
              if ((equipo.jugadores || []).some((j: any) => j.numero === dorsal)) {
                this.alertController.create({
                  header: 'Advertencia',
                  message: 'Este número de camiseta ya está en uso',
                  buttons: ['Aceptar']
                }).then(a => a.present());
                return false;
              }
              const jugador: any = this.clean_jugador();
              jugador.numero = dorsal;
              jugador.nombre = data.nombre?.trim() || null;
              if (!equipo.jugadores) equipo.jugadores = [];
              equipo.jugadores.push(jugador);
              this.guardar();
              agregado = jugador;
              return true;
            }
          }
        ]
      });
      alert.onDidDismiss().then(() => resolve(agregado));
      await alert.present();
      alert.querySelector<HTMLInputElement>('#input-dorsal-jugador-rapido')?.focus();
    });
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
      // País de cada oficial (columna "Country" de APPROVAL en la planilla).
      primer_arbitro_pais: null,
      segundo_arbitro_pais: null,
      planillero_pais: null,
      asistente_planillero_pais: null,
      primer_banderin: null,
      segundo_banderin: null,
      tercer_banderin: null,
      cuarto_banderin: null,
      // Pool / fase del partido (casilla "Pool/Phase" de la planilla).
      fase: null,
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
      // Relación opcional a una competencia/fecha/grupo (por id). El partido
      // en sí no cambia de estructura más allá de estos campos.
      competencia_id: null,
      fecha_id: null,
      grupo_id: null,
      // Texto libre, independiente de todo lo anterior: partidos de fase
      // eliminatoria (sin grupo_id) usan esto para identificar la instancia
      // ("Cuartos de final", "Semifinal"...). Disponible en cualquier
      // partido, incluidos los sueltos, solo para mostrar.
      etiqueta: null,
      // Observaciones (REMARKS) pedidas antes de las firmas finales. null =
      // aún no se pidieron; "" = se confirmó sin observaciones.
      observaciones: null,
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
    // Si el set siguiente ya existe (se está recorriendo un partido ya
    // jugado), se pasa por él antes de mirar si hay ganador: con todos los
    // sets terminados, obtenerGanadorPartido() ya devuelve ganador y se
    // saltaría directo a las firmas finales.
    if (set == 2) {
      if (this.partido.set_3) {
        this.irASetExistente(3);
      } else if (this.obtenerGanadorPartido()) {
        this.new_firma(5);
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
      if (this.partido.set_5) {
        this.irASetExistente(5);
      } else if (this.obtenerGanadorPartido()) {
        this.new_firma(5);
      } else {
        this.avanzarDespuesDeSet4();
      }
    }
    if (set == 5) {
      this.new_firma(5);
    }
  }

  // Lleva a un set que ya existe: si es el decisivo pasa primero por su
  // sorteo (que se muestra bloqueado si el set ya se jugó); si no, directo
  // a su R-5.
  private irASetExistente(num: 3 | 5) {
    const esDecisivo = num == 5 || this.partido.numero_sets == 3;
    if (esDecisivo) this.new_sorteo(num);
    else this.new_set(num);
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
      primer_arbitro_pais: null,
      segundo_arbitro_pais: null,
      planillero_pais: null,
      asistente_planillero_pais: null,
      primer_banderin: null,
      segundo_banderin: null,
      tercer_banderin: null,
      cuarto_banderin: null,
      numero_sets: 3,
      cambio_lado_ultimo_set: true,
      firmas_habilitadas: this.clean_firmas_habilitadas()
    };
  }

  // El id se genera acá mismo (sincrónico) en vez de dejar que lo asigne el
  // guardado en Filesystem (asíncrono): el llamador (home.page.ts) navega a
  // /competencia usando este id inmediatamente después de crear la
  // competencia, sin esperar a que la persistencia en disco termine.
  nuevaCompetencia(nombre: string) {
    const competencia = {
      id: this.generarId(),
      nombre,
      // Ícono/color con que se muestra la competencia en la lista de Home
      // (ver home.page.html). Editables después desde Competencia > Configuración.
      icono: 'trophy-outline',
      color: 'medium',
      configuracionDefault: this.clean_configuracion_default(),
      fechas: [],
      // O-2 general de cada equipo (ver Competencia > Configuración > Equipos).
      equipos: []
    };
    this.competencias.push(competencia);
    this.guardarCompetencia(competencia);
    return competencia;
  }

  async guardarCompetencia(competencia: any) {
    try {
      await this.localStorageService.guardarCompetencia(competencia);
    } catch (error) {
      console.error('Error al guardar la competencia:', error);
    }
  }

  // Cambia el nombre de la competencia y lo replica en el campo "competicion"
  // de sus partidos ya creados (no archivados ni finalizados), para que no
  // queden con un nombre desactualizado. Los finalizados conservan el nombre
  // con que se jugaron (ver partidoFinalizado).
  async renombrarCompetencia(competencia: any, nuevoNombre: string) {
    competencia.nombre = nuevoNombre;
    const partidosDeLaCompetencia = this.partidos.filter((p: any) => p.competencia_id === competencia.id && !p.archivado && !this.partidoFinalizado(p));
    for (const p of partidosDeLaCompetencia) {
      p.competicion = nuevoNombre;
      await this.localStorageService.guardarPartido(p);
    }
    await this.guardarCompetencia(competencia);
  }

  // Partidos asociados a una competencia (todas las fechas, incluida "sin fecha"),
  // sin contar los archivados.
  partidosDeCompetencia(competenciaId: string): any[] {
    return this.partidos.filter((p: any) => p.competencia_id === competenciaId && !p.archivado);
  }

  partidosDeFecha(competenciaId: string, fechaId: string | null): any[] {
    return this.partidosDeCompetencia(competenciaId).filter((p: any) => (p.fecha_id || null) === fechaId);
  }

  // Partidos de la competencia asignados a un grupo puntual (fase de grupos).
  // Independiente de partidosDeFecha: un partido puede tener fecha_id y
  // grupo_id a la vez, o solo uno de los dos.
  partidosDeGrupo(competenciaId: string, grupoId: string): any[] {
    return this.partidosDeCompetencia(competenciaId).filter((p: any) => p.grupo_id === grupoId);
  }

  // ===========================================================================
  // Resultados (fase de grupos)
  // ===========================================================================

  // Configuración de resultados de una competencia: sistema de puntos por
  // resultado (estilo FIVB por defecto: en partidos a 5 sets un 3-2 vale
  // menos que un 3-0/3-1, y el perdedor de un 3-2 rescata un punto) y orden
  // de los criterios de desempate. Todo editable desde Resultados en
  // competencia-config; "nombre" (alfabético) no se lista ahí porque es el
  // desempate final fijo, no un criterio deportivo.
  clean_configuracion_resultados() {
    return {
      puntos3: {
        '2-0': { ganador: 3, perdedor: 0 },
        '2-1': { ganador: 2, perdedor: 1 },
      },
      puntos5: {
        '3-0': { ganador: 3, perdedor: 0 },
        '3-1': { ganador: 3, perdedor: 0 },
        '3-2': { ganador: 2, perdedor: 1 },
      },
      criteriosDesempate: ['puntos', 'ratioSets', 'ratioPuntos']
    };
  }

  private ratio(favor: number, contra: number): number {
    return contra ? favor / contra : favor;
  }

  // Comparadores disponibles para el orden de desempate configurable (ver
  // criteriosDesempate). Cada uno devuelve >0 si "x" debería ir después de
  // "y" en la tabla (mismo signo que espera Array.sort).
  private readonly comparadoresDesempate: Record<string, (x: any, y: any) => number> = {
    puntos: (x, y) => y.puntos - x.puntos,
    ratioSets: (x, y) => this.ratio(y.setsFavor, y.setsContra) - this.ratio(x.setsFavor, x.setsContra),
    ratioPuntos: (x, y) => this.ratio(y.puntosFavor, y.puntosContra) - this.ratio(x.puntosFavor, x.puntosContra),
  };

  // Arma la tabla de posiciones a partir de una lista de partidos ya
  // finalizados. Agrupa por nombre de equipo (no existe una entidad
  // "Equipo" separada): cada fila nace la primera vez que aparece ese
  // nombre. Partidos sin sets jugados o empatados en sets (no debería
  // pasar en un partido finalizado) se ignoran.
  private calcularTablaDesdePartidos(partidos: any[], config: any): any[] {
    const tabla: Record<string, any> = {};
    const fila = (nombre: string) => tabla[nombre] || (tabla[nombre] = {
      nombre, pj: 0, pg: 0, pp: 0, puntos: 0,
      setsFavor: 0, setsContra: 0, puntosFavor: 0, puntosContra: 0
    });

    for (const partido of partidos) {
      const vista = mapearPartidoParaVista(partido, 0, (set, equipo) => this.contarPuntos(set, equipo));
      if (!vista.sets.length) continue;

      const setsA = vista.sets.filter(s => s.victoria === 'A').length;
      const setsB = vista.sets.filter(s => s.victoria === 'B').length;
      if (setsA === setsB) continue;

      const puntosA = vista.sets.reduce((s, set) => s + set.a, 0);
      const puntosB = vista.sets.reduce((s, set) => s + set.b, 0);

      const filaA = fila(vista.equipoA);
      const filaB = fila(vista.equipoB);
      filaA.pj++; filaB.pj++;
      filaA.setsFavor += setsA; filaA.setsContra += setsB;
      filaB.setsFavor += setsB; filaB.setsContra += setsA;
      filaA.puntosFavor += puntosA; filaA.puntosContra += puntosB;
      filaB.puntosFavor += puntosB; filaB.puntosContra += puntosA;

      const tablaPuntos = partido.numero_sets === 5 ? config.puntos5 : config.puntos3;
      const clave = `${Math.max(setsA, setsB)}-${Math.min(setsA, setsB)}`;
      const puntosResultado = tablaPuntos[clave] || { ganador: 0, perdedor: 0 };

      if (setsA > setsB) {
        filaA.pg++; filaB.pp++;
        filaA.puntos += puntosResultado.ganador;
        filaB.puntos += puntosResultado.perdedor;
      } else {
        filaB.pg++; filaA.pp++;
        filaB.puntos += puntosResultado.ganador;
        filaA.puntos += puntosResultado.perdedor;
      }
    }

    const criterios = config.criteriosDesempate || ['puntos', 'ratioSets', 'ratioPuntos'];
    return Object.values(tabla).sort((x: any, y: any) => {
      for (const criterio of criterios) {
        const comparador = this.comparadoresDesempate[criterio];
        if (!comparador) continue;
        const resultado = comparador(x, y);
        if (resultado !== 0) return resultado;
      }
      // Desempate final fijo (no configurable): alfabético, para que el
      // orden sea siempre determinístico.
      return x.nombre.localeCompare(y.nombre);
    });
  }

  calcularTablaGrupo(competencia: any, grupo: any): any[] {
    const partidos = this.partidosDeGrupo(competencia.id, grupo.id).filter((p: any) => p.estado === 33);
    const config = competencia.configuracionResultados || this.clean_configuracion_resultados();
    return this.calcularTablaDesdePartidos(partidos, config);
  }

  // Tablas de posiciones de la competencia: una por grupo si tiene grupos
  // creados (los partidos sin grupo -fase eliminatoria manual- quedan
  // afuera a propósito), o una sola tabla general con todos los partidos
  // finalizados si la competencia no usa grupos. Solo incluye tablas con
  // al menos un partido jugado.
  resultadosCompetencia(competencia: any): { nombre: string; filas: any[] }[] {
    const grupos = competencia.grupos || [];
    if (grupos.length) {
      return grupos
        .map((g: any) => ({ nombre: g.nombre, filas: this.calcularTablaGrupo(competencia, g) }))
        .filter((t: any) => t.filas.length);
    }
    const config = competencia.configuracionResultados || this.clean_configuracion_resultados();
    const filas = this.calcularTablaDesdePartidos(
      this.partidosDeCompetencia(competencia.id).filter((p: any) => p.estado === 33),
      config
    );
    return filas.length ? [{ nombre: competencia.nombre, filas }] : [];
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
    partido.primer_arbitro_pais = config.primer_arbitro_pais ?? null;
    partido.segundo_arbitro_pais = config.segundo_arbitro_pais ?? null;
    partido.planillero_pais = config.planillero_pais ?? null;
    partido.asistente_planillero_pais = config.asistente_planillero_pais ?? null;
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
    this.setSoloLectura(false);
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
  async crearFecha(competencia: any, nombre: string, cantidad: number) {
    const fecha = { id: this.generarId(), nombre };
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
      await this.localStorageService.guardarPartido(partido);
    }

    await this.guardarCompetencia(competencia);
    return fecha;
  }

  // Crea un grupo (fase de grupos) dentro de la competencia. A diferencia de
  // crearFecha, no genera partidos: los partidos ya existentes (o nuevos) se
  // asignan al grupo después, uno por uno, desde su propia configuración.
  async crearGrupo(competencia: any, nombre: string) {
    const grupo = { id: this.generarId(), nombre };
    if (!competencia.grupos) competencia.grupos = [];
    competencia.grupos.push(grupo);
    await this.guardarCompetencia(competencia);
    return grupo;
  }

  // Elimina un grupo. Se asume que el llamador ya verificó (con
  // partidosDeGrupo) que no hay partidos asignados, o que el usuario aceptó
  // seguir de todas formas: acá solo se quita el grupo de la competencia.
  async eliminarGrupo(competencia: any, grupo: any) {
    const idx = (competencia.grupos || []).indexOf(grupo);
    if (idx !== -1) competencia.grupos.splice(idx, 1);
    await this.guardarCompetencia(competencia);
  }

  // ===========================================================================
  // Equipos de la competencia (O-2 general)
  // ===========================================================================

  // O-2 general de un equipo dentro de la competencia: el plantel completo
  // inscrito. En cada partido se usa un subconjunto (el O-2 bis), que se
  // arma desde la página del equipo (team.page.ts).
  clean_equipo_competencia() {
    return {
      id: this.generarId(),
      nombre: null as string | null,
      jugadores: [] as any[],
      entrenador: null,
      primer_asistente: null,
      segundo_asistente: null,
      medico: null,
      fisioterapeuta: null
    };
  }

  // Equipo de prueba rápido para testing: al escribir "EP1" en el nombre del
  // equipo (en un partido o en el O-2 general), se ofrece cargar estos datos.
  readonly equiposPrueba: { [clave: string]: any } = {
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

  normalizarNombreEquipo(nombre: string | null | undefined): string {
    return (nombre || '').trim().toLowerCase();
  }

  // O-2 general del equipo con ese nombre (sin distinguir mayúsculas ni
  // espacios a los lados), o null si la competencia no lo tiene registrado.
  buscarEquipoCompetencia(competencia: any, nombre: string | null | undefined): any | null {
    const clave = this.normalizarNombreEquipo(nombre);
    if (!clave) return null;
    return (competencia?.equipos || []).find((e: any) => this.normalizarNombreEquipo(e.nombre) === clave) || null;
  }

  async crearEquipoCompetencia(competencia: any, nombre: string) {
    const equipo = this.clean_equipo_competencia();
    equipo.nombre = nombre;
    if (!competencia.equipos) competencia.equipos = [];
    competencia.equipos.push(equipo);
    await this.guardarCompetencia(competencia);
    return equipo;
  }

  // Solo quita el O-2 general: los partidos ya completados con ese equipo
  // conservan su propio plantel.
  async eliminarEquipoCompetencia(competencia: any, equipo: any) {
    const idx = (competencia.equipos || []).indexOf(equipo);
    if (idx !== -1) competencia.equipos.splice(idx, 1);
    await this.guardarCompetencia(competencia);
  }

  private generarId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Marca partidos como archivados (ocultos de las listas normales, recuperables
  // desde "Archivados"). Limpia referencias a competencia/fecha que ya no
  // existan, para no dejar ids colgando tras borrar la competencia/fecha dueña.
  async archivarPartidos(lista: any[]) {
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
      await this.localStorageService.guardarPartido(partido);
    }
  }

  async eliminarPartidosDefinitivo(lista: any[]) {
    for (const partido of lista) {
      await this.eliminarFirmasPartido(partido);
      await this.eliminarPartido(partido);
    }
  }

  async eliminarCompetencia(competencia: any, archivar: boolean) {
    const partidosDeLaCompetencia = this.partidos.filter((p: any) => p.competencia_id === competencia.id);
    if (archivar) {
      await this.archivarPartidos(partidosDeLaCompetencia);
    } else {
      await this.eliminarPartidosDefinitivo(partidosDeLaCompetencia);
    }

    const idx = this.competencias.indexOf(competencia);
    if (idx !== -1) this.competencias.splice(idx, 1);
    await this.localStorageService.eliminarCompetencia(competencia.id);
  }

  async eliminarFecha(competencia: any, fecha: any, archivar: boolean) {
    const partidosDeLaFecha = this.partidos.filter((p: any) => p.competencia_id === competencia.id && p.fecha_id === fecha.id);
    if (archivar) {
      await this.archivarPartidos(partidosDeLaFecha);
    } else {
      await this.eliminarPartidosDefinitivo(partidosDeLaFecha);
    }

    const idx = competencia.fechas.indexOf(fecha);
    if (idx !== -1) competencia.fechas.splice(idx, 1);
    await this.guardarCompetencia(competencia);
  }

  async restaurarPartido(partido: any) {
    partido.archivado = false;
    await this.localStorageService.guardarPartido(partido);
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
    this.setSoloLectura(false);
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
    // Estados 5-9: sorteo del set 1 y firmas iniciales. Si todavía no hay
    // equipo A/B definido, falta el sorteo (también cubre partidos guardados
    // con el orden anterior, donde las firmas iban antes del sorteo).
    if(estado >= 5 && estado <= 9){
      const sorteoHecho = !!this.partido.equipo_1?.lado;
      if(estado == 5 || !sorteoHecho){
        this.new_sorteo(1)
      }else{
        this.new_firma(estado - 5)
      }
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

  // Última planilla exportada, solo en memoria, para la vista previa. Se
  // descarta al salir de esa vista (no se guardan archivos por cada exportación).
  planillaGenerada: { bytes: Uint8Array, nombre: string } | null = null;

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

  // ==========================================================================
  // EXPORTAR PLANILLA A PDF (formato "International Scoresheet" FIVB)
  // ==========================================================================
  // Las coordenadas de esta sección fueron calibradas visualmente contra las
  // plantillas reales (assets/planilla_3.pdf y planilla_5.pdf), que comparten
  // el mismo diseño: planilla_5 es igual a planilla_3 pero con una fila extra
  // de sets (altura 112.5pt) insertada entre la cabecera y el bloque inferior.
  // Por eso la planilla de 5 sets reutiliza exactamente las mismas coordenadas,
  // sumando ese offset a la cabecera y a la fila de sets 1-2, y usando sin
  // offset el patrón de sets 1-2 para los sets 3-4, y el patrón del set
  // decisivo + bloque inferior para el set 5.
  private readonly PLANILLA_OFFSET_5_SETS = 112.5;
  private readonly PLANILLA_AZUL = () => rgb(0 / 255, 91 / 255, 172 / 255);

  async completarPlanilla(partido: any) {
    try {
      const es3Sets = partido.numero_sets === 3;
      const urlPlantilla = es3Sets ? 'assets/planilla_3.pdf' : 'assets/planilla_5.pdf';
      const pdfBytesPlantilla = await fetch(urlPlantilla).then(res => res.arrayBuffer());
      if (!pdfBytesPlantilla) throw new Error('No se pudo cargar la plantilla PDF.');

      const pdfDoc = await PDFDocument.load(pdfBytesPlantilla);
      const pagina = pdfDoc.getPages()[0];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Relleno de la planilla desactivado: por ahora se exporta la plantilla
      // en blanco. Se irá reactivando/rehaciendo sección por sección.
      const H = es3Sets ? 0 : this.PLANILLA_OFFSET_5_SETS;
      // // Origen = inicio de la columna "I" de titulares (no el borde de la caja:
      // // a la izquierda de eso va la franja de etiquetas "Team line-up" + el
      // // dígito grande del N° de set, que no se repite en la segunda caja).
      // const BOX1_X = 139.9, BOX2_X = 515.0;

      const equipoA = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'A');
      const equipoB = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'B');
      // const nombreA = equipoA?.nombre || '';
      // const nombreB = equipoB?.nombre || '';

      this.dibujarCabeceraPlanilla(pagina, font, partido, equipoA, equipoB, H);

      // // planilla_3.pdf (imagen escaneada) y planilla_5.pdf (PDF vectorial) NO
      // // comparten el mismo layout absoluto pese a verse casi iguales, así que
      // // cada plantilla usa su propio "top" medido directamente contra su
      // // archivo. Dentro de una misma plantilla, la fila de sets 1-2 (y 3-4 en
      // // la de 5 sets) sí comparte el mismo patrón, solo que la de 5 sets
      // // agrega la cabecera desplazada por H.
      // const topNormal = es3Sets ? 440 : 431;
      // const topDecisivo = es3Sets ? 310 : 292;

      // Cajas de los sets y REMARKS: por ahora calibradas solo para la
      // plantilla de 3 sets.
      if (es3Sets) {
        this.dibujarSetsPlanilla3(pagina, font, partido);
        this.dibujarObservacionesPlanilla(pagina, font, partido.observaciones);
      }

      // this.dibujarSetPlanilla(pagina, font, partido.set_1, BOX1_X, topNormal + H, false, nombreA, nombreB, es3Sets);
      // this.dibujarSetPlanilla(pagina, font, partido.set_2, BOX2_X, topNormal + H, false, nombreA, nombreB, es3Sets);
      // if (!es3Sets) {
        // this.dibujarSetPlanilla(pagina, font, partido.set_3, BOX1_X, topNormal, false, nombreA, nombreB, es3Sets);
        // this.dibujarSetPlanilla(pagina, font, partido.set_4, BOX2_X, topNormal, false, nombreA, nombreB, es3Sets);
        // this.dibujarSetPlanilla(pagina, font, partido.set_5, BOX1_X, topDecisivo, true, nombreA, nombreB, es3Sets);
      // } else {
        // this.dibujarSetPlanilla(pagina, font, partido.set_3, BOX1_X, topDecisivo, true, nombreA, nombreB, es3Sets);
      // }

      this.dibujarRosterPlanilla(pagina, font, partido);
      this.dibujarSancionesPlanilla(pagina, font, partido);
      await this.dibujarAprobacionYFirmasPlanilla(pdfDoc, pagina, font, fontBold, partido);
      this.dibujarResultadosPlanilla(pagina, font, fontBold, partido, equipoA?.nombre || '', equipoB?.nombre || '');

      // No se descarga directo: se deja en memoria y se abre la vista previa
      // (PlanillaPreviewPage), desde donde se descarga o comparte.
      const pdfBytesModificado = await pdfDoc.save();
      this.planillaGenerada = { bytes: pdfBytesModificado, nombre: `planilla_partido_${partido.numero_partido || 'final'}.pdf` };
      this.router.navigate(['planilla-preview']);
    } catch (error) {
      console.error('Error procesando la planilla PDF:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo generar la planilla PDF. Revisa la consola para más detalles.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  // Dibuja texto solo si hay valor (para no ensuciar la plantilla con "null"/"undefined").
  // Todo lo que se completa en la planilla se dibuja en el mismo azul de
  // lápiz/pluma (como si el árbitro/anotador lo hubiese escrito a mano),
  // salvo que se pida explícitamente otro color.
  private txtPlanilla(pagina: PDFPage, font: PDFFont, valor: any, x: number, y: number, opts: { size?: number, bold?: boolean, fontBold?: PDFFont, color?: any } = {}) {
    if (valor === null || valor === undefined || valor === '') return;
    pagina.drawText(String(valor), { x, y, size: opts.size || 7, font: opts.bold && opts.fontBold ? opts.fontBold : font, color: opts.color || this.PLANILLA_AZUL() });
  }

  // Centra un texto horizontalmente en una caja de "ancho" que empieza en x.
  // Si se da "alto", y es el borde inferior de la caja y el texto también se
  // centra verticalmente (por altura de mayúsculas); si es null, y es
  // directamente la línea base.
  private centradoEnCajaPlanilla(pagina: PDFPage, font: PDFFont, valor: any, x: number, y: number, ancho: number, alto: number | null, size: number) {
    if (valor === null || valor === undefined || valor === '') return;
    const texto = String(valor);
    const xTexto = x + (ancho - font.widthOfTextAtSize(texto, size)) / 2;
    const yTexto = alto === null ? y : y + (alto - font.heightAtSize(size, { descender: false })) / 2;
    this.txtPlanilla(pagina, font, texto, xTexto, yTexto, { size });
  }

  // Texto en una caja de ancho fijo: prueba desde "size" hacia abajo hasta
  // "minSize" para que quepa; si aun así no cabe, lo recorta.
  private textoQueCabePlanilla(pagina: PDFPage, font: PDFFont, valor: any, x: number, y: number, ancho: number, size: number, minSize: number) {
    let texto = String(valor ?? '').trim();
    if (!texto) return;
    let s = size;
    while (s > minSize && font.widthOfTextAtSize(texto, s) > ancho) s -= 0.5;
    while (texto.length > 1 && font.widthOfTextAtSize(texto, s) > ancho) texto = texto.slice(0, -1);
    this.txtPlanilla(pagina, font, texto, x, y, { size: s });
  }

  // Letra A/B del sorteo dentro de uno de los círculos de la plantilla,
  // centrada en (cx, cy).
  private letraEnCirculoPlanilla(pagina: PDFPage, font: PDFFont, letra: any, cx: number, cy: number) {
    if (letra !== 'A' && letra !== 'B') return;
    const r = 6;
    this.centradoEnCajaPlanilla(pagina, font, letra, cx - r, cy - r, 2 * r, 2 * r, 10);
  }

  // Escribe un texto repartido en "n" casillas consecutivas de "ancho" (un
  // carácter centrado en cada una, de izquierda a derecha), con y como línea
  // base. Si el texto tiene más caracteres que casillas, se centra completo
  // sobre el ancho total.
  private casillasPlanilla(pagina: PDFPage, font: PDFFont, valor: any, xInicio: number, ancho: number, n: number, y: number, size: number) {
    if (valor === null || valor === undefined || valor === '') return;
    const caracteres = [...String(valor)];
    if (caracteres.length > n) {
      this.centradoEnCajaPlanilla(pagina, font, caracteres.join(''), xInicio, y, ancho * n, null, size);
      return;
    }
    caracteres.forEach((c, i) => this.centradoEnCajaPlanilla(pagina, font, c, xInicio + i * ancho, y, ancho, null, size));
  }

  private dibujarCabeceraPlanilla(pagina: PDFPage, font: PDFFont, partido: any, equipoA: any, equipoB: any, H: number) {
    // Coordenadas medidas por píxel sobre la plantilla (planilla_3.pdf):
    // la línea base de cada texto se calcula para que quede centrado
    // verticalmente dentro de su caja, y los campos con casillas de 12pt
    // (país, fecha, hora, N° de partido, equipos) llevan un carácter
    // centrado por casilla.
    const t = (v: any, x: number, y: number, size = 10) => this.txtPlanilla(pagina, font, v, x, y + H, { size });
    const casillas = (v: any, xInicio: number, n: number, y: number, size = 10) => this.casillasPlanilla(pagina, font, v, xInicio, 12, n, y + H, size);
    const marcar = (xCaja: number, yCaja: number) => this.centradoEnCajaPlanilla(pagina, font, 'X', xCaja, yCaja + H, 12, 12, 8);

    // Alineado con la línea base del rótulo "Name of the Competition".
    t(partido.competicion, 139.6, 491.5);
    t(partido.ciudad, 59.6, 474.2);
    casillas(this.codigoPaisPlanilla(partido.pais), 297.6, 3, 474.2);
    t(partido.gimnasio, 59.6, 462.2);
    // Pool/Phase: caja sin casillas (225.4 - 261.6); el texto se achica hasta
    // caber y, si aun así no cabe, se recorta.
    this.textoQueCabePlanilla(pagina, font, partido.fase, 227.0, 462.2 + H, 33.0, 10, 5);
    casillas(partido.numero_partido, 309.6, 2, 462.2);

    // Fecha "DD/MM/YYYY": día, mes en número y año con solo 2 dígitos,
    // cada dígito en su casilla (D: 361.7-385.7, M: 385.7-409.7, Y: 409.7-433.7).
    if (partido.fecha) {
      const [d, m, a] = String(partido.fecha).split('/');
      casillas(d, 361.7, 2, 474.5);
      casillas(m, 385.7, 2, 474.5);
      casillas(a ? a.slice(-2) : '', 409.7, 2, 474.5);
    }
    // Hora "HH:mm": horas en 468.0-492.2 y minutos en 492.2-516.2.
    if (partido.hora) {
      const [h, mn] = String(partido.hora).split(':');
      casillas(h, 468.0, 2, 474.5);
      casillas(mn, 492.2, 2, 474.5);
    }

    // División / categoría son texto libre: se marca la casilla de la
    // plantilla cuyo término (o traducción) calce con lo ingresado. Cada
    // casilla es de 12x12 (esquina inferior izquierda medida en la plantilla).
    const division = this.clasificarDivisionPlanilla(partido.division);
    if (division === 'masculino') marcar(85.2, 443.4);
    if (division === 'femenino') marcar(132.2, 443.7);

    const categoria = this.clasificarCategoriaPlanilla(partido.categoria);
    if (categoria === 'senior') marcar(233.8, 443.8);
    if (categoria === 'junior') marcar(278.4, 443.8);
    if (categoria === 'youth') marcar(321.1, 443.4);

    // Equipos N°1 y N°2 tal como se registraron (no según A/B), abreviados,
    // una letra por casilla (3 casillas por equipo).
    casillas(this.abreviarEquipoPlanilla(partido.equipo_1?.nombre), 372.2, 3, 450.2);
    casillas(this.abreviarEquipoPlanilla(partido.equipo_2?.nombre), 453.6, 3, 450.2);

    // Letra A/B que le tocó a cada equipo en el sorteo inicial, en el
    // círculo junto a su nombre (N°1 a la izquierda, N°2 a la derecha).
    this.letraEnCirculoPlanilla(pagina, font, partido.equipo_1?.lado, 360.2, 454.0 + H);
    this.letraEnCirculoPlanilla(pagina, font, partido.equipo_2?.lado, 502.2, 454.3 + H);

    // const AZ = this.PLANILLA_AZUL();
    // const t = (v: any, x: number, y: number, size = 10) => this.txtPlanilla(pagina, font, v, x, y + H, { size, color: AZ });

    // t(partido.competicion, 140, 490);
    // t(partido.ciudad, 60, 474);
    // t(partido.pais ? String(partido.pais).slice(0, 3).toUpperCase() : '', 300, 474);
    // t(partido.gimnasio, 60, 461);

    // if (partido.numero_partido > 10) {
      // t(partido.numero_partido, 312, 461);
    // } else if (partido.numero_partido !== null && partido.numero_partido !== undefined) {
      // t('0', 312, 461);
      // t(partido.numero_partido, 325, 461);
    // }

    // if (partido.fecha) {
      // const [d, m, a] = partido.fecha.split('/');
      // t(d, 364, 474); t(m, 386, 474); t(a, 411, 474);
    // }
    // if (partido.hora) {
      // const [h, mn] = partido.hora.split(':');
      // t(h, 470, 474); t(mn, 495, 474);
    // }

    // t('A', 358, 451);
    // t(equipoA?.nombre, 373, 451);
    // t('B', 500, 451);
    // t(equipoB?.nombre, 455, 451);

    // // Division / Categoria: texto libre, se marca la casilla si calza con las
    // // opciones fijas de la plantilla (Men/Women, Senior/Junior/Youth).
    // const div = String(partido.division || '').toLowerCase();
    // if (/mujer|dama|fem|women/.test(div)) this.txtPlanilla(pagina, font, 'X', 147, 447 + H, { size: 8 });
    // else if (/hombre|var[oó]n|masc|men/.test(div)) this.txtPlanilla(pagina, font, 'X', 88, 447 + H, { size: 8 });

    // const cat = String(partido.categoria || '').toLowerCase();
    // if (/senior|mayor|adult/.test(cat)) this.txtPlanilla(pagina, font, 'X', 252, 447 + H, { size: 8 });
    // else if (/junior/.test(cat)) this.txtPlanilla(pagina, font, 'X', 307, 447 + H, { size: 8 });
    // else if (/youth|infantil|menor/.test(cat)) this.txtPlanilla(pagina, font, 'X', 367, 447 + H, { size: 8 });
  }

  // Minúsculas y sin tildes, para comparar texto libre ingresado a mano.
  private normalizarTextoPlanilla(valor: any): string {
    return String(valor ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  // true si alguno de los términos aparece en el texto: los de varias
  // palabras se buscan tal cual; los de una palabra deben ser una palabra
  // completa o (si tienen 3+ letras) el inicio de una (ej. "fem" en
  // "femenino"), así "men" no calza dentro de "women".
  private coincideTerminoPlanilla(texto: string, terminos: string[]): boolean {
    const palabras = texto.split(/[^a-z0-9]+/).filter(Boolean);
    return terminos.some(termino => termino.includes(' ')
      ? texto.includes(termino)
      : palabras.some(p => p === termino || (termino.length >= 3 && p.startsWith(termino))));
  }

  // Términos (y traducciones) aceptados para cada casilla de división y
  // categoría de la plantilla. Ya normalizados (minúsculas, sin tildes).
  // Opciones de los selectores de División / Categoría (partido y
  // configuración de competencia). Los valores calzan con las casillas de
  // la planilla (Men/Women y Senior/Junior/Youth, ver términos abajo).
  readonly DIVISIONES_PARTIDO = ['Varones', 'Damas'];
  readonly CATEGORIAS_PARTIDO = [
    { valor: 'Adulto', detalle: 'Senior' },
    { valor: 'Juvenil', detalle: 'Junior · Sub-21 / Sub-20' },
    { valor: 'Menores', detalle: 'Youth · Sub-19 / Sub-18' },
  ];

  // Opciones para los ion-select. Si el valor guardado no es una de las
  // opciones (partidos/competencias de cuando era texto libre), se agrega
  // como opción extra para no perderlo ni mostrar el select vacío.
  opcionesDivision(actual: any): { valor: string, etiqueta: string }[] {
    const opciones = this.DIVISIONES_PARTIDO.map(d => ({ valor: d, etiqueta: d }));
    if (actual && !this.DIVISIONES_PARTIDO.includes(actual)) opciones.push({ valor: actual, etiqueta: actual });
    return opciones;
  }

  opcionesCategoria(actual: any): { valor: string, etiqueta: string }[] {
    const opciones = this.CATEGORIAS_PARTIDO.map(c => ({ valor: c.valor, etiqueta: `${c.valor} (${c.detalle})` }));
    if (actual && !this.CATEGORIAS_PARTIDO.some(c => c.valor === actual)) opciones.push({ valor: actual, etiqueta: actual });
    return opciones;
  }

  private readonly PLANILLA_TERMINOS_DIVISION = {
    femenino: ['fem', 'female', 'women', 'woman', 'mujer', 'mujeres', 'dama', 'damas', 'ladies', 'girls', 'nina', 'ninas', 'chica', 'chicas', 'f', 'w', 'feminin', 'feminino', 'femminile', 'frauen', 'damen'],
    masculino: ['masc', 'male', 'men', 'man', 'hombre', 'hombres', 'varon', 'varones', 'caballero', 'caballeros', 'boys', 'nino', 'ninos', 'chico', 'chicos', 'm', 'masculin', 'maschile', 'herren', 'manner', 'homme', 'hommes'],
  };

  private readonly PLANILLA_TERMINOS_CATEGORIA = {
    youth: ['youth', 'menor', 'menores', 'cadete', 'cadetes', 'infantil', 'infantiles', 'jeunes', 'jugend', 'giovanile', 'juvenis'],
    // En la nomenclatura FIVB en español, Junior = "Juvenil" y Youth = "Menores".
    junior: ['junior', 'juniors', 'juniores', 'jr', 'juvenil', 'juveniles'],
    senior: ['senior', 'seniors', 'mayor', 'mayores', 'adulto', 'adultos', 'adult', 'adulta', 'adultas', 'todo competidor', 'todo competidora', 'open', 'abierta', 'abierto', 'primera', 'sr'],
  };

  private clasificarDivisionPlanilla(division: any): 'masculino' | 'femenino' | null {
    const texto = this.normalizarTextoPlanilla(division);
    if (!texto) return null;
    // Femenino primero: varios términos femeninos contienen uno masculino.
    if (this.coincideTerminoPlanilla(texto, this.PLANILLA_TERMINOS_DIVISION.femenino)) return 'femenino';
    if (this.coincideTerminoPlanilla(texto, this.PLANILLA_TERMINOS_DIVISION.masculino)) return 'masculino';
    return null;
  }

  private clasificarCategoriaPlanilla(categoria: any): 'senior' | 'junior' | 'youth' | null {
    const texto = this.normalizarTextoPlanilla(categoria);
    if (!texto) return null;

    // Categorías por edad ("Sub 19", "U-21", "Under 18"...), con los cortes
    // FIVB: Junior = sub 20/21, Youth = sub 19 o menos.
    const edad = texto.match(/(?:sub|u|under|menores de)\s*-?\s*(\d{2})/);
    if (edad) {
      const n = Number(edad[1]);
      if (n <= 19) return 'youth';
      if (n <= 21) return 'junior';
    }

    if (this.coincideTerminoPlanilla(texto, this.PLANILLA_TERMINOS_CATEGORIA.junior)) return 'junior';
    if (this.coincideTerminoPlanilla(texto, this.PLANILLA_TERMINOS_CATEGORIA.youth)) return 'youth';
    if (this.coincideTerminoPlanilla(texto, this.PLANILLA_TERMINOS_CATEGORIA.senior)) return 'senior';
    return null;
  }

  // Código de país de 3 letras (estilo FIVB/COI), buscado por nombre
  // (español/inglés/portugués). Si no está en la lista: con 4 letras o menos
  // se asume que ya es un código y va tal cual (en mayúsculas); si es más
  // largo, se usan sus 3 primeras letras.
  private readonly PLANILLA_CODIGOS_PAIS: Record<string, string> = {
    'chile': 'CHI', 'argentina': 'ARG', 'brasil': 'BRA', 'brazil': 'BRA', 'peru': 'PER', 'bolivia': 'BOL',
    'uruguay': 'URU', 'paraguay': 'PAR', 'colombia': 'COL', 'venezuela': 'VEN', 'ecuador': 'ECU',
    'mexico': 'MEX', 'guatemala': 'GUA', 'honduras': 'HON', 'el salvador': 'ESA', 'nicaragua': 'NCA',
    'costa rica': 'CRC', 'panama': 'PAN', 'cuba': 'CUB', 'republica dominicana': 'DOM', 'dominican republic': 'DOM',
    'puerto rico': 'PUR', 'haiti': 'HAI', 'jamaica': 'JAM', 'trinidad y tobago': 'TTO', 'trinidad and tobago': 'TTO',
    'estados unidos': 'USA', 'eeuu': 'USA', 'united states': 'USA', 'canada': 'CAN',
    'espana': 'ESP', 'spain': 'ESP', 'portugal': 'POR', 'francia': 'FRA', 'france': 'FRA', 'italia': 'ITA', 'italy': 'ITA',
    'alemania': 'GER', 'germany': 'GER', 'paises bajos': 'NED', 'holanda': 'NED', 'netherlands': 'NED',
    'belgica': 'BEL', 'belgium': 'BEL', 'suiza': 'SUI', 'switzerland': 'SUI', 'austria': 'AUT',
    'reino unido': 'GBR', 'gran bretana': 'GBR', 'united kingdom': 'GBR', 'great britain': 'GBR', 'inglaterra': 'ENG', 'england': 'ENG',
    'irlanda': 'IRL', 'ireland': 'IRL', 'polonia': 'POL', 'poland': 'POL', 'serbia': 'SRB', 'croacia': 'CRO', 'croatia': 'CRO',
    'eslovenia': 'SLO', 'slovenia': 'SLO', 'eslovaquia': 'SVK', 'slovakia': 'SVK', 'republica checa': 'CZE', 'chequia': 'CZE', 'czech republic': 'CZE', 'czechia': 'CZE',
    'hungria': 'HUN', 'hungary': 'HUN', 'rumania': 'ROU', 'romania': 'ROU', 'bulgaria': 'BUL', 'grecia': 'GRE', 'greece': 'GRE',
    'turquia': 'TUR', 'turkey': 'TUR', 'turkiye': 'TUR', 'rusia': 'RUS', 'russia': 'RUS', 'ucrania': 'UKR', 'ukraine': 'UKR',
    'finlandia': 'FIN', 'finland': 'FIN', 'suecia': 'SWE', 'sweden': 'SWE', 'noruega': 'NOR', 'norway': 'NOR',
    'dinamarca': 'DEN', 'denmark': 'DEN', 'estonia': 'EST', 'letonia': 'LAT', 'latvia': 'LAT', 'lituania': 'LTU', 'lithuania': 'LTU',
    'japon': 'JPN', 'japan': 'JPN', 'china': 'CHN', 'corea del sur': 'KOR', 'south korea': 'KOR', 'corea': 'KOR', 'korea': 'KOR',
    'tailandia': 'THA', 'thailand': 'THA', 'filipinas': 'PHI', 'philippines': 'PHI', 'iran': 'IRI', 'india': 'IND',
    'qatar': 'QAT', 'australia': 'AUS', 'nueva zelanda': 'NZL', 'new zealand': 'NZL',
    'egipto': 'EGY', 'egypt': 'EGY', 'marruecos': 'MAR', 'morocco': 'MAR', 'tunez': 'TUN', 'tunisia': 'TUN',
    'argelia': 'ALG', 'algeria': 'ALG', 'nigeria': 'NGR', 'kenia': 'KEN', 'kenya': 'KEN', 'camerun': 'CMR', 'cameroon': 'CMR',
    'sudafrica': 'RSA', 'south africa': 'RSA',
  };

  private codigoPaisPlanilla(pais: any): string {
    const original = String(pais ?? '').trim();
    if (!original) return '';
    // Primero el nombre conocido (así "Perú" o "Cuba", de 4 letras, igual
    // salen como PER/CUB); si no, un texto corto se toma como código.
    const codigo = this.PLANILLA_CODIGOS_PAIS[this.normalizarTextoPlanilla(original)];
    if (codigo) return codigo;
    if (original.replace(/[^A-Za-z]/g, '').length <= 4) return original.toUpperCase();
    return this.normalizarTextoPlanilla(original).replace(/[^a-z]/g, '').slice(0, 3).toUpperCase();
  }

  // Abreviación del nombre de un equipo para la planilla: una sola palabra
  // -> sus 3 primeras letras; varias palabras -> la inicial de cada una.
  // Siempre en mayúsculas. Ej: "Halcones" -> "HAL", "Halcones del Sur" -> "HDS".
  private abreviarEquipoPlanilla(nombre: any): string {
    const palabras = String(nombre ?? '').trim().split(/\s+/).filter(Boolean);
    if (!palabras.length) return '';
    const abreviacion = palabras.length === 1 ? palabras[0].slice(0, 3) : palabras.map(p => p[0]).join('');
    return abreviacion.toUpperCase();
  }

  // Partículas que forman parte de un apellido compuesto ("del Carmen",
  // "de la Fuente", "San Martín", "van der Berg"): se unen a la palabra
  // siguiente para contarse como un solo apellido.
  private readonly PLANILLA_TITULOS = ['dr', 'dra', 'prof', 'profa', 'lic', 'licda', 'ing', 'sr', 'sra', 'srta', 'klgo', 'klga', 'kine', 'mg', 'pf'];

  // Nombre de un oficial para su celda: mismo formato que los jugadores
  // (inicial del primer nombre + primer apellido) y, si aun así no cabe en
  // "maxAncho", recortado.
  private nombreQueCabePlanilla(nombre: any, font: PDFFont, size: number, maxAncho: number): string {
    let corto = this.nombreCortoJugadorPlanilla(nombre);
    while (corto.length > 1 && font.widthOfTextAtSize(corto, size) > maxAncho) corto = corto.slice(0, -1);
    return corto;
  }

  private readonly PLANILLA_PARTICULAS_APELLIDO =['de', 'del', 'la', 'las', 'los', 'y', 'san', 'santa', 'van', 'von', 'der', 'den', 'da', 'das', 'do', 'dos', 'di', 'du', 'le', 'mc', 'mac'];

  // Nombre de jugador para la planilla: inicial del primer nombre + "." +
  // primer apellido. Lo primero escrito siempre es el nombre:
  //   2 partes -> nombre + apellido           ("Diego Rojas" -> "D. Rojas")
  //   3 partes -> nombre + 2 apellidos        ("Diego Rojas Soto" -> "D. Rojas")
  //   4+ partes -> nombres + 2 apellidos      ("Juan Pablo Rojas Soto" -> "J. Rojas")
  //   1 parte  -> se asume apellido, completo ("Rojas" -> "Rojas")
  // Un apellido compuesto ("del Carmen") cuenta como una sola parte.
  private nombreCortoJugadorPlanilla(nombre: any): string {
    // Títulos ("Dr.", "Dra.", "Prof."...) no son parte del nombre.
    const palabras = String(nombre ?? '').trim().split(/\s+/).filter(Boolean)
      .filter((p, _, arr) => !(arr.length > 1 && this.PLANILLA_TITULOS.includes(this.normalizarTextoPlanilla(p).replace(/\.$/, ''))));
    const partes: string[] = [];
    let particulas: string[] = [];
    for (const palabra of palabras) {
      if (this.PLANILLA_PARTICULAS_APELLIDO.includes(this.normalizarTextoPlanilla(palabra))) {
        particulas.push(palabra);
      } else {
        partes.push([...particulas, palabra].join(' '));
        particulas = [];
      }
    }
    // Partículas sueltas al final (texto incompleto): se pegan a la última parte.
    if (particulas.length) {
      if (partes.length) partes[partes.length - 1] += ' ' + particulas.join(' ');
      else partes.push(particulas.join(' '));
    }

    if (!partes.length) return '';
    if (partes.length === 1) return partes[0];
    const primerApellido = partes.length <= 3 ? partes[1] : partes[partes.length - 2];
    return `${partes[0].charAt(0).toUpperCase()}. ${primerApellido}`;
  }

  // Coordenadas x de las 6 columnas de titulares (I..VI) y las 4 bandas de la
  // grilla de puntos, para el lado A y el lado B de una caja de set, dado el
  // origen x de esa caja (BOX1_X para el set izquierdo de la fila, BOX2_X
  // para el derecho).
  private columnasSetPlanilla(origen: number) {
    return {
      IVI_A: [11.8, 35.35, 58.85, 82.4, 105.95, 129.5].map(v => origen + v),
      PTS_A: [145.6, 154.3, 163.0, 171.7].map(v => origen + v),
      IVI_B: [187.5, 211.05, 234.6, 258.15, 281.65, 305.2].map(v => origen + v),
      PTS_B: [321.3, 330.0, 338.7, 347.4].map(v => origen + v),
    };
  }

  // planilla_3.pdf (imagen escaneada) y planilla_5.pdf (vectorial) no
  // comparten el mismo layout absoluto pese a verse casi iguales, así que la
  // altura de cabecera y de la caja se midieron por separado contra cada
  // archivo (con recortes con grilla superpuestos sobre el PDF real).
  private coordenadasFilaSetPlanilla(top: number, filasPuntos: number, es3Sets: boolean) {
    const esDecisivo = filasPuntos !== 12;
    const yLabel = top - 6;
    const yLabelSub = top - 12;
    // Alto total de cabecera (fila START/TEAM/A/POINTS + fila I..VI).
    const headerTotal = es3Sets ? 30 : (esDecisivo ? 27 : 32);
    // La fila 1 de la grilla de POINTS comparte la banda de "I..VI" (queda
    // una fila más arriba que la primera fila de datos del "team line-up").
    const pointsTop = top - headerTotal / 2;
    const dataTop = top - headerTotal;
    const yTitular = dataTop - 5.5;
    const ySubJugador = dataTop - 16.4;
    const ySubPuntaje = dataTop - 27.4;
    // Alto total de la caja (borde superior a borde inferior).
    const alturaCaja = es3Sets ? (esDecisivo ? 110 : 130) : (esDecisivo ? 93.2 : 119.8);
    const bottom = top - alturaCaja;
    const alturaDatos = pointsTop - bottom;
    const nFilas = filasPuntos + 3; // + fila "T" (tiempos) + 2 filas de reserva
    const rowH = alturaDatos / nFilas;
    const filaPunto = (n: number) => pointsTop - (n - 0.5) * rowH;
    const yTiempo = pointsTop - (filasPuntos + 0.5) * rowH;
    return { yLabel, yLabelSub, yTitular, ySubJugador, ySubPuntaje, filaPunto, yTiempo };
  }

  private fmtHoraPlanilla(iso: any): { hh: string, mm: string } | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return { hh: String(d.getHours()).padStart(2, '0'), mm: String(d.getMinutes()).padStart(2, '0') };
  }

  // Puntaje acumulado de cada equipo contando los logs desde el final del
  // arreglo (el más antiguo) hasta el índice `idxDesdeElFinal` inclusive
  // (los logs se guardan más nuevo primero, ver clean_log()/punto()).
  private puntajeEnIndicePlanilla(set: any, idxDesdeElFinal: number): { A: number, B: number } {
    const logs = set.logs || [];
    let a = 0, b = 0;
    for (let i = logs.length - 1; i >= idxDesdeElFinal; i--) {
      const l = logs[i];
      if (l.tipo === 1) { if (l.equipo === 'A') a++; else b++; }
      if (l.tipo === 7) { if (l.equipo === 'A') b++; else a++; }
    }
    return { A: a, B: b };
  }

  // Para cada equipo, determina en qué columna (posición inicial I..VI, por
  // índice de la alineación de partida) ocurrió cada sustitución (tipo 2) que
  // no haya sido deshecha (tipo 3), y el marcador en ese momento.
  private construirSustitucionesPlanilla(set: any, alineacionInicial: { A: number[], B: number[] }) {
    const resultado: any = { A: {}, B: {} };
    for (const equipo of ['A', 'B'] as const) {
      const ocupante = [...alineacionInicial[equipo]];
      const logsCronologicos = [...(set.logs || [])].reverse();
      const deshechos = new Set<string>();
      logsCronologicos.forEach((l: any) => { if (l.tipo === 3 && l.equipo === equipo) deshechos.add(`${l.jugador}-${l.cambio}`); });
      for (const l of logsCronologicos) {
        if (l.tipo === 2 && l.equipo === equipo) {
          const key = `${l.jugador}-${l.cambio}`;
          if (deshechos.has(key)) continue;
          const idx = ocupante.findIndex(n => n === l.jugador);
          if (idx !== -1) {
            const marcador = this.puntajeEnIndicePlanilla(set, set.logs.indexOf(l));
            resultado[equipo][idx] = { entra: l.cambio, puntaje: marcador };
            ocupante[idx] = l.cambio;
          }
        }
      }
    }
    return resultado;
  }

  private dibujarSetPlanilla(pagina: PDFPage, font: PDFFont, set: any, origenX: number, top: number, esDecisivo: boolean, nombreA: string, nombreB: string, es3Sets: boolean) {
    // if (!set) return;
    // const cols = this.columnasSetPlanilla(origenX);
    // const filasPuntos = esDecisivo ? 10 : 12;
    // const rc = this.coordenadasFilaSetPlanilla(top, filasPuntos, es3Sets);

    // const hi = this.fmtHoraPlanilla(set.hora_inicio);
    // const hf = this.fmtHoraPlanilla(set.hora_fin);
    // if (hi) { this.txtPlanilla(pagina, font, hi.hh, origenX + 26, rc.yLabelSub, { size: 5.5 }); this.txtPlanilla(pagina, font, hi.mm, origenX + 38, rc.yLabelSub, { size: 5.5 }); }
    // if (hf) { this.txtPlanilla(pagina, font, hf.hh, origenX + 293, rc.yLabelSub, { size: 5.5 }); this.txtPlanilla(pagina, font, hf.mm, origenX + 305, rc.yLabelSub, { size: 5.5 }); }

    // // El lado izquierdo/derecho de la caja depende de qué equipo quedó a la
    // // izquierda en ese set (set.lado_izquierda).
    // const equipoIzq = set.lado_izquierda === 'A' ? nombreA : nombreB;
    // const equipoDer = set.lado_izquierda === 'A' ? nombreB : nombreA;
    // this.txtPlanilla(pagina, font, equipoIzq, origenX + 78, rc.yLabel, { size: 6.5 });
    // this.txtPlanilla(pagina, font, equipoDer, origenX + 210, rc.yLabel, { size: 6.5 });

    // const alinA: number[] = set.alineacion_a || [];
    // const alinB: number[] = set.alineacion_b || [];
    // cols.IVI_A.forEach((x, i) => this.txtPlanilla(pagina, font, alinA[i], x, rc.yTitular, { size: 6.5 }));
    // cols.IVI_B.forEach((x, i) => this.txtPlanilla(pagina, font, alinB[i], x, rc.yTitular, { size: 6.5 }));

    // const subs = this.construirSustitucionesPlanilla(set, { A: alinA, B: alinB });
    // for (const [equipo, colXs] of [['A', cols.IVI_A], ['B', cols.IVI_B]] as const) {
      // for (let i = 0; i < 6; i++) {
        // const s = subs[equipo][i];
        // if (s) {
          // this.txtPlanilla(pagina, font, s.entra, colXs[i], rc.ySubJugador, { size: 6 });
          // this.txtPlanilla(pagina, font, s.puntaje[equipo], colXs[i], rc.ySubPuntaje, { size: 6 });
        // }
      // }
    // }

    // // Grilla de puntos: numeración secuencial simple por equipo (1,2,3,...),
    // // en la fila correspondiente al resto de dividir por la cantidad de filas
    // // de la caja, avanzando de banda cuando se supera esa cantidad (igual al
    // // esquema "1 13 25 37" / "1 11 21" preimpreso en la plantilla).
    // const logsCronologicos = [...(set.logs || [])].reverse();
    // let scoreA = 0, scoreB = 0;
    // const escribirPunto = (equipo: 'A' | 'B', n: number, cols4: number[]) => {
      // const banda = Math.floor((n - 1) / filasPuntos);
      // const fila = ((n - 1) % filasPuntos) + 1;
      // this.txtPlanilla(pagina, font, n, cols4[Math.min(banda, cols4.length - 1)], rc.filaPunto(fila), { size: 4.3 });
    // };
    // for (const l of logsCronologicos) {
      // if (l.tipo === 1) {
        // if (l.equipo === 'A') { scoreA++; escribirPunto('A', scoreA, cols.PTS_A); }
        // else { scoreB++; escribirPunto('B', scoreB, cols.PTS_B); }
      // } else if (l.tipo === 7) {
        // // Tarjeta roja: punto para el equipo contrario al sancionado.
        // if (l.equipo === 'A') { scoreB++; escribirPunto('B', scoreB, cols.PTS_B); }
        // else { scoreA++; escribirPunto('A', scoreA, cols.PTS_A); }
      // } else if (l.tipo === 4) {
        // const x = l.equipo === 'A' ? cols.PTS_A[0] : cols.PTS_B[0];
        // this.txtPlanilla(pagina, font, `${scoreA}:${scoreB}`, x - 2, rc.yTiempo, { size: 4.3 });
      // }
    // }
  }

  // ==========================================================================
  // Cajas de los sets (plantilla de 3 sets)
  // ==========================================================================
  // Geometría medida por píxel sobre planilla_3.pdf. Cada caja de set tiene
  // dos "mitades" (una por equipo; el set decisivo tiene además la mitad de
  // "Change side"). Por mitad:
  //   cols:    7 bordes x de las columnas I..VI (orden de saque)
  //   puntos:  números impresos de la columna POINTS: rango x de cada
  //            subcolumna, centro y de cada fila y alto del número
  //   xT:      centro x de la columna POINTS (":" de los tiempos "T")
  //   equipo:  x inicial de la caja TEAM (3 casillas de 12pt)
  //   sr:      círculos S/R [x centro, y centro S, y centro R]
  //   circulo: círculo vacío para la letra A/B (solo en el set decisivo)
  //   hora:    caja de hora de inicio/fin [x0, x1]
  // Filas (iguales para todas las mitades de una misma caja): bordes y de
  // la fila de titulares, sustitutos, marcador del cambio (2 filas), rondas
  // de saque y tiempos, más las líneas base de la cabecera.
  private readonly PLANILLA_SET_FILAS_NORMAL = {
    lineas: [423.71, 407.73, 396.79, 385.74, 374.80, 363.87, 352.82, 341.88, 330.95, 320.01],
    rondas: 4, tiempos: [[341.88, 330.95], [330.95, 320.01]] as [number, number][],
    yEquipo: 428.3, hora: [428.27, 438.25] as [number, number], yCirculo: 0,
  };
  private readonly PLANILLA_SET_FILAS_DECISIVO = {
    lineas: [300.67, 284.57, 273.52, 262.58, 251.53, 240.47, 229.42, 218.36, 207.31],
    rondas: 3, tiempos: [[229.42, 218.36], [218.36, 207.31]] as [number, number][],
    yEquipo: 304.76, hora: [305.00, 315.09] as [number, number], yCirculo: 308.66,
  };

  private planillaFilasPuntos(primera: number, paso: number, n: number): number[] {
    return Array.from({ length: n }, (_, i) => primera - i * paso);
  }

  private get PLANILLA_SETS_3(): any {
    const filas12 = this.planillaFilasPuntos(419.3, 5.658, 12);
    const filas10 = this.planillaFilasPuntos(296.23, 5.661, 10);
    const filas8 = this.planillaFilasPuntos(295.99, 7.073, 8);
    return {
      set1: {
        izq: { cols: [139.80, 163.31, 186.83, 210.47, 233.99, 257.51, 281.03], puntos: { xs: [[283.19, 287.51], [291.59, 295.91], [299.99, 304.31], [308.39, 312.95]], ys: filas12, alto: 3.0 }, xT: 298.37, equipo: 213.83, sr: [275.63, 435.6, 427.7], hora: [163.67, 185.51] },
        der: { cols: [315.71, 339.11, 362.63, 386.15, 409.67, 433.19, 456.82], puntos: { xs: [[459.34, 463.66], [467.74, 472.06], [476.14, 480.46], [484.54, 489.10]], ys: filas12, alto: 3.0 }, xT: 474.22, equipo: 346.79, sr: [321.23, 435.6, 427.7], hora: [430.55, 454.54] },
      },
      set2: {
        izq: { cols: [514.90, 538.42, 561.94, 585.46, 608.98, 632.50, 656.14], puntos: { xs: [[658.30, 662.62], [666.46, 671.02], [674.86, 679.42], [683.50, 688.06]], ys: filas12, alto: 3.0 }, xT: 673.36, equipo: 588.82, sr: [650.73, 435.6, 427.7], hora: [538.54, 560.62] },
        der: { cols: [690.58, 714.10, 737.62, 761.13, 784.65, 808.29, 831.81], puntos: { xs: [[834.45, 838.53], [842.61, 847.17], [851.01, 855.57], [859.65, 864.21]], ys: filas12, alto: 3.0 }, xT: 849.27, equipo: 721.66, sr: [696.5, 435.6, 427.7], hora: [805.65, 829.65] },
      },
      set3: {
        izq: { cols: [149.75, 173.03, 196.67, 220.31, 243.59, 267.35, 290.87], puntos: { xs: [[301.67, 303.83]], ys: filas8, alto: 3.1 }, xT: 303.11, equipo: 223.19, sr: [285.15, 312.15, 304.6], circulo: 272.75, hora: [173.03, 195.11] },
        der: { cols: [315.35, 338.99, 362.51, 386.03, 409.55, 433.07, 456.70], puntos: { xs: [[460.54, 464.38], [471.34, 475.66], [483.34, 487.66]], ys: filas10, alto: 3.1 }, xT: 474.16, equipo: 346.79, sr: [321.0, 312.15, 304.6], circulo: 333.47, hora: [430.55, 454.54] },
        cambio: { cols: [514.66, 538.18, 561.58, 585.34, 608.86, 632.38, 655.90], puntos: { xs: [[659.50, 663.34], [670.54, 674.86], [682.30, 686.86]], ys: filas10, alto: 3.1 }, xT: 672.94, circulo: 552.46, puntosEnCambio: 624.94 },
      },
    };
  }

  // Recorre los logs de un set en orden cronológico y arma, para cada
  // equipo, todo lo que se anota en su mitad de la caja:
  //  - rondas de saque: cada vez que un equipo pierde el saque se anota su
  //    puntaje bajo la posición de quien sacaba (y la vuelta en que iba);
  //    al terminar el set, el puntaje final va en la casilla de quien estaba
  //    sacando. Al equipo que recibe primero se le marca "X" en la primera
  //    ronda de la posición I (su primer saque lo hace la posición II).
  //  - sustituciones (por posición inicial): N° del que entra, marcador al
  //    entrar y marcador al volver el titular.
  //  - tiempos ("T") con el marcador.
  // El punto por tarjeta roja cuenta como un rally ganado por el rival.
  // "i" de cada evento = índice cronológico del log, para separar lo
  // anterior/posterior al cambio de lado del set decisivo.
  private simularSetPlanilla(set: any) {
    const logs: any[] = [...(set.logs || [])].reverse();
    const otro = (e: 'A' | 'B'): 'A' | 'B' => e === 'A' ? 'B' : 'A';
    const marcador = { A: 0, B: 0 };
    const equipos: any = {};
    for (const e of ['A', 'B'] as const) {
      equipos[e] = {
        rondas: [] as { pos: number, ronda: number, texto: string, i: number }[],
        subs: [] as { pos: number, entra: number, marcador: [number, number], i: number, vuelta?: [number, number], iVuelta?: number }[],
        tiempos: [] as { marcador: [number, number], i: number }[],
        // Números de punto (1, 2, ...) ganados por tarjeta roja del rival:
        // en la columna POINTS se encierran en un círculo en vez de tacharse.
        puntosCastigo: [] as number[],
        ocupantes: [...(e === 'A' ? set.alineacion_a : set.alineacion_b) || []],
        servidor: 0,
        vueltas: [0, 0, 0, 0, 0, 0],
      };
    }
    let saque: 'A' | 'B' = set.equipo_saque === 'B' ? 'B' : 'A';
    // El que saca primero arranca en la posición I (1ª vuelta); el que
    // recibe tiene la 1ª vuelta de la posición I marcada con "X".
    equipos[saque].vueltas[0] = 1;
    equipos[otro(saque)].vueltas[0] = 1;
    equipos[otro(saque)].rondas.push({ pos: 0, ronda: 1, texto: 'X', i: -1 });

    let iCambio = Infinity;
    const enCambio = { A: 0, B: 0 };
    logs.forEach((l, i) => {
      if (l.tipo === 1 || l.tipo === 7) {
        const ganador: 'A' | 'B' = l.tipo === 1 ? l.equipo : otro(l.equipo);
        marcador[ganador]++;
        if (l.tipo === 7) equipos[ganador].puntosCastigo.push(marcador[ganador]);
        if (ganador !== saque) {
          const perdedor = equipos[saque];
          perdedor.rondas.push({ pos: perdedor.servidor, ronda: perdedor.vueltas[perdedor.servidor], texto: String(marcador[saque]), i });
          saque = ganador;
          const g = equipos[ganador];
          g.servidor = (g.servidor + 1) % 6;
          g.vueltas[g.servidor]++;
        }
        // Set decisivo sin log de cambio de lado: igual se cambia al llegar a 8.
        if (iCambio === Infinity && set._decisivo && (marcador.A === 8 || marcador.B === 8) && !logs.some(x => x.tipo === 10)) {
          iCambio = i + 0.5; enCambio.A = marcador.A; enCambio.B = marcador.B;
        }
      } else if (l.tipo === 10) {
        if (iCambio === Infinity) { iCambio = i; enCambio.A = marcador.A; enCambio.B = marcador.B; }
      } else if (l.tipo === 4 && equipos[l.equipo]) {
        equipos[l.equipo].tiempos.push({ marcador: [marcador[l.equipo as 'A' | 'B'], marcador[otro(l.equipo)]], i });
      } else if ((l.tipo === 2 || l.tipo === 3) && equipos[l.equipo]) {
        const eq = equipos[l.equipo];
        const m: [number, number] = [marcador[l.equipo as 'A' | 'B'], marcador[otro(l.equipo)]];
        if (l.tipo === 2) {
          const pos = eq.ocupantes.indexOf(l.jugador);
          if (pos === -1 || eq.subs.some((s: any) => s.pos === pos)) return;
          eq.subs.push({ pos, entra: l.cambio, marcador: m, i });
          eq.ocupantes[pos] = l.cambio;
        } else {
          const sub = eq.subs.find((s: any) => s.entra === l.cambio && !s.vuelta);
          if (!sub) return;
          sub.vuelta = m; sub.iVuelta = i;
          eq.ocupantes[sub.pos] = l.jugador;
        }
      }
    });
    // Puntaje final en la casilla de quien estaba sacando al terminar.
    const s = equipos[saque];
    s.rondas.push({ pos: s.servidor, ronda: s.vueltas[s.servidor], texto: String(marcador[saque]), i: logs.length });
    return { equipos, marcador, iCambio, enCambio };
  }

  private lineaPlanilla(pagina: PDFPage, x0: number, y0: number, x1: number, y1: number, grosor = 0.6) {
    pagina.drawLine({ start: { x: x0, y: y0 }, end: { x: x1, y: y1 }, thickness: grosor, color: this.PLANILLA_AZUL() });
  }

  // Marca la columna POINTS de una mitad: diagonal sobre cada punto desde
  // "desde" hasta "hasta", círculo en el último (si "circulo") y una línea
  // vertical que tacha los números que quedaron sin usar (si "tacharResto"). Con
  // "tacharAntes" > 0 también tacha 1..tacharAntes (números ya usados en
  // otra caja, en la mitad de cambio de lado del set decisivo).
  private marcarPuntosPlanilla(pagina: PDFPage, grilla: any, opts: { tacharAntes?: number, desde: number, hasta: number, circulo: boolean, tacharResto: boolean, castigo?: number[] }) {
    const filas = grilla.ys.length;
    const total = filas * grilla.xs.length;
    const celda = (n: number) => {
      const col = Math.floor((n - 1) / filas), fila = (n - 1) % filas;
      const [x0, x1] = grilla.xs[col];
      return { x0, x1, yc: grilla.ys[fila], col };
    };
    const tachar = (a: number, b: number) => {
      for (let n = a; n <= Math.min(b, total);) {
        const c = celda(n);
        let m = n;
        while (m + 1 <= Math.min(b, total) && celda(m + 1).col === c.col) m++;
        const d = celda(m);
        const xm = (c.x0 + c.x1) / 2;
        this.lineaPlanilla(pagina, xm, c.yc + grilla.alto / 2 + 0.8, xm, d.yc - grilla.alto / 2 - 0.8);
        n = m + 1;
      }
    };
    if (opts.tacharAntes) tachar(1, opts.tacharAntes);
    const encerrar = (n: number) => {
      const c = celda(n);
      pagina.drawEllipse({ x: (c.x0 + c.x1) / 2, y: c.yc, xScale: (c.x1 - c.x0) / 2 + 1.8, yScale: grilla.alto / 2 + 1.4, borderColor: this.PLANILLA_AZUL(), borderWidth: 0.6 });
    };
    for (let n = opts.desde; n <= Math.min(opts.hasta, total); n++) {
      // Punto ganado por tarjeta roja del rival: círculo en vez de diagonal.
      if (opts.castigo?.includes(n)) { encerrar(n); continue; }
      const c = celda(n);
      this.lineaPlanilla(pagina, c.x0 - 0.6, c.yc - grilla.alto / 2 - 0.6, c.x1 + 0.6, c.yc + grilla.alto / 2 + 0.6);
    }
    if (opts.circulo && opts.hasta >= opts.desde && opts.hasta <= total && !opts.castigo?.includes(opts.hasta)) encerrar(opts.hasta);
    if (opts.tacharResto) tachar(Math.max(opts.hasta + 1, (opts.tacharAntes || 0) + 1), total);
  }

  // Marcador "propio:rival" alrededor del ":" impreso en xColon.
  private marcadorPlanilla(pagina: PDFPage, font: PDFFont, m: [number, number], xColon: number, yBase: number, size = 7) {
    const izq = String(m[0]);
    this.txtPlanilla(pagina, font, izq, xColon - 1.4 - font.widthOfTextAtSize(izq, size), yBase, { size });
    this.txtPlanilla(pagina, font, String(m[1]), xColon + 1.4, yBase, { size });
  }

  // Dibuja una mitad de caja de set (un equipo). "hasta" limita a los
  // eventos anteriores a ese índice cronológico (caja 1 del set decisivo,
  // que solo llega hasta el cambio de lado).
  private dibujarMitadSetPlanilla(pagina: PDFPage, font: PDFFont, geo: any, filas: any, set: any, datos: any, equipo: any, opts: { lado: 'A' | 'B', hasta?: number, letra?: boolean, hora?: any, saca?: boolean }) {
    const hasta = opts.hasta ?? Infinity;
    const L = filas.lineas;
    const base = (techo: number, piso: number, size: number) => piso + (techo - piso - font.heightAtSize(size, { descender: false })) / 2;
    const centroCol = (p: number) => (geo.cols[p] + geo.cols[p + 1]) / 2;

    // Cabecera: nombre abreviado, letra (set decisivo), S/R y hora.
    if (geo.equipo !== undefined) this.casillasPlanilla(pagina, font, this.abreviarEquipoPlanilla(equipo?.nombre), geo.equipo, 12, 3, filas.yEquipo, 10);
    if (opts.letra && geo.circulo !== undefined) this.letraEnCirculoPlanilla(pagina, font, opts.lado, geo.circulo, filas.yCirculo);
    if (geo.sr && opts.saca !== undefined) {
      const [x, yS, yR] = geo.sr;
      const y = opts.saca ? yS : yR;
      this.lineaPlanilla(pagina, x - 2.6, y - 2.6, x + 2.6, y + 2.6);
      this.lineaPlanilla(pagina, x - 2.6, y + 2.6, x + 2.6, y - 2.6);
    }
    const hora = this.fmtHoraPlanilla(opts.hora);
    if (hora && geo.hora) {
      const [x0, x1] = geo.hora, xm = (x0 + x1) / 2;
      const y = base(filas.hora[1], filas.hora[0], 7);
      this.centradoEnCajaPlanilla(pagina, font, hora.hh, x0, y, xm - x0 - 1, null, 7);
      this.centradoEnCajaPlanilla(pagina, font, hora.mm, xm + 1, y, x1 - xm - 1, null, 7);
    }

    // Titulares (orden de saque I..VI).
    const alineacion: any[] = (opts.lado === 'A' ? set.alineacion_a : set.alineacion_b) || [];
    const yTitular = base(L[1], L[2], 8);
    alineacion.slice(0, 6).forEach((n, p) => {
      if (typeof n === 'number') this.centradoEnCajaPlanilla(pagina, font, n, geo.cols[p], yTitular, geo.cols[p + 1] - geo.cols[p], null, 8);
    });

    // Sustituciones: N° del que entra, marcador al entrar y al volver.
    for (const s of datos.subs.filter((x: any) => x.i < hasta)) {
      const ySub = base(L[2], L[3], 8);
      this.centradoEnCajaPlanilla(pagina, font, s.entra, geo.cols[s.pos], ySub, geo.cols[s.pos + 1] - geo.cols[s.pos], null, 8);
      // Cambio deshecho (volvió el titular): el N° del sustituto va en un círculo.
      if (s.vuelta && s.iVuelta < hasta) {
        const ancho = font.widthOfTextAtSize(String(s.entra), 8);
        pagina.drawEllipse({ x: centroCol(s.pos), y: ySub + font.heightAtSize(8, { descender: false }) / 2, xScale: ancho / 2 + 2.6, yScale: 4.6, borderColor: this.PLANILLA_AZUL(), borderWidth: 0.6 });
      }
      this.marcadorPlanilla(pagina, font, s.marcador, centroCol(s.pos), base(L[3], L[4], 7));
      if (s.vuelta && s.iVuelta < hasta) this.marcadorPlanilla(pagina, font, s.vuelta, centroCol(s.pos), base(L[4], L[5], 7));
    }

    // Rondas de saque: cada posición tiene 2 subcolumnas (1..n | n+1..2n).
    for (const r of datos.rondas.filter((x: any) => x.i < hasta)) {
      const nFilas = filas.rondas;
      if (r.ronda < 1 || r.ronda > nFilas * 2) continue;
      const sub = r.ronda <= nFilas ? 0 : 1, fila = (r.ronda - 1) % nFilas;
      const xm = centroCol(r.pos);
      const x0 = sub === 0 ? geo.cols[r.pos] : xm;
      const techo = L[5 + fila], piso = L[6 + fila];
      // Un poco a la derecha y abajo, para no tapar el número de ronda impreso.
      this.centradoEnCajaPlanilla(pagina, font, r.texto, x0 + 1.5, piso + 1.4, (xm - geo.cols[r.pos]) - 1.5, null, 7);
    }

    // Tiempos.
    datos.tiempos.filter((t: any) => t.i < hasta).slice(0, 2).forEach((t: any, k: number) => {
      const [techo, piso] = filas.tiempos[k];
      this.marcadorPlanilla(pagina, font, t.marcador, geo.xT, base(techo, piso, 7));
    });
  }

  // Sets 1, 2 y 3 de la plantilla de 3 sets. En los sets 1 y 2 las letras
  // ya vienen impresas (set 1: A izquierda / B derecha; set 2: B izquierda /
  // A derecha). En el set 3 (decisivo) se anota la letra: la caja 1 es del
  // equipo que empezó a la izquierda, que al cambio de lado sigue en la
  // caja "Change side"; la caja 2 es del otro equipo.
  private dibujarSetsPlanilla3(pagina: PDFPage, font: PDFFont, partido: any) {
    const geo = this.PLANILLA_SETS_3;
    const equipoDe = (lado: 'A' | 'B') => [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === lado);
    const otro = (e: 'A' | 'B'): 'A' | 'B' => e === 'A' ? 'B' : 'A';

    const setNormal = (set: any, g: any, izq: 'A' | 'B') => {
      if (!set?.logs) return;
      const sim = this.simularSetPlanilla(set);
      for (const [lado, mitad, hora] of [[izq, g.izq, set.hora_inicio], [otro(izq), g.der, set.hora_fin]] as const) {
        this.dibujarMitadSetPlanilla(pagina, font, mitad, this.PLANILLA_SET_FILAS_NORMAL, set, sim.equipos[lado], equipoDe(lado), { lado, hora, saca: set.equipo_saque === lado });
        this.marcarPuntosPlanilla(pagina, mitad.puntos, { desde: 1, hasta: sim.marcador[lado], circulo: !!set.victoria, tacharResto: !!set.victoria, castigo: sim.equipos[lado].puntosCastigo });
      }
    };
    setNormal(partido.set_1, geo.set1, 'A');
    setNormal(partido.set_2, geo.set2, 'B');

    const set3 = partido.set_3;
    if (!set3?.logs) return;
    // lado_izquierda queda alternado después del cambio de lado: se
    // recupera el lado con que empezó el set.
    const izqFinal: 'A' | 'B' = set3.lado_izquierda === 'B' ? 'B' : 'A';
    const izq: 'A' | 'B' = set3.cambio_lado_realizado ? otro(izqFinal) : izqFinal;
    const der = otro(izq);
    const sim = this.simularSetPlanilla({ ...set3, _decisivo: true });
    const filas = this.PLANILLA_SET_FILAS_DECISIVO;
    const g = geo.set3;
    const terminado = !!set3.victoria;
    const k = sim.iCambio === Infinity ? Infinity : sim.enCambio[izq];

    // Caja 1: equipo de la izquierda hasta el cambio de lado (puntos 1..8).
    this.dibujarMitadSetPlanilla(pagina, font, g.izq, filas, set3, sim.equipos[izq], equipoDe(izq), { lado: izq, hasta: sim.iCambio, letra: true, hora: set3.hora_inicio, saca: set3.equipo_saque === izq });
    const puntosCaja1 = Math.min(k === Infinity ? sim.marcador[izq] : k, 8);
    // Sin círculo: el punto final del set de este equipo va en la caja de
    // cambio de lado; acá solo se tacha lo que sobró de 1..8.
    this.marcarPuntosPlanilla(pagina, g.izq.puntos, { desde: 1, hasta: puntosCaja1, circulo: false, tacharResto: sim.iCambio !== Infinity, castigo: sim.equipos[izq].puntosCastigo });

    // Caja 2: el otro equipo, todo el set.
    this.dibujarMitadSetPlanilla(pagina, font, g.der, filas, set3, sim.equipos[der], equipoDe(der), { lado: der, letra: true, hora: set3.hora_fin, saca: set3.equipo_saque === der });
    this.marcarPuntosPlanilla(pagina, g.der.puntos, { desde: 1, hasta: sim.marcador[der], circulo: terminado, tacharResto: terminado, castigo: sim.equipos[der].puntosCastigo });

    // Caja "Change side": el equipo de la caja 1, desde el cambio de lado
    // (se copia la alineación y lo ya anotado, y se sigue anotando acá).
    // "Points at change" = puntos del equipo que NO llegó a 8 al momento del
    // cambio (el que llegó a 8 es el que lo provocó).
    if (sim.iCambio !== Infinity) {
      this.dibujarMitadSetPlanilla(pagina, font, g.cambio, filas, set3, sim.equipos[izq], null, { lado: izq, letra: true });
      const puntosNoOcho = sim.enCambio.A === 8 ? sim.enCambio.B : sim.enCambio.A;
      this.casillasPlanilla(pagina, font, String(puntosNoOcho), g.cambio.puntosEnCambio, 12, 2, filas.yEquipo, 10);
      this.marcarPuntosPlanilla(pagina, g.cambio.puntos, { tacharAntes: k, desde: k + 1, hasta: sim.marcador[izq], circulo: terminado, tacharResto: terminado, castigo: sim.equipos[izq].puntosCastigo });
    }
  }

  // REMARKS (planilla_3.pdf): 7 renglones; los 2 primeros empiezan a la
  // derecha del rótulo "REMARKS" y el resto ocupa todo el ancho. El texto se
  // reparte por palabras (respetando los saltos de línea escritos) y, si no
  // cabe, el último renglón termina en "…".
  private dibujarObservacionesPlanilla(pagina: PDFPage, font: PDFFont, observaciones: any) {
    // Helvetica estándar solo dibuja caracteres WinAnsi: se descartan los
    // demás (emojis, etc.) para que no falle la exportación.
    const soportados = new Set(font.getCharacterSet());
    const texto = [...String(observaciones || '')].filter(c => c === '\n' || soportados.has(c.codePointAt(0)!)).join('').trim();
    if (!texto) return;

    const size = 7;
    const LINEAS = [203.47, 195.42, 187.36, 179.31, 171.38, 163.33, 155.28, 147.23];
    const xInicio = (i: number) => i < 2 ? 233.0 : 173.0;
    const xFin = 515.0;
    const ancho = (t: string) => font.widthOfTextAtSize(t, size);

    const renglones: string[] = [];
    let desbordado = false;
    for (const parrafo of texto.split(/\n+/)) {
      let actual = '';
      for (const palabra of parrafo.split(/\s+/).filter(Boolean)) {
        const max = xFin - xInicio(renglones.length);
        const prueba = actual ? actual + ' ' + palabra : palabra;
        if (ancho(prueba) <= max) { actual = prueba; continue; }
        if (actual) renglones.push(actual);
        actual = palabra;
        // Palabra más larga que el renglón completo: se corta.
        while (ancho(actual) > xFin - xInicio(renglones.length)) {
          let k = actual.length;
          while (k > 1 && ancho(actual.slice(0, k)) > xFin - xInicio(renglones.length)) k--;
          renglones.push(actual.slice(0, k));
          actual = actual.slice(k);
        }
      }
      if (actual) renglones.push(actual);
    }
    if (renglones.length > LINEAS.length - 1) {
      renglones.length = LINEAS.length - 1;
      desbordado = true;
    }
    renglones.forEach((r, i) => {
      let linea = r;
      if (desbordado && i === renglones.length - 1) {
        while (linea.length > 1 && ancho(linea + '…') > xFin - xInicio(i)) linea = linea.slice(0, -1);
        linea += '…';
      }
      const techo = LINEAS[i], piso = LINEAS[i + 1];
      const y = piso + (techo - piso - font.heightAtSize(size, { descender: false })) / 2;
      this.txtPlanilla(pagina, font, linea, xInicio(i), y, { size });
    });
  }

  private dibujarRosterPlanilla(pagina: PDFPage, font: PDFFont, partido: any) {
    // Equipos N°1 y N°2 abreviados sobre la nómina, una letra por casilla.
    // Este bloque inferior no se desplaza en la plantilla de 5 sets (no lleva H).
    this.casillasPlanilla(pagina, font, this.abreviarEquipoPlanilla(partido.equipo_1?.nombre), 724.8, 12, 3, 305.5, 10);
    this.casillasPlanilla(pagina, font, this.abreviarEquipoPlanilla(partido.equipo_2?.nombre), 797.0, 12, 3, 305.5, 10);
    this.letraEnCirculoPlanilla(pagina, font, partido.equipo_1?.lado, 707.7, 308.1);
    this.letraEnCirculoPlanilla(pagina, font, partido.equipo_2?.lado, 853.9, 308.1);

    // Nómina de cada equipo (N°1 a la izquierda, N°2 a la derecha): hasta 14
    // jugadores (sin líberos) y, aparte, hasta 2 líberos. Ordenados por
    // número de camiseta. Cada fila se centra entre sus líneas reales de la
    // plantilla (no son equidistantes: van de ~8.2 a ~9.7pt), medidas por
    // píxel en planilla_3.pdf; ambas columnas comparten las mismas filas.
    const tamano = 7;
    const LINEAS_JUGADORES = [291.66, 281.93, 272.31, 262.94, 253.57, 244.32, 234.83, 226.05, 216.56, 206.95, 197.58, 187.97, 178.59, 169.10, 159.73];
    const LINEAS_LIBEROS = [151.68, 142.79, 134.62];
    // [equipo, x inicio columna N°, ancho columna N°, x del nombre (a 2pt del borde)]
    const columnasNomina: [any, number, number, number][] = [
      [partido.equipo_1, 695.5, 10.1, 707.6],
      [partido.equipo_2, 780.7, 10.8, 793.5],
    ];
    for (const [equipo, xNum, anchoNum, xNombre] of columnasNomina) {
      const jugadores: any[] = [...(equipo?.jugadores || [])].sort((a: any, b: any) => (a.numero ?? 0) - (b.numero ?? 0));
      const fila = (j: any, lineas: number[], i: number) => {
        const techo = lineas[i], piso = lineas[i + 1];
        const y = piso + (techo - piso - font.heightAtSize(tamano, { descender: false })) / 2;
        this.centradoEnCajaPlanilla(pagina, font, j.numero, xNum, y, anchoNum, null, tamano);
        this.txtPlanilla(pagina, font, this.nombreCortoJugadorPlanilla(j.nombre), xNombre, y, { size: tamano });
      };
      jugadores.filter(j => !j.libero).slice(0, 14).forEach((j, i) => fila(j, LINEAS_JUGADORES, i));
      jugadores.filter(j => j.libero).slice(0, 2).forEach((j, i) => fila(j, LINEAS_LIBEROS, i));
    }

    // Oficiales (bloque OFFICIALS): filas C, AC¹, AC², T (fisioterapeuta) y
    // M (médico); equipo N°1 a la izquierda y N°2 a la derecha del rótulo.
    // Bordes internos de filas y celdas medidos por píxel en planilla_3.pdf.
    const LINEAS_OFICIALES = [126.21, 117.56, 108.90, 100.01, 91.00, 82.47];
    const CAMPOS_OFICIALES = ['entrenador', 'primer_asistente', 'segundo_asistente', 'fisioterapeuta', 'medico'];
    const celdasOficiales: [any, number, number][] = [
      [partido.equipo_1, 696.0, 771.8],
      [partido.equipo_2, 790.1, 865.9],
    ];
    for (const [equipo, xIzq, xDer] of celdasOficiales) {
      CAMPOS_OFICIALES.forEach((campo, i) => {
        const techo = LINEAS_OFICIALES[i], piso = LINEAS_OFICIALES[i + 1];
        const y = piso + (techo - piso - font.heightAtSize(tamano, { descender: false })) / 2;
        const nombre = this.nombreQueCabePlanilla(equipo?.[campo], font, tamano, xDer - xIzq - 4);
        this.txtPlanilla(pagina, font, nombre, xIzq + 2, y, { size: tamano });
      });
    }

    // const equipoA = partido.equipo_1?.lado === 'A' ? partido.equipo_1 : partido.equipo_2;
    // const equipoB = partido.equipo_1?.lado === 'B' ? partido.equipo_1 : partido.equipo_2;
    // const jugadoresA: any[] = equipoA?.jugadores || [];
    // const jugadoresB: any[] = equipoB?.jugadores || [];
    // const startY = 273, rowH = 13;

    // const etiqueta = (j: any) => (j.nombre || '') + (j.capitan ? ' (C)' : '') + (j.libero ? ' (L)' : '');
    // jugadoresA.forEach((j, i) => {
      // const y = startY - i * rowH;
      // this.txtPlanilla(pagina, font, j.numero, 801, y, { size: 6 });
      // this.txtPlanilla(pagina, font, etiqueta(j), 815, y, { size: 6 });
    // });
    // jugadoresB.forEach((j, i) => {
      // const y = startY - i * rowH;
      // this.txtPlanilla(pagina, font, j.numero, 848, y, { size: 6 });
      // this.txtPlanilla(pagina, font, etiqueta(j), 862, y, { size: 6 });
    // });

    // const liberosA = jugadoresA.filter(j => j.libero).map(j => j.numero).join(', ');
    // const liberosB = jugadoresB.filter(j => j.libero).map(j => j.numero).join(', ');
    // this.txtPlanilla(pagina, font, liberosA, 805, 140, { size: 6 });
    // this.txtPlanilla(pagina, font, liberosB, 850, 140, { size: 6 });

    // const filasOficiales: [string, number][] = [
      // ['entrenador', 120],
      // ['primer_asistente', 109],
      // ['segundo_asistente', 98],
      // ['fisioterapeuta', 87],
      // ['medico', 76],
    // ];
    // for (const [campo, y] of filasOficiales) {
      // const valor = [equipoA?.[campo], equipoB?.[campo]].filter(Boolean).join(' / ');
      // this.txtPlanilla(pagina, font, valor, 805, y, { size: 5.5 });
    // }
  }

  // Recuadro SANCTIONS (11 filas) e IMPROPER REQUEST, medidos en
  // planilla_3.pdf (bloque inferior: no lleva H). Por cada sanción, en
  // orden cronológico: N° del jugador (o "D" si es por demora) en la columna
  // que corresponda, letra del equipo, set y marcador en ese momento
  // (equipo sancionado primero).
  //   tarjeta amarilla -> W, tarjeta roja -> P, expulsión -> E
  //   demora: la 1ª de cada equipo en el partido -> "D" en W; las siguientes -> "D" en P
  //   solicitud improcedente: la 1ª de cada equipo -> X en su letra de
  //   IMPROPER REQUEST; las siguientes se registran como demora.
  private dibujarSancionesPlanilla(pagina: PDFPage, font: PDFFont, partido: any) {
    const LINEAS = [162.25, 153.24, 144.23, 135.22, 126.21, 117.07, 108.06, 99.05, 90.04, 81.03, 72.02, 63.01];
    const COLUMNAS: Record<string, [number, number]> = { W: [23.52, 42.60], P: [42.60, 61.68], E: [61.68, 80.64], D: [80.64, 99.72] };
    const CIRCULOS_IMPROCEDENTE = { A: 127.7, B: 155.4 };
    const otro = (e: 'A' | 'B'): 'A' | 'B' => e === 'A' ? 'B' : 'A';
    const demoras = { A: 0, B: 0 };
    const improcedentes = { A: 0, B: 0 };
    const filas: { col: string, texto: any, equipo: 'A' | 'B', set: number, marcador: [number, number] }[] = [];

    for (let n = 1; n <= (partido.numero_sets || 3); n++) {
      const set = partido[`set_${n}`];
      if (!set?.logs) continue;
      const m = { A: 0, B: 0 };
      for (const l of [...set.logs].reverse()) {
        const e: 'A' | 'B' = l.equipo === 'B' ? 'B' : 'A';
        const marcador: [number, number] = [m[e], m[otro(e)]];
        let col: string | null = null, texto: any = null;
        if (l.tipo === 6) { col = 'W'; texto = l.jugador; }
        else if (l.tipo === 7) { col = 'P'; texto = l.jugador; }
        else if (l.tipo === 9) { col = 'E'; texto = l.jugador; }
        else if (l.tipo === 5 || (l.tipo === 8 && improcedentes[e]++ > 0)) { col = demoras[e]++ === 0 ? 'W' : 'P'; texto = 'D'; }
        if (col) filas.push({ col, texto, equipo: e, set: n, marcador });
        // El marcador se actualiza después: la sanción se anota con el
        // marcador previo al punto de castigo de la tarjeta roja.
        if (l.tipo === 1) m[e]++;
        if (l.tipo === 7) m[otro(e)]++;
      }
    }

    filas.slice(0, LINEAS.length - 1).forEach((f, i) => {
      const techo = LINEAS[i], piso = LINEAS[i + 1];
      const y = piso + (techo - piso - font.heightAtSize(7, { descender: false })) / 2;
      const [x0, x1] = COLUMNAS[f.col];
      this.centradoEnCajaPlanilla(pagina, font, f.texto, x0, y, x1 - x0, null, 7);
      this.centradoEnCajaPlanilla(pagina, font, f.equipo, 99.72, y, 12.12, null, 7);
      this.centradoEnCajaPlanilla(pagina, font, f.set, 111.84, y, 16.92, null, 7);
      this.marcadorPlanilla(pagina, font, f.marcador, 146.28, y);
    });

    for (const e of ['A', 'B'] as const) {
      if (!improcedentes[e]) continue;
      const cx = CIRCULOS_IMPROCEDENTE[e], cy = 188.0;
      this.lineaPlanilla(pagina, cx - 2.4, cy - 2.4, cx + 2.4, cy + 2.4);
      this.lineaPlanilla(pagina, cx - 2.4, cy + 2.4, cx + 2.4, cy - 2.4);
    }

    // const columnaPorTipo: Record<number, number> = { 5: 25, 6: 68, 7: 108, 9: 148 }; // W,P,E,D
    // let fila = 0;
    // for (let n = 1; n <= 5; n++) {
      // const set = partido[`set_${n}`];
      // if (!set) continue;
      // const logsCronologicos = [...(set.logs || [])].reverse();
      // let scoreA = 0, scoreB = 0;
      // for (const l of logsCronologicos) {
        // if (l.tipo === 1) { if (l.equipo === 'A') scoreA++; else scoreB++; }
        // if (l.tipo === 7) { if (l.equipo === 'A') scoreB++; else scoreA++; }
        // if (columnaPorTipo[l.tipo]) {
          // const y = 155 - fila * 13.5;
          // this.txtPlanilla(pagina, font, l.jugador, columnaPorTipo[l.tipo], y, { size: 6 });
          // this.txtPlanilla(pagina, font, l.equipo, 185, y, { size: 6 });
          // this.txtPlanilla(pagina, font, n, 215, y, { size: 6 });
          // this.txtPlanilla(pagina, font, `${scoreA}:${scoreB}`, 250, y, { size: 6 });
          // fila++;
        // }
      // }
    // }

    // let improcedenteA = 0, improcedenteB = 0;
    // for (let n = 1; n <= 5; n++) {
      // const logs = partido[`set_${n}`]?.logs || [];
      // improcedenteA += logs.filter((l: any) => l.tipo === 8 && l.equipo === 'A').length;
      // improcedenteB += logs.filter((l: any) => l.tipo === 8 && l.equipo === 'B').length;
    // }
    // this.txtPlanilla(pagina, font, improcedenteA || '', 200, 193, { size: 7 });
    // this.txtPlanilla(pagina, font, improcedenteB || '', 245, 193, { size: 7 });
  }

  // Intenta incrustar la imagen PNG de una firma guardada en el filesystem
  // del dispositivo. Si no existe o falla la lectura, no dibuja nada.
  // Dibuja la firma guardada (PNG en el filesystem) centrada dentro de la
  // caja (x, y, ancho, alto), escalada para caber sin deformarse. Si no
  // existe o falla la lectura, deja la casilla en blanco.
  private async dibujarFirmaPlanilla(pdfDoc: PDFDocument, pagina: PDFPage, nombreArchivo: string, x: number, y: number, ancho: number, alto: number) {
    if (!nombreArchivo) return;
    try {
      const contenido = await Filesystem.readFile({ path: nombreArchivo, directory: Directory.Data, encoding: Encoding.UTF8 });
      const bytes = await this.prepararFirmaPlanilla(contenido.data as string);
      const imagen = await pdfDoc.embedPng(bytes);
      const escala = Math.min(ancho / imagen.width, alto / imagen.height);
      const w = imagen.width * escala, h = imagen.height * escala;
      pagina.drawImage(imagen, { x: x + (ancho - w) / 2, y: y + (alto - h) / 2, width: w, height: h });
    } catch (e) {
      // Firma no disponible: se deja la casilla en blanco.
    }
  }

  // Deja la firma lista para la planilla: recorta el margen vacío alrededor
  // del trazo (el lienzo de firma ocupa toda la pantalla) y pinta el trazo
  // del mismo azul "lápiz" del resto de la planilla (la firma se dibuja con
  // el color del tema, que en modo oscuro es casi blanco y no se vería en
  // papel). Si algo falla, devuelve la imagen original.
  private async prepararFirmaPlanilla(base64: string): Promise<Uint8Array> {
    const original = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    try {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const datos = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = datos.data;

      // Trazo = píxeles no transparentes; si la imagen no tiene
      // transparencia (fondo opaco), trazo = lo que difiere del color de la
      // esquina superior izquierda (el fondo).
      const conTransparencia = px.some((_, i) => i % 4 === 3 && px[i] < 250);
      const [fr, fg, fb] = [px[0], px[1], px[2]];
      const esTrazo = (i: number) => conTransparencia
        ? px[i + 3] > 40
        : Math.abs(px[i] - fr) + Math.abs(px[i + 1] - fg) + Math.abs(px[i + 2] - fb) > 90;

      let x0 = canvas.width, y0 = canvas.height, x1 = -1, y1 = -1;
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (esTrazo(i)) {
            px[i] = 0; px[i + 1] = 91; px[i + 2] = 172; px[i + 3] = 255;
            if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          } else {
            px[i + 3] = 0;
          }
        }
      }
      if (x1 < 0) return original; // sin trazo: se deja tal cual

      ctx.putImageData(datos, 0, 0);
      const margen = 4;
      const recorte = document.createElement('canvas');
      recorte.width = x1 - x0 + 1 + margen * 2;
      recorte.height = y1 - y0 + 1 + margen * 2;
      recorte.getContext('2d')!.drawImage(canvas, x0 - margen, y0 - margen, recorte.width, recorte.height, 0, 0, recorte.width, recorte.height);
      const dataUrl = recorte.toDataURL('image/png');
      return Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0));
    } catch {
      return original;
    }
  }

  private async dibujarAprobacionYFirmasPlanilla(pdfDoc: PDFDocument, pagina: PDFPage, font: PDFFont, fontBold: PDFFont, partido: any) {
    // Bloque SIGNATURES (bajo la nómina): firmas iniciales (antes del set 1)
    // de capitán y entrenador. Columna izquierda = equipo N°1 y derecha =
    // equipo N°2, igual que la nómina; las firmas se guardan por lado A/B,
    // así que se busca la del lado que le tocó a cada equipo en el sorteo.
    // Cajas = espacio libre bajo los rótulos "Team Captain" / "Coach",
    // medido en planilla_3.pdf (bloque inferior: no lleva H).
    const columnasFirmas: [any, number][] = [[partido.equipo_1, 697.0], [partido.equipo_2, 782.2]];
    for (const [equipo, x] of columnasFirmas) {
      const lado = equipo?.lado === 'A' ? 'a' : equipo?.lado === 'B' ? 'b' : null;
      if (!lado) continue;
      await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido[`firma_inicio_capitan_${lado}`], x, 54.4, 82.2, 11.0);
      await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido[`firma_entrenador_${lado}`], x, 33.8, 82.2, 12.7);
    }

    // APPROVAL (medido en planilla_3.pdf): árbitros, planilleros y jueces
    // de línea con el mismo formato que los jugadores (inicial + apellido),
    // y sus firmas en la columna Signature. País: no se registra en la app.
    const tamano = 8;
    const base = (techo: number, piso: number) => piso + (techo - piso - font.heightAtSize(tamano, { descender: false })) / 2;
    const nombre = (v: any) => this.nombreCortoJugadorPlanilla(v);
    const oficialesPartido: [string, string, number, number][] = [
      ['primer_arbitro', 'firma_primer_arbitro', 117.07, 105.06],
      ['segundo_arbitro', 'firma_segundo_arbitro', 105.06, 93.04],
      ['planillero', 'firma_planillero', 93.04, 81.03],
      ['asistente_planillero', 'firma_asistente_planillero', 81.03, 69.01],
    ];
    for (const [campo, firma, techo, piso] of oficialesPartido) {
      this.txtPlanilla(pagina, font, nombre(partido[campo]), 198.5, base(techo, piso), { size: tamano });
      // Country: código de 3 letras (mismo criterio que el país del partido).
      this.centradoEnCajaPlanilla(pagina, font, this.codigoPaisPlanilla(partido[campo + '_pais']), 357.6, base(techo, piso), 39.7, null, tamano);
      await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido[firma], 399.5, piso + 0.8, 116.0, techo - piso - 1.6);
    }

    // Jueces de línea: 1 y 3 a la izquierda (el N° va impreso al borde
    // derecho de la celda), 2 y 4 a la derecha (N° impreso al borde izquierdo).
    this.txtPlanilla(pagina, font, nombre(partido.primer_banderin), 173.5, base(69.01, 56.88), { size: tamano });
    this.txtPlanilla(pagina, font, nombre(partido.segundo_banderin), 367.0, base(69.01, 56.88), { size: tamano });
    this.txtPlanilla(pagina, font, nombre(partido.tercer_banderin), 173.5, base(56.88, 44.86), { size: tamano });
    this.txtPlanilla(pagina, font, nombre(partido.cuarto_banderin), 367.0, base(56.88, 44.86), { size: tamano });

    // Team Captains: firmas finales (después del partido), A junto al
    // círculo A y B junto al B.
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_fin_capitan_a, 172.5, 33.6, 140.0, 10.5);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_fin_capitan_b, 371.0, 33.6, 144.5, 10.5);

    // this.txtPlanilla(pagina, font, partido.primer_arbitro, 335, 112, { size: 6.5 });
    // this.txtPlanilla(pagina, font, partido.segundo_arbitro, 335, 95, { size: 6.5 });
    // this.txtPlanilla(pagina, font, partido.planillero, 335, 78, { size: 6.5 });
    // this.txtPlanilla(pagina, font, partido.asistente_planillero, 335, 62, { size: 6.5 });
    // this.txtPlanilla(pagina, font, partido.primer_banderin, 565, 18, { size: 6 });
    // this.txtPlanilla(pagina, font, partido.segundo_banderin, 620, 18, { size: 6 });
    // this.txtPlanilla(pagina, font, partido.tercer_banderin, 565, 6, { size: 6 });
    // this.txtPlanilla(pagina, font, partido.cuarto_banderin, 620, 6, { size: 6 });

    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_primer_arbitro, 530, 108, 90, 14);
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_segundo_arbitro, 530, 91, 90, 14);
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_planillero, 530, 74, 90, 14);
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_asistente_planillero, 530, 58, 90, 14);

    // const equipoA = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'A');
    // const equipoB = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'B');
    // const capitanA = equipoA?.jugadores?.find((j: any) => j.capitan)?.numero;
    // const capitanB = equipoB?.jugadores?.find((j: any) => j.capitan)?.numero;
    // this.txtPlanilla(pagina, font, capitanA, 518, 5, { size: 7 });
    // this.txtPlanilla(pagina, font, capitanB, 592, 5, { size: 7 });

    // // Firmas de capitanes, entrenadores (bloque de SIGNATURES junto al roster)
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_fin_capitan_a || partido.firma_inicio_capitan_a, 805, 38, 40, 12);
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_fin_capitan_b || partido.firma_inicio_capitan_b, 850, 38, 40, 12);
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_entrenador_a, 805, 10, 40, 12);
    // await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_entrenador_b, 850, 10, 40, 12);
  }

  private dibujarResultadosPlanilla(pagina: PDFPage, font: PDFFont, fontBold: PDFFont, partido: any, nombreA: string, nombreB: string) {
    // Encabezado de RESULTS: equipo A (según el sorteo inicial) en la caja
    // junto al círculo A y equipo B junto al B, abreviados, una letra por
    // casilla. Bloque inferior: no se desplaza en la plantilla de 5 sets.
    this.casillasPlanilla(pagina, font, this.abreviarEquipoPlanilla(nombreA), 548.4, 12, 3, 175.3, 10);
    this.casillasPlanilla(pagina, font, this.abreviarEquipoPlanilla(nombreB), 628.3, 12, 3, 175.3, 10);

    // Tabla por set: "T" (tiempos), S (sustituciones, incluye regresos),
    // W (1 si ganó el set) y P (puntos); A a la izquierda y B a la derecha.
    // En la columna SET va la duración del set en minutos. La última fila
    // (junto a "Total Set Duration") lleva los totales.
    const COLS = {
      A: { T: [523.78, 537.10], S: [537.10, 551.14], W: [551.14, 565.06], P: [565.06, 582.46] },
      B: { P: [630.58, 647.74], W: [647.74, 661.90], S: [661.90, 675.70], T: [675.70, 689.86] },
    } as Record<'A' | 'B', Record<string, number[]>>;
    const FILAS_SETS = [[154.56, 139.54], [139.54, 124.40], [124.40, 109.38]];
    const FILA_TOTAL = [79.35, 64.33];
    const tamano = 8;
    const base = (techo: number, piso: number, size = tamano) => piso + (techo - piso - font.heightAtSize(size, { descender: false })) / 2;
    const enCelda = (v: any, [x0, x1]: number[], y: number) => this.centradoEnCajaPlanilla(pagina, font, v, x0, y, x1 - x0, null, tamano);
    // Minutos "de reloj" (como se anotan las horas en la planilla).
    const minutos = (d: any) => Math.floor(new Date(d).getTime() / 60000);
    const duracion = (ini: any, fin: any) => (ini && fin) ? minutos(fin) - minutos(ini) : null;

    const total: any = { A: { T: 0, S: 0, W: 0, P: 0 }, B: { T: 0, S: 0, W: 0, P: 0 } };
    let totalSets = 0;
    const sets = [1, 2, 3].map(n => partido[`set_${n}`]);
    sets.forEach((set, i) => {
      if (!set?.logs || !(set.victoria || set.logs.length)) return;
      const [techo, piso] = FILAS_SETS[i];
      const y = base(techo, piso);
      for (const e of ['A', 'B'] as const) {
        const v = {
          T: set.logs.filter((l: any) => l.tipo === 4 && l.equipo === e).length,
          S: set.logs.filter((l: any) => (l.tipo === 2 || l.tipo === 3) && l.equipo === e).length,
          W: set.victoria === e ? 1 : 0,
          P: this.contarPuntos(set, e),
        };
        for (const k of ['T', 'S', 'W', 'P']) {
          enCelda((v as any)[k], COLS[e][k], y);
          total[e][k] += (v as any)[k];
        }
      }
      const d = duracion(set.hora_inicio, set.hora_fin);
      if (d !== null) {
        totalSets += d;
        // Entre los paréntesis impresos "( ... )" de la columna SET.
        this.centradoEnCajaPlanilla(pagina, font, d, 600.5, y, 27, null, tamano);
      }
    });

    const yTotal = base(FILA_TOTAL[0], FILA_TOTAL[1]);
    for (const e of ['A', 'B'] as const) for (const k of ['T', 'S', 'W', 'P']) enCelda(total[e][k], COLS[e][k], yTotal);
    // "( ___ mn )" de Total Set Duration.
    this.centradoEnCajaPlanilla(pagina, font, totalSets, 587.5, 68.1, 26, null, 9);

    // Hora de inicio (inicio del set 1), de término (fin del último set
    // jugado) y duración total del partido, sobre los puntos "...... h ...... mn".
    const jugados = sets.filter(s => s?.hora_inicio);
    const inicio = jugados[0]?.hora_inicio;
    const fin = [...sets].reverse().find(s => s?.hora_fin)?.hora_fin;
    const hm = (x: number, xMn: number, hh: any, mm: any) => {
      this.centradoEnCajaPlanilla(pagina, font, hh, x - 5, 51.0, 10, null, tamano);
      this.centradoEnCajaPlanilla(pagina, font, mm, xMn - 5, 51.0, 10, null, tamano);
    };
    const hi = this.fmtHoraPlanilla(inicio), hf = this.fmtHoraPlanilla(fin);
    if (hi) hm(534.6, 553.1, hi.hh, hi.mm);
    if (hf) hm(591.6, 610.1, hf.hh, hf.mm);
    const dPartido = duracion(inicio, fin);
    if (dPartido !== null) hm(649.9, 668.4, Math.floor(dPartido / 60), String(dPartido % 60).padStart(2, '0'));

    // WINNER: equipo ganador abreviado (una letra por casilla) y los sets
    // del perdedor después del "2 :" impreso.
    if (total.A.W !== total.B.W && (total.A.W >= 2 || total.B.W >= 2)) {
      const ganadorA = total.A.W > total.B.W;
      this.casillasPlanilla(pagina, font, this.abreviarEquipoPlanilla(ganadorA ? nombreA : nombreB), 588.46, 12, 3, 36.6, 10);
      this.centradoEnCajaPlanilla(pagina, font, ganadorA ? total.B.W : total.A.W, 666.1, 36.0, 10, null, 14);
    }

    // this.txtPlanilla(pagina, font, nombreA, 595, 178, { size: 6.5 });
    // this.txtPlanilla(pagina, font, nombreB, 685, 178, { size: 6.5 });

    // let ganadosA = 0, ganadosB = 0;
    // let totalMs = 0;
    // for (let n = 1; n <= partido.numero_sets; n++) {
      // const set = partido[`set_${n}`];
      // if (!set) continue;
      // const puntos = this.puntajeEnIndicePlanilla(set, 0);
      // const y = 145 - (n - 1) * 23;
      // const tiemposA = (set.logs || []).filter((l: any) => l.tipo === 4 && l.equipo === 'A').length;
      // const tiemposB = (set.logs || []).filter((l: any) => l.tipo === 4 && l.equipo === 'B').length;
      // const cambiosA = (set.logs || []).filter((l: any) => l.tipo === 2 && l.equipo === 'A').length;
      // const cambiosB = (set.logs || []).filter((l: any) => l.tipo === 2 && l.equipo === 'B').length;

      // this.txtPlanilla(pagina, font, tiemposA || '', 575, y, { size: 6 });
      // this.txtPlanilla(pagina, font, cambiosA || '', 605, y, { size: 6 });
      // this.txtPlanilla(pagina, font, set.victoria === 'A' ? 'X' : '', 635, y, { size: 6 });
      // this.txtPlanilla(pagina, font, puntos.A, 655, y, { size: 6 });
      // this.txtPlanilla(pagina, font, puntos.B, 725, y, { size: 6 });
      // this.txtPlanilla(pagina, font, set.victoria === 'B' ? 'X' : '', 750, y, { size: 6 });
      // this.txtPlanilla(pagina, font, cambiosB || '', 770, y, { size: 6 });
      // this.txtPlanilla(pagina, font, tiemposB || '', 782, y, { size: 6 });

      // if (set.victoria === 'A') ganadosA++;
      // if (set.victoria === 'B') ganadosB++;
      // if (set.hora_inicio && set.hora_fin) {
        // const inicio = new Date(set.hora_inicio).getTime();
        // const fin = new Date(set.hora_fin).getTime();
        // this.txtPlanilla(pagina, font, Math.round((fin - inicio) / 60000), 703, y, { size: 6 });
        // totalMs += (fin - inicio);
      // }
    // }
    // if (totalMs > 0) this.txtPlanilla(pagina, font, Math.round(totalMs / 60000), 700, 68, { size: 6.5 });

    // const ganador = ganadosA > ganadosB ? 'A' : (ganadosB > ganadosA ? 'B' : null);
    // if (ganador) {
      // this.txtPlanilla(pagina, font, ganador === 'A' ? nombreA : nombreB, 613, 25, { size: 7, bold: true, fontBold });
      // this.txtPlanilla(pagina, font, ganador === 'A' ? ganadosB : ganadosA, 740, 25, { size: 8, bold: true, fontBold });
    // }
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

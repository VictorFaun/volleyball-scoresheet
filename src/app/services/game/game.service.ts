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

    this.volverAOrigen();
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
      fechas: []
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
  // de sus partidos ya creados (no archivados), para que no queden con un
  // nombre desactualizado.
  async renombrarCompetencia(competencia: any, nuevoNombre: string) {
    competencia.nombre = nuevoNombre;
    const partidosDeLaCompetencia = this.partidos.filter((p: any) => p.competencia_id === competencia.id && !p.archivado);
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

      const H = es3Sets ? 0 : this.PLANILLA_OFFSET_5_SETS;
      // Origen = inicio de la columna "I" de titulares (no el borde de la caja:
      // a la izquierda de eso va la franja de etiquetas "Team line-up" + el
      // dígito grande del N° de set, que no se repite en la segunda caja).
      const BOX1_X = 139.9, BOX2_X = 515.0;

      const equipoA = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'A');
      const equipoB = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'B');
      const nombreA = equipoA?.nombre || '';
      const nombreB = equipoB?.nombre || '';

      this.dibujarCabeceraPlanilla(pagina, font, partido, equipoA, equipoB, H);

      // planilla_3.pdf (imagen escaneada) y planilla_5.pdf (PDF vectorial) NO
      // comparten el mismo layout absoluto pese a verse casi iguales, así que
      // cada plantilla usa su propio "top" medido directamente contra su
      // archivo. Dentro de una misma plantilla, la fila de sets 1-2 (y 3-4 en
      // la de 5 sets) sí comparte el mismo patrón, solo que la de 5 sets
      // agrega la cabecera desplazada por H.
      const topNormal = es3Sets ? 440 : 431;
      const topDecisivo = es3Sets ? 310 : 292;

      this.dibujarSetPlanilla(pagina, font, partido.set_1, BOX1_X, topNormal + H, false, nombreA, nombreB, es3Sets);
      this.dibujarSetPlanilla(pagina, font, partido.set_2, BOX2_X, topNormal + H, false, nombreA, nombreB, es3Sets);
      if (!es3Sets) {
        this.dibujarSetPlanilla(pagina, font, partido.set_3, BOX1_X, topNormal, false, nombreA, nombreB, es3Sets);
        this.dibujarSetPlanilla(pagina, font, partido.set_4, BOX2_X, topNormal, false, nombreA, nombreB, es3Sets);
        this.dibujarSetPlanilla(pagina, font, partido.set_5, BOX1_X, topDecisivo, true, nombreA, nombreB, es3Sets);
      } else {
        this.dibujarSetPlanilla(pagina, font, partido.set_3, BOX1_X, topDecisivo, true, nombreA, nombreB, es3Sets);
      }

      this.dibujarRosterPlanilla(pagina, font, partido);
      this.dibujarSancionesPlanilla(pagina, font, partido);
      await this.dibujarAprobacionYFirmasPlanilla(pdfDoc, pagina, font, fontBold, partido);
      this.dibujarResultadosPlanilla(pagina, font, fontBold, partido, nombreA, nombreB);

      const pdfBytesModificado = await pdfDoc.save();
      this.descargarPdf(pdfBytesModificado, `planilla_partido_${partido.numero_partido || 'final'}.pdf`);
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

  private dibujarCabeceraPlanilla(pagina: PDFPage, font: PDFFont, partido: any, equipoA: any, equipoB: any, H: number) {
    const AZ = this.PLANILLA_AZUL();
    const t = (v: any, x: number, y: number, size = 10) => this.txtPlanilla(pagina, font, v, x, y + H, { size, color: AZ });

    t(partido.competicion, 140, 490);
    t(partido.ciudad, 60, 474);
    t(partido.pais ? String(partido.pais).slice(0, 3).toUpperCase() : '', 300, 474);
    t(partido.gimnasio, 60, 461);

    if (partido.numero_partido > 10) {
      t(partido.numero_partido, 312, 461);
    } else if (partido.numero_partido !== null && partido.numero_partido !== undefined) {
      t('0', 312, 461);
      t(partido.numero_partido, 325, 461);
    }

    if (partido.fecha) {
      const [d, m, a] = partido.fecha.split('/');
      t(d, 364, 474); t(m, 386, 474); t(a, 411, 474);
    }
    if (partido.hora) {
      const [h, mn] = partido.hora.split(':');
      t(h, 470, 474); t(mn, 495, 474);
    }

    t('A', 358, 451);
    t(equipoA?.nombre, 373, 451);
    t('B', 500, 451);
    t(equipoB?.nombre, 455, 451);

    // Division / Categoria: texto libre, se marca la casilla si calza con las
    // opciones fijas de la plantilla (Men/Women, Senior/Junior/Youth).
    const div = String(partido.division || '').toLowerCase();
    if (/mujer|dama|fem|women/.test(div)) this.txtPlanilla(pagina, font, 'X', 147, 447 + H, { size: 8 });
    else if (/hombre|var[oó]n|masc|men/.test(div)) this.txtPlanilla(pagina, font, 'X', 88, 447 + H, { size: 8 });

    const cat = String(partido.categoria || '').toLowerCase();
    if (/senior|mayor|adult/.test(cat)) this.txtPlanilla(pagina, font, 'X', 252, 447 + H, { size: 8 });
    else if (/junior/.test(cat)) this.txtPlanilla(pagina, font, 'X', 307, 447 + H, { size: 8 });
    else if (/youth|infantil|menor/.test(cat)) this.txtPlanilla(pagina, font, 'X', 367, 447 + H, { size: 8 });
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
    if (!set) return;
    const cols = this.columnasSetPlanilla(origenX);
    const filasPuntos = esDecisivo ? 10 : 12;
    const rc = this.coordenadasFilaSetPlanilla(top, filasPuntos, es3Sets);

    const hi = this.fmtHoraPlanilla(set.hora_inicio);
    const hf = this.fmtHoraPlanilla(set.hora_fin);
    if (hi) { this.txtPlanilla(pagina, font, hi.hh, origenX + 26, rc.yLabelSub, { size: 5.5 }); this.txtPlanilla(pagina, font, hi.mm, origenX + 38, rc.yLabelSub, { size: 5.5 }); }
    if (hf) { this.txtPlanilla(pagina, font, hf.hh, origenX + 293, rc.yLabelSub, { size: 5.5 }); this.txtPlanilla(pagina, font, hf.mm, origenX + 305, rc.yLabelSub, { size: 5.5 }); }

    // El lado izquierdo/derecho de la caja depende de qué equipo quedó a la
    // izquierda en ese set (set.lado_izquierda).
    const equipoIzq = set.lado_izquierda === 'A' ? nombreA : nombreB;
    const equipoDer = set.lado_izquierda === 'A' ? nombreB : nombreA;
    this.txtPlanilla(pagina, font, equipoIzq, origenX + 78, rc.yLabel, { size: 6.5 });
    this.txtPlanilla(pagina, font, equipoDer, origenX + 210, rc.yLabel, { size: 6.5 });

    const alinA: number[] = set.alineacion_a || [];
    const alinB: number[] = set.alineacion_b || [];
    cols.IVI_A.forEach((x, i) => this.txtPlanilla(pagina, font, alinA[i], x, rc.yTitular, { size: 6.5 }));
    cols.IVI_B.forEach((x, i) => this.txtPlanilla(pagina, font, alinB[i], x, rc.yTitular, { size: 6.5 }));

    const subs = this.construirSustitucionesPlanilla(set, { A: alinA, B: alinB });
    for (const [equipo, colXs] of [['A', cols.IVI_A], ['B', cols.IVI_B]] as const) {
      for (let i = 0; i < 6; i++) {
        const s = subs[equipo][i];
        if (s) {
          this.txtPlanilla(pagina, font, s.entra, colXs[i], rc.ySubJugador, { size: 6 });
          this.txtPlanilla(pagina, font, s.puntaje[equipo], colXs[i], rc.ySubPuntaje, { size: 6 });
        }
      }
    }

    // Grilla de puntos: numeración secuencial simple por equipo (1,2,3,...),
    // en la fila correspondiente al resto de dividir por la cantidad de filas
    // de la caja, avanzando de banda cuando se supera esa cantidad (igual al
    // esquema "1 13 25 37" / "1 11 21" preimpreso en la plantilla).
    const logsCronologicos = [...(set.logs || [])].reverse();
    let scoreA = 0, scoreB = 0;
    const escribirPunto = (equipo: 'A' | 'B', n: number, cols4: number[]) => {
      const banda = Math.floor((n - 1) / filasPuntos);
      const fila = ((n - 1) % filasPuntos) + 1;
      this.txtPlanilla(pagina, font, n, cols4[Math.min(banda, cols4.length - 1)], rc.filaPunto(fila), { size: 4.3 });
    };
    for (const l of logsCronologicos) {
      if (l.tipo === 1) {
        if (l.equipo === 'A') { scoreA++; escribirPunto('A', scoreA, cols.PTS_A); }
        else { scoreB++; escribirPunto('B', scoreB, cols.PTS_B); }
      } else if (l.tipo === 7) {
        // Tarjeta roja: punto para el equipo contrario al sancionado.
        if (l.equipo === 'A') { scoreB++; escribirPunto('B', scoreB, cols.PTS_B); }
        else { scoreA++; escribirPunto('A', scoreA, cols.PTS_A); }
      } else if (l.tipo === 4) {
        const x = l.equipo === 'A' ? cols.PTS_A[0] : cols.PTS_B[0];
        this.txtPlanilla(pagina, font, `${scoreA}:${scoreB}`, x - 2, rc.yTiempo, { size: 4.3 });
      }
    }
  }

  private dibujarRosterPlanilla(pagina: PDFPage, font: PDFFont, partido: any) {
    const equipoA = partido.equipo_1?.lado === 'A' ? partido.equipo_1 : partido.equipo_2;
    const equipoB = partido.equipo_1?.lado === 'B' ? partido.equipo_1 : partido.equipo_2;
    const jugadoresA: any[] = equipoA?.jugadores || [];
    const jugadoresB: any[] = equipoB?.jugadores || [];
    const startY = 273, rowH = 13;

    const etiqueta = (j: any) => (j.nombre || '') + (j.capitan ? ' (C)' : '') + (j.libero ? ' (L)' : '');
    jugadoresA.forEach((j, i) => {
      const y = startY - i * rowH;
      this.txtPlanilla(pagina, font, j.numero, 801, y, { size: 6 });
      this.txtPlanilla(pagina, font, etiqueta(j), 815, y, { size: 6 });
    });
    jugadoresB.forEach((j, i) => {
      const y = startY - i * rowH;
      this.txtPlanilla(pagina, font, j.numero, 848, y, { size: 6 });
      this.txtPlanilla(pagina, font, etiqueta(j), 862, y, { size: 6 });
    });

    const liberosA = jugadoresA.filter(j => j.libero).map(j => j.numero).join(', ');
    const liberosB = jugadoresB.filter(j => j.libero).map(j => j.numero).join(', ');
    this.txtPlanilla(pagina, font, liberosA, 805, 140, { size: 6 });
    this.txtPlanilla(pagina, font, liberosB, 850, 140, { size: 6 });

    const filasOficiales: [string, number][] = [
      ['entrenador', 120],
      ['primer_asistente', 109],
      ['segundo_asistente', 98],
      ['fisioterapeuta', 87],
      ['medico', 76],
    ];
    for (const [campo, y] of filasOficiales) {
      const valor = [equipoA?.[campo], equipoB?.[campo]].filter(Boolean).join(' / ');
      this.txtPlanilla(pagina, font, valor, 805, y, { size: 5.5 });
    }
  }

  private dibujarSancionesPlanilla(pagina: PDFPage, font: PDFFont, partido: any) {
    const columnaPorTipo: Record<number, number> = { 5: 25, 6: 68, 7: 108, 9: 148 }; // W,P,E,D
    let fila = 0;
    for (let n = 1; n <= 5; n++) {
      const set = partido[`set_${n}`];
      if (!set) continue;
      const logsCronologicos = [...(set.logs || [])].reverse();
      let scoreA = 0, scoreB = 0;
      for (const l of logsCronologicos) {
        if (l.tipo === 1) { if (l.equipo === 'A') scoreA++; else scoreB++; }
        if (l.tipo === 7) { if (l.equipo === 'A') scoreB++; else scoreA++; }
        if (columnaPorTipo[l.tipo]) {
          const y = 155 - fila * 13.5;
          this.txtPlanilla(pagina, font, l.jugador, columnaPorTipo[l.tipo], y, { size: 6 });
          this.txtPlanilla(pagina, font, l.equipo, 185, y, { size: 6 });
          this.txtPlanilla(pagina, font, n, 215, y, { size: 6 });
          this.txtPlanilla(pagina, font, `${scoreA}:${scoreB}`, 250, y, { size: 6 });
          fila++;
        }
      }
    }

    let improcedenteA = 0, improcedenteB = 0;
    for (let n = 1; n <= 5; n++) {
      const logs = partido[`set_${n}`]?.logs || [];
      improcedenteA += logs.filter((l: any) => l.tipo === 8 && l.equipo === 'A').length;
      improcedenteB += logs.filter((l: any) => l.tipo === 8 && l.equipo === 'B').length;
    }
    this.txtPlanilla(pagina, font, improcedenteA || '', 200, 193, { size: 7 });
    this.txtPlanilla(pagina, font, improcedenteB || '', 245, 193, { size: 7 });
  }

  // Intenta incrustar la imagen PNG de una firma guardada en el filesystem
  // del dispositivo. Si no existe o falla la lectura, no dibuja nada.
  private async dibujarFirmaPlanilla(pdfDoc: PDFDocument, pagina: PDFPage, nombreArchivo: string, x: number, y: number, ancho: number, alto: number) {
    if (!nombreArchivo) return;
    try {
      const contenido = await Filesystem.readFile({ path: nombreArchivo, directory: Directory.Data, encoding: Encoding.UTF8 });
      const binario = atob(contenido.data as string);
      const bytes = new Uint8Array(binario.length);
      for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
      const imagen = await pdfDoc.embedPng(bytes);
      const escala = Math.min(ancho / imagen.width, alto / imagen.height);
      pagina.drawImage(imagen, { x, y, width: imagen.width * escala, height: imagen.height * escala });
    } catch (e) {
      // Firma no disponible: se deja la casilla en blanco.
    }
  }

  private async dibujarAprobacionYFirmasPlanilla(pdfDoc: PDFDocument, pagina: PDFPage, font: PDFFont, fontBold: PDFFont, partido: any) {
    this.txtPlanilla(pagina, font, partido.primer_arbitro, 335, 112, { size: 6.5 });
    this.txtPlanilla(pagina, font, partido.segundo_arbitro, 335, 95, { size: 6.5 });
    this.txtPlanilla(pagina, font, partido.planillero, 335, 78, { size: 6.5 });
    this.txtPlanilla(pagina, font, partido.asistente_planillero, 335, 62, { size: 6.5 });
    this.txtPlanilla(pagina, font, partido.primer_banderin, 565, 18, { size: 6 });
    this.txtPlanilla(pagina, font, partido.segundo_banderin, 620, 18, { size: 6 });
    this.txtPlanilla(pagina, font, partido.tercer_banderin, 565, 6, { size: 6 });
    this.txtPlanilla(pagina, font, partido.cuarto_banderin, 620, 6, { size: 6 });

    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_primer_arbitro, 530, 108, 90, 14);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_segundo_arbitro, 530, 91, 90, 14);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_planillero, 530, 74, 90, 14);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_asistente_planillero, 530, 58, 90, 14);

    const equipoA = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'A');
    const equipoB = [partido.equipo_1, partido.equipo_2].find((e: any) => e?.lado === 'B');
    const capitanA = equipoA?.jugadores?.find((j: any) => j.capitan)?.numero;
    const capitanB = equipoB?.jugadores?.find((j: any) => j.capitan)?.numero;
    this.txtPlanilla(pagina, font, capitanA, 518, 5, { size: 7 });
    this.txtPlanilla(pagina, font, capitanB, 592, 5, { size: 7 });

    // Firmas de capitanes, entrenadores (bloque de SIGNATURES junto al roster)
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_fin_capitan_a || partido.firma_inicio_capitan_a, 805, 38, 40, 12);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_fin_capitan_b || partido.firma_inicio_capitan_b, 850, 38, 40, 12);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_entrenador_a, 805, 10, 40, 12);
    await this.dibujarFirmaPlanilla(pdfDoc, pagina, partido.firma_entrenador_b, 850, 10, 40, 12);
  }

  private dibujarResultadosPlanilla(pagina: PDFPage, font: PDFFont, fontBold: PDFFont, partido: any, nombreA: string, nombreB: string) {
    this.txtPlanilla(pagina, font, nombreA, 595, 178, { size: 6.5 });
    this.txtPlanilla(pagina, font, nombreB, 685, 178, { size: 6.5 });

    let ganadosA = 0, ganadosB = 0;
    let totalMs = 0;
    for (let n = 1; n <= partido.numero_sets; n++) {
      const set = partido[`set_${n}`];
      if (!set) continue;
      const puntos = this.puntajeEnIndicePlanilla(set, 0);
      const y = 145 - (n - 1) * 23;
      const tiemposA = (set.logs || []).filter((l: any) => l.tipo === 4 && l.equipo === 'A').length;
      const tiemposB = (set.logs || []).filter((l: any) => l.tipo === 4 && l.equipo === 'B').length;
      const cambiosA = (set.logs || []).filter((l: any) => l.tipo === 2 && l.equipo === 'A').length;
      const cambiosB = (set.logs || []).filter((l: any) => l.tipo === 2 && l.equipo === 'B').length;

      this.txtPlanilla(pagina, font, tiemposA || '', 575, y, { size: 6 });
      this.txtPlanilla(pagina, font, cambiosA || '', 605, y, { size: 6 });
      this.txtPlanilla(pagina, font, set.victoria === 'A' ? 'X' : '', 635, y, { size: 6 });
      this.txtPlanilla(pagina, font, puntos.A, 655, y, { size: 6 });
      this.txtPlanilla(pagina, font, puntos.B, 725, y, { size: 6 });
      this.txtPlanilla(pagina, font, set.victoria === 'B' ? 'X' : '', 750, y, { size: 6 });
      this.txtPlanilla(pagina, font, cambiosB || '', 770, y, { size: 6 });
      this.txtPlanilla(pagina, font, tiemposB || '', 782, y, { size: 6 });

      if (set.victoria === 'A') ganadosA++;
      if (set.victoria === 'B') ganadosB++;
      if (set.hora_inicio && set.hora_fin) {
        const inicio = new Date(set.hora_inicio).getTime();
        const fin = new Date(set.hora_fin).getTime();
        this.txtPlanilla(pagina, font, Math.round((fin - inicio) / 60000), 703, y, { size: 6 });
        totalMs += (fin - inicio);
      }
    }
    if (totalMs > 0) this.txtPlanilla(pagina, font, Math.round(totalMs / 60000), 700, 68, { size: 6.5 });

    const ganador = ganadosA > ganadosB ? 'A' : (ganadosB > ganadosA ? 'B' : null);
    if (ganador) {
      this.txtPlanilla(pagina, font, ganador === 'A' ? nombreA : nombreB, 613, 25, { size: 7, bold: true, fontBold });
      this.txtPlanilla(pagina, font, ganador === 'A' ? ganadosB : ganadosA, 740, 25, { size: 8, bold: true, fontBold });
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

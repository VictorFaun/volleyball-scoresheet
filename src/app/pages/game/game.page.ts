import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import * as moment from 'moment';
import { AlertController, NavController } from '@ionic/angular';
import { ganadorPuntoLog } from 'src/app/services/game/partido-view.util';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit {

  set: any
  logs: any = []
  alineacion_a: any = []
  alineacion_b: any = []
  saque: any
  // Qué equipo arranca el set del lado izquierdo de la cancha.
  ladoIzquierda: 'A' | 'B' = 'A'
  constructor(private navCtrl: NavController, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController) { }

  // Si el Equipo B está a la izquierda, se invierte el orden visual del
  // marcador/cancha/botones (ver .orden-invertido en el scss), sin tocar
  // ninguna lógica de rotación/posición, que sigue siendo por equipo A/B.
  get invertido(): boolean {
    return this.ladoIzquierda === 'B';
  }

  // true si este set ya fue cerrado (tiene victoria registrada). Se llega a
  // verlo así al reingresar con "editar" desde el inicio del partido: se
  // puede recorrer y seguir avanzando, pero ya no se puede volver a jugar.
  get setFinalizado(): boolean {
    return !!this._game_.partido[`set_${this.set}`]?.victoria;
  }
  volver() {
    this._game_.guardar();
    this._game_.volverAOrigen();
  }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.set = params['set'];
      this.updateLogs()
    });
    console.log(this._game_.partido)
  }

  // Nombre del equipo que corresponde a un lado, para mostrarlo junto a la
  // letra ("A"/"B") en el marcador.
  nombreEquipoLado(lado: 'A' | 'B'): string {
    return this._game_.obtenerEquipoPorLado(lado)?.nombre || `Equipo ${lado}`;
  }

  updateLogs() {
    if (this.set == 1) {
      this.logs = this._game_.partido.set_1.logs
      this.alineacion_a = this._game_.partido.set_1.alineacion_a
      this.alineacion_b = this._game_.partido.set_1.alineacion_b
      this.saque = this._game_.partido.set_1.equipo_saque
      this.ladoIzquierda = this._game_.partido.set_1.lado_izquierda || 'A'
    }
    if (this.set == 2) {
      this.logs = this._game_.partido.set_2.logs
      this.alineacion_a = this._game_.partido.set_2.alineacion_a
      this.alineacion_b = this._game_.partido.set_2.alineacion_b
      this.saque = this._game_.partido.set_2.equipo_saque
      this.ladoIzquierda = this._game_.partido.set_2.lado_izquierda || 'A'
    }
    if (this.set == 3) {
      this.logs = this._game_.partido.set_3.logs
      this.alineacion_a = this._game_.partido.set_3.alineacion_a
      this.alineacion_b = this._game_.partido.set_3.alineacion_b
      this.saque = this._game_.partido.set_3.equipo_saque
      this.ladoIzquierda = this._game_.partido.set_3.lado_izquierda || 'A'
    }
    if (this.set == 4) {
      this.logs = this._game_.partido.set_4.logs
      this.alineacion_a = this._game_.partido.set_4.alineacion_a
      this.alineacion_b = this._game_.partido.set_4.alineacion_b
      this.saque = this._game_.partido.set_4.equipo_saque
      this.ladoIzquierda = this._game_.partido.set_4.lado_izquierda || 'A'
    }
    if (this.set == 5) {
      this.logs = this._game_.partido.set_5.logs
      this.alineacion_a = this._game_.partido.set_5.alineacion_a
      this.alineacion_b = this._game_.partido.set_5.alineacion_b
      this.saque = this._game_.partido.set_5.equipo_saque
      this.ladoIzquierda = this._game_.partido.set_5.lado_izquierda || 'A'
    }
  }

  async punto(equipo: any) {
    if (this.setFinalizado) return;
    this._game_.punto(this.set, equipo);
    this.updateLogs()
    await this.verificarCambioDeLado();
  }

  // Si la opción "Cambio de lado último set" está activa y este es el set
  // decisivo (3 a 3 sets, o 5 a 5 sets), avisa una sola vez por set cuando
  // algún equipo llega a 8 puntos, y al cerrar la alerta intercambia los
  // lados.
  async verificarCambioDeLado() {
    if (!this._game_.partido.cambio_lado_ultimo_set) return;

    const esSetDecisivo = this.set == 5 || (this.set == 3 && this._game_.partido.numero_sets == 3);
    if (!esSetDecisivo) return;

    const setActual = this._game_.partido[`set_${this.set}`];
    if (setActual.cambio_lado_realizado) return;

    if (this.contarPuntos('A') !== 8 && this.contarPuntos('B') !== 8) return;

    setActual.cambio_lado_realizado = true;

    const alert = await this.alertController.create({
      header: 'Cambio de lado',
      message: 'Los equipos deberán hacer un cambio de lado.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            setActual.lado_izquierda = this._game_.alternarEquipo(setActual.lado_izquierda);
            this.ladoIzquierda = setActual.lado_izquierda;

            // Se registra como log, ligado al punto n°8 que lo provocó (que
            // queda justo debajo): al deshacer, GameService.deshacer()
            // revierte ambos juntos en una sola acción.
            const logCambioLado: any = this._game_.clean_log();
            logCambioLado.tipo = 10;
            logCambioLado.hora = new Date();
            logCambioLado.equipo = setActual.lado_izquierda;
            this.logs.unshift(logCambioLado);
            this.updateLogs();

            this._game_.guardar();
          }
        }
      ]
    });
    await alert.present();
  }

  formatoHora(date: any) {
    return moment(date).format("HH:mm:ss").split(":")
  }

  textLog(tipo: any) {
    if (tipo == 1) {
      return "Punto"
    }
    if (tipo == 2) {
      return "Cambio"
    }
    if (tipo == 3) {
      return "Deshacer"
    }
    if (tipo == 4) {
      return "Tiempo"
    }
    if (tipo == 5) {
      return "Demora"
    }
    if (tipo == 6) {
      return "Tarjeta Amarilla"
    }
    if (tipo == 7) {
      return "Tarjeta Roja"
    }
    if (tipo == 8) {
      return "Solicitud improcedente"
    }
    if (tipo == 9) {
      return "Expulsión"
    }
    if (tipo == 10) {
      return "Cambio de lado"
    }
    if (tipo == 11) {
      return "Descalificación"
    }
    if (tipo == 12) {
      return "Cambio excepcional"
    }
    if (tipo == 13) {
      return "Equipo incompleto"
    }
    return tipo
  }

  async deshacer() {
    if (this.setFinalizado) return;
    if (!this.logs || this.logs.length === 0) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas deshacer la última acción?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, deshacer',
          handler: () => {
            this._game_.deshacer(this.set);
            this.updateLogs()
          }
        }
      ]
    });

    await alert.present();
  }
  contarPuntos(equipo: 'A' | 'B'): number {
    if (!this.logs || this.logs.length === 0) {
      return 0;
    }

    return this.logs.filter((log: any) => ganadorPuntoLog(log) === equipo).length;
  }

  // Puntos necesarios para ganar el set actual (15 en el set decisivo, 25 en el resto).
  puntosParaGanarSet(): number {
    return (this.set == 5 || (this.set == 3 && this._game_.partido.numero_sets == 3)) ? 15 : 25;
  }

  // El equipo ya está ganando el set (alcanzó el puntaje máximo con diferencia de 2).
  esGanadorSet(equipo: 'A' | 'B'): boolean {
    const propios = this.contarPuntos(equipo);
    const rival = this.contarPuntos(equipo === 'A' ? 'B' : 'A');
    return propios >= this.puntosParaGanarSet() && propios - rival >= 2;
  }

  async siguiente() {
    if (this.setFinalizado) {
      // Ya estaba cerrado (se reabrió con "editar"): solo se avanza, sin
      // volver a tocar logs/victoria/hora_fin ni recalcular nada.
      this._game_.continuarDespuesDeSetFinalizado(this.set);
      return;
    }
    this._game_.closeSet(this.set)
  }

  // Equipo que ganó el rally de un log, o null si el log no es un punto. Los
  // castigos (tarjeta roja y demora con castigo) cuentan como rally ganado
  // por el rival: le dan el punto y el saque (y, si no estaba sacando, rota).
  private ganadorRally(log: any): 'A' | 'B' | null {
    return ganadorPuntoLog(log);
  }

  contarRotaciones(equipo: "A" | "B"): number {
    let rotacionesA = 0;
    let rotacionesB = 0;
    let ultimoEquipo: string = this.saque;

    // Recorremos del más viejo al más nuevo (invirtiendo el arreglo)
    for (let i = this.logs.length - 1; i >= 0; i--) {
      const ganador = this.ganadorRally(this.logs[i]);

      // Solo considerar rallies (puntos y castigos)
      if (ganador) {
        if (ultimoEquipo && ganador !== ultimoEquipo) {
          // Si hay un cambio de equipo, sumar rotación al equipo actual
          if (ganador === "A") {
            rotacionesA++;
          } else {
            rotacionesB++;
          }
        }

        ultimoEquipo = ganador;
      }
    }
    return equipo === "A" ? rotacionesA : rotacionesB;
  }

  saqueActual(): 'A' | 'B' {
    if (!this.logs || this.logs.length === 0) {
      return this.saque;
    }

    for (const log of this.logs) {
      const ganador = this.ganadorRally(log);
      if (ganador) {
        return ganador; // El equipo que ganó el último rally tiene el saque
      }
    }

    return this.saque; // Si no hay puntos registrados, se mantiene el saque inicial
  }

  async cambiarJugador(equipo: 'A' | 'B', jugadorSeleccionado: number) {
    if (this.setFinalizado) return;

    const jugadoresEquipo = this._game_.obtenerEquipoPorLado(equipo).jugadores;

    const alineacionInicial = equipo === 'A'
      ? this.alineacion_a
      : this.alineacion_b;

    // Posición con cambio excepcional (15.7): ya no admite cambios regulares.
    const posicion = alineacionInicial.indexOf(jugadorSeleccionado);
    if (this.logs.some((log: any) => log.tipo === 12 && log.equipo === equipo && log.posicion === posicion)) {
      const alerta = await this.alertController.create({
        header: 'Cambio excepcional',
        message: 'En esta posición hubo un cambio excepcional: no se permiten más cambios regulares en el set.',
        buttons: ['Aceptar']
      });
      await alerta.present();
      return;
    }

    // Expulsados en este set y descalificados en el partido no pueden
    // entrar ni volver (21.3.2 / 21.3.3).
    const fueraDeJuego = this._game_.jugadoresFueraDeJuego(equipo, Number(this.set));

    // Si en esta posición sigue un expulsado/descalificado (p. ej. se cerró
    // la app antes de elegir su reemplazo), se vuelve a pedir el reemplazo
    // obligatorio en vez de un cambio normal.
    const ocupante = this.ocupantePosicion(equipo, jugadorSeleccionado);
    if (fueraDeJuego.has(ocupante)) {
      const descalificado = this._game_.logsPartido().some(({ log }) => log.tipo === 11 && log.equipo === equipo && log.jugador === ocupante);
      await this.reemplazoObligatorio(equipo, ocupante, descalificado ? 11 : 9);
      return;
    }

    // Jugadores disponibles: no liberos, no en alineación inicial
    let jugadoresDisponibles = jugadoresEquipo.filter((j: any) => {
      const yaEnAlineacion = alineacionInicial.includes(j.numero);
      const esLibero = j.libero;
      return !yaEnAlineacion && !esLibero && !fueraDeJuego.has(j.numero);
    });

    // Excluir jugadores que ya han sido parte de un cambio (como "cambio")
    const jugadoresCambiados = this.logs
      .filter((log: any) => log.tipo === 2 && log.equipo === equipo)
      .map((log: any) => log.cambio);

    jugadoresDisponibles = jugadoresDisponibles.filter((j: any) => !jugadoresCambiados.includes(j.numero));

    // Verificar si el jugador seleccionado ya tiene un cambio (tipo 2)
    const logExistente = this.logs.find(
      (log: any) => log.tipo === 2 && log.equipo === equipo && log.jugador === jugadorSeleccionado
    );

    if (logExistente) {
      const jugadorCambio = logExistente.cambio;

      // Verificar si ya existe un log tipo 3 que indique que el cambio fue decidido
      const cambioYaRealizado = this.logs.some(
        (log: any) =>
          log.tipo === 3 &&
          log.equipo === equipo &&
          log.jugador === jugadorSeleccionado &&
          log.cambio === jugadorCambio
      );

      if (cambioYaRealizado) {
        const alertaYaDecidido = await this.alertController.create({
          header: 'Cambio ya realizado',
          message: `El cambio entre [ ${jugadorSeleccionado} ] y [ ${jugadorCambio} ] ya fue confirmado.`,
          buttons: ['Aceptar']
        });
        await alertaYaDecidido.present();
        return;
      }

      if (fueraDeJuego.has(jugadorSeleccionado)) {
        const alerta = await this.alertController.create({
          header: 'No puede volver',
          message: `El N° ${jugadorSeleccionado} está expulsado o descalificado y no puede volver a la cancha.`,
          buttons: ['Aceptar']
        });
        await alerta.present();
        return;
      }

      const alertaConfirm = await this.alertController.create({
        header: 'Cambio existente',
        message: `Ya existe un cambio para este jugador entre [ ${jugadorSeleccionado} ] y [ ${jugadorCambio} ].\n¿Deseas deshacer este cambio?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Deshacer',
            handler: () => {
              const nuevoLog: any = this._game_.clean_log();
              nuevoLog.tipo = 3;
              nuevoLog.jugador = jugadorSeleccionado;
              nuevoLog.cambio = jugadorCambio;
              nuevoLog.equipo = equipo;
              nuevoLog.hora = new Date();

              this.logs.unshift(nuevoLog);
              this.updateLogs();
              this._game_.guardar();
            }
          }
        ]
      });

      await alertaConfirm.present();
      return;
    }

    const registrarCambio = (numeroEntrante: number) => {
      const nuevoLog: any = this._game_.clean_log();
      nuevoLog.tipo = 2;
      nuevoLog.jugador = jugadorSeleccionado;
      nuevoLog.cambio = numeroEntrante;
      nuevoLog.equipo = equipo;
      nuevoLog.hora = new Date();

      this.logs.unshift(nuevoLog);
      this.updateLogs();
      this._game_.guardar();
    };

    // Agrega al equipo un jugador que no estaba anotado y lo ingresa de
    // inmediato en el cambio.
    const agregarNuevo = async () => {
      const nuevo = await this._game_.agregarJugadorRapido(this._game_.obtenerEquipoPorLado(equipo));
      if (nuevo) registrarCambio(nuevo.numero);
    };

    // El alta rápida solo se ofrece mientras quede cupo (máx. 14 jugadores
    // sin contar líberos, ver GameService.cuposEquipo).
    const hayCupo = this._game_.puedeAgregarJugadorRapido(this._game_.obtenerEquipoPorLado(equipo));

    if (jugadoresDisponibles.length === 0) {
      const alertaSinOpciones = await this.alertController.create({
        header: 'Sin jugadores disponibles',
        message: hayCupo
          ? 'No hay jugadores disponibles para realizar el cambio. ¿Deseas agregar un jugador nuevo?'
          : 'No hay jugadores disponibles para realizar el cambio y el equipo ya tiene el máximo de jugadores permitido.',
        buttons: hayCupo
          ? [{ text: 'Cancelar', role: 'cancel' }, { text: 'Agregar jugador', handler: () => { agregarNuevo(); } }]
          : ['Aceptar']
      });

      await alertaSinOpciones.present();
      return;
    }

    const inputs = jugadoresDisponibles.map((j: any) => ({
      name: `${j.numero}`,
      type: 'radio',
      label: `[ ${j.numero} ]${j.nombre ? ' ' + j.nombre : ''}`,
      value: j.numero
    }));

    const alertaSelect = await this.alertController.create({
      header: 'Selecciona jugador a ingresar',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        ...(hayCupo ? [{
          text: 'Nuevo jugador',
          handler: () => { agregarNuevo(); }
        }] : []),
        {
          text: 'Aceptar',
          handler: (valorSeleccionado: number) => {
            const jugadorValido = jugadoresDisponibles.find((j: any) => j.numero === valorSeleccionado);
            if (!jugadorValido) return;
            registrarCambio(jugadorValido.numero);
          }
        }
      ]
    });

    await alertaSelect.present();
  }
  validaCambio(equipo: 'A' | 'B', numeroJugador: number): number {
    let numeroCambio: number | null = null;

    // Buscar en logs de tipo 2 del mismo equipo
    for (const log of this.logs) {
      if (log.tipo === 2 && log.equipo === equipo && log.jugador === numeroJugador) {
        numeroCambio = log.cambio;
        break;
      }
    }

    // Si hay cambio registrado (tipo 2), verificamos si se completó (tipo 3)
    if (numeroCambio !== null) {
      const existeTipo3 = this.logs.some(
        (log: any) =>
          log.tipo === 3 &&
          log.equipo === equipo &&
          log.jugador === numeroJugador &&
          log.cambio === numeroCambio
      );

      if (existeTipo3) {
        return numeroJugador; // cambio realizado, mantener jugador original
      } else {
        return numeroCambio; // cambio aún no realizado, usar jugador entrante
      }
    }

    // No hay cambio registrado, devolver jugador original
    return numeroJugador;
  }

  // Jugador en cancha en la posición cuyo titular es "numeroJugador":
  // resultado de los cambios regulares (validaCambio) y, si los hubo, de los
  // cambios excepcionales (tipo 12) en esa posición, el último manda.
  ocupantePosicion(equipo: 'A' | 'B', numeroJugador: number): number {
    const alineacion: any[] = equipo === 'A' ? this.alineacion_a : this.alineacion_b;
    const posicion = alineacion.indexOf(numeroJugador);
    let ocupante = this.validaCambio(equipo, numeroJugador);
    for (const log of [...this.logs].reverse()) {
      if (log.tipo === 12 && log.equipo === equipo && log.posicion === posicion) ocupante = log.cambio;
    }
    return ocupante;
  }

  async tiempo(equipo: 'A' | 'B') {
    if (this.setFinalizado) return;

    //valida que no pase de 2 tiempos
    let tiempo = this.logs.filter((log: any) => log.tipo === 4 && log.equipo === equipo).length;
    if (tiempo >= 2) {
      const alertaMaxTiempos = await this.alertController.create({
        header: 'Máximo de tiempos',
        message: 'Se ha superado el límite de tiempos permitidos.',
        buttons: ['Aceptar']
      });
      await alertaMaxTiempos.present();
      return;
    }
    const nuevoLog: any = this._game_.clean_log();
    nuevoLog.tipo = 4;
    nuevoLog.equipo = equipo;
    nuevoLog.hora = new Date();

    this.logs.unshift(nuevoLog);
    this.updateLogs();
    this._game_.guardar();
  }

  // Amonestaciones según las reglas FIVB:
  //  - Demora (16) y solicitud improcedente (15.11): sanciones al equipo.
  //  - Conducta (21): amarilla (advertencia), castigo (roja), expulsión y
  //    descalificación, a un jugador o a un oficial del equipo.
  async amonestacion(equipo: 'A' | 'B') {
    if (this.setFinalizado) return;

    const alert = await this.alertController.create({
      header: 'Amonestación',
      message: `Seleccione el tipo de amonestación para el equipo ${equipo}`,
      buttons: [
        { text: 'Demora', handler: () => { this.registrarAmonestacion(equipo, 5); } },
        { text: 'Solicitud Improcedente', handler: () => { this.registrarAmonestacion(equipo, 8); } },
        { text: 'Tarjeta Amarilla', handler: () => { this.seleccionarMiembro(equipo, 6); } },
        { text: 'Tarjeta Roja', handler: () => { this.seleccionarMiembro(equipo, 7); } },
        { text: 'Expulsión', handler: () => { this.seleccionarMiembro(equipo, 9); } },
        { text: 'Descalificación', handler: () => { this.seleccionarMiembro(equipo, 11); } },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });

    await alert.present();
  }

  // Elige a quién se sanciona: jugadores en cancha primero, luego la banca y
  // los oficiales del equipo (entrenador, asistentes, fisioterapeuta,
  // médico), que también pueden ser sancionados por conducta (21.2).
  // "Nuevo jugador" agrega uno que no estaba anotado y lo sanciona.
  async seleccionarMiembro(equipo: 'A' | 'B', tipoAmonestacion: number) {
    const alineacion: number[] = equipo === 'A' ? this.alineacion_a : this.alineacion_b;
    const equipoData = this._game_.obtenerEquipoPorLado(equipo);
    const plantel: any[] = equipoData?.jugadores || [];
    const enCancha = alineacion.map((n: number) => this.ocupantePosicion(equipo, n));

    const enJuego = enCancha
      .map((numero: number) => plantel.find((j: any) => j.numero === numero))
      .filter((j: any) => !!j);
    const banca = plantel
      .filter((j: any) => !enCancha.includes(j.numero))
      .sort((a: any, b: any) => (a.numero ?? 0) - (b.numero ?? 0));

    const oficiales: [string, string, any][] = [
      ['C', 'Entrenador', equipoData?.entrenador],
      ['AC1', 'Primer asistente', equipoData?.primer_asistente],
      ['AC2', 'Segundo asistente', equipoData?.segundo_asistente],
      ['T', 'Fisioterapeuta', equipoData?.fisioterapeuta],
      ['M', 'Médico', equipoData?.medico],
    ];

    const inputs: any[] = [
      ...[...enJuego, ...banca].map((jugador: any) => ({
        name: 'miembro',
        type: 'radio',
        label: `${jugador.numero}${jugador.nombre ? ' - ' + jugador.nombre : ''}${enCancha.includes(jugador.numero) ? '' : ' (banca)'}`,
        value: jugador.numero,
      })),
      ...oficiales
        .filter(([, , nombre]) => !!nombre)
        .map(([codigo, cargo, nombre]) => ({ name: 'miembro', type: 'radio', label: `${codigo} - ${cargo} (${nombre})`, value: codigo })),
    ];

    const agregarNuevo = async () => {
      const nuevo = await this._game_.agregarJugadorRapido(equipoData);
      if (nuevo) this.registrarAmonestacion(equipo, tipoAmonestacion, nuevo.numero);
    };

    const alert = await this.alertController.create({
      header: `${this._game_.NOMBRE_SANCION[tipoAmonestacion]} - ¿a quién?`,
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        // Alta rápida solo mientras quede cupo en el equipo.
        ...(this._game_.puedeAgregarJugadorRapido(equipoData) ? [{
          text: 'Nuevo jugador',
          handler: () => { agregarNuevo(); }
        }] : []),
        {
          text: 'Aceptar',
          handler: (miembro: number | string) => {
            if (miembro === undefined || miembro === null || miembro === '') return false;
            this.registrarAmonestacion(equipo, tipoAmonestacion, miembro);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  private async avisar(header: string, message: string) {
    const alerta = await this.alertController.create({ header, message, buttons: ['Aceptar'] });
    await alerta.present();
    await alerta.onDidDismiss();
  }

  // Pregunta con botones; resuelve con el "valor" del botón elegido, o null
  // si se canceló.
  private preguntar(header: string, message: string, opciones: { texto: string, valor: any }[]): Promise<any> {
    return new Promise(async resolve => {
      let elegido: any = null;
      const alerta = await this.alertController.create({
        header, message, backdropDismiss: false,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          ...opciones.map(o => ({ text: o.texto, handler: () => { elegido = o.valor; } })),
        ]
      });
      alerta.onDidDismiss().then(() => resolve(elegido));
      await alerta.present();
    });
  }

  async registrarAmonestacion(equipo: 'A' | 'B', tipoAmonestacion: number, miembro?: number | string) {
    // Conducta (21): sanción progresiva y nivel de sanción del equipo.
    if (this._game_.NIVEL_SANCION[tipoAmonestacion] && miembro !== undefined) {
      const tipoFinal = await this.ajustarSancionConducta(equipo, tipoAmonestacion, miembro);
      if (tipoFinal === null) return;
      tipoAmonestacion = tipoFinal;
    }

    const nuevoLog: any = this._game_.clean_log();
    nuevoLog.tipo = tipoAmonestacion;
    nuevoLog.equipo = equipo;
    nuevoLog.jugador = typeof miembro === 'number' ? miembro : null;
    if (typeof miembro === 'string') nuevoLog.oficial = miembro;
    nuevoLog.hora = new Date();

    // Demora (regla 16 FIVB): la 1ª del equipo en el partido es solo
    // amonestación; desde la 2ª es castigo, con punto y saque para el rival.
    // La 2ª solicitud improcedente en adelante cuenta como demora (15.11.3).
    let avisoDemora: string | null = null;
    if (tipoAmonestacion === 5 || tipoAmonestacion === 8) {
      const { demoras, improcedentes } = this._game_.demorasPartido(equipo);
      const esDemora = tipoAmonestacion === 5 || improcedentes > 0;
      const prefijo = tipoAmonestacion === 8 && esDemora ? 'Solicitud improcedente repetida: cuenta como demora. ' : '';
      if (esDemora && demoras > 0) {
        nuevoLog.castigo = true;
        const rival = equipo === 'A' ? 'B' : 'A';
        avisoDemora = `${prefijo}Es la ${demoras + 1}ª demora del Equipo ${equipo} en el partido: castigo por demora. Punto y saque para el Equipo ${rival}.`;
      } else if (esDemora) {
        avisoDemora = `${prefijo}1ª demora del Equipo ${equipo} en el partido: amonestación por demora, sin punto. La próxima será castigo.`;
      }
    }

    this.logs.unshift(nuevoLog);
    this.updateLogs();
    this._game_.guardar();

    if (avisoDemora) await this.avisar('Demora', avisoDemora);
    // Un castigo (roja o demora) suma punto: puede tocar el cambio de lado.
    if (ganadorPuntoLog(nuevoLog)) await this.verificarCambioDeLado();

    // Expulsión / descalificación de un jugador en cancha: reemplazo
    // inmediato (15.8).
    if ((tipoAmonestacion === 9 || tipoAmonestacion === 11) && typeof miembro === 'number') {
      await this.reemplazoObligatorio(equipo, miembro, tipoAmonestacion);
    }
  }

  // Aplica la escala de la regla 21: si la persona ya fue sancionada en el
  // partido, la nueva sanción debe ser más grave que la anterior (21.4.2); y
  // si el equipo ya tiene amarilla, llegó al nivel de sanción (21.1) y una
  // nueva conducta incorrecta se sanciona al menos con castigo. Devuelve el
  // tipo a registrar, o null si se canceló.
  private async ajustarSancionConducta(equipo: 'A' | 'B', tipo: number, miembro: number | string): Promise<number | null> {
    const g = this._game_;
    const quien = typeof miembro === 'number' ? `El N° ${miembro}` : `El oficial ${miembro}`;
    const previo = g.nivelSancionPrevia(equipo, miembro);

    if (previo >= 4) {
      await this.avisar('Ya descalificado', `${quien} ya está descalificado en este partido.`);
      return null;
    }
    const minimo = previo > 0 ? previo + 1 : 0;
    if (g.NIVEL_SANCION[tipo] < minimo) {
      const tipoMinimo = g.TIPO_POR_NIVEL[minimo];
      const elegido = await this.preguntar(
        'Sanción progresiva',
        `${quien} ya recibió ${g.NOMBRE_SANCION[g.TIPO_POR_NIVEL[previo]].toLowerCase()} en este partido. Por reincidencia corresponde una sanción más grave: ${g.NOMBRE_SANCION[tipoMinimo].toLowerCase()}.`,
        [{ texto: `Aplicar ${g.NOMBRE_SANCION[tipoMinimo].toLowerCase()}`, valor: tipoMinimo }]
      );
      return elegido;
    }
    if (tipo === 6 && g.equipoTieneAmarilla(equipo)) {
      return this.preguntar(
        'Nivel de sanción',
        `El equipo ${equipo} ya recibió tarjeta amarilla en este partido: llegó al nivel de sanción y una nueva conducta incorrecta debe sancionarse (castigo, expulsión o descalificación).`,
        [{ texto: 'Aplicar castigo (roja)', valor: 7 }, { texto: 'Amarilla igual', valor: 6 }]
      );
    }
    return tipo;
  }

  // Reemplazo inmediato del jugador expulsado/descalificado si está en
  // cancha (15.8): cambio legal; si no se puede, cambio excepcional (15.7:
  // cualquier jugador que no esté en cancha, salvo líberos); si tampoco, el
  // equipo queda incompleto y pierde el set (6.4.3).
  private async reemplazoObligatorio(equipo: 'A' | 'B', numero: number, tipo: number) {
    const alineacion: number[] = equipo === 'A' ? this.alineacion_a : this.alineacion_b;
    const posicion = [0, 1, 2, 3, 4, 5].find(i => this.ocupantePosicion(equipo, alineacion[i]) === numero);
    if (posicion === undefined) return; // no estaba en cancha

    const titular = alineacion[posicion];
    const plantel: any[] = this._game_.obtenerEquipoPorLado(equipo)?.jugadores || [];
    const fuera = this._game_.jugadoresFueraDeJuego(equipo, Number(this.set));
    const enCancha = alineacion.map(n => this.ocupantePosicion(equipo, n));
    const hayExcepcional = this.logs.some((l: any) => l.tipo === 12 && l.equipo === equipo && l.posicion === posicion);
    const cambio = this.logs.find((l: any) => l.tipo === 2 && l.equipo === equipo && l.jugador === titular);
    const volvio = cambio && this.logs.some((l: any) => l.tipo === 3 && l.equipo === equipo && l.jugador === titular && l.cambio === cambio.cambio);

    // Cambio legal: si el titular aún no fue cambiado, cualquier jugador
    // de la banca no usado en cambios; si el que sale es el suplente, solo
    // puede volver su titular (una vez).
    let legales: number[] = [];
    if (!hayExcepcional) {
      if (!cambio) {
        const usados = this.logs.filter((l: any) => l.tipo === 2 && l.equipo === equipo).map((l: any) => l.cambio);
        legales = plantel
          .filter(j => !j.libero && !alineacion.includes(j.numero) && !usados.includes(j.numero) && !fuera.has(j.numero))
          .map(j => j.numero);
      } else if (!volvio && cambio.cambio === numero && !fuera.has(titular)) {
        legales = [titular];
      }
    }
    // El cambio excepcional solo se permite si no hay ningún cambio legal.
    const excepcionales = legales.length ? [] : plantel
      .filter(j => !j.libero && !enCancha.includes(j.numero) && !fuera.has(j.numero))
      .map(j => j.numero);

    const nombre = (n: number) => plantel.find(j => j.numero === n)?.nombre;
    const inputs: any[] = [
      ...legales.map(n => ({ type: 'radio', name: 'r', label: `[ ${n} ]${nombre(n) ? ' ' + nombre(n) : ''} · cambio legal`, value: { n, tipo: 'legal' } })),
      ...excepcionales.map(n => ({ type: 'radio', name: 'r', label: `[ ${n} ]${nombre(n) ? ' ' + nombre(n) : ''} · cambio excepcional`, value: { n, tipo: 'excepcional' } })),
    ];
    const sancion = tipo === 11 ? 'descalificado' : 'expulsado';

    const eleccion: any = await new Promise(async resolve => {
      let valor: any = null;
      const alerta = await this.alertController.create({
        header: 'Reemplazo obligatorio',
        subHeader: `N° ${numero} ${sancion}: debe ser reemplazado de inmediato.`,
        message: inputs.length ? 'Primero un cambio legal; si no hay, un cambio excepcional.' : 'No hay jugadores para reemplazarlo: el equipo queda incompleto.',
        backdropDismiss: false,
        inputs,
        // "Equipo incompleto" solo si no hay ningún reemplazo posible (15.8).
        buttons: inputs.length
          ? [{ text: 'Aceptar', handler: (v: any) => { if (!v) return false; valor = v; return true; } }]
          : [{ text: 'Equipo incompleto', handler: () => { valor = { tipo: 'incompleto' }; } }]
      });
      alerta.onDidDismiss().then(() => resolve(valor));
      await alerta.present();
    });
    if (!eleccion) return;

    const log: any = this._game_.clean_log();
    log.equipo = equipo;
    log.hora = new Date();
    if (eleccion.tipo === 'legal' && eleccion.n === titular) {
      // Vuelve el titular: mismo registro que "deshacer cambio".
      log.tipo = 3; log.jugador = titular; log.cambio = numero;
    } else if (eleccion.tipo === 'legal') {
      log.tipo = 2; log.jugador = titular; log.cambio = eleccion.n;
    } else if (eleccion.tipo === 'excepcional') {
      log.tipo = 12; log.jugador = numero; log.cambio = eleccion.n; log.posicion = posicion;
    } else {
      await this.declararIncompleto(equipo, tipo === 11);
      return;
    }
    this.logs.unshift(log);
    this.updateLogs();
    this._game_.guardar();
  }

  // Equipo incompleto (6.4.3): pierde el set; el rival recibe los puntos que
  // le faltan para ganarlo y el incompleto conserva los suyos.
  private async declararIncompleto(equipo: 'A' | 'B', porDescalificacion: boolean) {
    const rival: 'A' | 'B' = equipo === 'A' ? 'B' : 'A';
    const marca: any = this._game_.clean_log();
    marca.tipo = 13; marca.equipo = equipo; marca.hora = new Date(); marca.paraPartido = porDescalificacion;
    this.logs.unshift(marca);
    while (!this.esGanadorSet(rival)) {
      const punto: any = this._game_.clean_log();
      punto.tipo = 1; punto.equipo = rival; punto.hora = new Date(); punto.incompleto = true;
      this.logs.unshift(punto);
    }
    this.updateLogs();
    this._game_.guardar();
    await this.avisar('Equipo incompleto', `El equipo ${equipo} queda incompleto y pierde el set: el equipo ${rival} recibe los puntos necesarios para ganarlo.${porDescalificacion ? ' Si en los sets siguientes tampoco puede completar 6 jugadores, también los pierde.' : ''}`);
  }
}

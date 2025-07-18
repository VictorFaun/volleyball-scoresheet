import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';

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
  constructor(private router: Router, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController) { }
  volver() {
    this.router.navigate(["home"]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.set = params['set'];
      this.updateLogs()
    });
  }

  updateLogs() {
    if (this.set == 1) {
      this.logs = this._game_.partido.set_1.logs
      this.alineacion_a = this._game_.partido.set_1.alineacion_a
      this.alineacion_b = this._game_.partido.set_1.alineacion_b
      this.saque = this._game_.partido.set_1.equipo_saque
    }
    if (this.set == 2) {
      this.logs = this._game_.partido.set_2.logs
      this.alineacion_a = this._game_.partido.set_2.alineacion_a
      this.alineacion_b = this._game_.partido.set_2.alineacion_b
      this.saque = this._game_.partido.set_2.equipo_saque
    }
    if (this.set == 3) {
      this.logs = this._game_.partido.set_3.logs
      this.alineacion_a = this._game_.partido.set_3.alineacion_a
      this.alineacion_b = this._game_.partido.set_3.alineacion_b
      this.saque = this._game_.partido.set_3.equipo_saque
    }
    if (this.set == 4) {
      this.logs = this._game_.partido.set_4.logs
      this.alineacion_a = this._game_.partido.set_4.alineacion_a
      this.alineacion_b = this._game_.partido.set_4.alineacion_b
      this.saque = this._game_.partido.set_4.equipo_saque
    }
    if (this.set == 5) {
      this.logs = this._game_.partido.set_5.logs
      this.alineacion_a = this._game_.partido.set_5.alineacion_a
      this.alineacion_b = this._game_.partido.set_5.alineacion_b
      this.saque = this._game_.partido.set_5.equipo_saque
    }
  }

  punto(equipo: any) {
    this._game_.punto(this.set, equipo);
    this.updateLogs()
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
    return tipo
  }

  async deshacer() {
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

    return this.logs.filter((log: any) => log.tipo === 1 && log.equipo === equipo).length;
  }

  async siguiente() {
    this._game_.closeSet(this.set)
  }

  contarRotaciones(equipo: "A" | "B"): number {
    let rotacionesA = 0;
    let rotacionesB = 0;
    let ultimoEquipo: string = this.saque;

    // Recorremos del más viejo al más nuevo (invirtiendo el arreglo)
    for (let i = this.logs.length - 1; i >= 0; i--) {
      const log = this.logs[i];

      // Solo considerar puntos
      if (log.tipo === 1) {
        if (ultimoEquipo && log.equipo !== ultimoEquipo) {
          // Si hay un cambio de equipo, sumar rotación al equipo actual
          if (log.equipo === "A") {
            rotacionesA++;
          } else if (log.equipo === "B") {
            rotacionesB++;
          }
        }

        ultimoEquipo = log.equipo;
      }
    }
    return equipo === "A" ? rotacionesA : rotacionesB;
  }

  saqueActual(): 'A' | 'B' {
    if (!this.logs || this.logs.length === 0) {
      return this.saque;
    }

    for (const log of this.logs) {
      if (log.tipo === 1) {
        return log.equipo; // El equipo que hizo el último punto tiene el saque
      }
    }

    return this.saque; // Si no hay puntos registrados, se mantiene el saque inicial
  }

  async cambiarJugador(equipo: 'A' | 'B', jugadorSeleccionado: number) {
    const jugadoresEquipo = equipo === 'A'
      ? this._game_.partido.equipo_a.jugadores
      : this._game_.partido.equipo_b.jugadores;

    const alineacionInicial = equipo === 'A'
      ? this.alineacion_a
      : this.alineacion_b;

    // Jugadores disponibles: no liberos, no en alineación inicial
    let jugadoresDisponibles = jugadoresEquipo.filter((j: any) => {
      const yaEnAlineacion = alineacionInicial.includes(j.numero);
      const esLibero = j.libero;
      return !yaEnAlineacion && !esLibero;
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

      const jugadorCambioNombre =
        jugadoresEquipo.find((j: any) => j.numero === jugadorCambio)?.nombre || jugadorCambio;

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
            }
          }
        ]
      });

      await alertaConfirm.present();
      return;
    }

    if (jugadoresDisponibles.length === 0) {
      const alertaSinOpciones = await this.alertController.create({
        header: 'Sin jugadores disponibles',
        message: 'No hay jugadores disponibles para realizar el cambio.',
        buttons: ['Aceptar']
      });

      await alertaSinOpciones.present();
      return;
    }

    const inputs = jugadoresDisponibles.map((j: any) => ({
      name: `${j.numero}`,
      type: 'radio',
      label: `[ ${j.numero} ] ${j.nombre}`,
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
        {
          text: 'Aceptar',
          handler: (valorSeleccionado: number) => {
            const jugadorValido = jugadoresDisponibles.find((j: any) => j.numero === valorSeleccionado);
            if (!jugadorValido) return;

            const nuevoLog: any = this._game_.clean_log();
            nuevoLog.tipo = 2;
            nuevoLog.jugador = jugadorSeleccionado;
            nuevoLog.cambio = jugadorValido.numero;
            nuevoLog.equipo = equipo;
            nuevoLog.hora = new Date();

            this.logs.unshift(nuevoLog);
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


}

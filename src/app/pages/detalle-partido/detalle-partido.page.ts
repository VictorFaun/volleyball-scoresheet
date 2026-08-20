import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

type Lado = 'A' | 'B';

interface SaqueJugador {
  numero: number;
  nombre: string;
  saques: number;
  porcentaje: number;
}

interface AmonestacionItem {
  tipo: number;
  nombre: string;
  equipo: Lado;
  jugador: number | null;
  jugadorNombre: string | null;
  hora: any;
}

interface CambioItem {
  equipo: Lado;
  sale: number;
  saleNombre: string;
  entra: number;
  entraNombre: string;
  hora: any;
}

interface JugadorSimple {
  numero: number;
  nombre: string;
}

interface RachaEquipo {
  cantidad: number;
  marcadorInicio: string;
  marcadorFin: string;
  jugadores: JugadorSimple[];
}

interface MejorRachaPartido {
  equipo: Lado;
  cantidad: number;
  set: number;
  jugadores: JugadorSimple[];
}

interface AmonestacionResumenTipo {
  nombre: string;
  a: number;
  b: number;
  porcentajeA: number;
  porcentajeB: number;
}

interface DuracionSetResumen {
  numero: number;
  texto: string;
  porcentaje: number;
}

interface DetalleSet {
  numero: number;
  puntosA: number;
  puntosB: number;
  victoria: Lado | null;
  duracion: string;
  duracionMs: number;
  tiemposA: number;
  tiemposB: number;
  amonestacionesA: number;
  amonestacionesB: number;
  cambiosA: number;
  cambiosB: number;
  amonestaciones: AmonestacionItem[];
  cambios: CambioItem[];
  saquesA: SaqueJugador[];
  saquesB: SaqueJugador[];
  rachaA: RachaEquipo | null;
  rachaB: RachaEquipo | null;
  chartA: string;
  chartB: string;
  logsChrono: any[];
}

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.page.html',
  styleUrls: ['./detalle-partido.page.scss'],
  standalone: false,
})
export class DetallePartidoPage implements OnInit {

  private readonly NOMBRES_AMONESTACION: Record<number, string> = {
    5: 'Demora',
    6: 'Tarjeta Amarilla',
    7: 'Tarjeta Roja',
    8: 'Solicitud Improcedente',
    9: 'Expulsión'
  };

  private readonly TIPOS_AMONESTACION = [5, 6, 7, 8, 9];

  partido: any;
  nombreA = 'Equipo A';
  nombreB = 'Equipo B';
  textoGanador: string | null = null;
  duracionTotal = '-';

  segmento: number | 'total' = 'total';
  sets: DetalleSet[] = [];

  totales = {
    setsGanadosA: 0,
    setsGanadosB: 0,
    tiemposA: 0,
    tiemposB: 0,
    amonestacionesA: 0,
    amonestacionesB: 0,
    amonestacionesPorTipo: [] as AmonestacionResumenTipo[],
    duracionesSets: [] as DuracionSetResumen[],
    saquesA: [] as SaqueJugador[],
    saquesB: [] as SaqueJugador[],
    mejorRachas: [] as MejorRachaPartido[]
  };

  constructor(private navCtrl: NavController, private _game_: GameService) { }

  ngOnInit() {
    this.partido = this._game_.partido;
    if (!this.partido) return;

    const equipoA = this._game_.obtenerEquipoPorLado('A');
    const equipoB = this._game_.obtenerEquipoPorLado('B');
    this.nombreA = equipoA?.nombre || 'Equipo A';
    this.nombreB = equipoB?.nombre || 'Equipo B';

    const ganador = this._game_.obtenerGanadorPartido();
    this.textoGanador = ganador ? this._game_.textoEquipoGanador(ganador) : null;

    let duracionTotalMs = 0;
    const saquesTotalA = new Map<number, number>();
    const saquesTotalB = new Map<number, number>();
    const todasLasRachas: MejorRachaPartido[] = [];

    for (let numSet = 1; numSet <= 5; numSet++) {
      const set = this.partido[`set_${numSet}`];
      if (!set || !set.victoria) continue;

      // Los logs se guardan del más nuevo al más viejo (unshift); para
      // reconstruir la progresión del set se necesitan en orden cronológico.
      const logsChrono = [...(set.logs || [])].reverse();

      const puntosA = this._game_.contarPuntos(set, 'A');
      const puntosB = this._game_.contarPuntos(set, 'B');

      const duracionMs = this.duracionSetMs(set) || 0;
      duracionTotalMs += duracionMs;

      const { progresion, rachaA, rachaB, saquesA: saquesSetA, saquesB: saquesSetB } =
        this.analizarSet(set, logsChrono, equipoA, equipoB);
      const maxPuntos = Math.max(puntosA, puntosB, this.puntosParaGanar(numSet), 1);
      const chart = this.construirChart(progresion, maxPuntos);

      const saquesA = this.mapSaques(saquesSetA, equipoA);
      const saquesB = this.mapSaques(saquesSetB, equipoB);
      saquesSetA.forEach((cant, num) => saquesTotalA.set(num, (saquesTotalA.get(num) || 0) + cant));
      saquesSetB.forEach((cant, num) => saquesTotalB.set(num, (saquesTotalB.get(num) || 0) + cant));

      const amonestaciones = logsChrono
        .filter(l => this.TIPOS_AMONESTACION.includes(l.tipo))
        .map(l => this.mapAmonestacion(l, equipoA, equipoB));

      const cambios = logsChrono
        .filter(l => l.tipo === 2)
        .map(l => this.mapCambio(l, equipoA, equipoB));

      const tiemposA = logsChrono.filter(l => l.tipo === 4 && l.equipo === 'A').length;
      const tiemposB = logsChrono.filter(l => l.tipo === 4 && l.equipo === 'B').length;
      const amonestacionesA = amonestaciones.filter(a => a.equipo === 'A').length;
      const amonestacionesB = amonestaciones.filter(a => a.equipo === 'B').length;
      const cambiosA = cambios.filter(c => c.equipo === 'A').length;
      const cambiosB = cambios.filter(c => c.equipo === 'B').length;

      if (rachaA) todasLasRachas.push({ equipo: 'A', cantidad: rachaA.cantidad, set: numSet, jugadores: rachaA.jugadores });
      if (rachaB) todasLasRachas.push({ equipo: 'B', cantidad: rachaB.cantidad, set: numSet, jugadores: rachaB.jugadores });

      this.sets.push({
        numero: numSet,
        puntosA,
        puntosB,
        victoria: set.victoria,
        duracion: this.duracionSetMs(set) !== null ? this.formatearDuracion(duracionMs) : '-',
        duracionMs,
        tiemposA,
        tiemposB,
        amonestacionesA,
        amonestacionesB,
        cambiosA,
        cambiosB,
        amonestaciones,
        cambios,
        saquesA,
        saquesB,
        rachaA,
        rachaB,
        chartA: chart.pointsA,
        chartB: chart.pointsB,
        logsChrono
      });

      this.totales.setsGanadosA += set.victoria === 'A' ? 1 : 0;
      this.totales.setsGanadosB += set.victoria === 'B' ? 1 : 0;
      this.totales.tiemposA += tiemposA;
      this.totales.tiemposB += tiemposB;
      this.totales.amonestacionesA += amonestacionesA;
      this.totales.amonestacionesB += amonestacionesB;
    }

    this.duracionTotal = this.formatearDuracion(duracionTotalMs);
    if (todasLasRachas.length) {
      const maxCantidad = Math.max(...todasLasRachas.map(r => r.cantidad));
      this.totales.mejorRachas = todasLasRachas.filter(r => r.cantidad === maxCantidad);
    }
    this.totales.saquesA = this.mapSaques(saquesTotalA, equipoA);
    this.totales.saquesB = this.mapSaques(saquesTotalB, equipoB);

    const maxDuracion = Math.max(...this.sets.map(s => s.duracionMs), 1);
    this.totales.duracionesSets = this.sets.map(s => ({
      numero: s.numero,
      texto: s.duracion,
      porcentaje: Math.round((s.duracionMs / maxDuracion) * 100)
    }));

    const tiposConDatos = this.TIPOS_AMONESTACION.map(tipo => ({
      nombre: this.NOMBRES_AMONESTACION[tipo],
      a: this.sets.reduce((acc, s) => acc + s.amonestaciones.filter(am => am.tipo === tipo && am.equipo === 'A').length, 0),
      b: this.sets.reduce((acc, s) => acc + s.amonestaciones.filter(am => am.tipo === tipo && am.equipo === 'B').length, 0),
    })).filter(t => t.a > 0 || t.b > 0);
    const maxTipo = Math.max(...tiposConDatos.map(t => Math.max(t.a, t.b)), 1);
    this.totales.amonestacionesPorTipo = tiposConDatos.map(t => ({
      ...t,
      porcentajeA: Math.round((t.a / maxTipo) * 100),
      porcentajeB: Math.round((t.b / maxTipo) * 100)
    }));

  }

  volver() {
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }

  formatoHoraCorta(fecha: any): string {
    const d = new Date(fecha);
    if (!fecha || isNaN(d.getTime())) return '--:--:--';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // Mismo léxico de tipos de log usado en GamePage.textLog().
  textLog(tipo: any): string {
    if (tipo == 1) return 'Punto';
    if (tipo == 2) return 'Cambio';
    if (tipo == 3) return 'Deshacer';
    if (tipo == 4) return 'Tiempo';
    if (tipo == 5) return 'Demora';
    if (tipo == 6) return 'Tarjeta Amarilla';
    if (tipo == 7) return 'Tarjeta Roja';
    if (tipo == 8) return 'Solicitud improcedente';
    if (tipo == 9) return 'Expulsión';
    if (tipo == 10) return 'Cambio de lado';
    return tipo;
  }

  private puntosParaGanar(numSet: number): number {
    return (numSet === 5 || (numSet === 3 && this.partido.numero_sets === 3)) ? 15 : 25;
  }

  // Recorre los puntos del set en orden simulando a la vez la rotación
  // estándar de vóleibol (para saber quién sirve cada punto) y las rachas
  // de puntos consecutivos de cada equipo. El equipo al saque mantiene al
  // mismo servidor mientras gana puntos, y rota una posición cada vez que
  // pierde el saque; los cambios de jugador (tipo 2) se reflejan en la
  // rotación simulada (deshacer un cambio, tipo 3, no se modela por ser un
  // caso poco frecuente y ambiguo en los datos).
  //
  // El primer punto de una racha es, casi siempre, un punto ganado al
  // resto (el equipo aún no servía), así que el/los jugador(es) de la
  // racha son quienes sirvieron desde el segundo punto en adelante; si
  // hubo un cambio de jugador a mitad de la racha, quedan varios.
  private analizarSet(set: any, logsChrono: any[], equipoA: any, equipoB: any): {
    progresion: { a: number; b: number }[];
    rachaA: RachaEquipo | null;
    rachaB: RachaEquipo | null;
    saquesA: Map<number, number>;
    saquesB: Map<number, number>;
  } {
    let posA: number[] = [...(set.alineacion_a || [])];
    let posB: number[] = [...(set.alineacion_b || [])];
    let currentServer: Lado | null = set.equipo_saque || null;
    const saquesA = new Map<number, number>();
    const saquesB = new Map<number, number>();

    const progresion: { a: number; b: number }[] = [{ a: 0, b: 0 }];
    let a = 0, b = 0;
    let streakTeam: Lado | null = null;
    let streakCount = 0;
    let streakStartA = 0, streakStartB = 0;
    let streakJugadores = new Set<number>();
    let mejorA: RachaEquipo | null = null;
    let mejorB: RachaEquipo | null = null;

    for (const log of logsChrono) {
      if (log.tipo === 2) {
        if (log.equipo === 'A') {
          const idx = posA.indexOf(log.jugador);
          if (idx !== -1) posA[idx] = log.cambio;
        } else if (log.equipo === 'B') {
          const idx = posB.indexOf(log.jugador);
          if (idx !== -1) posB[idx] = log.cambio;
        }
        continue;
      }

      let winner: Lado | null = null;
      if (log.tipo === 1) winner = log.equipo;
      else if (log.tipo === 7) winner = log.equipo === 'A' ? 'B' : 'A';
      if (!winner) continue;

      const servidorEquipo = currentServer;
      const servidorJugador = (log.tipo === 1 && servidorEquipo)
        ? (servidorEquipo === 'A' ? posA[0] : posB[0])
        : null;

      if (servidorJugador != null) {
        const mapa = servidorEquipo === 'A' ? saquesA : saquesB;
        mapa.set(servidorJugador, (mapa.get(servidorJugador) || 0) + 1);
      }

      if (winner === streakTeam) {
        streakCount++;
      } else {
        streakTeam = winner;
        streakCount = 1;
        streakStartA = a;
        streakStartB = b;
        streakJugadores = new Set<number>();
      }
      if (winner === servidorEquipo && servidorJugador != null) {
        streakJugadores.add(servidorJugador);
      }

      if (winner === 'A') a++; else b++;
      progresion.push({ a, b });

      const equipoRacha = winner === 'A' ? equipoA : equipoB;
      const jugadoresRacha: JugadorSimple[] = Array.from(streakJugadores).map(numero => ({
        numero,
        nombre: equipoRacha?.jugadores?.find((j: any) => j.numero === numero)?.nombre || ''
      }));

      if (winner === 'A' && (!mejorA || streakCount > mejorA.cantidad)) {
        mejorA = { cantidad: streakCount, marcadorInicio: `${streakStartA}-${streakStartB}`, marcadorFin: `${a}-${b}`, jugadores: jugadoresRacha };
      }
      if (winner === 'B' && (!mejorB || streakCount > mejorB.cantidad)) {
        mejorB = { cantidad: streakCount, marcadorInicio: `${streakStartA}-${streakStartB}`, marcadorFin: `${a}-${b}`, jugadores: jugadoresRacha };
      }

      if (winner !== servidorEquipo) {
        if (winner === 'A' && posA.length) posA = [...posA.slice(1), posA[0]];
        if (winner === 'B' && posB.length) posB = [...posB.slice(1), posB[0]];
        currentServer = winner;
      }
    }

    return { progresion, rachaA: mejorA, rachaB: mejorB, saquesA, saquesB };
  }

  private construirChart(progresion: { a: number; b: number }[], maxPuntos: number): { pointsA: string; pointsB: string } {
    const width = 100, height = 40, padding = 3;
    const n = progresion.length;
    const denomX = n > 1 ? n - 1 : 1;
    const scaleX = (width - padding * 2) / denomX;
    const scaleY = (height - padding * 2) / maxPuntos;
    const pointsA = progresion.map((p, i) => `${(padding + i * scaleX).toFixed(1)},${(height - padding - p.a * scaleY).toFixed(1)}`).join(' ');
    const pointsB = progresion.map((p, i) => `${(padding + i * scaleX).toFixed(1)},${(height - padding - p.b * scaleY).toFixed(1)}`).join(' ');
    return { pointsA, pointsB };
  }

  private mapSaques(mapa: Map<number, number>, equipo: any): SaqueJugador[] {
    const valores = Array.from(mapa.values());
    if (!valores.length) return [];
    const maxCant = Math.max(...valores, 1);
    return Array.from(mapa.entries())
      .map(([numero, saques]) => ({
        numero,
        nombre: equipo?.jugadores?.find((j: any) => j.numero === numero)?.nombre || '',
        saques,
        porcentaje: Math.round((saques / maxCant) * 100)
      }))
      .sort((x, y) => y.saques - x.saques);
  }

  private mapAmonestacion(log: any, equipoA: any, equipoB: any): AmonestacionItem {
    const equipo: Lado = log.equipo;
    const equipoData = equipo === 'A' ? equipoA : equipoB;
    const jugadorNombre = log.jugador != null
      ? (equipoData?.jugadores?.find((j: any) => j.numero === log.jugador)?.nombre || null)
      : null;
    return {
      tipo: log.tipo,
      nombre: this.NOMBRES_AMONESTACION[log.tipo] || 'Amonestación',
      equipo,
      jugador: log.jugador,
      jugadorNombre,
      hora: log.hora
    };
  }

  private mapCambio(log: any, equipoA: any, equipoB: any): CambioItem {
    const equipo: Lado = log.equipo;
    const equipoData = equipo === 'A' ? equipoA : equipoB;
    const nombreJugador = (numero: number) => equipoData?.jugadores?.find((j: any) => j.numero === numero)?.nombre || '';
    return {
      equipo,
      sale: log.jugador,
      saleNombre: nombreJugador(log.jugador),
      entra: log.cambio,
      entraNombre: nombreJugador(log.cambio),
      hora: log.hora
    };
  }

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

  private duracionSetMs(set: any): number | null {
    if (!set?.hora_inicio || !set?.hora_fin) return null;
    const ms = new Date(set.hora_fin).getTime() - new Date(set.hora_inicio).getTime();
    return isNaN(ms) ? null : ms;
  }

}

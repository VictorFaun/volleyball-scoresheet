// Texto de estado mostrado en las tarjetas de partido (Home, Competencia).
// Mismo mapeo que se usaba antes inline en home.page.ts.
const ESTADOS_TEXTO: Record<number, string> = {
  1: 'Configuración',
  2: 'Configuración',
  3: 'Configuración',
  4: 'Configuración',
  5: 'Firmas',
  6: 'Firmas',
  7: 'Firmas',
  8: 'Firmas',
  9: 'Sorteo',
  10: 'R-5 Set 1',
  11: 'Inicio Set 1',
  12: 'Fin Set 1',
  13: 'R-5 Set 2',
  14: 'Inicio Set 2',
  15: 'Fin Set 2',
  16: 'Sorteo',
  17: 'R-5 Set 3',
  18: 'Inicio Set 3',
  19: 'Fin Set 3',
  20: 'R-5 Set 4',
  21: 'Inicio Set 4',
  22: 'Fin Set 4',
  23: 'Sorteo',
  24: 'R-5 Set 5',
  25: 'Inicio Set 5',
  26: 'Fin Set 5',
  27: 'Firmas',
  28: 'Firmas',
  29: 'Firmas',
  30: 'Firmas',
  31: 'Firmas',
  32: 'Firmas',
  33: 'Finalizado',
};

// Color (nombre de ion-color) del texto de estado, según la etapa: gris
// mientras no se ha empezado a configurar, ámbar en los pasos de espera
// (firmas, sorteo, R-5, entre sets), azul primario mientras un set está en
// juego, y verde una vez finalizado el partido.
const ESTADOS_COLOR: Record<number, string> = {
  1: 'medium', 2: 'medium', 3: 'medium', 4: 'medium',
  5: 'warning', 6: 'warning', 7: 'warning', 8: 'warning',
  9: 'warning',
  10: 'warning', 11: 'primary', 12: 'warning',
  13: 'warning', 14: 'primary', 15: 'warning',
  16: 'warning',
  17: 'warning', 18: 'primary', 19: 'warning',
  20: 'warning', 21: 'primary', 22: 'warning',
  23: 'warning',
  24: 'warning', 25: 'primary', 26: 'warning',
  27: 'warning', 28: 'warning', 29: 'warning', 30: 'warning', 31: 'warning', 32: 'warning',
  33: 'success',
};

export interface PartidoVista {
  torneo: string;
  equipoA: string;
  equipoB: string;
  sets: { a: number; b: number; victoria: 'A' | 'B' }[];
  estado: string;
  estadoColor: string;
  index: number;
  numero_partido: number;
  fecha: string;
}

// Arma el objeto liviano usado para mostrar un partido en las listas (Home,
// Competencia). `index` es la posición del partido dentro de GameService.partidos
// (no dentro de una sub-lista filtrada), ya que las acciones (editar, eliminar,
// continuar) operan sobre ese arreglo global.
export function mapearPartidoParaVista(
  partido: any,
  index: number,
  contarPuntos: (set: any, equipo: 'A' | 'B') => number
): PartidoVista {
  const vista: PartidoVista = {
    torneo: partido.competicion || '',
    equipoA: 'Equipo A',
    equipoB: 'Equipo B',
    sets: [],
    estado: 'Configuración',
    estadoColor: 'medium',
    index,
    numero_partido: partido.numero_partido || 0,
    fecha: partido.fecha || ''
  };

  // El equipo que juega como "A"/"B" se define recién en el R-5 del set 1
  // (equipo.lado). Antes de eso, mostramos equipo_1/equipo_2 en ese orden para
  // no dejar la lista vacía mientras se configura.
  const equipo1 = partido.equipo_1;
  const equipo2 = partido.equipo_2;
  const equipoLadoA = [equipo1, equipo2].find((e: any) => e?.lado === 'A') || equipo1;
  const equipoLadoB = [equipo1, equipo2].find((e: any) => e?.lado === 'B') || equipo2;
  if (equipoLadoA?.nombre) vista.equipoA = equipoLadoA.nombre;
  if (equipoLadoB?.nombre) vista.equipoB = equipoLadoB.nombre;

  for (let numSet = 1; numSet <= 5; numSet++) {
    const set = partido[`set_${numSet}`];
    if (set && set.victoria) {
      vista.sets.push({
        a: contarPuntos(set, 'A'),
        b: contarPuntos(set, 'B'),
        victoria: set.victoria
      });
    }
  }

  if (partido.estado) {
    vista.estado = ESTADOS_TEXTO[partido.estado] || 'Configuración';
    vista.estadoColor = ESTADOS_COLOR[partido.estado] || 'medium';
  }

  return vista;
}

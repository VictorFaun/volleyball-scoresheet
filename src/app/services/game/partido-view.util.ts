// Texto de estado mostrado en las tarjetas de partido (Home, Competencia).
// Corto a propósito: se muestra dentro de un pill chico junto al ícono
// (ver ESTADOS_ICONO), no hay espacio para el nombre completo del paso.
const ESTADOS_TEXTO: Record<number, string> = {
  1: 'Config.',
  2: 'Config.',
  3: 'Config.',
  4: 'Config.',
  5: 'Firmas',
  6: 'Firmas',
  7: 'Firmas',
  8: 'Firmas',
  9: 'Sorteo',
  10: 'R-5 · 1',
  11: 'Set 1',
  12: 'Fin · 1',
  13: 'R-5 · 2',
  14: 'Set 2',
  15: 'Fin · 2',
  16: 'Sorteo',
  17: 'R-5 · 3',
  18: 'Set 3',
  19: 'Fin · 3',
  20: 'R-5 · 4',
  21: 'Set 4',
  22: 'Fin · 4',
  23: 'Sorteo',
  24: 'R-5 · 5',
  25: 'Set 5',
  26: 'Fin · 5',
  27: 'Firmas',
  28: 'Firmas',
  29: 'Firmas',
  30: 'Firmas',
  31: 'Firmas',
  32: 'Firmas',
  33: 'Finalizado',
};

// Color (nombre de ion-color) del pill de estado, según la etapa: gris
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

// Ícono (nombre de ionicon) del pill de estado, uno distinto por tipo de
// paso: engranaje mientras se configura, lápiz en las firmas, dados en el
// sorteo, planilla en el R-5 (alineación), play mientras el set está en
// juego, check al terminar un set, y doble check al finalizar el partido.
const ESTADOS_ICONO: Record<number, string> = {
  1: 'settings-outline', 2: 'settings-outline', 3: 'settings-outline', 4: 'settings-outline',
  5: 'create-outline', 6: 'create-outline', 7: 'create-outline', 8: 'create-outline',
  9: 'shuffle-outline',
  10: 'clipboard-outline', 11: 'play', 12: 'checkmark-circle-outline',
  13: 'clipboard-outline', 14: 'play', 15: 'checkmark-circle-outline',
  16: 'shuffle-outline',
  17: 'clipboard-outline', 18: 'play', 19: 'checkmark-circle-outline',
  20: 'clipboard-outline', 21: 'play', 22: 'checkmark-circle-outline',
  23: 'shuffle-outline',
  24: 'clipboard-outline', 25: 'play', 26: 'checkmark-circle-outline',
  27: 'create-outline', 28: 'create-outline', 29: 'create-outline', 30: 'create-outline', 31: 'create-outline', 32: 'create-outline',
  33: 'checkmark-done-outline',
};

export interface PartidoVista {
  torneo: string;
  equipoA: string;
  equipoB: string;
  sets: { a: number; b: number; victoria: 'A' | 'B' }[];
  estado: string;
  estadoColor: string;
  estadoIcono: string;
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
    estado: 'Config.',
    estadoColor: 'medium',
    estadoIcono: 'settings-outline',
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
    vista.estado = ESTADOS_TEXTO[partido.estado] || 'Config.';
    vista.estadoColor = ESTADOS_COLOR[partido.estado] || 'medium';
    vista.estadoIcono = ESTADOS_ICONO[partido.estado] || 'settings-outline';
  }

  return vista;
}

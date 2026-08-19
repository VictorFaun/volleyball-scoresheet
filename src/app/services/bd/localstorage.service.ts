import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  // Cada partido se guarda bajo su propia clave (en vez de todos juntos en
  // un solo bloque). Así, anotar un punto en un partido no implica
  // reescribir el historial completo de todos los demás partidos guardados.
  private readonly INDICE_KEY = 'volleyball_partidos_index';
  private readonly PARTIDO_PREFIX = 'volleyball_partido_';
  // Formato anterior: un solo bloque con el array completo de partidos.
  private readonly LEGACY_KEY = 'volleyball_app_data';

  // Piso conservador típico del límite de localStorage en navegadores y
  // WebViews (suele rondar 5-10MB). Se usa el valor más chico para avisar
  // con margen.
  private readonly LIMITE_ESTIMADO_BYTES = 5 * 1024 * 1024;

  private claveDePartido(id: string): string {
    return this.PARTIDO_PREFIX + id;
  }

  private leerIndice(): string[] {
    try {
      const json = localStorage.getItem(this.INDICE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error reading partidos index:', error);
      return [];
    }
  }

  private guardarIndice(ids: string[]): void {
    localStorage.setItem(this.INDICE_KEY, JSON.stringify(ids));
  }

  private generarId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Migra automáticamente los datos del formato anterior (un solo bloque
  // con todos los partidos) la primera vez que se detecta, y luego lo
  // elimina. Es seguro llamarla siempre: si no hay datos antiguos, no hace
  // nada.
  private migrarSiCorresponde(): void {
    const legacyJson = localStorage.getItem(this.LEGACY_KEY);
    if (!legacyJson) return;

    try {
      const partidosAntiguos = JSON.parse(legacyJson);
      if (Array.isArray(partidosAntiguos)) {
        for (const partido of partidosAntiguos) {
          this.guardarPartido(partido);
        }
      }
    } catch (error) {
      console.error('Error migrando datos antiguos de localStorage:', error);
    } finally {
      localStorage.removeItem(this.LEGACY_KEY);
    }
  }

  /**
   * Lee todos los partidos guardados.
   */
  getData(): any[] {
    this.migrarSiCorresponde();

    const ids = this.leerIndice();
    const partidos: any[] = [];
    for (const id of ids) {
      try {
        const json = localStorage.getItem(this.claveDePartido(id));
        if (json) partidos.push(JSON.parse(json));
      } catch (error) {
        console.error(`Error reading partido ${id} from localStorage:`, error);
      }
    }
    return partidos;
  }

  /**
   * Guarda (crea o actualiza) un único partido bajo su propia clave, sin
   * tocar los demás partidos ya guardados. Le asigna un id si todavía no
   * tiene uno.
   */
  guardarPartido(partido: any): void {
    if (!partido.id) {
      partido.id = this.generarId();
    }

    try {
      localStorage.setItem(this.claveDePartido(partido.id), JSON.stringify(partido));
    } catch (error) {
      console.error('Error saving partido to localStorage:', error);
      throw new Error('Failed to save partido to localStorage');
    }

    const ids = this.leerIndice();
    if (!ids.includes(partido.id)) {
      ids.push(partido.id);
      this.guardarIndice(ids);
    }
  }

  /**
   * Elimina un partido guardado por su id.
   */
  eliminarPartido(id: string): void {
    localStorage.removeItem(this.claveDePartido(id));
    const ids = this.leerIndice().filter(existente => existente !== id);
    this.guardarIndice(ids);
  }

  /**
   * Tamaño en bytes que ocuparía un valor al guardarlo (serializado a JSON).
   */
  tamanioEnBytes(valor: any): number {
    return new Blob([JSON.stringify(valor)]).size;
  }

  /**
   * Bytes actualmente ocupados por todo lo guardado en localStorage para
   * este origen (no solo los partidos), para compararlo contra el límite
   * estimado.
   */
  private usoTotalLocalStorage(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (!clave) continue;
      total += new Blob([clave + (localStorage.getItem(clave) || '')]).size;
    }
    return total;
  }

  /**
   * Espacio libre estimado, según el límite conservador asumido para
   * localStorage. No es un valor exacto (los navegadores no exponen la
   * cuota real de localStorage de forma confiable), pero sirve como aviso
   * temprano.
   */
  espacioDisponibleEstimado(): number {
    return Math.max(0, this.LIMITE_ESTIMADO_BYTES - this.usoTotalLocalStorage());
  }
}

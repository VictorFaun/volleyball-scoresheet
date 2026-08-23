import { Injectable } from '@angular/core';
import { FilesystemStorageService } from '../filesystem-storage/filesystem-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  private readonly COLECCION_PARTIDOS = 'partidos';
  private readonly COLECCION_COMPETENCIAS = 'competencias';

  // Claves del formato anterior (todo en localStorage). Se migran una sola
  // vez, la primera vez que se pide algo a este servicio, y luego se
  // eliminan. Es seguro llamar a la migración siempre: si no hay datos
  // antiguos, no hace nada.
  private readonly LEGACY_INDICE_PARTIDOS = 'volleyball_partidos_index';
  private readonly LEGACY_PARTIDO_PREFIX = 'volleyball_partido_';
  private readonly LEGACY_INDICE_COMPETENCIAS = 'volleyball_competencias_index';
  private readonly LEGACY_COMPETENCIA_PREFIX = 'volleyball_competencia_';
  // Formato aún más viejo: un solo bloque con todos los partidos.
  private readonly LEGACY_BLOQUE_UNICO = 'volleyball_app_data';
  // Marca que ya se hizo la migración a Filesystem, para no repetirla en
  // cada arranque (una vez migrado y borrado, localStorage ya no tiene
  // rastro de los datos originales para volver a detectarlos).
  private readonly LEGACY_MIGRADO_FLAG = 'volleyball_migrado_a_filesystem';

  private migracion: Promise<void> | null = null;

  constructor(private storage: FilesystemStorageService) {}

  private migrarSiCorresponde(): Promise<void> {
    if (!this.migracion) {
      this.migracion = this.migrarInterno();
    }
    return this.migracion;
  }

  private async migrarInterno(): Promise<void> {
    if (localStorage.getItem(this.LEGACY_MIGRADO_FLAG) === 'true') return;

    try {
      // Formato viejísimo: un solo bloque con todos los partidos.
      const bloqueUnico = localStorage.getItem(this.LEGACY_BLOQUE_UNICO);
      if (bloqueUnico) {
        try {
          const partidosAntiguos = JSON.parse(bloqueUnico);
          if (Array.isArray(partidosAntiguos)) {
            for (const partido of partidosAntiguos) {
              await this.storage.guardar(this.COLECCION_PARTIDOS, partido);
            }
          }
        } catch (error) {
          console.error('Error migrando el bloque único de partidos:', error);
        }
        localStorage.removeItem(this.LEGACY_BLOQUE_UNICO);
      }

      // Partidos guardados en localStorage (índice + clave por id).
      const idsPartidos = this.leerIndiceLegacy(this.LEGACY_INDICE_PARTIDOS);
      for (const id of idsPartidos) {
        const json = localStorage.getItem(this.LEGACY_PARTIDO_PREFIX + id);
        if (json) {
          try {
            await this.storage.guardar(this.COLECCION_PARTIDOS, JSON.parse(json));
          } catch (error) {
            console.error(`Error migrando partido ${id}:`, error);
          }
        }
        localStorage.removeItem(this.LEGACY_PARTIDO_PREFIX + id);
      }
      if (idsPartidos.length) localStorage.removeItem(this.LEGACY_INDICE_PARTIDOS);

      // Competencias guardadas en localStorage.
      const idsCompetencias = this.leerIndiceLegacy(this.LEGACY_INDICE_COMPETENCIAS);
      for (const id of idsCompetencias) {
        const json = localStorage.getItem(this.LEGACY_COMPETENCIA_PREFIX + id);
        if (json) {
          try {
            await this.storage.guardar(this.COLECCION_COMPETENCIAS, JSON.parse(json));
          } catch (error) {
            console.error(`Error migrando competencia ${id}:`, error);
          }
        }
        localStorage.removeItem(this.LEGACY_COMPETENCIA_PREFIX + id);
      }
      if (idsCompetencias.length) localStorage.removeItem(this.LEGACY_INDICE_COMPETENCIAS);
    } finally {
      // Se marca migrado incluso si algo individual falló arriba, para no
      // reintentar en cada arranque; los errores puntuales ya quedaron en consola.
      localStorage.setItem(this.LEGACY_MIGRADO_FLAG, 'true');
    }
  }

  private leerIndiceLegacy(clave: string): string[] {
    try {
      const json = localStorage.getItem(clave);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error(`Error leyendo índice legacy "${clave}":`, error);
      return [];
    }
  }

  /**
   * Lee todos los partidos guardados.
   */
  async getData(): Promise<any[]> {
    await this.migrarSiCorresponde();
    return this.storage.obtenerTodos(this.COLECCION_PARTIDOS);
  }

  /**
   * Guarda (crea o actualiza) un único partido, sin tocar los demás.
   */
  async guardarPartido(partido: any): Promise<void> {
    await this.migrarSiCorresponde();
    await this.storage.guardar(this.COLECCION_PARTIDOS, partido);
  }

  /**
   * Elimina un partido guardado por su id.
   */
  async eliminarPartido(id: string): Promise<void> {
    await this.storage.eliminar(this.COLECCION_PARTIDOS, id);
  }

  /**
   * Lee todas las competencias guardadas.
   */
  async getCompetencias(): Promise<any[]> {
    await this.migrarSiCorresponde();
    return this.storage.obtenerTodos(this.COLECCION_COMPETENCIAS);
  }

  /**
   * Guarda (crea o actualiza) una única competencia.
   */
  async guardarCompetencia(competencia: any): Promise<void> {
    await this.migrarSiCorresponde();
    await this.storage.guardar(this.COLECCION_COMPETENCIAS, competencia);
  }

  /**
   * Elimina una competencia guardada por su id.
   */
  async eliminarCompetencia(id: string): Promise<void> {
    await this.storage.eliminar(this.COLECCION_COMPETENCIAS, id);
  }

  /**
   * Tamaño en bytes que ocuparía un valor al guardarlo (serializado a JSON).
   */
  tamanioEnBytes(valor: any): number {
    return new Blob([JSON.stringify(valor)]).size;
  }

  /**
   * Bytes reales ocupados por todo lo que esta app guarda vía Filesystem
   * (partidos, competencias y firmas), para la barra de almacenamiento de
   * Ajustes y el aviso de poco espacio.
   */
  async usoTotalAlmacenamiento(): Promise<number> {
    return this.storage.espacioUsado();
  }

  /**
   * Cuota total estimada del origen. Se apoya en navigator.storage.estimate()
   * cuando está disponible (ver FilesystemStorageService.espacioTotalEstimado);
   * si no, usa un piso conservador. Ya no es la cuota chica de localStorage:
   * los datos ahora viven en Filesystem (nativo) / IndexedDB (web), con
   * mucho más margen.
   */
  async limiteEstimadoBytes(): Promise<number> {
    const FALLBACK_BYTES = 50 * 1024 * 1024;
    const estimado = await this.storage.espacioTotalEstimado();
    return estimado ? estimado.cuotaOrigen : FALLBACK_BYTES;
  }

  /**
   * Espacio libre estimado (cuota estimada menos uso real). No es un valor
   * exacto (ver limiteEstimadoBytes), pero sirve como aviso temprano.
   */
  async espacioDisponibleEstimado(): Promise<number> {
    const [usado, total] = await Promise.all([
      this.usoTotalAlmacenamiento(),
      this.limiteEstimadoBytes()
    ]);
    return Math.max(0, total - usado);
  }
}

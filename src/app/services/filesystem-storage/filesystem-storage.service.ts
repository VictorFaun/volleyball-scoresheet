import { Injectable } from '@angular/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

/**
 * Almacenamiento tipo "base de datos de documentos" (colección + id -> JSON),
 * respaldado 100% por @capacitor/filesystem en vez de localStorage.
 *
 * - Nativo (Android/iOS): los archivos quedan en el almacenamiento privado
 *   real del dispositivo (Directory.Data), sin la cuota chica (~5-10MB) que
 *   tiene localStorage en el WebView.
 * - Web: la implementación web de Capacitor Filesystem guarda estos archivos
 *   en IndexedDB, que sí es medido por navigator.storage.estimate() (a
 *   diferencia de localStorage).
 *
 * No depende de nada específico de esta app: solo trabaja con "colecciones"
 * (un nombre de carpeta) e ids, así que este archivo se puede copiar tal
 * cual a otro proyecto Ionic/Capacitor.
 */
@Injectable({
  providedIn: 'root'
})
export class FilesystemStorageService {

  private readonly directorio = Directory.Data;

  private rutaArchivo(coleccion: string, id: string): string {
    return `${coleccion}/${id}.json`;
  }

  generarId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // guardar() se llama muy seguido (cada punto, cambio, tiempo, etc. llaman
  // a GameService.guardar()), y cada llamada puede terminar de resolver en
  // cualquier orden. Sin encolar, dos escrituras casi simultáneas a Filesystem
  // -incluso a archivos distintos- pueden pisarse o fallar en algunos
  // dispositivos. Esta cola global serializa TODAS las escrituras de este
  // servicio (una a la vez, en orden), sin bloquear lecturas.
  private colaEscritura: Promise<void> = Promise.resolve();

  /**
   * Guarda (crea o actualiza) un registro dentro de una colección. Si el
   * registro no tiene "id", se le asigna uno nuevo (mutando el objeto
   * recibido, igual que antes con localStorage). Devuelve el id usado.
   */
  async guardar(coleccion: string, datos: any): Promise<string> {
    if (!datos.id) {
      datos.id = this.generarId();
    }
    const id = datos.id;

    const escritura = this.colaEscritura.then(() =>
      Filesystem.writeFile({
        path: this.rutaArchivo(coleccion, id),
        data: JSON.stringify(datos),
        directory: this.directorio,
        encoding: Encoding.UTF8,
        // Crea la carpeta de la colección si todavía no existe.
        recursive: true
      })
    );
    // Encolar la siguiente escritura detrás de esta pase o falle (si no, un
    // guardado fallido dejaría la cola trabada para siempre).
    this.colaEscritura = escritura.then(() => undefined, () => undefined);

    await escritura;
    return id;
  }

  /**
   * Lee un único registro. Devuelve null si no existe (o no se pudo leer),
   * en vez de lanzar, ya que "no existe" es un resultado válido y esperado.
   */
  async obtener(coleccion: string, id: string): Promise<any | null> {
    try {
      const resultado = await Filesystem.readFile({
        path: this.rutaArchivo(coleccion, id),
        directory: this.directorio,
        encoding: Encoding.UTF8
      });
      return JSON.parse(resultado.data as string);
    } catch {
      return null;
    }
  }

  /**
   * Lee todos los registros de una colección. Si la colección todavía no
   * tiene ningún registro guardado (la carpeta no existe), devuelve [].
   */
  async obtenerTodos(coleccion: string): Promise<any[]> {
    let archivos;
    try {
      archivos = await Filesystem.readdir({ path: coleccion, directory: this.directorio });
    } catch {
      return [];
    }

    const registros: any[] = [];
    for (const archivo of archivos.files) {
      if (archivo.type !== 'file' || !archivo.name.endsWith('.json')) continue;
      try {
        const contenido = await Filesystem.readFile({
          path: `${coleccion}/${archivo.name}`,
          directory: this.directorio,
          encoding: Encoding.UTF8
        });
        registros.push(JSON.parse(contenido.data as string));
      } catch (error) {
        console.error(`Error leyendo "${archivo.name}" de la colección "${coleccion}":`, error);
      }
    }
    return registros;
  }

  /**
   * Elimina un registro. Si ya no existe, no hace nada (no lanza).
   */
  async eliminar(coleccion: string, id: string): Promise<void> {
    try {
      await Filesystem.deleteFile({ path: this.rutaArchivo(coleccion, id), directory: this.directorio });
    } catch {
      // Ya no estaba: nada que borrar.
    }
  }

  /**
   * Bytes reales ocupados. Sin argumento, suma TODO lo que este servicio
   * gestiona (todas las colecciones, recursivamente). Con una colección,
   * suma solo esa carpeta. A diferencia de una estimación, este número sale
   * de leer el tamaño real de cada archivo en disco.
   */
  async espacioUsado(coleccion?: string): Promise<number> {
    return this.sumarTamanioCarpeta(coleccion ?? '');
  }

  private async sumarTamanioCarpeta(ruta: string): Promise<number> {
    let archivos;
    try {
      archivos = await Filesystem.readdir({ path: ruta, directory: this.directorio });
    } catch {
      return 0;
    }

    let total = 0;
    for (const item of archivos.files) {
      if (item.type === 'directory') {
        const subruta = ruta ? `${ruta}/${item.name}` : item.name;
        total += await this.sumarTamanioCarpeta(subruta);
      } else {
        total += item.size;
      }
    }
    return total;
  }

  /**
   * Estimación best-effort del uso/cuota del origen completo (no exclusiva
   * de este servicio), vía la Storage API del navegador/WebView
   * (navigator.storage.estimate()). No es exacta ni está garantizada -por
   * eso "estimado"-, y en nativo puede no reflejar los archivos guardados
   * acá (viven fuera del storage manejado por el WebView). Se ofrece solo
   * como referencia informativa; null si la API no está disponible.
   */
  async espacioTotalEstimado(): Promise<{ usoOrigen: number; cuotaOrigen: number } | null> {
    if (!navigator?.storage?.estimate) return null;
    try {
      const { usage, quota } = await navigator.storage.estimate();
      if (quota === undefined) return null;
      return { usoOrigen: usage ?? 0, cuotaOrigen: quota };
    } catch {
      return null;
    }
  }
}

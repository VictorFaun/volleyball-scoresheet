import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';
import { mapearPartidoParaVista, PartidoVista } from 'src/app/services/game/partido-view.util';

interface GrupoFecha {
  fecha: any;
  partidos: PartidoVista[];
}

@Component({
  selector: 'app-competencia',
  templateUrl: './competencia.page.html',
  styleUrls: ['./competencia.page.scss'],
  standalone: false,
})
export class CompetenciaPage implements OnInit {

  competencia: any;
  grupos: GrupoFecha[] = [];
  partidosSinFecha: PartidoVista[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private _game_: GameService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.competencia = this._game_.competencias.find((c: any) => c.id === id);
    if (!this.competencia) {
      this.volver();
      return;
    }
    this.cargar();
  }

  volver() {
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }

  cargar() {
    const vista = (p: any) => mapearPartidoParaVista(
      p,
      this._game_.partidos.indexOf(p),
      (set, equipo) => this._game_.contarPuntos(set, equipo)
    );

    const fechas = this.competencia.fechas || [];
    this.grupos = fechas.map((f: any) => ({
      fecha: f,
      partidos: this._game_.partidosDeFecha(this.competencia.id, f.id).map(vista)
    }));
    this.grupos.forEach(g => g.partidos.sort((a, b) => (a.numero_partido || 0) - (b.numero_partido || 0)));

    this.partidosSinFecha = this._game_.partidosDeFecha(this.competencia.id, null)
      .map(vista)
      .sort((a, b) => (a.numero_partido || 0) - (b.numero_partido || 0));
  }

  irAFecha(fecha: any) {
    this.router.navigate(['/fecha'], { queryParams: { competenciaId: this.competencia.id, fechaId: fecha.id } });
  }

  irAConfiguracion() {
    this.router.navigate(['/competencia-config'], { queryParams: { id: this.competencia.id } });
  }

  async crearFecha() {
    const alert = await this.alertController.create({
      header: 'Crear fecha',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre (ej: Fecha 3)' },
        { name: 'cantidad', type: 'number', placeholder: 'Cantidad de partidos', min: 1 }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            const nombre = (data?.nombre || '').trim();
            const cantidad = parseInt(data?.cantidad, 10);
            if (!nombre || !cantidad || cantidad < 1) return false;
            this._game_.crearFecha(this.competencia, nombre, cantidad);
            this.cargar();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async nuevoPartido() {
    this._game_.setOrigenCompetencia(this.competencia.id);
    const fechas = this.competencia.fechas || [];
    if (!fechas.length) {
      await this._game_.new_game_en_competencia(this.competencia, null);
      return;
    }

    const SIN_FECHA = '__sin_fecha__';
    const inputs: any[] = fechas.map((f: any, i: number) => ({
      type: 'radio', label: f.nombre, value: f.id, checked: i === 0
    }));
    inputs.push({ type: 'radio', label: 'Sin fecha', value: SIN_FECHA, checked: false });

    const alert = await this.alertController.create({
      header: '¿A qué fecha pertenece?',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Continuar',
          handler: async (fechaId) => {
            await this._game_.new_game_en_competencia(this.competencia, fechaId === SIN_FECHA ? null : fechaId);
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarFecha(fecha: any) {
    const partidos = this._game_.partidosDeFecha(this.competencia.id, fecha.id);
    if (partidos.length === 0) {
      this._game_.confirmarConPalabra({
        header: 'Eliminar fecha',
        message: `Esta acción no se puede deshacer. Escribe "confirmo" para eliminar "${fecha.nombre}".`,
        onConfirm: async () => {
          await this._game_.eliminarFecha(this.competencia, fecha, false);
          this.cargar();
        }
      });
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar fecha',
      message: `"${fecha.nombre}" tiene ${partidos.length} partido(s). ¿Qué deseas hacer con ellos?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Archivar partidos',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Archivar y eliminar fecha',
              message: 'Los partidos quedarán archivados (recuperables desde "Archivados"). Escribe "confirmo" para continuar.',
              onConfirm: async () => {
                await this._game_.eliminarFecha(this.competencia, fecha, true);
                this.cargar();
              }
            });
          }
        },
        {
          text: 'Eliminar partidos',
          role: 'destructive',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Eliminar fecha y partidos',
              message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar la fecha y todos sus partidos.',
              onConfirm: async () => {
                await this._game_.eliminarFecha(this.competencia, fecha, false);
                this.cargar();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarCompetencia() {
    const partidos = this._game_.partidosDeCompetencia(this.competencia.id);
    if (partidos.length === 0) {
      this._game_.confirmarConPalabra({
        header: 'Eliminar competencia',
        message: `Esta acción no se puede deshacer. Escribe "confirmo" para eliminar "${this.competencia.nombre}".`,
        onConfirm: async () => {
          await this._game_.eliminarCompetencia(this.competencia, false);
          this.volver();
        }
      });
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar competencia',
      message: `"${this.competencia.nombre}" tiene ${partidos.length} partido(s). ¿Qué deseas hacer con ellos?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Archivar partidos',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Archivar y eliminar competencia',
              message: 'Los partidos quedarán archivados (recuperables desde "Archivados"). Escribe "confirmo" para continuar.',
              onConfirm: async () => {
                await this._game_.eliminarCompetencia(this.competencia, true);
                this.volver();
              }
            });
          }
        },
        {
          text: 'Eliminar partidos',
          role: 'destructive',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Eliminar competencia y partidos',
              message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar la competencia y todos sus partidos.',
              onConfirm: async () => {
                await this._game_.eliminarCompetencia(this.competencia, false);
                this.volver();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  edit_game(index: number) {
    this._game_.setOrigenCompetencia(this.competencia.id);
    this._game_.edit_game(index);
  }

  continuar_partido(index: number) {
    this._game_.setOrigenCompetencia(this.competencia.id);
    this._game_.continuarPartido(index);
  }

  exportarPartido(index: number) {
    this._game_.exportarPartido(index);
  }

  copiarPartido(index: number) {
    this._game_.copiarPartido(index);
  }

  // Toma los partidos finalizados de la competencia y arma, por grupo (o
  // una tabla general si no hay grupos creados), la tabla de posiciones
  // completa: PJ, PG, PP, sets y puntos a favor/en contra, y el puntaje que
  // define el orden (ya calculado según la config de puntos/desempate de
  // la competencia). Los partidos sin grupo (fase eliminatoria manual) no
  // entran en ninguna tabla. Mismo patrón de alert con HTML libre que usa
  // mostrarResumenPartido() en GameService.
  async verResultados() {
    const tablas = this._game_.resultadosCompetencia(this.competencia);
    if (!tablas.length) {
      const alert = await this.alertController.create({
        header: 'Resultados',
        message: 'Aún no hay partidos finalizados en esta competencia.',
        buttons: ['Entendido']
      });
      await alert.present();
      return;
    }

    const escapeHtml = (texto: string) => texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const estiloEncabezado = 'padding: 6px 4px; text-align: center; font-size: 10px; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; color: rgba(var(--ion-color-dark-rgb), 0.4); white-space: nowrap; overflow: hidden;';
    const estiloCelda = 'padding: 6px 4px; text-align: center; font-size: 12px;';
    const estiloCeldaEquipo = 'padding: 6px 4px; text-align: left; font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
    const filaBorde = 'border-top: 1px solid rgba(var(--ion-color-dark-rgb), 0.08);';

    const tablasHtml = tablas.map(tabla => {
      const filas = tabla.filas.map((f: any, i: number) => `
        <tr>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''}">${i + 1}</td>
          <td style="${estiloCeldaEquipo} ${i > 0 ? filaBorde : ''}">${escapeHtml(f.nombre)}</td>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''}">${f.pj}</td>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''}">${f.pg}</td>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''}">${f.pp}</td>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''}">${f.setsFavor}-${f.setsContra}</td>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''}">${f.puntosFavor}-${f.puntosContra}</td>
          <td style="${estiloCelda} ${i > 0 ? filaBorde : ''} font-weight: 700; color: var(--ion-color-primary);">${f.puntos}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-top: 16px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px;">${escapeHtml(tabla.nombre)}</div>
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
            <tr>
              <th style="${estiloEncabezado} width: 7%;">#</th>
              <th style="${estiloEncabezado} width: 27%; text-align: left;">Equipo</th>
              <th style="${estiloEncabezado} width: 9%;">PJ</th>
              <th style="${estiloEncabezado} width: 9%;">PG</th>
              <th style="${estiloEncabezado} width: 9%;">PP</th>
              <th style="${estiloEncabezado} width: 13%;">Sets</th>
              <th style="${estiloEncabezado} width: 16%;">Puntos</th>
              <th style="${estiloEncabezado} width: 10%;">Pts</th>
            </tr>
            ${filas}
          </table>
        </div>
      `;
    }).join('');

    const alert = await this.alertController.create({
      cssClass: 'no-padding-header no-padding-message alert-resultados',
      htmlAttributes: {
        innerHTML: `
          <h2 class="alert-title sc-ion-alert-ios" style="text-align: center; padding-top: 12px;">Resultados</h2>
          <div style="padding: 4px 16px 12px;">${tablasHtml}</div>
        `
      },
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  eliminarPartido(index: number) {
    const partido = this._game_.partidos[index];
    if (!partido) return;
    this._game_.confirmarConPalabra({
      header: 'Eliminar partido',
      message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar el partido.',
      onConfirm: async () => {
        await this._game_.eliminarPartidosDefinitivo([partido]);
        this.cargar();
      }
    });
  }

}

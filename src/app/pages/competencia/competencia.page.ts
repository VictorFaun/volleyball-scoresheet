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

  async renombrar() {
    const alert = await this.alertController.create({
      header: 'Renombrar competencia',
      inputs: [{ name: 'nombre', type: 'text', value: this.competencia.nombre }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const nombre = (data?.nombre || '').trim();
            if (!nombre) return false;
            this._game_.renombrarCompetencia(this.competencia, nombre);
            this.cargar();
            return true;
          }
        }
      ]
    });
    await alert.present();
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

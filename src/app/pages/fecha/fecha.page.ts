import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';
import { mapearPartidoParaVista, PartidoVista } from 'src/app/services/game/partido-view.util';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.page.html',
  styleUrls: ['./fecha.page.scss'],
  standalone: false,
})
export class FechaPage implements OnInit {

  competencia: any;
  fecha: any;
  partidos: PartidoVista[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private _game_: GameService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const competenciaId = this.route.snapshot.queryParamMap.get('competenciaId');
    const fechaId = this.route.snapshot.queryParamMap.get('fechaId');
    this.competencia = this._game_.competencias.find((c: any) => c.id === competenciaId);
    this.fecha = this.competencia?.fechas?.find((f: any) => f.id === fechaId);
    if (!this.competencia || !this.fecha) {
      this.volver();
      return;
    }
    this.cargar();
  }

  volver() {
    this.navCtrl.navigateBack('/competencia', {
      replaceUrl: true,
      queryParams: this.competencia ? { id: this.competencia.id } : undefined
    });
  }

  cargar() {
    this.partidos = this._game_.partidosDeFecha(this.competencia.id, this.fecha.id)
      .map((p: any) => mapearPartidoParaVista(
        p,
        this._game_.partidos.indexOf(p),
        (set, equipo) => this._game_.contarPuntos(set, equipo)
      ))
      .sort((a, b) => (a.numero_partido || 0) - (b.numero_partido || 0));
  }

  async renombrar() {
    const alert = await this.alertController.create({
      header: 'Renombrar fecha',
      inputs: [{ name: 'nombre', type: 'text', value: this.fecha.nombre }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const nombre = (data?.nombre || '').trim();
            if (!nombre) return false;
            this.fecha.nombre = nombre;
            this._game_.guardarCompetencia(this.competencia);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async nuevoPartido() {
    this._game_.setOrigenFecha(this.competencia.id, this.fecha.id);
    await this._game_.new_game_en_competencia(this.competencia, this.fecha.id);
  }

  async eliminarFecha() {
    if (this.partidos.length === 0) {
      this._game_.confirmarConPalabra({
        header: 'Eliminar fecha',
        message: `Esta acción no se puede deshacer. Escribe "confirmo" para eliminar "${this.fecha.nombre}".`,
        onConfirm: async () => {
          await this._game_.eliminarFecha(this.competencia, this.fecha, false);
          this.volver();
        }
      });
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar fecha',
      message: `"${this.fecha.nombre}" tiene ${this.partidos.length} partido(s). ¿Qué deseas hacer con ellos?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Archivar partidos',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Archivar y eliminar fecha',
              message: 'Los partidos quedarán archivados (recuperables desde "Archivados"). Escribe "confirmo" para continuar.',
              onConfirm: async () => {
                await this._game_.eliminarFecha(this.competencia, this.fecha, true);
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
              header: 'Eliminar fecha y partidos',
              message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar la fecha y todos sus partidos.',
              onConfirm: async () => {
                await this._game_.eliminarFecha(this.competencia, this.fecha, false);
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
    this._game_.setOrigenFecha(this.competencia.id, this.fecha.id);
    this._game_.edit_game(index);
  }

  continuar_partido(index: number) {
    this._game_.setOrigenFecha(this.competencia.id, this.fecha.id);
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

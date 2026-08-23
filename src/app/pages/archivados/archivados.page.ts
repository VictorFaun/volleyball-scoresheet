import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';
import { mapearPartidoParaVista, PartidoVista } from 'src/app/services/game/partido-view.util';

@Component({
  selector: 'app-archivados',
  templateUrl: './archivados.page.html',
  styleUrls: ['./archivados.page.scss'],
  standalone: false,
})
export class ArchivadosPage implements OnInit {

  partidos: PartidoVista[] = [];

  constructor(private navCtrl: NavController, private _game_: GameService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.cargar();
  }

  cargar() {
    this.partidos = this._game_.partidos
      .map((p: any, index: number) => ({ p, index }))
      .filter((item: { p: any; index: number }) => item.p.archivado)
      .map((item: { p: any; index: number }) => mapearPartidoParaVista(item.p, item.index, (set, equipo) => this._game_.contarPuntos(set, equipo)));
  }

  volver() {
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }

  restaurar(index: number) {
    const partido = this._game_.partidos[index];
    if (!partido) return;
    this._game_.restaurarPartido(partido);
    this.cargar();
  }

  eliminarDefinitivo(index: number) {
    const partido = this._game_.partidos[index];
    if (!partido) return;
    this._game_.confirmarConPalabra({
      header: 'Eliminar definitivamente',
      message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar el partido.',
      onConfirm: async () => {
        await this._game_.eliminarPartidosDefinitivo([partido]);
        this.cargar();
      }
    });
  }

}

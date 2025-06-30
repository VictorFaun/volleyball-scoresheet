import { Component } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-create-jugador',
  templateUrl: './create-jugador.page.html',
  styleUrls: ['./create-jugador.page.scss'],
  standalone: false,
})
export class CreateJugadorPage {

  nombre: string = '';
  dorsal: number | null = null;
  index: number | null = null;
  equipo: string = ""

  constructor(private modalCtrl: ModalController, private _game_: GameService, private alertCtrl: AlertController) { }

  // Se llama automáticamente cuando se inyectan las propiedades
  ionViewWillEnter() {
    const navParams = (this as any)['componentProps'] || {}; // truco si no se usan @Input()
    if (navParams.nombre) this.nombre = navParams.nombre;
    if (navParams.dorsal !== undefined) this.dorsal = navParams.dorsal;
    if (navParams.index !== undefined) this.index = navParams.index;
    if (navParams.equipo !== undefined) this.equipo = navParams.equipo;
  }

  async guardar() {
    if (this.nombre && this.dorsal !== null) {
      if (this.dorsalRepetido(this.dorsal, this.index)) {
        const alert = await this.alertCtrl.create({
          header: 'Numero repetido',
          cssClass: 'custom-alert',
          message: `Ya existe un jugador con el numero ${this.dorsal} en el Equipo ${this.equipo}.`,
          buttons: ['Aceptar']
        });

        await alert.present();
        return;
      }
      this.modalCtrl.dismiss({
        nombre: this.nombre,
        dorsal: this.dorsal,
        index: this.index
      });
    }
  }

  dorsalRepetido(dorsal: number, indexActual: number | null = null): boolean {
    const jugadores = this.equipo === 'A'
      ? this._game_.partido.equipo_a.jugadores
      : this._game_.partido.equipo_b.jugadores;

    return jugadores.some((j: any, i: number) => j.numero === dorsal && i !== indexActual);
  }

  eliminar() {
    this.modalCtrl.dismiss({
      eliminar: true
    });
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }
}
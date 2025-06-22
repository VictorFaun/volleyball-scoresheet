import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-jugador',
  templateUrl: './create-jugador.page.html',
  styleUrls: ['./create-jugador.page.scss'],
  standalone: false,
})
export class CreateJugadorPage{

  nombre: string = '';
  dorsal: number | null = null;

  constructor(private modalCtrl: ModalController) {}

  guardar() {
    if (this.nombre && this.dorsal !== null) {
      this.modalCtrl.dismiss({ nombre: this.nombre, dorsal: this.dorsal });
    }
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }
}

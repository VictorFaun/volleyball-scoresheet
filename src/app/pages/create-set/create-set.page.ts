import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-create-set',
  templateUrl: './create-set.page.html',
  styleUrls: ['./create-set.page.scss'],
  standalone: false,
})
export class CreateSetPage implements OnInit {

  num: any;

  set: any;

  constructor(private router: Router, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController) { }

  volver() {
    this.router.navigate(["home"]);
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.num = params['num'];
      if (this.num == 1) {
        this.set = this._game_.partido.set_1
      }
    });
  }

  async siguiente() {
  const aCompleto = this.set.alineacion_a.every((j:any) => j && typeof j === 'number');
  const bCompleto = this.set.alineacion_b.every((j:any) => j && typeof j === 'number');
  const saqueValido = this.set.equipo_saque === 'A' || this.set.equipo_saque === 'B';

  if (!saqueValido) {
    const alert = await this.alertController.create({
      header: 'Saque inválido',
      cssClass: 'custom-alert',
      message: 'Debes seleccionar un equipo válido para el saque (A o B).',
      buttons: ['Aceptar']
    });
    await alert.present();
    return;
  }

  if (!aCompleto || !bCompleto) {
    const equipo = !aCompleto ? 'A' : 'B';
    const alert = await this.alertController.create({
      header: 'Alineación incompleta',
      cssClass: 'custom-alert',
      message: `La alineación inicial del Equipo ${equipo} no está completa. Debes asignar los 6 Jugadores.`,
      buttons: ['Aceptar']
    });

    await alert.present();
    return;
  }

  // Todas las validaciones pasaron
  this._game_.confirm_set(this.num);
}


  async alineacion(equipo: 'A' | 'B', pos: number) {
    const jugadores = equipo === 'A'
      ? this._game_.partido.equipo_a.jugadores
      : this._game_.partido.equipo_b.jugadores;

    const alineacion = equipo === 'A'
      ? this.set.alineacion_a
      : this.set.alineacion_b;

    // Filtrar jugadores que no sean líberos
    const jugadoresFiltrados = jugadores.filter((j: any) => !j.libero);

    const inputs = jugadoresFiltrados.map((j: any) => ({
      name: `jugador-${j.numero}`,
      type: 'radio',
      label: `[ ${j.numero} ] ${j.nombre}`,
      value: j.numero,
      checked: alineacion[pos] === j.numero
    }));

    const alert = await this.alertController.create({
      header: 'Selecciona un jugador',
      cssClass: 'custom-alert',
      inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (selectedValue: any) => {
            const indexExistente = alineacion.findIndex((num: any, i: number) =>
              num === selectedValue && i !== pos
            );

            if (indexExistente !== -1) {
              alineacion[indexExistente] = false;
            }

            alineacion[pos] = selectedValue;
          }
        }
      ]
    });

    await alert.present();
  }

  async seleccionar_equipo() {
    const alert = await this.alertController.create({
      header: 'Selecciona un equipo',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'A',
          type: 'radio',
          label: 'Equipo A',
          value: 'A',
          checked: this.set.equipo_saque == "A"
        },
        {
          name: 'B',
          type: 'radio',
          label: 'Equipo B',
          value: 'B',
          checked: this.set.equipo_saque == "B"
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (selectedValue) => {
            this.set.equipo_saque = selectedValue;
          }
        }
      ]
    });

    await alert.present();
  }

}

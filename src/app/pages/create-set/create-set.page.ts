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

  ionViewWillLeave() {
    this._game_.guardar();
  }

  volver() {
    this._game_.guardar();
    this.router.navigate(["home"], { replaceUrl: true });
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.num = params['num'];
      if (this.num == 1) {
        this.set = this._game_.partido.set_1
      }
      if (this.num == 2) {
        this.set = this._game_.partido.set_2
      }
      if (this.num == 3) {
        this.set = this._game_.partido.set_3
      }
      if (this.num == 4) {
        this.set = this._game_.partido.set_4
      }
      if (this.num == 5) {
        this.set = this._game_.partido.set_5
      }
    });
  }

  async siguiente() {
  const aCompleto = this.set.alineacion_a.every((j:any) => j && typeof j === 'number');
  const bCompleto = this.set.alineacion_b.every((j:any) => j && typeof j === 'number');

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

  // Nombre del equipo que corresponde a un lado, para mostrarlo entre
  // paréntesis junto a "Equipo A"/"Equipo B".
  nombreEquipoLado(lado: 'A' | 'B'): string {
    return this._game_.obtenerEquipoPorLado(lado)?.nombre || `Equipo ${lado}`;
  }

  async alineacion(equipo: 'A' | 'B', pos: number) {
    const jugadores = this._game_.obtenerEquipoPorLado(equipo).jugadores;

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
            this._game_.guardar();
          }
        }
      ]
    });

    await alert.present();
  }

}

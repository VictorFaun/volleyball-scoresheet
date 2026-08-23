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

  // true si el set ya se empezó a jugar (tiene hora de inicio, logs o
  // resultado) — a partir de eso la alineación inicial queda fija, aunque
  // se reingrese a esta vista con "editar" desde el inicio. Completar la
  // alineación por sí solo no bloquea la vista: se puede seguir editando
  // hasta que se apriete "Iniciar".
  bloqueado = false;

  constructor(private router: Router, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController) { }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  volver() {
    this._game_.guardar();
    this._game_.volverAOrigen();
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
      this.bloqueado = this._game_.setYaIniciado(this.num);
    });
  }

  async siguiente() {
  // El set ya se inició (o ya está finalizado): la alineación ya se usó
  // para jugar, así que solo se avanza sin volver a validar/tocar nada.
  if (this.bloqueado) {
    this._game_.confirm_set(this.num);
    return;
  }

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
    // Set ya iniciado: la alineación inicial ya se usó para jugar y no se
    // puede reordenar.
    if (this.bloqueado) return;

    const jugadores = this._game_.obtenerEquipoPorLado(equipo).jugadores;

    const alineacion = equipo === 'A'
      ? this.set.alineacion_a
      : this.set.alineacion_b;

    // Filtrar jugadores que no sean líberos
    const jugadoresFiltrados = jugadores.filter((j: any) => !j.libero);

    const inputs = jugadoresFiltrados.map((j: any) => ({
      name: `jugador-${j.numero}`,
      type: 'radio',
      label: `[ ${j.numero} ]${j.nombre ? ' ' + j.nombre : ''}`,
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

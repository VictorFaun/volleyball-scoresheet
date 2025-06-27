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

  siguiente() {
    console.log(this._game_.partido)
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

  async seleccionar_equipo(){
    const alert = await this.alertController.create({
      header: 'Selecciona un equipo',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'A',
          type: 'radio',
          label: 'Equipo A',
          value: 'A',
          checked: this.set.equipo_saque=="A"
        },
        {
          name: 'B',
          type: 'radio',
          label: 'Equipo B',
          value: 'B',
          checked: this.set.equipo_saque=="B"
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

import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import { CreateJugadorPage } from 'src/app/modals/create-jugador/create-jugador.page';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: false,
})
export class TeamPage implements OnInit {

  lado: string = '';
  equipo:any;

  constructor(private navCtrl: NavController,private route: ActivatedRoute,private _game_: GameService,private modalCtrl: ModalController) { }
  volver() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.lado = params['lado'];
      if(this.lado == "A"){
        this.equipo = this._game_.partido.equipo_a;
      }
      if(this.lado == "B"){
        this.equipo = this._game_.partido.equipo_b;
      }
    });
  }

  siguiente(){
    if(this.lado == "A"){
      this._game_.new_equipo("B");
    }
    if(this.lado == "B"){
      this._game_.new_firma(1);
    }
  }

  async abrirModalJugador() {
  const modal = await this.modalCtrl.create({
    component: CreateJugadorPage,
    cssClass: ['modal-centrado']
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();
  if (data) {
    let jugador = this._game_.clean_jugador();
    jugador.numero= data.dorsal;
    jugador.nombre= data.nombre;
    if(!this.equipo.jugadores){
      this.equipo.jugadores=[jugador]
    }else{
      this.equipo.jugadores.push(jugador)
    }
  }
}
}

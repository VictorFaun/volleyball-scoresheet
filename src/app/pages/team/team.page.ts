import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: false,
})
export class TeamPage implements OnInit {

  lado: string = '';
  equipo:any;

  constructor(private navCtrl: NavController,private route: ActivatedRoute,private _game_: GameService) { }
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
      console.log(this._game_.partido)
      console.log(this._game_.partidos)
    }
  }

}

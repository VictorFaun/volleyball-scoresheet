import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit {

  partido:any;

  constructor(private navCtrl: NavController,private _game_: GameService) { }
  volver() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.partido = this._game_.partido;
  }

  siguiente(){
    this._game_.new_equipo("A")
  }

}

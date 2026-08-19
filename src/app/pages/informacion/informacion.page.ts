import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
  standalone: false,
})
export class InformacionPage implements OnInit {

  partido: any;

  constructor(private navCtrl: NavController, private _game_: GameService) { }

  ngOnInit() {
    this.partido = this._game_.partido;
  }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  volver() {
    this._game_.guardar();
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
  }

  siguiente() {
    this._game_.new_equipo(1);
  }

}

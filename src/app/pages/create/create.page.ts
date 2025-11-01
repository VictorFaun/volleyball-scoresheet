import { Component, DoCheck, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalstorageService } from 'src/app/services/bd/localstorage.service';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit, DoCheck {

  partido:any;

  constructor(private navCtrl: NavController,private _game_: GameService, private _localStorage_: LocalstorageService) { }
  volver() {
    this.navCtrl.navigateBack('/home');
  }

  ngOnInit() {
    this.partido = this._game_.partido;
  }

  siguiente(){
    this._game_.new_equipo("A")
  }
  
  ngDoCheck() {
    this._localStorage_.saveData(this._game_.partidos);
  }

}

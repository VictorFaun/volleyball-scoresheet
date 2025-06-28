import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit {

  set:any
  logs:any=[]
  constructor(private router: Router, private route: ActivatedRoute, private _game_: GameService) { }
  volver() {
    this.router.navigate(["home"]);
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.set = params['set'];
      if(this.set == 1){
        this.logs = this._game_.partido.set_1.logs
      }
      if(this.set == 2){
        this.logs = this._game_.partido.set_2.logs
      }
      if(this.set == 3){
        this.logs = this._game_.partido.set_3.logs
      }
      if(this.set == 4){
        this.logs = this._game_.partido.set_4.logs
      }
      if(this.set == 5){
        this.logs = this._game_.partido.set_5.logs
      }
    });
  }

}

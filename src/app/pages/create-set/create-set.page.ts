import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-create-set',
  templateUrl: './create-set.page.html',
  styleUrls: ['./create-set.page.scss'],
  standalone: false,
})
export class CreateSetPage implements OnInit {

  num:any;

  constructor(private navCtrl: NavController,private route: ActivatedRoute,private _game_: GameService) { }
  
  volver() {
    this.navCtrl.back();
  }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.num = params['num'];
    });
  }

  siguiente(){
    console.log(this._game_.partido)
  }

}

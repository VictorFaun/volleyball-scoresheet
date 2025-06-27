import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit {

  constructor(private router: Router,private navCtrl: NavController) { }
  volver() {
    this.router.navigate(["home"]);
  }

  ngOnInit() {
  }

}

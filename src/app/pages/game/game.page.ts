import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: false,
})
export class GamePage implements OnInit {

  set:any

  constructor(private router: Router, private route: ActivatedRoute) { }
  volver() {
    this.router.navigate(["home"]);
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.set = params['set'];
    });
  }

}

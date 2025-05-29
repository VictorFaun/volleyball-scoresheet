import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit {

  players:any = [];

  constructor(private router: Router,private navCtrl: NavController) { }
  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }
  volver() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

}

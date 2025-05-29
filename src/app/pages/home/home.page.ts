import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  partidos: any = [
    {
      torneo: "Test",
      equipoA: "UBB",
      setsA: 2,
      equipoB: "VOLEICO",
      setsB: 0,
      estado: "Iniciado",

    },
    {
      torneo: "Test",
      equipoA: "UBB",
      setsA: 2,
      equipoB: "VOLEICO",
      setsB: 1,
      estado: "Iniciado",

    }
  ]

  constructor(private router: Router) { }
  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }

}

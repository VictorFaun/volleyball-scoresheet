import { Component } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';

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

  constructor(private _game_: GameService) { }

  new_game(){
    this._game_.new_game();
  }

}

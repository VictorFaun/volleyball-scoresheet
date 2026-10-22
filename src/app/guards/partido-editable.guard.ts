import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GameService } from '../services/game/game.service';

// Impide entrar a cualquier vista del asistente de partido (create,
// informacion, team, sorteo, create-set, game, signature) cuando el partido
// activo ya está finalizado. Así un partido cerrado no se puede reabrir por
// ningún camino (botón editar, historial del navegador, URL directa); solo
// queda verlo en su resumen/detalle, exportarlo o recorrerlo en modo solo
// vista (botón del ojo, ver GameService.ver_partido), donde nada se guarda.
@Injectable({
  providedIn: 'root'
})
export class PartidoEditableGuard implements CanActivate {
  constructor(private _game_: GameService) {}

  canActivate(): boolean {
    return this._game_.soloLectura || !this._game_.partidoFinalizado(this._game_.partido);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PartidoVista } from 'src/app/services/game/partido-view.util';

// Tarjeta de partido reutilizada en Home y en la vista de Competencia: mismo
// diseño (nombre de equipos, marcador por set, estado) y mismas acciones al
// deslizar (editar, exportar, copiar, eliminar).
@Component({
  selector: 'app-partido-card',
  templateUrl: './partido-card.component.html',
  styleUrls: ['./partido-card.component.scss'],
  standalone: false,
})
export class PartidoCardComponent {

  @Input() partido!: PartidoVista;
  @Input() mostrarTorneo = false;

  @Output() continuar = new EventEmitter<void>();
  @Output() editar = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<void>();
  @Output() copiar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();

}

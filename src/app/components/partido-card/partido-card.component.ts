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

  // Solo el pill de "Config." (estado sin empezar) actúa como atajo directo
  // a editar los datos básicos del partido. En cualquier otro estado, el
  // pill es solo informativo: el click cae al comportamiento normal de la
  // tarjeta (continuar.emit(), que retoma el paso exacto donde quedó).
  onEstadoPillClick(event: Event) {
    if (this.partido.estadoColor !== 'medium') return;
    event.stopPropagation();
    this.editar.emit();
  }

  // Fondo del pill de estado: mezcla el color del estado con el fondo de la
  // página (color-mix, no rgba, para que no se transparente durante el
  // swipe de la tarjeta). "medium" (Config.) es gris igual que el fondo
  // tenue de la card, así que sin un porcentaje más alto quedan casi
  // indistinguibles; el resto de los colores ya contrastan por el tono.
  estadoPillBackground(): string {
    const porcentaje = this.partido.estadoColor === 'medium' ? 35 : 18;
    return `color-mix(in srgb, var(--ion-color-${this.partido.estadoColor}) ${porcentaje}%, var(--ion-background-color) ${100 - porcentaje}%)`;
  }

}

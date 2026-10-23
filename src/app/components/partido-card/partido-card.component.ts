import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PartidoVista } from 'src/app/services/game/partido-view.util';

// Tarjeta de partido reutilizada en Home y en la vista de Competencia: mismo
// diseño (nombre de equipos, marcador por set, estado) y mismas acciones al
// deslizar: "más" y eliminar. "Más" abre un menú con el resto de las
// acciones (editar -o ver, si ya finalizó-, exportar, copiar JSON, editar
// JSON y mover a otra competencia/fecha): con un botón por acción no
// cabían en la pantalla.
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
  @Output() ver = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<void>();
  @Output() copiar = new EventEmitter<void>();
  @Output() editarJson = new EventEmitter<void>();
  @Output() mover = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();

  constructor(private actionSheetController: ActionSheetController) { }

  async mostrarMas() {
    const menu = await this.actionSheetController.create({
      header: this.mostrarTorneo && this.partido.torneo ? this.partido.torneo : `Partido N° ${this.partido.numero_partido}`,
      buttons: [
        this.partido.finalizado
          ? { text: 'Ver partido', icon: 'eye-outline', handler: () => this.ver.emit() }
          : { text: 'Editar partido', icon: 'pencil', handler: () => this.editar.emit() },
        { text: 'Exportar planilla', icon: 'document-text-outline', handler: () => this.exportar.emit() },
        { text: 'Copiar JSON', icon: 'copy-outline', handler: () => this.copiar.emit() },
        { text: 'Editar JSON', icon: 'code-slash-outline', handler: () => this.editarJson.emit() },
        { text: 'Mover a competencia / fecha', icon: 'folder-open-outline', handler: () => this.mover.emit() },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await menu.present();
  }

  // Solo el pill de "Config."(estado sin empezar) actúa como atajo directo
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

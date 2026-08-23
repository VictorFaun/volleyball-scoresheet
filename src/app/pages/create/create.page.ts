import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';
import { ComponentCanDeactivate } from 'src/app/guards/can-deactivate.guard';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit, ComponentCanDeactivate {

  partido:any;

  // Firmas que se piden durante el flujo del partido, en el orden en que
  // aparecen. Cada una se puede desactivar para saltarla directo al
  // siguiente paso (ver GameService.new_firma / avanzarDespuesDeFirma).
  firmasConfig = [
    { num: 1, label: 'Capitán A (inicio)' },
    { num: 2, label: 'Entrenador A' },
    { num: 3, label: 'Capitán B (inicio)' },
    { num: 4, label: 'Entrenador B' },
    { num: 5, label: 'Capitán A (fin)' },
    { num: 6, label: 'Capitán B (fin)' },
    { num: 7, label: 'Planillero' },
    { num: 8, label: 'Asistente Planillero' },
    { num: 9, label: 'Segundo Árbitro' },
    { num: 10, label: 'Primer Árbitro' },
  ];

  constructor(private navCtrl: NavController, private _game_: GameService, private alertController: AlertController) { }

  volver() {
    this._game_.volverAOrigen();
  }

  // Se ejecuta ante cualquier intento de salir de esta vista: el botón
  // "volver", el botón/gesto físico de retroceso de Android, etc. Si el
  // partido aún no fue confirmado (no existe en la lista de partidos), avisa
  // antes de descartarlo en vez de perderlo silenciosamente.
  canDeactivate(): boolean | Promise<boolean> {
    if (this._game_.index !== null && this._game_.index !== undefined) {
      this._game_.guardar();
      return true;
    }

    return new Promise<boolean>(resolve => {
      this.alertController.create({
        header: 'Partido no guardado',
        message: 'Este partido todavía no se ha guardado. ¿Deseas salir de todas formas o guardarlo antes de salir?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Salir de todas formas',
            role: 'destructive',
            handler: () => resolve(true)
          },
          {
            text: 'Guardar y salir',
            handler: () => {
              this._game_.crearPartido();
              this._game_.guardar();
              resolve(true);
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  ngOnInit() {
    this.partido = this._game_.partido;
    // Partidos creados antes de que existiera esta opción no traen el campo.
    if (!this.partido.firmas_habilitadas) {
      this.partido.firmas_habilitadas = this._game_.clean_firmas_habilitadas();
    }
  }

  siguiente(){
    this._game_.crearPartido();
    this._game_.new_informacion();
  }

  // Una vez que algún set ya tiene alineación cargada o ya se inició, la
  // cantidad de sets del partido queda fija (cambiarla invalidaría el
  // formato de puntos y el cálculo del ganador ya usado).
  partidoEnCurso(): boolean {
    return this._game_.partidoEnCurso();
  }

  activarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.partido.firmas_habilitadas[f.num] = true);
  }

  desactivarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.partido.firmas_habilitadas[f.num] = false);
  }

}

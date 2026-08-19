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
  autocompletar:boolean = false;

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
    this.navCtrl.navigateBack('/home', { replaceUrl: true });
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

  activarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.partido.firmas_habilitadas[f.num] = true);
  }

  desactivarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.partido.firmas_habilitadas[f.num] = false);
  }

  buscar_torneo(){
    if (!this.partido?.competicion || !this._game_.partidos) {
      this.autocompletar = false;
      return;
    }

    const existeTorneo = this._game_.partidos.some((partido: any, index: number) =>
      index !== this._game_.index &&
      partido.competicion &&
      partido.competicion.toLowerCase() === this.partido.competicion.toLowerCase()
    );

    this.autocompletar = existeTorneo;
  }

  autocompletarDatos(){
    const partido = this.buscarPartido();
    if (partido) {
      this.partido.competicion = partido.competicion;
      this.partido.numero_partido = partido.numero_partido + 1;
      this.partido.numero_sets = partido.numero_sets;
      this.partido.fecha = partido.fecha;
      this.partido.hora = partido.hora;
      this.partido.ciudad = partido.ciudad;
      this.partido.pais = partido.pais;
      this.partido.gimnasio = partido.gimnasio;
      this.partido.division = partido.division;
      this.partido.categoria = partido.categoria;
      this.partido.primer_arbitro = partido.primer_arbitro;
      this.partido.segundo_arbitro = partido.segundo_arbitro;
      this.partido.planillero = partido.planillero;
      this.partido.asistente_planillero = partido.asistente_planillero;
      this.partido.primer_banderin = partido.primer_banderin;
      this.partido.segundo_banderin = partido.segundo_banderin;
      this.partido.tercer_banderin = partido.tercer_banderin;
      this.partido.cuarto_banderin = partido.cuarto_banderin;
    }
    this.autocompletar = false;
    this._game_.guardar();
  }

  buscarPartido(){
    // Filter matching games (excluding current one)
    const partidos = this._game_.partidos.filter((partido: any, index: number) =>
      index !== this._game_.index &&
      partido.competicion &&
      partido.competicion.toLowerCase() === this.partido.competicion.toLowerCase()
    );

    if (partidos.length === 0) return null;
    if (partidos.length === 1) return partidos[0];

    // Sort by numero_partido (highest first), then by date and time (most recent first)
    partidos.sort((a: any, b: any) => {
      const numA = a.numero_partido || 0;
      const numB = b.numero_partido || 0;

      // If both have numero_partido and they're different, sort by numero_partido (highest first)
      if (numA > 0 && numB > 0 && numA !== numB) {
        return numB - numA;
      }

      // If both have the same numero_partido or one/both don't have it, sort by date and time
      const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const timeA = a.hora ? new Date(`1970-01-01T${a.hora}`).getTime() : 0;
      const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
      const timeB = b.hora ? new Date(`1970-01-01T${b.hora}`).getTime() : 0;

      // If both have dates, compare them
      if (dateA > 0 && dateB > 0) {
        // If dates are different, sort by date (newest first)
        if (dateA !== dateB) return dateB - dateA;
        // If same date, sort by time (newest first)
        return timeB - timeA;
      }

      // If only one has a date, prioritize the one with date
      if (dateA > 0) return -1;
      if (dateB > 0) return 1;

      // If neither has a date, maintain original order (last created first)
      return 0;
    });

    return partidos[0];
  }

}

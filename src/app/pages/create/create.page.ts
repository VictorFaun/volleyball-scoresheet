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

  opcionesPopoverSelect: any = { size: 'cover', alignment: 'start' };

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

  // Grupos de la competencia del partido (fase de grupos), si tiene alguno
  // configurado. Vacío si el partido está suelto o su competencia no tiene
  // grupos creados: en ese caso el select de grupo no se muestra.
  get gruposDisponibles(): any[] {
    if (!this.partido?.competencia_id) return [];
    const competencia = this._game_.competencias.find((c: any) => c.id === this.partido.competencia_id);
    return competencia?.grupos || [];
  }

  // Otros partidos sueltos con el mismo nombre de competición, de los que se
  // pueden copiar los datos de este partido (ver autocompletarDatos).
  get partidosParaAutocompletar(): any[] {
    return this._game_.soloLectura ? [] : this._game_.partidosSueltosMismaCompeticion();
  }

  async autocompletarDatos() {
    const partidos = this.partidosParaAutocompletar;
    if (!partidos.length) return;
    const alert = await this.alertController.create({
      header: 'Autocompletar datos',
      subHeader: 'Selecciona el partido del que copiar los datos',
      inputs: partidos.map((p: any, i: number) => ({
        type: 'radio',
        label: this._game_.etiquetaPartidoAutocompletar(p),
        value: i,
        checked: i === 0
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Usar',
          handler: (i: number) => {
            if (i === undefined || i === null) return false;
            this.copiarDatosDe(partidos[i]);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  // Copia la configuración y la información general (lugar, división,
  // categoría, fecha y oficiales). No copia lo propio de cada partido:
  // número, etiqueta, fase, grupo, hora, equipos ni sets.
  private copiarDatosDe(origen: any) {
    if (!this.partidoEnCurso()) this.partido.numero_sets = origen.numero_sets;
    this.partido.cambio_lado_ultimo_set = origen.cambio_lado_ultimo_set;
    if (origen.firmas_habilitadas) this.partido.firmas_habilitadas = { ...origen.firmas_habilitadas };
    const campos = [
      'ciudad', 'pais', 'gimnasio', 'division', 'categoria', 'fecha',
      'primer_arbitro', 'segundo_arbitro', 'planillero', 'asistente_planillero',
      'primer_arbitro_pais', 'segundo_arbitro_pais', 'planillero_pais', 'asistente_planillero_pais',
      'primer_banderin', 'segundo_banderin', 'tercer_banderin', 'cuarto_banderin',
    ];
    campos.forEach(c => this.partido[c] = origen[c] ?? null);
    this._game_.guardar();
  }

  activarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.partido.firmas_habilitadas[f.num] = true);
  }

  desactivarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.partido.firmas_habilitadas[f.num] = false);
  }

}

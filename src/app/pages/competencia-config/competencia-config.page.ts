import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-competencia-config',
  templateUrl: './competencia-config.page.html',
  styleUrls: ['./competencia-config.page.scss'],
  standalone: false,
})
export class CompetenciaConfigPage implements OnInit {

  competencia: any;
  config: any;

  // Colores disponibles para identificar la competencia en la lista de Home
  // (nombres de ion-color, igual que se usan para los estados de partido).
  coloresDisponibles = ['medium', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'danger'];

  // Íconos disponibles para lo mismo: genéricos (no de un deporte en
  // particular, salvo "volleyball", el ícono propio de la app). El resto son
  // de Ionicons (ya vienen con la app, no hace falta registrar nada nuevo).
  // "volleyball" es un caso especial: no es un ionicon, se resuelve como
  // src="assets/icon/volleyball.svg" en el template (ver esIconoVolleyball()).
  iconosDisponibles = [
    'volleyball', 'trophy-outline', 'medal-outline', 'ribbon-outline', 'podium-outline',
    'star-outline', 'flag-outline', 'shield-outline', 'flame-outline',
    'calendar-outline', 'people-outline', 'school-outline', 'earth-outline'
  ];

  esIconoVolleyball(icono: string): boolean {
    return icono === 'volleyball';
  }

  // Mismo listado que create.page.ts, para mantener el mismo orden/labels.
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

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private _game_: GameService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.competencia = this._game_.competencias.find((c: any) => c.id === id);
    if (!this.competencia) {
      this.volver();
      return;
    }
    if (!this.competencia.configuracionDefault) {
      this.competencia.configuracionDefault = this._game_.clean_configuracion_default();
    }
    this.config = this.competencia.configuracionDefault;
  }

  ionViewWillLeave() {
    if (this.competencia) this._game_.guardarCompetencia(this.competencia);
  }

  volver() {
    this.navCtrl.navigateBack('/competencia', {
      replaceUrl: true,
      queryParams: this.competencia ? { id: this.competencia.id } : undefined
    });
  }

  activarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.config.firmas_habilitadas[f.num] = true);
  }

  desactivarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.config.firmas_habilitadas[f.num] = false);
  }

}

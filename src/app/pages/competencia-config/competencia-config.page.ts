import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
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
  configResultados: any;

  // Claves de puntos3/puntos5 en el orden en que se muestran los inputs.
  clavesPuntos3 = ['2-0', '2-1'];
  clavesPuntos5 = ['3-0', '3-1', '3-2'];

  etiquetasCriterio: Record<string, string> = {
    puntos: 'Puntos',
    ratioSets: 'Ratio de sets',
    ratioPuntos: 'Ratio de puntos'
  };

  pestanaActual: 'diseno' | 'configuracion' | 'resultados' = 'diseno';

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
    private alertController: AlertController,
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

    if (!this.competencia.configuracionResultados) {
      this.competencia.configuracionResultados = this._game_.clean_configuracion_resultados();
    }
    this.configResultados = this.competencia.configuracionResultados;
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

  // El input de nombre edita competencia.nombre directo (ngModel). Al salir
  // del campo, se pasa por renombrarCompetencia() -no un guardado genérico-
  // porque ese método también actualiza el campo "competicion" de los
  // partidos ya creados en esta competencia (para que no queden con un
  // nombre desactualizado) y guarda todo junto.
  guardarNombre() {
    const nombre = (this.competencia.nombre || '').trim();
    if (!nombre) return;
    this._game_.renombrarCompetencia(this.competencia, nombre);
  }

  activarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.config.firmas_habilitadas[f.num] = true);
  }

  desactivarTodasLasFirmas() {
    this.firmasConfig.forEach(f => this.config.firmas_habilitadas[f.num] = false);
  }

  // Mueve un criterio de desempate un puesto arriba (-1) o abajo (1) dentro
  // de configResultados.criteriosDesempate. El orden de esa lista es el que
  // usa GameService.calcularTablaGrupo para romper empates en puntos.
  moverCriterio(indice: number, direccion: -1 | 1) {
    const lista = this.configResultados.criteriosDesempate;
    const nuevoIndice = indice + direccion;
    if (nuevoIndice < 0 || nuevoIndice >= lista.length) return;
    [lista[indice], lista[nuevoIndice]] = [lista[nuevoIndice], lista[indice]];
  }

  cantidadPartidosDeGrupo(grupo: any): number {
    return this._game_.partidosDeGrupo(this.competencia.id, grupo.id).length;
  }

  async crearGrupo() {
    const alert = await this.alertController.create({
      header: 'Crear grupo',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre (ej: Grupo A)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            const nombre = (data?.nombre || '').trim();
            if (!nombre) return false;
            this._game_.crearGrupo(this.competencia, nombre);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  // Si el grupo no tiene partidos asignados, se elimina con la misma
  // confirmación por palabra que se usa en el resto de la app. Si tiene, se
  // bloquea la eliminación y se muestra el listado de partidos afectados
  // (para que el usuario los reasigne o desvincule primero).
  async eliminarGrupo(grupo: any) {
    const partidos = this._game_.partidosDeGrupo(this.competencia.id, grupo.id);
    if (partidos.length === 0) {
      this._game_.confirmarConPalabra({
        header: 'Eliminar grupo',
        message: `Esta acción no se puede deshacer. Escribe "confirmo" para eliminar "${grupo.nombre}".`,
        onConfirm: async () => {
          await this._game_.eliminarGrupo(this.competencia, grupo);
        }
      });
      return;
    }

    const listado = partidos
      .map((p: any) => {
        const fecha = (this.competencia.fechas || []).find((f: any) => f.id === p.fecha_id);
        return fecha ? `Partido ${p.numero_partido}, ${fecha.nombre}` : `Partido ${p.numero_partido}`;
      })
      .join(' · ');

    const alert = await this.alertController.create({
      header: 'No se puede eliminar el grupo',
      message: `Quita la asignación de los partidos de "${grupo.nombre}" antes de eliminarlo: ${listado}.`,
      buttons: ['Entendido']
    });
    await alert.present();
  }

}

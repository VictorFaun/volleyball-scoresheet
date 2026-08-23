import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';
import { LocalstorageService } from 'src/app/services/bd/localstorage.service';
import { mapearPartidoParaVista, PartidoVista } from 'src/app/services/game/partido-view.util';
import { ThemeService } from 'src/app/services/theme/theme.service';

interface CompetenciaResumen {
  competencia: any;
  cantidadPartidos: number;
  cantidadFechas: number;
  actividad: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  tabActual: 'partidos' | 'competencias' | 'ajustes' = 'partidos';

  get tituloVista(): string {
    if (this.tabActual === 'competencias') return 'Competencias';
    if (this.tabActual === 'ajustes') return 'Ajustes';
    return 'Scoresheets';
  }

  partidosSueltos: PartidoVista[] = [];
  competenciasResumen: CompetenciaResumen[] = [];
  archivadosCount = 0;

  almacenamientoUsadoTexto = '';
  almacenamientoTotalTexto = '';
  almacenamientoFraccion = 0;

  constructor(
    private _game_: GameService,
    private alertController: AlertController,
    private router: Router,
    private localStorageService: LocalstorageService,
    public themeService: ThemeService
  ) { }
  ngOnInit(): void {
  }

  async new_game(){
    await this._game_.new_game();
  }
  edit_game(index:any){
    this._game_.setOrigenHome();
    this._game_.edit_game(index);
  }


  ionViewWillEnter() {
    this._game_.index = null;
    this.cargaPartidos()
  }

  actualizarAlmacenamiento() {
    const usados = this.localStorageService.usoTotalLocalStorage();
    const total = this.localStorageService.limiteEstimadoBytes();
    this.almacenamientoFraccion = total > 0 ? Math.min(1, usados / total) : 0;
    this.almacenamientoUsadoTexto = this.formatearBytes(usados);
    this.almacenamientoTotalTexto = this.formatearBytes(total);
  }

  private formatearBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  cargaPartidos(){
    this.partidosSueltos = [];
    for (let index = 0; index < this._game_.partidos.length; index++) {
      const partido = this._game_.partidos[index];
      if (partido.archivado || partido.competencia_id) continue;
      this.partidosSueltos.push(
        mapearPartidoParaVista(partido, index, (set, equipo) => this._game_.contarPuntos(set, equipo))
      );
    }
    // Más recientes primero; sin fecha quedan al final.
    this.partidosSueltos.sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    });

    this.competenciasResumen = this._game_.competencias.map((competencia: any) => {
      const partidos = this._game_.partidosDeCompetencia(competencia.id);
      const actividad = partidos.reduce((max: number, p: any) => {
        const t = p.fecha ? new Date(p.fecha).getTime() : 0;
        return t > max ? t : max;
      }, 0);
      return {
        competencia,
        cantidadPartidos: partidos.length,
        cantidadFechas: competencia.fechas?.length || 0,
        actividad
      };
    });
    this.competenciasResumen.sort((a, b) => b.actividad - a.actividad);

    this.archivadosCount = this._game_.partidosArchivados().length;

    this.actualizarAlmacenamiento();
  }

  irACompetencia(competencia: any) {
    this.router.navigate(['/competencia'], { queryParams: { id: competencia.id } });
  }

  irAArchivados() {
    this.router.navigate(['/archivados']);
  }

  async nuevaCompetencia() {
    const alert = await this.alertController.create({
      header: 'Nueva competencia',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre de la competencia' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            const nombre = (data?.nombre || '').trim();
            if (!nombre) return false;
            const competencia = this._game_.nuevaCompetencia(nombre);
            this.irACompetencia(competencia);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarCompetencia(resumen: CompetenciaResumen) {
    if (resumen.cantidadPartidos === 0) {
      this._game_.confirmarConPalabra({
        header: 'Eliminar competencia',
        message: `Esta acción no se puede deshacer. Escribe "confirmo" para eliminar "${resumen.competencia.nombre}".`,
        onConfirm: async () => {
          await this._game_.eliminarCompetencia(resumen.competencia, false);
          this.cargaPartidos();
        }
      });
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar competencia',
      message: `"${resumen.competencia.nombre}" tiene ${resumen.cantidadPartidos} partido(s). ¿Qué deseas hacer con ellos?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Archivar partidos',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Archivar y eliminar competencia',
              message: 'Los partidos quedarán archivados (recuperables desde "Archivados"). Escribe "confirmo" para continuar.',
              onConfirm: async () => {
                await this._game_.eliminarCompetencia(resumen.competencia, true);
                this.cargaPartidos();
              }
            });
          }
        },
        {
          text: 'Eliminar partidos',
          role: 'destructive',
          handler: () => {
            this._game_.confirmarConPalabra({
              header: 'Eliminar competencia y partidos',
              message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar la competencia y todos sus partidos.',
              onConfirm: async () => {
                await this._game_.eliminarCompetencia(resumen.competencia, false);
                this.cargaPartidos();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  eliminarPartido(index: number) {
    const partido = this._game_.partidos[index];
    if (!partido) return;
    this._game_.confirmarConPalabra({
      header: 'Eliminar partido',
      message: 'Esta acción no se puede deshacer. Escribe "confirmo" para eliminar el partido.',
      onConfirm: async () => {
        await this._game_.eliminarPartidosDefinitivo([partido]);
        this.cargaPartidos();
      }
    });
  }

  continuar_partido(index: number){
    this._game_.setOrigenHome();
    this._game_.continuarPartido(index);
  }

  exportarPartido(index: number) {
    this._game_.exportarPartido(index);
  }

  copiarPartido(index: number) {
    this._game_.copiarPartido(index);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game/game.service';

// Edición del O-2 general de un equipo de la competencia: el plantel completo
// inscrito. Al completar un partido (team.page.ts) se eligen desde acá los
// jugadores que van a jugar (O-2 bis).
@Component({
  selector: 'app-competencia-equipo',
  templateUrl: './competencia-equipo.page.html',
  styleUrls: ['./competencia-equipo.page.scss'],
  standalone: false,
})
export class CompetenciaEquipoPage implements OnInit {

  competencia: any;
  equipo: any;

  // Nombre vigente, para restaurarlo si el usuario lo deja vacío o repetido.
  private nombreGuardado = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private _game_: GameService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    const competenciaId = this.route.snapshot.queryParamMap.get('competenciaId');
    const equipoId = this.route.snapshot.queryParamMap.get('equipoId');
    this.competencia = this._game_.competencias.find((c: any) => c.id === competenciaId);
    this.equipo = this.competencia?.equipos?.find((e: any) => e.id === equipoId);
    if (!this.competencia || !this.equipo) {
      this.volver();
      return;
    }
    if (!this.equipo.jugadores) this.equipo.jugadores = [];
    this.nombreGuardado = this.equipo.nombre || '';
    // Cubre el caso de crear el equipo directamente con el nombre "EP1".
    this.revisarEquipoPrueba();
  }

  ionViewWillLeave() {
    if (this.competencia) this._game_.guardarCompetencia(this.competencia);
  }

  volver() {
    this.navCtrl.navigateBack('/competencia-config', {
      replaceUrl: true,
      queryParams: this.competencia ? { id: this.competencia.id, pestana: 'equipos' } : undefined
    });
  }

  guardar() {
    this._game_.guardarCompetencia(this.competencia);
  }

  guardarNombre() {
    const nombre = (this.equipo.nombre || '').trim();
    const repetido = this._game_.buscarEquipoCompetencia(this.competencia, nombre);
    if (!nombre || (repetido && repetido !== this.equipo)) {
      this.equipo.nombre = this.nombreGuardado;
      if (nombre) this.mostrarError(`Ya existe un equipo llamado "${repetido.nombre}" en esta competencia.`);
      return;
    }
    this.equipo.nombre = nombre;
    this.nombreGuardado = nombre;
    this.guardar();
  }

  // Igual que en team.page.ts: al escribir "EP1" se ofrece cargar el equipo
  // de prueba. Se pregunta una sola vez mientras el nombre siga siendo EP1.
  private ultimoEquipoPruebaConsultado: string | null = null;

  revisarEquipoPrueba() {
    const clave = (this.equipo?.nombre || '').trim().toUpperCase();
    if (!this._game_.equiposPrueba[clave]) {
      this.ultimoEquipoPruebaConsultado = null;
      return;
    }
    if (this.ultimoEquipoPruebaConsultado === clave) return;
    this.ultimoEquipoPruebaConsultado = clave;
    this.confirmarCargarEquipoPrueba(clave);
  }

  async confirmarCargarEquipoPrueba(clave: string) {
    const alert = await this.alertController.create({
      header: 'Equipo de prueba',
      message: `¿Deseas cargar el ${this._game_.equiposPrueba[clave].nombre}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', handler: () => this.cargarEquipoPrueba(clave) }
      ]
    });
    await alert.present();
  }

  // Si ya hay otro equipo con el nombre de prueba en la competencia, se le
  // agrega un número ("Equipo de Prueba 2", ...) para no repetir nombres.
  cargarEquipoPrueba(clave: string) {
    const datos = this._game_.equiposPrueba[clave];
    let nombre = datos.nombre;
    for (let n = 2; ; n++) {
      const existente = this._game_.buscarEquipoCompetencia(this.competencia, nombre);
      if (!existente || existente === this.equipo) break;
      nombre = `${datos.nombre} ${n}`;
    }
    this.equipo.nombre = nombre;
    this.nombreGuardado = nombre;
    this.equipo.entrenador = datos.entrenador;
    this.equipo.primer_asistente = datos.primer_asistente;
    this.equipo.segundo_asistente = datos.segundo_asistente;
    this.equipo.medico = datos.medico;
    this.equipo.fisioterapeuta = datos.fisioterapeuta;
    this.equipo.jugadores = datos.jugadores.map((j: any) => ({ ...this._game_.clean_jugador(), ...j }));
    this.guardar();
  }

  jugadoresOrdenados(): any[] {
    return [...(this.equipo?.jugadores || [])].sort((a: any, b: any) => (a.numero ?? 0) - (b.numero ?? 0));
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async abrirModalJugador() {
    const alert = await this.alertController.create({
      cssClass: 'no-padding-message',
      header: 'Agregar Jugador',
      subHeader: 'Complete los datos del jugador',
      inputs: [
        { name: 'dorsal', id: 'input-dorsal-jugador-o2', type: 'number', placeholder: 'Número de camiseta', value: '' },
        { name: 'nombre', type: 'text', placeholder: 'Nombre del jugador (opcional)', value: '' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.dorsal === '' || data.dorsal === null || data.dorsal === undefined) return false;
            const dorsal = parseInt(data.dorsal, 10);
            if (this.equipo.jugadores.some((j: any) => j.numero === dorsal)) {
              this.mostrarError('Este número de camiseta ya está en uso');
              return false;
            }
            const jugador: any = this._game_.clean_jugador();
            jugador.numero = dorsal;
            jugador.nombre = data.nombre?.trim() || null;
            this.equipo.jugadores.push(jugador);
            this.guardar();
            return true;
          }
        }
      ]
    });
    await alert.present();

    const inputDorsal = alert.querySelector<HTMLInputElement>('#input-dorsal-jugador-o2');
    inputDorsal?.focus();
  }

  async editarJugador(jugador: any) {
    const dorsalOriginal = jugador.numero;
    const alert = await this.alertController.create({
      cssClass: 'no-padding-message',
      header: 'Editar Jugador',
      subHeader: 'Modifique los datos del jugador',
      inputs: [
        { name: 'dorsal', type: 'number', placeholder: 'Número de camiseta', value: dorsalOriginal },
        { name: 'nombre', type: 'text', placeholder: 'Nombre del jugador', value: jugador.nombre },
      ],
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            const idx = this.equipo.jugadores.indexOf(jugador);
            if (idx !== -1) this.equipo.jugadores.splice(idx, 1);
            this.guardar();
            return true;
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.dorsal === '' || data.dorsal === null || data.dorsal === undefined) return false;
            const nuevoDorsal = parseInt(data.dorsal, 10);
            if (nuevoDorsal !== dorsalOriginal && this.equipo.jugadores.some((j: any) => j !== jugador && j.numero === nuevoDorsal)) {
              this.mostrarError('Este número de camiseta ya está en uso');
              return false;
            }
            jugador.numero = nuevoDorsal;
            jugador.nombre = data.nombre?.trim() || null;
            this.guardar();
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

}

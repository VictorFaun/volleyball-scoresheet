import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  standalone: false,
})
export class TeamPage implements OnInit {

  numero: any;
  titulo: string = '';
  equipo: any;
  autocompletar: boolean = false;
  // Fuentes de autocompletado encontradas por buscarTeam().
  fuenteFecha: { partido: any, equipo: any } | null = null;
  equipoO2: any = null;
  sugerenciasO2: any[] = [];
  // Partido suelto: otros partidos sueltos de la misma competición (por
  // nombre) donde un equipo con este nombre ya tiene jugadores cargados.
  fuentesSueltos: { partido: any, equipo: any }[] = [];

  // Equipo de prueba rápido para testing (ver GameService.equiposPrueba).
  private get equiposPrueba() { return this._game_.equiposPrueba; }

  // Evita reabrir la alerta repetidamente mientras el nombre siga igual
  // (por ejemplo si el evento ionInput se disparara más de una vez).
  private ultimoEquipoPruebaConsultado: string | null = null;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private _game_: GameService, private alertController: AlertController) { }
  volver() {
    this._game_.guardar();
    this._game_.volverAOrigen();
  }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.numero = Number(params['numero']);
      if (this.numero == 1) {
        this.equipo = this._game_.partido.equipo_1;
        this.titulo = 'Equipo N°1';
      }
      if (this.numero == 2) {
        this.equipo = this._game_.partido.equipo_2;
        this.titulo = 'Equipo N°2';
      }
      this.buscarTeam();
    });
  }

  siguiente() {
    if (this.numero == 1) {
      this._game_.new_equipo(2);
    }
    if (this.numero == 2) {
      this._game_.new_sorteo(1);
    }
  }

  // Cupos restantes del O-2 bis (máx. 14 jugadores sin contar líberos y
  // máx. 2 líberos, ver GameService.cuposEquipo).
  get cupos() {
    return this._game_.cuposEquipo(this.equipo);
  }

  get maxJugadores() { return this._game_.MAX_JUGADORES_PARTIDO; }
  get maxLiberos() { return this._game_.MAX_LIBEROS_PARTIDO; }

  get cantidadJugadores(): number {
    return (this.equipo?.jugadores || []).filter((j: any) => !j.libero).length;
  }

  get cantidadLiberos(): number {
    return (this.equipo?.jugadores || []).filter((j: any) => j.libero).length;
  }

  // Marca/desmarca líbero respetando los cupos: no más de 2 líberos, y no se
  // puede pasar un líbero a jugador común si ya hay 14 comunes.
  cambiarLibero(jugador: any, event: any) {
    const marcado = !!event.detail.checked;
    if (marcado === !!jugador.libero) return;
    const cupos = this.cupos;
    if (marcado && cupos.liberos <= 0) {
      event.target.checked = false;
      this.mostrarError(`El equipo ya tiene ${this.maxLiberos} líberos, el máximo permitido.`);
      return;
    }
    if (!marcado && cupos.jugadores <= 0) {
      event.target.checked = true;
      this.mostrarError(`El equipo ya tiene ${this.maxJugadores} jugadores (sin contar líberos), el máximo permitido.`);
      return;
    }
    jugador.libero = marcado;
    this._game_.guardar();
  }

  // Valida que un plantel (antes de aplicarlo) respete los cupos.
  private plantelRespetaCupos(jugadores: any[]): boolean {
    const liberos = jugadores.filter(j => j.libero).length;
    const comunes = jugadores.length - liberos;
    if (comunes <= this.maxJugadores && liberos <= this.maxLiberos) return true;
    this.mostrarError(`Un equipo puede tener como máximo ${this.maxJugadores} jugadores y ${this.maxLiberos} líberos. La selección tiene ${comunes} jugadores y ${liberos} líbero${liberos === 1 ? '' : 's'}.`);
    return false;
  }

  async abrirModalJugador() {
    // Sin cupo de jugadores comunes pero con cupo de líbero: el nuevo
    // jugador entra directamente como líbero.
    const comoLibero = this.cupos.jugadores <= 0;
    if (comoLibero && this.cupos.liberos <= 0) return;
    const alert = await this.alertController.create({
      cssClass: 'no-padding-message',
      header: comoLibero ? 'Agregar Líbero' : 'Agregar Jugador',
      subHeader: comoLibero ? `Ya hay ${this.maxJugadores} jugadores: el nuevo se agregará como líbero` : 'Complete los datos del jugador',

      inputs: [
        {
          name: 'dorsal',
          id: 'input-dorsal-nuevo-jugador',
          type: 'number',
          placeholder: 'Número de camiseta',
          value: ''
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del jugador (opcional)',
          value: ''
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.dorsal === '' || data.dorsal === null || data.dorsal === undefined) {
              return false;
            }

            const dorsal = parseInt(data.dorsal, 10);

            // Verificar si el dorsal ya está en uso
            if (this.equipo.jugadores && this.equipo.jugadores.some((j: any) => j.numero === dorsal)) {
              this.mostrarError('Este número de camiseta ya está en uso');
              return false;
            }

            // Si todo está bien, agregar el jugador (el nombre es opcional)
            let jugador: any = this._game_.clean_jugador();
            jugador.numero = dorsal;
            jugador.nombre = data.nombre?.trim() || null;
            jugador.libero = comoLibero || null;

            if (!this.equipo.jugadores) {
              this.equipo.jugadores = [jugador];
            } else {
              this.equipo.jugadores.push(jugador);
            }
            this._game_.guardar();
            return true;
          }
        }
      ]
    });

    await alert.present();

    // Foco automático en el campo N° al crear (no al editar).
    const inputDorsal = alert.querySelector<HTMLInputElement>('#input-dorsal-nuevo-jugador');
    inputDorsal?.focus();
  }
  
  // Método auxiliar para mostrar mensajes de error
  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }
  
  async editarJugador(i: any) {
    const jugadorActual = this.equipo.jugadores[i];
    const dorsalOriginal = jugadorActual.numero;
    
    const alert = await this.alertController.create({
      cssClass: 'no-padding-message',
      header: 'Editar Jugador',
      subHeader: 'Modifique los datos del jugador',
      inputs: [
        {
          name: 'dorsal',
          type: 'number',
          placeholder: 'Número de camiseta',
          value: dorsalOriginal
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del jugador',
          value: jugadorActual.nombre
        },
      ],
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            if (this._game_.jugadorParticipoEnSets(this.equipo.lado, dorsalOriginal)) {
              this.mostrarError('No puedes eliminar a este jugador porque ya participó en un set (en la alineación o en un cambio). Si necesitas corregir sus datos, edita su nombre o dorsal en vez de eliminarlo.');
              return false;
            }

            const confirmAlert = await this.alertController.create({
              header: 'Confirmar',
              message: '¿Estás seguro de eliminar este jugador?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel'
                },
                {
                  text: 'Eliminar',
                  handler: () => {
                    this.equipo.jugadores.splice(i, 1);
                    this._game_.guardar();
                  }
                }
              ]
            });
            await confirmAlert.present();
            return false; // Prevent the alert from closing
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.dorsal === '' || data.dorsal === null || data.dorsal === undefined) {
              return false;
            }

            const nuevoDorsal = parseInt(data.dorsal, 10);

            // Si el dorsal cambió, verificar que no esté en uso
            if (nuevoDorsal !== dorsalOriginal) {
              const dorsalEnUso = this.equipo.jugadores.some(
                (j: any, index: number) =>
                  index !== i && j.numero === nuevoDorsal
              );

              if (dorsalEnUso) {
                this.mostrarError('Este número de camiseta ya está en uso');
                return false;
              }
            }

            // Si el dorsal cambió y el jugador ya estuvo en algún set,
            // actualizamos las alineaciones y logs guardados para que sigan
            // apuntando al jugador correcto.
            if (nuevoDorsal !== dorsalOriginal) {
              this._game_.actualizarDorsalEnSets(this.equipo.lado, dorsalOriginal, nuevoDorsal);
            }

            // Si todo está bien, actualizar el jugador (el nombre es opcional)
            this.equipo.jugadores[i].nombre = data.nombre?.trim() || null;
            this.equipo.jugadores[i].numero = nuevoDorsal;
            this._game_.guardar();
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }

  // Fuentes para autocompletar el equipo, según el partido:
  // 1. Mismo nombre ya completado en otro partido de la MISMA fecha: se
  //    ofrece copiar ese plantel (se asume que el O-2 bis se repite en la
  //    fecha), con la opción de rearmarlo desde el O-2 general.
  // 2. Si no, el O-2 general del equipo (Competencia > Configuración >
  //    Equipos): se eligen los jugadores que juegan este partido.
  // Un partido sin fecha solo usa el O-2 general. Uno fuera de una
  // competencia solo autocompleta desde otros partidos sueltos con el mismo
  // nombre de competición (ver buscarEquipoEnSueltos), además del equipo de
  // prueba EP1.
  buscarTeam(){
    // Modo solo vista: sin sugerencias ni ofertas de autocompletar.
    if (this._game_.soloLectura) {
      this.limpiarFuentesAutocompletar();
      return;
    }
    const nombreNormalizado = (this.equipo?.nombre || '').trim().toUpperCase();

    if (nombreNormalizado === 'EP1') {
      this.limpiarFuentesAutocompletar();
      if (this.ultimoEquipoPruebaConsultado !== nombreNormalizado) {
        this.ultimoEquipoPruebaConsultado = nombreNormalizado;
        this.confirmarCargarEquipoPrueba(nombreNormalizado);
      }
      return;
    }
    this.ultimoEquipoPruebaConsultado = null;

    const competencia = this.competenciaDelPartido();
    if (!this.equipo || !competencia) {
      this.limpiarFuentesAutocompletar();
      this.fuentesSueltos = this.buscarEquipoEnSueltos();
      this.autocompletar = this.fuentesSueltos.length > 0;
      return;
    }

    this.fuenteFecha = this.buscarEquipoEnFecha();
    this.equipoO2 = this._game_.buscarEquipoCompetencia(competencia, this.equipo.nombre);
    this.autocompletar = !!(this.fuenteFecha || this.equipoO2?.jugadores?.length);

    // Sugerencias de nombres del O-2 mientras no haya coincidencia exacta
    // (sin el equipo rival, que ya está tomado en este partido).
    const texto = this._game_.normalizarNombreEquipo(this.equipo.nombre);
    const rival = this.numero == 1 ? this._game_.partido.equipo_2 : this._game_.partido.equipo_1;
    const nombreRival = this._game_.normalizarNombreEquipo(rival?.nombre);
    this.sugerenciasO2 = this.equipoO2 ? [] : (competencia.equipos || [])
      .filter((e: any) => {
        const nombre = this._game_.normalizarNombreEquipo(e.nombre);
        return nombre.includes(texto) && nombre !== nombreRival;
      })
      .slice(0, 8);
  }

  private limpiarFuentesAutocompletar() {
    this.autocompletar = false;
    this.fuenteFecha = null;
    this.equipoO2 = null;
    this.sugerenciasO2 = [];
    this.fuentesSueltos = [];
  }

  private competenciaDelPartido(): any | null {
    const competenciaId = this._game_.partido?.competencia_id;
    if (!competenciaId) return null;
    return this._game_.competencias.find((c: any) => c.id === competenciaId) || null;
  }

  // Otro partido (no archivado) de la misma competencia y fecha donde un
  // equipo con este nombre ya tiene jugadores cargados. Si hay varios, el de
  // mayor número de partido (el más reciente de la fecha).
  private buscarEquipoEnFecha(): { partido: any, equipo: any } | null {
    const actual = this._game_.partido;
    const nombre = this._game_.normalizarNombreEquipo(this.equipo?.nombre);
    if (!nombre || !actual?.competencia_id || !actual.fecha_id) return null;

    let mejor: { partido: any, equipo: any } | null = null;
    this._game_.partidos.forEach((partido: any, index: number) => {
      if (index === this._game_.index || partido === actual || partido.archivado) return;
      if (partido.competencia_id !== actual.competencia_id || partido.fecha_id !== actual.fecha_id) return;
      const equipo = [partido.equipo_1, partido.equipo_2].find((e: any) =>
        e?.jugadores?.length && this._game_.normalizarNombreEquipo(e.nombre) === nombre
      );
      if (!equipo) return;
      if (!mejor || (partido.numero_partido || 0) > (mejor.partido.numero_partido || 0)) {
        mejor = { partido, equipo };
      }
    });
    return mejor;
  }

  // Partidos sueltos de la misma competición (por nombre) donde un equipo
  // con este nombre ya tiene jugadores cargados.
  private buscarEquipoEnSueltos(): { partido: any, equipo: any }[] {
    const nombre = this._game_.normalizarNombreEquipo(this.equipo?.nombre);
    if (!nombre) return [];
    const fuentes: { partido: any, equipo: any }[] = [];
    this._game_.partidosSueltosMismaCompeticion().forEach((partido: any) => {
      const equipo = [partido.equipo_1, partido.equipo_2].find((e: any) =>
        e?.jugadores?.length && this._game_.normalizarNombreEquipo(e.nombre) === nombre
      );
      if (equipo) fuentes.push({ partido, equipo });
    });
    return fuentes;
  }

  // Lista los partidos sueltos encontrados para elegir de cuál copiar el
  // equipo (plantel y cuerpo técnico).
  async seleccionarDesdeSueltos() {
    const fuentes = this.fuentesSueltos;
    if (!fuentes.length) return;
    const alert = await this.alertController.create({
      header: 'Autocompletar equipo',
      subHeader: 'Selecciona el partido del que copiar el equipo',
      inputs: fuentes.map((f, i) => ({
        type: 'radio',
        label: this._game_.etiquetaPartidoAutocompletar(f.partido),
        value: i,
        checked: i === 0
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Usar',
          handler: (i: number) => {
            if (i === undefined || i === null) return false;
            return this.aplicarPlantel(fuentes[i].equipo.jugadores, fuentes[i].equipo);
          }
        }
      ]
    });
    await alert.present();
  }

  seleccionarSugerencia(equipoO2: any) {
    this.equipo.nombre = equipoO2.nombre;
    this.buscarTeam();
    if (this.autocompletar) this.autocompletarDatos();
  }

  async autocompletarDatos(){
    if (this.fuentesSueltos.length) {
      await this.seleccionarDesdeSueltos();
      return;
    }
    const fuente = this.fuenteFecha;
    if (!fuente) {
      if (this.equipoO2) await this.seleccionarDesdeO2();
      return;
    }

    const buttons: any[] = [{ text: 'Cancelar', role: 'cancel' }];
    if (this.equipoO2?.jugadores?.length) {
      buttons.push({ text: 'Armar desde O-2', handler: () => { this.seleccionarDesdeO2(); } });
    }
    buttons.push({ text: 'Usar este', handler: () => { this.aplicarPlantel(fuente.equipo.jugadores, fuente.equipo); } });

    const cantidad = fuente.equipo.jugadores.length;
    const alert = await this.alertController.create({
      header: 'Autocompletar equipo',
      message: `"${fuente.equipo.nombre}" ya está completado en el Partido ${fuente.partido.numero_partido || '-'} de esta fecha (${cantidad} jugador${cantidad === 1 ? '' : 'es'}). ¿Usar el mismo O-2 bis?`,
      buttons
    });
    await alert.present();
  }

  // Lista todos los jugadores del O-2 general para elegir los que juegan
  // este partido (O-2 bis). Todos vienen desmarcados, salvo los que ya
  // participaron en un set, que vienen marcados y no se pueden desmarcar.
  async seleccionarDesdeO2() {
    const o2 = this.equipoO2;
    if (!o2?.jugadores?.length) return;

    const participo = (numero: number) => this._game_.jugadorParticipoEnSets(this.equipo.lado, numero);

    const inputs: any[] = [...o2.jugadores]
      .sort((a: any, b: any) => (a.numero ?? 0) - (b.numero ?? 0))
      .map((j: any) => ({
        type: 'checkbox',
        label: `${j.numero}${j.nombre ? ' - ' + j.nombre : ''}${j.libero ? ' (L)' : ''}${j.capitan ? ' (C)' : ''}`,
        value: j.numero,
        checked: participo(j.numero),
        disabled: participo(j.numero)
      }));

    const alert = await this.alertController.create({
      header: `O-2 de ${o2.nombre}`,
      subHeader: 'Selecciona los jugadores de este partido',
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Usar',
          handler: (seleccion: number[]) => {
            const elegidos = new Set(seleccion || []);
            const jugadores = o2.jugadores
              .filter((j: any) => elegidos.has(j.numero) || participo(j.numero))
              .sort((a: any, b: any) => (a.numero ?? 0) - (b.numero ?? 0));
            // Si se pasa de los cupos, el alert queda abierto para corregir.
            return this.aplicarPlantel(jugadores, o2);
          }
        }
      ]
    });
    await alert.present();
  }

  // Reemplaza el plantel del equipo por "jugadores" (copia profunda, para no
  // mutar el origen al editar acá) y copia el cuerpo técnico desde "origen".
  // Los jugadores que ya participaron en un set se conservan aunque no
  // vengan en la selección, para no romper alineaciones ni logs.
  // Devuelve false (sin aplicar nada) si el plantel resultante excede los
  // cupos de jugadores/líberos.
  private aplicarPlantel(jugadores: any[], origen: any): boolean {
    const nuevos = (jugadores || []).map((j: any) => ({ ...this._game_.clean_jugador(), ...j }));
    for (const j of this.equipo.jugadores || []) {
      if (this._game_.jugadorParticipoEnSets(this.equipo.lado, j.numero) && !nuevos.some((n: any) => n.numero === j.numero)) {
        nuevos.push({ ...j });
      }
    }
    if (!this.plantelRespetaCupos(nuevos)) return false;
    this.equipo.jugadores = nuevos;
    this.equipo.entrenador = origen.entrenador;
    this.equipo.primer_asistente = origen.primer_asistente;
    this.equipo.segundo_asistente = origen.segundo_asistente;
    this.equipo.medico = origen.medico;
    this.equipo.fisioterapeuta = origen.fisioterapeuta;
    this.equipo.nombre = origen.nombre;
    this._game_.guardar();
    return true;
  }

  async confirmarCargarEquipoPrueba(clave: 'EP1') {
    const alert = await this.alertController.create({
      header: 'Equipo de prueba',
      message: `¿Deseas cargar el ${this.equiposPrueba[clave].nombre}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => this.cargarEquipoPrueba(clave)
        }
      ]
    });
    await alert.present();
  }

  cargarEquipoPrueba(clave: 'EP1') {
    const datos = this.equiposPrueba[clave];
    this.equipo.nombre = datos.nombre;
    this.equipo.entrenador = datos.entrenador;
    this.equipo.primer_asistente = datos.primer_asistente;
    this.equipo.segundo_asistente = datos.segundo_asistente;
    this.equipo.medico = datos.medico;
    this.equipo.fisioterapeuta = datos.fisioterapeuta;
    this.equipo.jugadores = datos.jugadores.map((j: any) => ({ ...this._game_.clean_jugador(), ...j }));
    this._game_.guardar();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.page.html',
  styleUrls: ['./sorteo.page.scss'],
  standalone: false,
})
export class SorteoPage implements OnInit {

  set: any;
  partido: any;
  equipo1: any;
  equipo2: any;

  // true si el set ya tiene alineación cargada, ya se inició o ya tiene
  // logs/resultado — a partir de eso el sorteo (R-5) de ese set ya no se
  // puede volver a editar, aunque se reingrese con "editar" desde el inicio.
  bloqueado = false;

  // Solo el sorteo antes del set 1 define cuál equipo juega como A y cuál
  // como B. En el sorteo del set decisivo (set 3 a 3 sets, o set 5 a 5
  // sets) el lado de cada equipo ya está definido y solo se anota el saque.
  mostrarLados = false;

  equipoALado: 1 | 2 = 1;
  equipoBLado: 1 | 2 = 2;
  equipoSaque: 'A' | 'B' = 'A';

  // Solo se usan en el sorteo del set decisivo (!mostrarLados): qué equipo
  // arranca en cada lado de la cancha.
  equipoIzquierda: 'A' | 'B' = 'A';
  equipoDerecha: 'A' | 'B' = 'B';

  // Por defecto, la burbuja del select ("popover") solo cubre el ancho del
  // control cuando el modo es "md"; esta app fuerza modo "ios", así que sin
  // esto queda con tamaño automático y mal alineada respecto a la caja.
  opcionesPopoverSelect: any = { size: 'cover', alignment: 'start' };

  constructor(private router: Router, private route: ActivatedRoute, private _game_: GameService) { }

  ionViewWillLeave() {
    this._game_.guardar();
  }

  volver() {
    this._game_.guardar();
    this.router.navigate(['home'], { replaceUrl: true });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.set = Number(params['set']);
      this.partido = this._game_.partido;
      this.equipo1 = this.partido.equipo_1;
      this.equipo2 = this.partido.equipo_2;
      this.mostrarLados = this.set === 1;
      this.bloqueado = this._game_.setTieneProgreso(this.set);

      if (this.equipo1?.lado) {
        this.equipoALado = this.equipo1.lado === 'A' ? 1 : 2;
        this.equipoBLado = this.equipo1.lado === 'A' ? 2 : 1;
      }

      if (!this.mostrarLados) {
        // Por defecto se sugiere mantener el mismo lado del set anterior
        // (no se alterna solo, como en los sets intermedios): es un sorteo
        // real y el planillero debe confirmar el resultado a mano.
        const setAnterior = this.partido[`set_${this.set - 1}`];
        if (setAnterior?.lado_izquierda) {
          this.equipoIzquierda = setAnterior.lado_izquierda;
          this.equipoDerecha = this._game_.alternarEquipo(setAnterior.lado_izquierda);
        }
      }

      const setActual = this.partido[`set_${this.set}`];
      if (setActual?.equipo_saque) {
        this.equipoSaque = setActual.equipo_saque;
      }
      if (setActual?.lado_izquierda) {
        this.equipoIzquierda = setActual.lado_izquierda;
        this.equipoDerecha = this._game_.alternarEquipo(setActual.lado_izquierda);
      }
    });
  }

  // Los dos selects de lado se mantienen sincronizados entre sí: elegir un
  // equipo para un lado automáticamente deja el otro equipo en el lado
  // contrario.
  onCambioEquipoA(valor: 1 | 2) {
    this.equipoALado = valor;
    this.equipoBLado = valor === 1 ? 2 : 1;
  }

  onCambioEquipoB(valor: 1 | 2) {
    this.equipoBLado = valor;
    this.equipoALado = valor === 1 ? 2 : 1;
  }

  // Igual que arriba, pero para los selects de lado de cancha del sorteo
  // del set decisivo.
  onCambioEquipoIzquierda(valor: 'A' | 'B') {
    this.equipoIzquierda = valor;
    this.equipoDerecha = this._game_.alternarEquipo(valor);
  }

  onCambioEquipoDerecha(valor: 'A' | 'B') {
    this.equipoDerecha = valor;
    this.equipoIzquierda = this._game_.alternarEquipo(valor);
  }

  // Equipo actualmente asignado a cada lado (según la selección tentativa
  // de los dos selects de arriba), usados para mostrar el nombre entre
  // paréntesis en sus labels.
  get equipoAsignadoA(): any {
    return this.equipoALado === 1 ? this.equipo1 : this.equipo2;
  }
  get equipoAsignadoB(): any {
    return this.equipoALado === 1 ? this.equipo2 : this.equipo1;
  }

  // Nombre del equipo que corresponde a un lado, usado para mostrarlo junto
  // a "Equipo A"/"Equipo B" en el select de saque.
  nombreEquipoLado(lado: 'A' | 'B'): string {
    if (this.mostrarLados) {
      return (lado === 'A' ? this.equipoAsignadoA : this.equipoAsignadoB)?.nombre || `Equipo ${lado}`;
    }
    return this._game_.obtenerEquipoPorLado(lado)?.nombre || `Equipo ${lado}`;
  }

  // El texto que ion-select muestra en la caja cerrada lo toma del
  // contenido del <ion-select-option> seleccionado, y no se refresca solo
  // cuando ese texto cambia por interpolación (recién se actualiza al
  // interactuar con el control). Por eso el texto mostrado se controla acá
  // de forma explícita con "selectedText", que sí reacciona de inmediato.
  get textoEquipoSaqueSeleccionado(): string {
    return `Equipo ${this.equipoSaque} (${this.nombreEquipoLado(this.equipoSaque)})`;
  }

  confirmar() {
    // El set ya tiene alineación/logs/resultado: el sorteo queda fijo, solo
    // se avanza al siguiente paso sin volver a escribir sobre sus datos.
    if (this.bloqueado) {
      this._game_.new_set(this.set);
      return;
    }

    if (this.mostrarLados) {
      this.equipoAsignadoA.lado = 'A';
      this.equipoAsignadoB.lado = 'B';
    }

    const clave = `set_${this.set}`;
    if (!this.partido[clave]) {
      this.partido[clave] = this._game_.clean_set();
    }
    this.partido[clave].equipo_saque = this.equipoSaque;
    // El set 1 siempre empieza con el Equipo A a la izquierda; en el set
    // decisivo, el lado lo decide el sorteo de arriba.
    this.partido[clave].lado_izquierda = this.mostrarLados ? 'A' : this.equipoIzquierda;

    this._game_.guardar();
    this._game_.new_set(this.set);
  }

}

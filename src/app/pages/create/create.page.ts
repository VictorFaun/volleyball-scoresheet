import { Component, DoCheck, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalstorageService } from 'src/app/services/bd/localstorage.service';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit, DoCheck {

  partido:any;
  autocompletar:boolean = false;

  constructor(private navCtrl: NavController,private _game_: GameService, private _localStorage_: LocalstorageService) { }
  volver() {
    this.navCtrl.navigateBack('/home');
  }

  ngOnInit() {
    this.partido = this._game_.partido;
  }

  siguiente(){
    this._game_.new_equipo("A")
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

    console.log(this._game_.index)
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
    
  ngDoCheck() {
    this._localStorage_.saveData(this._game_.partidos);
  }

}

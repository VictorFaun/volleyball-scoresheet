import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  partido: any

  equipo_a: any

  equipo_b: any

  set: any

  log: any

  constructor() { }

  clean_log(){
    return { 
      id:null,
      tipo:null,
      jugador:null,
      equipo:null,
      set:null
    }
  }

  clean_jugador(){
    return{
      id:null,
      numero:null,
      nombre:null,
      capitan:null,
      libero:null,
      equipo:null
    }
  }

  clean_partido() {
    return {
      id: null,
      nombre: null,
      numero_partido: null,
      competicion: null,
      ciudad: null,
      pais: null,
      gimnasio: null,
      division: null,
      categoria: null,
      fecha: null,
      hora: null,
      primer_arbitro: null,
      segundo_arbitro: null,
      planillero: null,
      asistente_planillero: null,
      primer_banderin: null,
      segundo_banderin: null,
      tercer_banderin: null,
      cuarto_banderin: null,
      set_1:null,
      set_2:null,
      set_3:null,
      set_4:null,
      set_5:null,
      equipo_a:null,
      equipo_b:null
    }
  }

  clean_equipo() {
    return {
      id: null,
      nombre: null,
      entrenador: null,
      primer_asistente: null,
      segundo_asistente: null,
      medico: null,
      fisioterapeuta: null
    }
  }

  clean_set() {
    return {
      equipo_saque: null,
      alineacion_a: null,
      alineacion_b: null,
      hora_inicio:null,
      hora_fin:null
    }
  }
}

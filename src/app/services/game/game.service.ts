import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //Estados partidos
  //1: registrar partido
  //2: registrar equipo a
  //3: registrar equipo b
  //4: firma capitan a
  //5: firma entrenador a 
  //6: firma capitan b
  //7: firma entrenador b
  //8: configurar set 1
  //9: inicio set 1
  //10: termino set 1 
  //11: configurar set 2
  //12: inicio set 2
  //13: termino set 2 
  //14: configurar set 3
  //15: inicio set 3
  //16: termino set 3 
  //17: configurar set 4
  //18: inicio set 4
  //19: termino set 4 
  //20: configurar set 5
  //21: inicio set 5
  //22: termino set 5
  //23: firma capitan a
  //24: firma capitan b
  //25: firma planillero
  //26: firma asistente planillero
  //27: firma segundo arbitro
  //28: firma primer arbitro
  //29: finalizado

  partido: any

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
      libero:null
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
      equipo_b:null,
      estado:null
    }
  }

  clean_equipo() {
    return {
      id: null,
      nombre: null,
      jugadores:null,
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

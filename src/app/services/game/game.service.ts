import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
  partidos:any = [
    {
      "id": null,
      "numero_partido": 1,
      "competicion": "Test",
      "ciudad": null,
      "pais": null,
      "gimnasio": null,
      "division": null,
      "categoria": null,
      "fecha": null,
      "hora": null,
      "primer_arbitro": null,
      "segundo_arbitro": null,
      "planillero": null,
      "asistente_planillero": null,
      "primer_banderin": null,
      "segundo_banderin": null,
      "tercer_banderin": null,
      "cuarto_banderin": null,
      "set_1": {
          "equipo_saque": null,
          "alineacion_a": [
              false,
              false,
              false,
              false,
              false,
              false
          ],
          "alineacion_b": [
              false,
              false,
              false,
              false,
              false,
              false
          ],
          "hora_inicio": null,
          "hora_fin": null,
          "victoria": null
      },
      "set_2": null,
      "set_3": null,
      "set_4": null,
      "set_5": null,
      "equipo_a": {
          "id": null,
          "nombre": null,
          "jugadores": [
              {
                  "id": null,
                  "numero": 1,
                  "nombre": "Malote",
                  "capitan": null,
                  "libero": null
              },
              {
                  "id": null,
                  "numero": 2,
                  "nombre": "Marshall",
                  "capitan": null,
                  "libero": true
              }
          ],
          "entrenador": null,
          "primer_asistente": null,
          "segundo_asistente": null,
          "medico": null,
          "fisioterapeuta": null
      },
      "equipo_b": {
          "id": null,
          "nombre": null,
          "jugadores": [
              {
                  "id": null,
                  "numero": 3,
                  "nombre": "Victor",
                  "capitan": null,
                  "libero": null
              },
              {
                  "id": null,
                  "numero": 4,
                  "nombre": "Dani",
                  "capitan": null,
                  "libero": true
              }
          ],
          "entrenador": null,
          "primer_asistente": null,
          "segundo_asistente": null,
          "medico": null,
          "fisioterapeuta": null
      },
      "firma_inicio_capitan_a": null,
      "firma_inicio_capitan_b": null,
      "firma_fin_capitan_a": null,
      "firma_fin_capitan_b": null,
      "firma_entrenador_a": null,
      "firma_entrenador_b": null,
      "firma_planillero": null,
      "firma_asistente_planillero": null,
      "firma_primer_arbitro": null,
      "firma_segundo_arbitro": null,
      "estado": 8
    }
  ]
  index:any

  constructor(private router: Router) { }

  new_set(num:any){
    if(num == 1){
      if(this.partido.estado < 8)
      this.partido.estado=8
      if(!this.partido.set_1)
      this.partido.set_1 = this.clean_set()
      this.redireccionar('create-set', { num });
    }
  }

  new_firma(num:any){
    if(num == 1){
      if(this.partido.estado < 4)
      this.partido.estado=4
      this.redireccionar('signature', { num });
    }
    if(num == 2){
      if(this.partido.estado < 5)
      this.partido.estado=5
      this.redireccionar('signature', { num });
    }
    if(num == 3){
      if(this.partido.estado < 6)
      this.partido.estado=6
      this.redireccionar('signature', { num });
    }
    if(num == 4){
      if(this.partido.estado < 7)
      this.partido.estado=7
      this.redireccionar('signature', { num });
    }
  }

  new_equipo(lado: any) {

    if (lado == "A") {
      if(this.partido.estado < 2)
      this.partido.estado = 2;
      if(!this.partido.equipo_a)
      this.partido.equipo_a = this.clean_equipo();
      this.redireccionar('team', { lado: "A" });
    }
    if (lado == "B") {
      if(this.partido.estado < 3)
      this.partido.estado = 3;
      if(!this.partido.equipo_b)
      this.partido.equipo_b = this.clean_equipo();
      this.redireccionar('team', { lado: "B" });
    }
  }

  new_game() {
    
    this.partido = this.clean_partido();
    this.partidos.push(this.partido)
    this.redireccionar('create');
  }
  edit_game(index:any) {
    this.index = index
    this.partido = this.partidos[index]
    this.redireccionar('create');
  }

  redireccionar(ruta: string, parametros?: any) {
    if (parametros) {
      this.router.navigate([ruta], { queryParams: parametros });
    } else {
      this.router.navigate([ruta]);
    }
  }

  clean_log() {
    return {
      id: null,
      tipo: null,
      jugador: null,
      equipo: null,
      set: null
    }
  }

  clean_jugador() {
    return {
      id: null,
      numero: null,
      nombre: null,
      capitan: null,
      libero: null
    }
  }

  clean_partido() {
    return {
      id: null,
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
      set_1: null,
      set_2: null,
      set_3: null,
      set_4: null,
      set_5: null,
      equipo_a: null,
      equipo_b: null,
      firma_inicio_capitan_a:null,
      firma_inicio_capitan_b:null,
      firma_fin_capitan_a:null,
      firma_fin_capitan_b:null,
      firma_entrenador_a:null,
      firma_entrenador_b:null,
      firma_planillero:null,
      firma_asistente_planillero:null,
      firma_primer_arbitro:null,
      firma_segundo_arbitro:null,
      estado: 1
    }
  }

  clean_equipo() {
    return {
      id: null,
      nombre: null,
      jugadores: null,
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
      alineacion_a: [false,false,false,false,false,false],
      alineacion_b: [false,false,false,false,false,false],
      hora_inicio: null,
      hora_fin: null,
      victoria:null
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly STORAGE_KEY = 'volleyball_dark_mode';
  // Clase que activa la paleta oscura (@ionic/angular/css/palettes/dark.class.css).
  private readonly DARK_CLASS = 'ion-palette-dark';

  darkMode = false;

  constructor() {
    const guardado = localStorage.getItem(this.STORAGE_KEY);
    this.darkMode = guardado !== null
      ? guardado === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.aplicar();
  }

  setDarkMode(activo: boolean) {
    this.darkMode = activo;
    localStorage.setItem(this.STORAGE_KEY, String(activo));
    this.aplicar();
  }

  private aplicar() {
    document.documentElement.classList.toggle(this.DARK_CLASS, this.darkMode);
  }
}

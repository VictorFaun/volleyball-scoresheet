import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

// Guard genérico: intercepta cualquier intento de navegar fuera de la vista
// (botón "volver", botón/gesto físico de retroceso de Android, etc.) y
// delega la decisión al método canDeactivate() del propio componente.
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Promise<boolean> {
    return component.canDeactivate();
  }
}

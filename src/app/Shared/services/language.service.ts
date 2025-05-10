import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private idiomaActual: string = 'es';

  constructor() {
    this.cargarIdiomaPreferido();
  }

  cargarIdiomaPreferido() {
    const idiomaGuardado = localStorage.getItem('idioma');
    if (idiomaGuardado) {
      this.idiomaActual = idiomaGuardado;
    }
  }

  getIdiomaActual() {
    return this.idiomaActual;
  }

  cambiarIdioma(codigoIdioma: string) {
    this.idiomaActual = codigoIdioma;
    localStorage.setItem('idioma', codigoIdioma);
    // Aquí podrías disparar un evento para que toda la app se actualice
  }
}

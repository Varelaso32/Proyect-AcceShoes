import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Shared/services/auth.service';
import { ThemeService } from '../../../Shared/services/theme.service';
import { LanguageService } from '../../../Shared/services/language.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-admin.component.html',
  styleUrls: ['./configuracion-admin.component.css'],
})
export class ConfiguracionAdminComponent {
  modalAbierto: string | null = null;
  confirmarDesactivacion: boolean = false;

  idiomaSeleccionado: string = 'es';
  idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'Inglés' },
    { codigo: 'fr', nombre: 'Francés' },
    { codigo: 'de', nombre: 'Alemán' },
  ];

  temaSeleccionado: 'light' | 'dark' | 'system' = 'system';

  ubicacion = {
    pais: '',
    ciudad: '',
  };

  paises = [
    'Argentina',
    'Chile',
    'Colombia',
    'España',
    'México',
    'Perú',
    'Estados Unidos',
    'Otro',
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    this.cargarConfiguraciones();
  }

  cargarConfiguraciones() {
    this.idiomaSeleccionado = this.languageService.getIdiomaActual();
    this.temaSeleccionado = this.themeService.getCurrentTheme();
    this.ubicacion = {
      pais: 'Colombia',
      ciudad: 'Cali',
    };
  }

  abrirModal(modal: string) {
    this.modalAbierto = modal;
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.confirmarDesactivacion = false;
  }

  async cambiarIdioma() {
    this.languageService.cambiarIdioma(this.idiomaSeleccionado);
    this.cerrarModal();

    await Swal.fire({
      icon: 'success',
      title: 'Idioma cambiado',
      text: `El idioma ha sido cambiado a ${this.idiomaSeleccionado.toUpperCase()}.`,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  async cambiarTema() {
    this.themeService.changeTheme(this.temaSeleccionado);
    this.cerrarModal();

    await Swal.fire({
      icon: 'success',
      title: 'Tema cambiado',
      text: `El tema ha sido cambiado a "${this.temaSeleccionado}".`,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  guardarUbicacion() {
    console.log('Ubicación guardada:', this.ubicacion);
    this.cerrarModal();

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'La ubicación ha sido guardada correctamente.',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  async cerrarSesion() {
    
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      this.authService.logout();
      this.cerrarModal();
      this.router.navigate(['/login']);

      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }
}

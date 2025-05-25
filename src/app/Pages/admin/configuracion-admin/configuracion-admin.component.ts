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
  idiomaSeleccionado: string = 'es';
  temaSeleccionado: 'light' | 'dark' | 'system' = 'system';

  idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'Inglés' },
    { codigo: 'fr', nombre: 'Francés' },
    { codigo: 'de', nombre: 'Alemán' },
  ];

  paises = [
    'Argentina', 'Chile', 'Colombia', 'España', 'México', 'Perú',
    'Estados Unidos', 'Otro',
  ];

  // Ciudades agrupadas por país (objeto)
  ciudadesPorPais: { [pais: string]: string[] } = {
    'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario'],
    'Chile': ['Santiago', 'Valparaíso', 'Concepción'],
    'Colombia': ['Bogotá', 'Medellín', 'Cali'],
    'España': ['Madrid', 'Barcelona', 'Valencia'],
    'México': ['Ciudad de México', 'Guadalajara', 'Monterrey'],
    'Perú': ['Lima', 'Arequipa', 'Cusco'],
    'Estados Unidos': ['Nueva York', 'Los Ángeles', 'Chicago'],
    'Otro': [],
  };

  ubicacion = {
    pais: 'Colombia',
    ciudad: 'Cali',
  };

  nuevaUbicacion = {
    pais: 'Colombia',  // Añadimos país para la nueva ubicación
    ciudad: '',
    nombre: '',
    descripcion: ''
  };

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

    // Si el país no está en el listado, asignar uno por defecto
    if (!this.paises.includes(this.ubicacion.pais)) {
      this.ubicacion.pais = this.paises[0];
    }

    // Si la ciudad no está en ciudadesPorPais, asignar la primera ciudad disponible
    const ciudades = this.ciudadesPorPais[this.ubicacion.pais];
    if (!ciudades.includes(this.ubicacion.ciudad)) {
      this.ubicacion.ciudad = ciudades.length > 0 ? ciudades[0] : '';
    }

    this.nuevaUbicacion.pais = this.ubicacion.pais;
  }

  // Cuando cambias el país en el selector principal (ubicación)
  cambiarPais() {
    const ciudades = this.ciudadesPorPais[this.ubicacion.pais] || [];
    this.ubicacion.ciudad = ciudades.length > 0 ? ciudades[0] : '';
  }

  // Cuando cambias el país en la sección de crear nueva ubicación
  cambiarPaisNuevaUbicacion() {
    this.nuevaUbicacion.ciudad = '';
  }

  guardarUbicacion() {
    // Aquí podrías enviar esta información a una API en el futuro
    console.log('Ubicación guardada (quemado):', this.ubicacion);

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: `Ubicación guardada: ${this.ubicacion.ciudad}, ${this.ubicacion.pais}`,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  crearUbicacion() {
    const { pais, ciudad, nombre, descripcion } = this.nuevaUbicacion;

    if (!pais || !ciudad || !nombre || !descripcion) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de guardar.',
      });
      return;
    }

    // Verificar si la ciudad ya existe para ese país
    if (!this.ciudadesPorPais[pais]) {
      this.ciudadesPorPais[pais] = [];
    }

    if (!this.ciudadesPorPais[pais].includes(ciudad)) {
      this.ciudadesPorPais[pais].push(ciudad);
    }

    // Opcional: cambiar la ubicación seleccionada a la nueva creada
    this.ubicacion.pais = pais;
    this.ubicacion.ciudad = ciudad;

    Swal.fire({
      icon: 'success',
      title: 'Ubicación creada',
      text: `La ubicación "${nombre}" en ${ciudad}, ${pais} ha sido creada.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Limpiar campos
    this.nuevaUbicacion = { pais, ciudad: '', nombre: '', descripcion: '' };
  }

  async cambiarIdioma() {
    this.languageService.cambiarIdioma(this.idiomaSeleccionado);
    Swal.fire({
      icon: 'success',
      title: 'Idioma cambiado',
      text: `El idioma ha sido cambiado a ${this.idiomaSeleccionado.toUpperCase()}.`,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  async cambiarTema() {
    this.themeService.changeTheme(this.temaSeleccionado);
    Swal.fire({
      icon: 'success',
      title: 'Tema cambiado',
      text: `El tema ha sido cambiado a "${this.temaSeleccionado}".`,
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

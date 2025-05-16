import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Shared/services/auth.service';
import { ThemeService } from '../../../Shared/services/theme.service';
import { LanguageService } from '../../../Shared/services/language.service';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent {
  modalAbierto: string | null = null;
  confirmarDesactivacion: boolean = false;

  // Configuración de idioma
  idiomaSeleccionado: string = 'es';
  idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'Inglés' },
    { codigo: 'fr', nombre: 'Francés' },
    { codigo: 'de', nombre: 'Alemán' },
  ];

  // Configuración de tema
  temaSeleccionado: 'light' | 'dark' | 'system' = 'system';

  // Configuración de ubicación
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
    // Cargar configuraciones actuales del usuario
    this.cargarConfiguraciones();
  }

  cargarConfiguraciones() {
    // Usamos getCurrentTheme() en lugar del antiguo getTemaActual()
    this.idiomaSeleccionado = this.languageService.getIdiomaActual();
    this.temaSeleccionado = this.themeService.getCurrentTheme();

    // Datos de ubicación (simulados)
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

  cambiarIdioma() {
    this.languageService.cambiarIdioma(this.idiomaSeleccionado);
    this.cerrarModal();
    // Aquí podrías agregar una notificación de éxito
  }

  cambiarTema() {
    this.themeService.changeTheme(this.temaSeleccionado);
    this.cerrarModal();
  }

  guardarUbicacion() {
    // Aquí iría la lógica para guardar la ubicación en el backend
    console.log('Ubicación guardada:', this.ubicacion);
    this.cerrarModal();
    // Mostrar notificación de éxito
  }

  cerrarSesion() {
    this.authService.logout();
    this.cerrarModal();
    this.router.navigate(['/login']);
  }
}

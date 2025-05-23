import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracion-admin',
  standalone: true,
  templateUrl: './configuracion-admin.component.html',
  styleUrls: ['./configuracion-admin.component.css'],
})
export class ConfiguracionAdminComponent {
  user = {
    name: 'Administrador',
    img: null, // o una URL si tienes una imagen de perfil por defecto
  };

  profileMenuOpen = false;
  modalAbierto: string | null = null;

  idiomaSeleccionado = 'es';
  idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español' },
    { codigo: 'en', nombre: 'Inglés' },
    { codigo: 'fr', nombre: 'Francés' },
  ];

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  abrirModal(modal: string) {
    this.modalAbierto = modal;
  }

  cerrarModal() {
    this.modalAbierto = null;
  }

  cambiarIdioma() {
    console.log(`Idioma cambiado a: ${this.idiomaSeleccionado}`);
    this.cerrarModal();
  }

  cerrarSesion() {
    console.log('Cerrar sesión');
    // Aquí puedes limpiar tokens, redirigir, etc.
  }
}

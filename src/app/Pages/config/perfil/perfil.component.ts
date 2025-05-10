import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../Shared/services/user.service';
import { UserResponse, UpdateUserDto } from './../../../models/user.model';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario: UserResponse | null = null;
  editData: UpdateUserDto = { name: '', email: '' };
  modoOscuro = false;
  modalAbierto: string | null = null;
  isLoading: boolean = false;
  isProfileLoading: boolean = true;
  isCurrentUser: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  router: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarPerfilUsuario();
  }

  cargarPerfilUsuario() {
    this.isProfileLoading = true;
    this.errorMessage = null;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.usuario = user;
        this.editData = {
          name: user.name,
          email: user.email,
        };
        this.isProfileLoading = false;
      },
      error: (err) => {
        this.handleProfileError(err);
      },
    });
  }

  private handleProfileError(err: any) {
    console.error('Error:', err);
    this.isProfileLoading = false;

    if (err.status === 401) {
      this.errorMessage =
        'Sesión expirada. Por favor inicia sesión nuevamente.';
      this.router.navigate(['/login']);
    } else if (err.status === 403) {
      this.errorMessage = 'No tienes permisos para ver este recurso';
    } else {
      this.errorMessage = 'Error al cargar el perfil. Intenta nuevamente.';
    }
  }

  guardarCambios() {
    if (!this.usuario) return;

    if (!this.validateForm()) return;

    this.isLoading = true;

    this.userService
      .updateCurrentUser({
        name: this.editData.name,
        email: this.editData.email,
        // Eliminamos el envío de currentPassword
      })
      .subscribe({
        next: (actualizado) => {
          this.handleUpdateSuccess(actualizado);
        },
        error: (err) => {
          this.handleUpdateError(err);
        },
      });
  }

  private validateForm(): boolean {
    if (!this.editData.name?.trim() || !this.editData.email?.trim()) {
      this.mostrarError('Nombre y correo son requeridos');
      return false;
    }
    // Eliminamos la validación de contraseña
    return true;
  }

  private handleUpdateSuccess(actualizado: UserResponse) {
    this.usuario = actualizado;
    this.mostrarExito('Perfil actualizado correctamente');
    this.cerrarModal();
    this.isLoading = false;
  }

  private handleUpdateError(err: any) {
    this.isLoading = false;

    if (err.status === 409) {
      this.mostrarError('El correo ya está registrado');
    } else if (err.status === 403) {
      this.mostrarError('No tienes permisos para esta acción');
    } else {
      this.mostrarError('Error al actualizar. Intenta nuevamente');
    }
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    setTimeout(() => (this.errorMessage = null), 5000);
  }

  private mostrarExito(mensaje: string) {
    this.successMessage = mensaje;
    setTimeout(() => (this.successMessage = null), 5000);
  }

  abrirModal(id: string) {
    this.modalAbierto = id;
    this.errorMessage = null;
    this.successMessage = null;
  }

  cerrarModal() {
    this.modalAbierto = null;
    // Restauramos los datos originales al cerrar
    if (this.usuario) {
      this.editData = {
        name: this.usuario.name,
        email: this.usuario.email,
      };
    }
  }

  aceptarModal(modalId: string) {
    this.mostrarExito(`Has confirmado la acción del modal: ${modalId}`);
    this.cerrarModal();
  }
}

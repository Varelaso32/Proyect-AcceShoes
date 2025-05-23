import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Shared/services/user.service';
import {
  UpdateUserDto,
  UpdateUserWithPasswordDto,
  UserResponse,
} from '../../../models/user.model';
import { firstValueFrom } from 'rxjs';
import { PlansService } from '../../../Shared/services/plans.service';
import { Plan } from '../../../models/plan.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css',
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: UserResponse[] = [];
  plan_id: number | null | undefined;
  planes: Plan[] = [];
  planMap = new Map<number, string>();
  passwordMismatch = false;

  // Estados para modales
  modalAbierto: 'crear' | 'editar' | null = null;

  // Para crear usuario
  nuevoUsuario: UpdateUserDto & {
    plan_id?: number;
    password?: string;
    role?: string;
    img?: string;
  } = {
    name: '',
    email: '',
    plan_id: undefined,
    password: '',
    role: '',
    img: '',
  };
  confirmPassword = '';

  // Para editar usuario
  usuarioEditando: UserResponse | null = null;
  editData: UpdateUserWithPasswordDto & {
    role?: string;
    img?: string;
  } = {
    name: '',
    email: '',
    plan_id: undefined,
    password: '',
    role: '',
  };

  // Mensajes
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private userService: UserService,
    private plansService: PlansService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarPlanes();
  }

  cargarUsuarios() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.usuarios = users;
      },
      error: (err) => {
        this.mostrarError('Error cargando usuarios');
      },
    });
  }

  onImageSelectedCrear(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.nuevoUsuario.img = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageSelectedEditar(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editData.img = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cargarPlanes() {
    this.plansService.getPlans().subscribe({
      next: (plans) => {
        this.planes = plans;
        this.planMap.clear();
        plans.forEach((p) => this.planMap.set(p.id, p.name));
      },
      error: () => this.mostrarError('Error cargando planes'),
    });
  }

  getPlanName(plan_id?: number): string {
    return plan_id ? this.planMap.get(plan_id) ?? 'Sin plan' : 'Sin plan';
  }

  abrirModalCrear() {
    this.nuevoUsuario = {
      name: '',
      email: '',
      plan_id: undefined,
      password: '',
    };
    this.modalAbierto = 'crear';
    this.limpiarMensajes();
  }

  crearUsuario() {
    if (this.nuevoUsuario.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    if (
      !this.nuevoUsuario.name ||
      !this.nuevoUsuario.email ||
      !this.nuevoUsuario.password
    ) {
      this.mostrarError('Nombre, email y contraseña son obligatorios');
      return;
    }
    this.isLoading = true;

    const payload: any = {
      name: this.nuevoUsuario.name,
      email: this.nuevoUsuario.email,
      password: this.nuevoUsuario.password,
      plan_id: 1,
      role: 'user',
      img: this.nuevoUsuario.img,
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.mostrarExito('Usuario creado');
        this.cargarUsuarios();
        this.cerrarModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.mostrarError('Error creando usuario');
      },
    });
  }

  get usuariosOrdenadosPorRol() {
    return [...this.usuarios].sort((a, b) => {
      if (!a.role) return 1;
      if (!b.role) return -1;
      return a.role.localeCompare(b.role);
    });
  }

  getImagenUsuario(img?: string): string {
    return img ? img : 'assets/user_pordefault.jpg';
  }

  abrirModalEditar(user: UserResponse) {
    this.usuarioEditando = user;
    this.editData = {
      name: user.name,
      email: user.email,
      plan_id: user.plan_id ?? null,
      password: '',
      role: user.role ?? '',
      img: user.img ?? '',
    };
    this.modalAbierto = 'editar';
    this.limpiarMensajes();
  }

  async guardarCambios() {
    if (!this.usuarioEditando) return;

    if (!this.editData.name || !this.editData.email) {
      this.mostrarError('Nombre y email son obligatorios');
      return;
    }

    this.isLoading = true;

    try {
      const userUpdatePayload: UpdateUserWithPasswordDto & { img?: string } = {
        name: this.editData.name,
        email: this.editData.email,
        img: this.editData.img,
      };

      if (this.editData.password && this.editData.password.trim() !== '') {
        userUpdatePayload.password = this.editData.password;
      }

      // Usar firstValueFrom en vez de toPromise
      await firstValueFrom(
        this.userService.updateUser(this.usuarioEditando.id, userUpdatePayload)
      );

      if (this.editData.plan_id !== this.usuarioEditando.plan_id) {
        await firstValueFrom(
          this.userService.changeUserPlan(
            this.usuarioEditando.id,
            this.editData.plan_id!
          )
        );
      }

      this.mostrarExito('Usuario actualizado correctamente');
      this.cargarUsuarios();
      this.cerrarModal();
    } catch (err) {
      this.manejarErrorActualizacion(err);
    } finally {
      this.isLoading = false;
    }
  }

  confirmarCambioRol(user: UserResponse) {
    const nuevoRol = user.role === 'admin' ? 'user' : 'admin';
    const rolTexto = nuevoRol === 'admin' ? 'Administrador' : 'Usuario';

    Swal.fire({
      title: `¿Estás seguro?`,
      text: `¿Deseas cambiar el rol de "${user.name}" a ${rolTexto}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await firstValueFrom(
            this.userService.changeUserRole(user.id, nuevoRol)
          );
          this.mostrarExito(`Rol actualizado a ${rolTexto}`);
          this.cargarUsuarios();
        } catch (error) {
          this.mostrarError('Error al cambiar el rol del usuario.');
        }
      }
    });
  }

  private manejarErrorActualizacion(err: any) {
    if (err.status === 409) {
      this.mostrarError('Ya existe un usuario con ese email.');
    } else if (err.status === 422) {
      const errores = err.error?.detail;
      if (Array.isArray(errores)) {
        const mensaje = errores.map((e: any) => e.msg).join(', ');
        this.mostrarError(`Error de validación: ${mensaje}`);
      } else {
        this.mostrarError('Error de validación.');
      }
    } else if (err.status === 401 || err.status === 403) {
      this.mostrarError('No autorizado para editar este usuario.');
    } else {
      this.mostrarError('Error actualizando usuario.');
    }
  }

  eliminarUsuario(user: UserResponse) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar al usuario "${user.name}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4', // color cian
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: `El usuario "${user.name}" fue eliminado correctamente.`,
              confirmButtonColor: '#06b6d4',
            });
            this.cargarUsuarios();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `No se pudo eliminar al usuario "${user.name}".`,
              confirmButtonColor: '#06b6d4',
            });
          },
        });
      }
    });
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.usuarioEditando = null;
    this.limpiarMensajes();
  }

  mostrarExito(mensaje: string) {
    this.successMessage = mensaje;
    this.errorMessage = null;

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      confirmButtonColor: '#06b6d4',
    });
  }

  mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.successMessage = null;

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#d33',
    });
  }

  limpiarMensajes() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}

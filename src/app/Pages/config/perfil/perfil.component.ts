import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../Shared/services/user.service';
import { PlansService } from '../../../Shared/services/plans.service';
import { UserResponse, UpdateUserDto } from './../../../models/user.model';
import { Plan } from './../../../models/plan.model';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  //Data general
  modalAbierto: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  //Data de user
  usuario: UserResponse | null = null;
  editData: UpdateUserDto = { name: '', email: '' };
  isLoading: boolean = false;
  isProfileLoading: boolean = true;
  isCurrentUser: boolean = true;
  //Data planes
  planes: Plan[] = [];
  isPlansLoading = false;
  planSeleccionado: Plan | null = null;
  planActual: Plan | undefined;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private plansService: PlansService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPerfilUsuario();
    this.cargarPlanes();
    this.checkPaymentStatus();
  }

  cargarPerfilUsuario() {
    this.isProfileLoading = true;
    this.errorMessage = null;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.usuario = user;
        this.editData = { name: user.name, email: user.email };

        // Obtenemos el plan actual usando el plan_id del usuario
        if (user.plan_id) {
          this.planActual = this.plansService.getPlanById(user.plan_id);
        }

        this.isProfileLoading = false;
      },
      error: (err) => this.handleProfileError(err),
    });
  }

  cargarPlanes() {
    this.isPlansLoading = true;
    this.plansService.getPlans().subscribe({
      next: (res) => {
        this.planes = res; // Guardamos la lista de planes disponibles

        // Actualizamos el plan actual si el usuario tiene uno asignado
        if (this.usuario?.plan_id) {
          this.planActual = res.find(
            (plan) => plan.id === this.usuario?.plan_id
          );
        }

        this.isPlansLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar planes:', err);
        this.isPlansLoading = false;
        this.mostrarError('No se pudieron cargar los planes');
      },
    });
  }

  private checkPaymentStatus() {
    this.route.queryParams.subscribe((params) => {
      if (params['payment'] === 'success') {
        this.mostrarExito('¡Pago completado! Tu plan ha sido actualizado.');
        // Recargar datos del usuario
        this.cargarPerfilUsuario();

        // Limpiar parámetro de URL
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
  }

  seleccionarPlan(plan: Plan) {
    this.planSeleccionado = plan;
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
    this.errorMessage = null;
    this.successMessage = mensaje;
    setTimeout(() => (this.successMessage = null), 5000);
  }

  abrirModal(id: string) {
    this.modalAbierto = id;
    this.errorMessage = null;
    this.successMessage = null;

    if (id === 'planesModal') {
      this.cargarPlanes();
    }
  }

  irAMetodoPago() {
    if (this.planSeleccionado) {
      this.router.navigate(['/metodo-pago'], {
        state: { plan: this.planSeleccionado },
      });
      this.cerrarModal();
    }
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

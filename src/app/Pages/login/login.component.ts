import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Shared/services/auth.service';
import { UserResponse } from '../../models/user.model';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../Shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };

  errorMessage: string | null = null;
  showPassword: boolean = false;

  failedAttempts: number = 0;
  isUserBlocked: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {}

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 2000);
  }

  getUserKey(prefix: string): string {
    return `${prefix}_${this.user.email}`;
  }

  loadUserStatus() {
    const attempts = Number(
      localStorage.getItem(this.getUserKey('failedAttempts'))
    );
    const blocked =
      localStorage.getItem(this.getUserKey('isUserBlocked')) === 'true';

    this.failedAttempts = attempts || 0;
    this.isUserBlocked = blocked;
  }

  unblockUser() {
    this.isUserBlocked = false;
    this.failedAttempts = 0;

    localStorage.removeItem(this.getUserKey('isUserBlocked'));
    localStorage.removeItem(this.getUserKey('failedAttempts'));
  }

  getCurrentUserRole(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).role;
    }
    return null;
  }

  onSubmit() {
    this.loadUserStatus();

    // Primero verificar si el usuario está bloqueado
    if (this.userService.isUserBlocked(this.user.email)) {
      this.showError(
        'Usuario bloqueado. Por favor, contacte al administrador del sistema.'
      );
      return;
    }

    if (!this.user.email || !this.user.password) {
      this.showError('Por favor, completa todos los campos.');
      return;
    }

    this.isLoading = true;

    this.authService.loginAuth(this.user).subscribe({
      next: () => {
        this.authService.getUserProfile().subscribe({
          next: (user: UserResponse) => {
            localStorage.setItem('user', JSON.stringify(user));
            this.resetFailedAttempts(); // Limpiar intentos fallidos al iniciar sesión correctamente

            // Redirección según rol
            const role = user.role;
            if (role === 'admin') {
              this.router.navigate(['/home-selector']);
            } else if (role === 'user') {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/unauthorized']);
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.showError('Error al obtener perfil del usuario');
            console.error(err);
          },
        });
      },
      error: (error) => {
        this.isLoading = false;

        // Registrar intento fallido
        this.registerFailedAttempt();

        // Verificar si ahora está bloqueado
        if (this.userService.isUserBlocked(this.user.email)) {
          this.showError(
            'Usuario bloqueado por múltiples intentos fallidos. Contacte al administrador.'
          );
          return;
        }

        // Manejar otros tipos de errores
        if (error.status === 401) {
          this.showError(error.error?.detail || 'Credenciales incorrectas');
        } else if (error.status === 422 && Array.isArray(error.error?.detail)) {
          const validationErrors = error.error.detail
            .map((e: any) => e.msg.charAt(0).toUpperCase() + e.msg.slice(1))
            .join(', ');
          this.showError(validationErrors);
        } else {
          this.showError('Error del servidor. Intente más tarde.');
        }
      },
    });
  }

  // Nuevos métodos auxiliares
  private registerFailedAttempt(): void {
    this.failedAttempts++;
    localStorage.setItem(
      this.getUserKey('failedAttempts'),
      this.failedAttempts.toString()
    );

    if (this.failedAttempts >= 3) {
      this.userService.blockUser(this.user.email);
      this.isUserBlocked = true;
      localStorage.setItem(this.getUserKey('isUserBlocked'), 'true');
    }
  }

  private resetFailedAttempts(): void {
    this.failedAttempts = 0;
    this.isUserBlocked = false;
    localStorage.removeItem(this.getUserKey('failedAttempts'));
    localStorage.removeItem(this.getUserKey('isUserBlocked'));
  }
}

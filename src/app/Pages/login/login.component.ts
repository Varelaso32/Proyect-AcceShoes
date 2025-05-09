import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Shared/services/auth.service';
import { finalize } from 'rxjs/operators';

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

  constructor(private authService: AuthService, private router: Router) {}

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

  onSubmit() {
    this.loadUserStatus();

    if (this.isUserBlocked) {
      this.showError('Usuario bloqueado. Intenta de nuevo en unos segundos.');
      return;
    }

    // Validar si faltan campos
    if (!this.user.email || !this.user.password) {
      this.showError('Por favor, completa todos los campos.');
      return;
    }

    this.isLoading = true;

    this.authService
      .loginAuth(this.user)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          this.unblockUser();

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 0);
        },
        error: (error) => {
          this.failedAttempts++;
          localStorage.setItem(
            this.getUserKey('failedAttempts'),
            this.failedAttempts.toString()
          );

          if (this.failedAttempts >= 3) {
            this.isUserBlocked = true;
            localStorage.setItem(this.getUserKey('isUserBlocked'), 'true');
            this.showError('Demasiados intentos fallidos. Usuario bloqueado.');
            return;
          }

          if (error.status === 401) {
            this.showError(error.error?.detail);
          } else if (
            error.status === 422 &&
            Array.isArray(error.error?.detail)
          ) {
            const validationErrors = error.error.detail
              .map((e: any) => e.msg.charAt(0).toUpperCase() + e.msg.slice(1))
              .join(', ');
            this.showError(validationErrors);
          } else {
            this.showError('Error del servidor. Intenta más tarde.');
          }
        },
      });
  }
}

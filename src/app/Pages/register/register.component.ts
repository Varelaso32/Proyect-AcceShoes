import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Shared/services/auth.service';
import { User } from '../../models/user.model'; // Asegúrate de que el modelo User esté bien definido

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
  };

  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = '¡Registro exitoso!';
        this.errorMessage = '';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/login']);
        }, 800);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = error.error.detail;
        } else if (error.status === 422) {
          const errores = error.error.detail;
          if (Array.isArray(errores)) {
            // Capitalizar cada mensaje de error
            this.errorMessage = errores
              .map((e: any) => e.msg.charAt(0).toUpperCase() + e.msg.slice(1))
              .join(', ');
          } else {
            this.errorMessage = 'Datos inválidos.';
          }
        } else {
          this.errorMessage = 'Error inesperado al registrarse.';
        }

        this.successMessage = '';
        setTimeout(() => (this.errorMessage = ''), 4000);
      },
    });
  }
}

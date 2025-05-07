import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    email: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = '¡Registro exitoso!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Error al registrarse';
        this.successMessage = '';
      }
    });
  }
}

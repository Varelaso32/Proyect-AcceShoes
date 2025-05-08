import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Shared/services/auth.service';

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

  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.loginAuth(this.user).subscribe({
      next: (response: any) => {
        console.log('Login exitoso ✅', response);
        alert('Login exitoso ✅');

        // El token se guarda automáticamente en el servicio
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login fallido ❌', error);
        if (error.status === 401 || error.status === 422) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else {
          this.errorMessage = 'Error del servidor. Intenta más tarde.';
        }
      },
    });
  }
}

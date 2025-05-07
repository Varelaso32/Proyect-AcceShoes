import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Shared/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user: User = {
    username: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.user).subscribe(
      (response) => {
        console.log('Login exitoso ✅', response);
        alert('Login exitoso ✅');

        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
        }

        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login fallido ❌', error);
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    );
  }
}

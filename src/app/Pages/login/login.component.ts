import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';  
import { AuthService } from '../../Shared/services/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  
})
export class LoginComponent {
  user: User = {
    username: '',  // Suponiendo que `username` es en realidad el email
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Username:', this.user.username); 
    console.log('Password:', this.user.password);  
  
    if (this.user.username && this.user.password) {
      this.authService.login(this.user).subscribe(
        (response) => {
          console.log('Login successful', response);
          alert('Login exitoso ✅');
  
          if (response.access_token) {
            localStorage.setItem('token', response.access_token);  // Guardamos el token
          }
  
          this.router.navigate(['/home']);  // Redirige a la página de inicio o dashboard
        },
        (error) => {
          console.error('Login failed ❌', error);
          alert('Usuario o contraseña incorrectos');
        }
      );
    }
  }
} 

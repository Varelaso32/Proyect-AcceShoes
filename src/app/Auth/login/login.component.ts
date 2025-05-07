import { Component, inject } from '@angular/core';
import { AuthService } from '../../Shared/services/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../interfaces/store.interfaces';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Datos de acceso incompletos',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const { username = '', password = '' } = this.loginForm.value;
    let data: Login = {
      username: username!,
      password: password!,
    };
    this.authService.loginAuth(data).subscribe({
      next: (resp) => {
        if (resp) {
          this.authService.login.set(true);
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Bienvenido',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Datos de acceso incorrectos',
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  }
}

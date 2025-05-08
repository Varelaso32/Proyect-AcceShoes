import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  showNewPassword: boolean = false;


  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada con éxito ✅';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.detail || 'Error al actualizar contraseña';
        this.successMessage = '';
      },
    });
  }
}

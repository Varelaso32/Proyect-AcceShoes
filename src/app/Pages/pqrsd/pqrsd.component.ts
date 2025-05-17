import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PqrsService } from '../../Shared/services/pqrs.service'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-pqrsd',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './pqrsd.component.html',
  styleUrls: ['./pqrsd.component.css'],
})
export class PqrsdComponent {
  form = {
    category: '',
    description: '',
  };

  loading = false;
  successMessage = '';
  errorMessage = '';
  showErrors = false;

  constructor(private pqrsService: PqrsService) {}

  submitPqrsd() {
    this.successMessage = '';
    this.errorMessage = '';
    this.showErrors = false;

    // Validación manual
    if (!this.form.category || !this.form.description.trim()) {
      this.showErrors = true;
      this.showError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    this.loading = true;
    this.pqrsService.createPqrs(this.form).subscribe({
      next: () => {
        this.showSuccess('PQRSD enviada correctamente.');
        this.form = { category: '', description: '' };
        this.showErrors = false;
        this.loading = false;
      },
      error: (err) => {
        this.showError('Ocurrió un error al enviar la solicitud.');
        this.loading = false;
        console.error(err);
      },
    });
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 4000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 4000);
  }
}

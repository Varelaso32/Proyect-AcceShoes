import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../Shared/services/category.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../Shared/components/navbar/navbar.component";
import { FooterComponent } from "../../Shared/components/footer/footer.component";

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './category-create.component.html',
})
export class CategoryCreateComponent {
  name = '';
  description = '';
  parent_id: number | null = null;
  isLoading = false;

  constructor(private categoryService: CategoryService, private router: Router) { }

  onSubmit(): void {
    if (!this.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Debes ingresar un nombre para la categoría.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    this.isLoading = true;

    const newCategory = {
      name: this.name,
      description: this.description,
      parent_id: this.parent_id || null
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (category) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La categoría se ha registrado exitosamente.',
          confirmButtonColor: '#22c55e'
        }).then(() => {
          this.router.navigate(['/all-categories']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Verifica tu conexión a internet o intenta más tarde.',
            confirmButtonColor: '#ef4444'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'No se pudo crear la categoría.',
            confirmButtonColor: '#ef4444'
          });
        }
      }
    });
  }

  onCancel(): void {
    Swal.fire({
      title: '¿Cancelar creación?',
      text: 'Se perderán los datos ingresados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/all-categories']);
      }
    });
  }
}

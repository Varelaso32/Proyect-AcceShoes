import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Shared/services/product.service';
import { CategoryService } from '../../Shared/services/category.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/products.model';
import { Category } from '../../models/category.model';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../Shared/components/navbar/navbar.component";
import { FooterComponent } from "../../Shared/components/footer/footer.component";

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './create-product.component.html',
})
export class CreateProductComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  productForm: FormGroup;
  isLoading = false;
  productTypes = ['Nuevo', 'Usado', 'Reacondicionado'];
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  categories: Category[] = [];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      size: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      status: ['disponible'],
      type_of_product: ['Nuevo', Validators.required],
      category_id: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
      // image: [null, Validators.required] // Mantenido comentado para futuro uso
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;

      const productData = {
        price: Number(this.productForm.get('price')?.value),
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        size: this.productForm.get('size')?.value,
        category: Number(this.productForm.get('category_id')?.value)
      };

      this.productService.createProduct(productData).subscribe({
        next: (product) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Producto creado',
            text: 'El producto se ha registrado exitosamente.',
            confirmButtonText: 'Ver producto',
            confirmButtonColor: '#06b6d4'
          }).then(() => {
            this.router.navigate(['/product', product.id]);
          });
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'Verifica tu conexión a internet o usa el proxy.',
              confirmButtonColor: '#ef4444'
            });
          } else if (err.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error del servidor',
              text: 'Ocurrió un problema interno. Contacta al administrador.',
              confirmButtonColor: '#ef4444'
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Error',
              text: err.message || 'Algo salió mal.',
              confirmButtonColor: '#f59e0b'
            });
          }
        }
      });
    }
  }
  onCancel(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se perderán los datos ingresados si sales del formulario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // rojo
      cancelButtonColor: '#6b7280',  // gris
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/all-products']); // Asegúrate que esta ruta exista
      }
    });
  }


}

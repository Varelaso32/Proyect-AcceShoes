import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Category } from '../../models/category.model';
import {
  SaleProductForm,
  SalesService,
} from '../../Shared/services/sales.service';
import { CategoryService } from '../../Shared/services/categories.service';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
})
export class CrearProductoComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  loading = false;
  previewImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      size: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      img: ['', Validators.required], // Será base64 o URL
      category: [null, Validators.required],
    });

    this.categoryService.getAll().subscribe({
      next: (cats) => (this.categories = cats),
      error: () =>
        Swal.fire('Error', 'No se pudieron cargar las categorías', 'error'),
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.productForm.patchValue({ img: this.previewImage });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.loading = true;
    const productData = this.productForm.value;

    this.salesService.createSaleProduct(productData).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Producto creado correctamente.', 'success');
        this.productForm.reset();
        this.previewImage = null;
        this.loading = false;
      },
      error: () => {
        Swal.fire('Error', 'Hubo un problema al crear el producto.', 'error');
        this.loading = false;
      },
    });
  }

  onCancel() {
    this.productForm.reset();
    this.previewImage = null;
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';
import Swal from 'sweetalert2';
import { SalesService } from '../../Shared/services/sales.service';
import { CategoryService } from '../../Shared/services/categories.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: (Product & { price: number; stock: number }) | undefined;
  categoryName: string = 'Cargando...';

  private route = inject(ActivatedRoute);
  private productService = inject(SalesService);
  private categoryService: CategoryService = inject(CategoryService);
  private location = inject(Location);
  private cartService = inject(CartService);

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!productId) {
      console.error('ID de producto no válido');
      return;
    }

    this.productService.getSaleProduct(productId).subscribe((sale) => {
      if (sale?.product) {
        const prod = sale.product;
        this.product = {
          ...prod,
          imageUrl: prod.img,
          price: sale.price,
          stock: sale.stock,
        };

        if (prod.category_id) {
          this.categoryService.getById(prod.category_id).subscribe({
            next: (cat) => (this.categoryName = cat.name),
            error: () => (this.categoryName = 'Sin categoría'),
          });
        } else {
          this.categoryName = 'Sin categoría';
        }
      } else {
        console.error('Producto no encontrado');
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);

      Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: `${this.product.name} fue agregado correctamente`,
        confirmButtonColor: '#10B981',
        confirmButtonText: 'Ok',
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}

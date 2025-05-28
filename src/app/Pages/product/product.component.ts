import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Shared/services/product.service';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProductById(productId).subscribe((product) => {
        if (product) {
          this.product = product;
        } else {
          console.error('Producto no encontrado');
        }
      });
    } else {
      console.error('ID de producto no válido');
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);

      Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: `${this.product.name} fue agregado correctamente`,
        confirmButtonColor: '#10B981',
        confirmButtonText: 'Ok'
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}

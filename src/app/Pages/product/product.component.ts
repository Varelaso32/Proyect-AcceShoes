import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../Shared/services/product.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product.component.html',
  imports: [CommonModule,NavbarComponent, FooterComponent,RouterLink],
  styleUrls: ['./product.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;  // La variable donde almacenamos el producto

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Obtén el ID del producto desde la URL
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Si el ID es válido, obtiene el producto
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
}

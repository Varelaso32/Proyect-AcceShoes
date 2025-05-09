import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../Shared/services/product.service';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product.component.html',
  imports: [CommonModule, FooterComponent, NavbarComponent],
  styleUrls: ['./product.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location  
  ) {}

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

  // Método para volver atrás
  goBack(): void {
    this.location.back();  
  }
}

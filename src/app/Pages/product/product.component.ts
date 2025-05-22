import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Shared/services/product.service';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product.component.html',
  imports: [CommonModule, FooterComponent, NavbarComponent],
  styleUrls: ['./product.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDialogElement>;
  addedProductName: string = ''; 

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
      this.addedProductName = this.product.name; 

      // Mostrar el modal después de agregar el producto
      if (this.modalRef?.nativeElement) {
        this.modalRef.nativeElement.showModal();
      }
    }
  }

  // Método para volver atrás
  goBack(): void {
    this.location.back();
  }
}

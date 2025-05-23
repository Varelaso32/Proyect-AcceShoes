import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../Shared/services/product.service';
import { Observable, switchMap } from 'rxjs';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { Location } from '@angular/common';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  providers: [CartService],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  products$: Observable<Product[]>;
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDialogElement>;
  addedProductName: string = '';
  categoryName: string = '';

  // Constructor no ha sido alterado
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private cartService: CartService,
    
  ) {
    this.products$ = this.route.paramMap.pipe(
      switchMap(params => {
        const category = params.get('category') || '';
        this.categoryName = category;
        return this.productService.getProductsByCategory(category);
      })
    );
  }

  // Método para agregar productos al carrito
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.addedProductName = product.name;

    // Mostrar el modal después de agregar el producto
    if (this.modalRef?.nativeElement) {
      this.modalRef.nativeElement.showModal();
    }
  }

  // Método para volver a la página anterior
  goBack(): void {
    this.location.back();
  }
}

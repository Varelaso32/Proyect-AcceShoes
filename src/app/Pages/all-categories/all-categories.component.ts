import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../Shared/services/product.service';
import { Observable, map } from 'rxjs';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CartService } from '../../Shared/services/cart.service';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './all-categories.component.html',
})
export class AllCategoriesComponent {
  groupedProducts$: Observable<Record<string, Product[]>>;
  private productService = inject(ProductService);
  private location = inject(Location);
  private cartService = inject(CartService);

  constructor() {
    this.groupedProducts$ = this.productService.getProducts().pipe(
      map((products) => {
        return products.reduce((acc: Record<string, Product[]>, product) => {
          acc[product.category] = acc[product.category] || [];
          acc[product.category].push(product);
          return acc;
        }, {});
      })
    );
  }

  goBack(): void {
    this.location.back();
  }
  addToCart(product: Product): void {
    this.cartService.addToCart(product); 
  }
}

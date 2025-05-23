import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Shared/services/product.service';
import { CategoryService } from '../../Shared/services/category.service';
import { Observable, combineLatest, map } from 'rxjs';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './all-categories.component.html',
})
export class AllCategoriesComponent {
  groupedProducts$: Observable<Record<string, Product[]>>;
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private location = inject(Location);
  private cartService = inject(CartService);

  showBackButton = true;

  constructor() {
    this.groupedProducts$ = combineLatest([
      this.productService.getProducts(),
      this.categoryService.getCategories(),
    ]).pipe(
      map(([products, categories]) => {
        const categoryMap: Record<number, string> = {};
        categories.forEach(cat => categoryMap[cat.id] = cat.name);

        const grouped: Record<string, Product[]> = {};

        // Inicializar con todas las categorías vacías
        categories.forEach(cat => {
          grouped[cat.name] = [];
        });

        // Asignar productos a sus categorías
        products.forEach(product => {
          const categoryName = categoryMap[product.category] ?? 'Sin categoría';
          grouped[categoryName] = grouped[categoryName] || [];
          grouped[categoryName].push(product);
        });

        return grouped;
      })
    );
  }

  goBack(): void {
    this.location.back();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  hideBackButtonTemporarily() {
    this.showBackButton = false;
    setTimeout(() => {
      this.showBackButton = true;
    }, 3000);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Shared/services/product.service';
import { CategoryService } from '../../Shared/services/category.service';
import { Observable, combineLatest, map } from 'rxjs';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { RouterLink, Router } from '@angular/router';
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
  private router = inject(Router);

  showBackButton = true;

  constructor() {
    this.groupedProducts$ = combineLatest([
      this.productService.getProducts(),
      this.categoryService.getMainCategories(), // <-- Solo categorías padre
    ]).pipe(
      map(([products, categories]) => {
        const categoryMap: Record<number, string> = {};
        categories.forEach(cat => categoryMap[cat.id] = cat.name);

        const grouped: Record<string, Product[]> = {};
        categories.forEach(cat => {
          grouped[cat.name] = [];
        });
        grouped['Sin categoría'] = [];

        products.forEach(product => {
          const categoryName = categoryMap[product.category] ?? 'Sin categoría';
          grouped[categoryName].push(product);
        });

        return grouped;
      })
    );
  }

  getCategoryNames(grouped: Record<string, Product[]>): string[] {
    return Object.keys(grouped).filter(name => name !== 'Sin categoría' || grouped[name].length > 0);
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

  navigateToCreateProduct() {
    this.router.navigate(['/create-product']);
  }

  navigateToCategory(categoryName: string): void {
    // Navega a la vista filtrada pasando la categoría como parámetro
    this.router.navigate(['/category-products', categoryName]);
  }
}

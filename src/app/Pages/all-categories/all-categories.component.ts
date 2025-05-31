import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../Shared/services/sales.service';
import { CategoryService } from '../../Shared/services/category.service';
import { Observable, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';
import { Category } from '../../models/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './all-categories.component.html',
})
export class AllCategoriesComponent {
  groupedProducts$: Observable<
    Record<string, (Product & { stock: number; price: number })[]>
  >;
  private productService = inject(SalesService);
  private categoryService = inject(CategoryService);
  private location = inject(Location);
  private cartService = inject(CartService);
  private router = inject(Router);

  showBackButton = true;

  constructor() {
    this.groupedProducts$ = this.productService.getAllProducts().pipe(
      switchMap((products) => {
        if (products.length === 0) {
          return of([[], [], []]);
        }

        const ids = products.map((p) => p.id);
        return combineLatest([
          of(products),
          this.categoryService.getMainCategories(),
          this.productService.getSaleProductsByList(ids),
        ]);
      }),
      map(([products, categories, sales]) => {
        const categoryMap: Record<number, string> = {};
        categories.forEach((cat) => (categoryMap[cat.id] = cat.name));

        const salesMap = new Map<number, any>();
        sales.forEach((sale: any) => {
          if (sale?.product?.id) {
            salesMap.set(sale.product.id, sale);
          }
        });

        return products.reduce((acc, product) => {
          const sale = salesMap.get(product.id);
          const categoryName =
            categoryMap[product.category_id] ?? 'Sin categoría';

          const fullProduct = {
            ...product,
            imageUrl: product.img,
            price: sale?.price ?? 0,
            stock: sale?.stock ?? 0,
          };

          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(fullProduct);

          return acc;
        }, {} as Record<string, (Product & { stock: number; price: number })[]>);
      })
    );
  }

  getCategoryNames(grouped: Record<string, Product[]>): string[] {
    return Object.keys(grouped).filter(
      (name) => name !== 'Sin categoría' || grouped[name].length > 0
    );
  }

  goBack(): void {
    this.location.back();
  }

  setDefaultImage(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (!element.src.includes('no-img.jpg')) {
      element.src = 'assets/no-img.jpg';
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);

    Swal.fire({
      title: 'Producto agregado 🛒',
      html: `
        <strong>${product.name}</strong><br>
        Talla: <strong>${product.size}</strong><br>
        Precio: <strong>$${product.price}</strong>
      `,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#10B981',
      background: '#f0fdfa',
      color: '#064e3b',
    });
  }

  hideBackButtonTemporarily() {
    this.showBackButton = false;
    setTimeout(() => {
      this.showBackButton = true;
    }, 3000);
  }

  navigateToCreateProduct() {
    this.router.navigate(['/agregar-ventas']);
  }

  navigateToCategoryById(categoryId: number): void {
    this.router.navigate(['/category-products', categoryId]);
  }

  navigateToCategory(categoryName: string): void {
    this.router.navigate(['/category', categoryName]);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}

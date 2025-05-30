import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../Shared/services/sales.service';
import { CategoryService } from '../../Shared/services/category.service';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
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
  groupedProducts$: Observable<Record<string, (Product & { stock: number })[]>>;
  private productService = inject(SalesService);
  private categoryService = inject(CategoryService);
  private location = inject(Location);
  private cartService = inject(CartService);
  private router = inject(Router);

  showBackButton = true;

  constructor() {
    this.groupedProducts$ = combineLatest([
      this.productService.getAllProducts(), // solo trae info base
      this.categoryService.getMainCategories(),
    ]).pipe(
      switchMap(([products, categories]) => {
        const ids = products.map((p) => p.id);
        return combineLatest([
          of(products),
          of(categories),
          this.productService.getSaleProductsByList(ids), // ahora sí con price + stock
        ]);
      }),
      map(([products, categories, sales]) => {
        const categoryMap: Record<number, string> = {};
        categories.forEach((cat) => (categoryMap[cat.id] = cat.name));

        const grouped: Record<string, any[]> = {};
        categories.forEach((cat) => (grouped[cat.name] = []));
        grouped['Sin categoría'] = [];

        // indexar sales por ID para acceder rápido
        const salesMap = new Map<number, any>();
        sales.forEach((sale: any) => {
          if (sale?.product?.id) {
            salesMap.set(sale.product.id, sale);
          }
        });

        products.forEach((product: any) => {
          const sale = salesMap.get(product.id);
          const categoryName =
            categoryMap[product.category_id] ?? 'Sin categoría';

          const fullProduct = {
            ...product,
            imageUrl: product.img,
            price: sale?.price ?? 0,
            stock: sale?.stock ?? 0,
          };

          if (!grouped[categoryName]) grouped[categoryName] = [];
          grouped[categoryName].push(fullProduct);
        });

        return grouped;
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
}

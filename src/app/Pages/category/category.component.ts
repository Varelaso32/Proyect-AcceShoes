import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../Shared/services/product.service';
import { Observable, switchMap } from 'rxjs';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { Location } from '@angular/common';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';
import { CategoryService } from '../../Shared/services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  providers: [CartService],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  products$: Observable<Product[]>;
  subcategories$: Observable<Category[]>; // Nueva propiedad
  @ViewChild('modalRef') modalRef!: ElementRef<HTMLDialogElement>;
  addedProductName: string = '';
  categoryName: string = '';
  private categoryService = inject(CategoryService);
  private router = inject(Router);

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

    this.subcategories$ = this.route.paramMap.pipe(
      switchMap(params => {
        const category = params.get('category') || '';
        return this.categoryService.getSubcategoriesByParent(category);
      })
    );
  }

  navigateToSubcategory(subcategoryName: string): void {
    this.router.navigate(['/category', subcategoryName]);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.addedProductName = product.name;
    this.modalRef?.nativeElement?.showModal();
  }

  goBack(): void {
    this.location.back();
  }

}

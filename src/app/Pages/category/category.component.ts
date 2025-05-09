import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../Shared/services/product.service';
import { Observable, switchMap } from 'rxjs';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { Location } from '@angular/common';



@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  products$: Observable<Product[]>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location
  ) {

    this.products$ = this.route.paramMap.pipe(
      switchMap(params => {
        const category = params.get('category') || '';
        return this.productService.getProductsByCategory(category);
      })
    );
  }
  goBack(): void {
    this.location.back();
  }
}

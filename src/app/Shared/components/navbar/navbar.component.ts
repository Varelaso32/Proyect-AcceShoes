import { Component, ViewChild, ElementRef, Renderer2, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';  // Añadido aquí

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {  // Implementamos OnInit
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('searchContainer') searchContainer!: ElementRef;

  searchQuery: string = '';
  showSearchSuggestions: boolean = false;
  searchSuggestions: any[] = [];
  cartItemCount: number = 0;
  showUserDropdown: boolean = false;
  showCategorias = false;
  categories: any[] = [];

  private authService = inject(AuthService);
  private router = inject(Router);
  public cartService = inject(CartService);

  constructor(
    private renderer: Renderer2,
    private productService: ProductService,
    private categoryService: CategoryService  // Inyectamos el servicio de categorías
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

      this.renderer.listen('document', 'click', (event) => {
        const clickedInside = (event.target as HTMLElement).closest('.user-dropdown');
        if (!clickedInside) {
          this.showUserDropdown = false;
        }
      });
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Error cargando categorías principales:', err);
      }
    });
  }
  toggleSearch() {
    const searchElement = this.searchBox.nativeElement;
    const searchButton = this.searchContainer.nativeElement.querySelector('.search-btn');

    if (searchElement.classList.contains('hidden')) {
      this.renderer.removeClass(searchElement, 'hidden');
      this.renderer.addClass(searchButton, 'ml-12');
      this.renderer.addClass(searchElement, 'w-64');
      this.renderer.addClass(searchButton, 'mr-2');
      setTimeout(() => {
        searchElement.focus();
      }, 300);
    } else {
      this.renderer.addClass(searchElement, 'hidden');
      this.renderer.removeClass(searchButton, 'ml-12');
      this.renderer.removeClass(searchElement, 'w-64');
      this.renderer.removeClass(searchButton, 'mr-2');
      this.searchQuery = '';
      this.showSearchSuggestions = false;
    }
  }

  logout() {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('login');
      this.authService.login.set(false);

      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;

    if (query.trim().length > 2) {
      this.productService.searchProducts(query).subscribe(results => {
        this.searchSuggestions = results.slice(0, 5);
        this.showSearchSuggestions = this.searchSuggestions.length > 0;
      });
    } else {
      this.showSearchSuggestions = false;
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.login();
  }

  submitSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery.trim() }
      });
      this.showSearchSuggestions = false;
    }
  }

  selectSuggestion(productName: string): void {
    this.searchQuery = productName;
    this.submitSearch();
  }

  closeSuggestions(): void {
    setTimeout(() => {
      this.showSearchSuggestions = false;
    }, 200);
  }

  toggleCategorias() {
    this.showCategorias = !this.showCategorias;
  }
}

import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('searchContainer') searchContainer!: ElementRef;
  
  searchQuery: string = '';
  showSearchSuggestions: boolean = false;
  searchSuggestions: any[] = [];

  constructor(
    private renderer: Renderer2, 
    private router: Router,
    private productService: ProductService
  ) {}

  // Función para mostrar u ocultar el campo de búsqueda
  toggleSearch() {
    const searchElement = this.searchBox.nativeElement;
    const searchButton =
      this.searchContainer.nativeElement.querySelector('.search-btn');

    // Si el campo de búsqueda está oculto, lo mostramos
    if (searchElement.classList.contains('hidden')) {
      this.renderer.removeClass(searchElement, 'hidden');
      this.renderer.addClass(searchButton, 'ml-12'); // Mover el botón y el input juntos
      this.renderer.addClass(searchElement, 'w-64'); // Aumentar el ancho del input
      this.renderer.addClass(searchButton, 'mr-2'); // Agregar un margen al botón
      
      // Dar foco al campo de búsqueda
      setTimeout(() => {
        searchElement.focus();
      }, 300);
    } else {
      // Si ya está visible, lo ocultamos
      this.renderer.addClass(searchElement, 'hidden');
      this.renderer.removeClass(searchButton, 'ml-12'); // Mover el botón de vuelta
      this.renderer.removeClass(searchElement, 'w-64'); // Reducir el ancho del input
      this.renderer.removeClass(searchButton, 'mr-2'); // Eliminar el margen extra
      
      // Limpiar búsqueda al cerrar
      this.searchQuery = '';
      this.showSearchSuggestions = false;
    }
  }
  
  // Método para manejar la entrada de búsqueda
  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    
    if (query.trim().length > 2) {
      // Buscar sugerencias cuando el usuario escribe más de 2 caracteres
      this.productService.searchProducts(query).subscribe(results => {
        // Limitar a 5 sugerencias máximo
        this.searchSuggestions = results.slice(0, 5);
        this.showSearchSuggestions = this.searchSuggestions.length > 0;
      });
    } else {
      this.showSearchSuggestions = false;
    }
  }
  
  // Método para enviar el formulario de búsqueda
  submitSearch(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.searchQuery.trim()) {
      // Navegar a la página de resultados de búsqueda con el query
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
      
      // Ocultar sugerencias después de buscar
      this.showSearchSuggestions = false;
    }
  }
  
  // Método para seleccionar una sugerencia
  selectSuggestion(productName: string): void {
    this.searchQuery = productName;
    this.submitSearch();
  }
  
  // Cerrar el dropdown de sugerencias cuando se hace clic fuera
  closeSuggestions(): void {
    setTimeout(() => {
      this.showSearchSuggestions = false;
    }, 200);
  }
}
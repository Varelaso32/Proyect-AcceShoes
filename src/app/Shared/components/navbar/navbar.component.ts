import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('searchContainer') searchContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  // Función para mostrar u ocultar el campo de búsqueda
  toggleSearch() {
    const searchElement = this.searchBox.nativeElement;
    const searchButton =
      this.searchContainer.nativeElement.querySelector('.search-btn');

    // Si el campo de búsqueda está oculto, lo mostramos
    if (searchElement.classList.contains('hidden')) {
      this.renderer.removeClass(searchElement, 'hidden');
      this.renderer.addClass(searchButton, 'ml-12'); 
      this.renderer.addClass(searchElement, 'w-64');
      this.renderer.addClass(searchButton, 'mr-2');
    } else {
      // Si ya está visible, lo ocultamos
      this.renderer.addClass(searchElement, 'hidden');
      this.renderer.removeClass(searchButton, 'ml-12'); 
      this.renderer.removeClass(searchElement, 'w-64'); 
      this.renderer.removeClass(searchButton, 'mr-2');
    }
  }
}

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
      this.renderer.addClass(searchButton, 'ml-12'); // Mover el botón y el input juntos
      this.renderer.addClass(searchElement, 'w-64'); // Aumentar el ancho del input
      this.renderer.addClass(searchButton, 'mr-2'); // Agregar un margen al botón
    } else {
      // Si ya está visible, lo ocultamos
      this.renderer.addClass(searchElement, 'hidden');
      this.renderer.removeClass(searchButton, 'ml-12'); // Mover el botón de vuelta
      this.renderer.removeClass(searchElement, 'w-64'); // Reducir el ancho del input
      this.renderer.removeClass(searchButton, 'mr-2'); // Eliminar el margen extra
    }
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseHttpService } from './base-http.service';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseHttpService {
  // Datos simulados de productos
  private products: Product[] = [
    {
      id: 1,
      name: 'Zapatos Deportivos',
      category: 'zapatos',
      price: 89.99,
      description: 'Zapatos deportivos cómodos para correr',
      imageUrl: 'assets/zapatos.jpg',
    },
    {
      id: 2,
      name: 'Zapatos Formales',
      category: 'zapatos',
      price: 120.00,
      description: 'Zapatos formales elegantes para ocasiones especiales',
      imageUrl: 'assets/products/zapatos-formales.jpg',
    },
    {
      id: 3,
      name: 'Zapatos Casuales',
      category: 'zapatos',
      price: 75.50,
      description: 'Zapatos casuales para uso diario',
      imageUrl: 'assets/products/zapatos-casuales.jpg',
    },
    {
      id: 4,
      name: 'Gorra Deportiva',
      category: 'gorras',
      price: 25.99,
      description: 'Gorra deportiva con protección UV',
      imageUrl: 'assets/products/gorra-deportiva.jpg',
    },
    {
      id: 5,
      name: 'Gorra de Moda',
      category: 'gorras',
      price: 34.50,
      description: 'Gorra moderna con diseño a la moda',
      imageUrl: 'assets/products/gorra-moda.jpg',
    },
    {
      id: 6,
      name: 'Saco de Invierno',
      category: 'sacos',
      price: 159.99,
      description: 'Saco cálido para temporada de frío',
      imageUrl: 'assets/products/saco-invierno.jpg',
    },
    {
      id: 7,
      name: 'Saco Formal',
      category: 'sacos',
      price: 189.95,
      description: 'Saco formal elegante para eventos',
      imageUrl: 'assets/products/saco-formal.jpg',
    },
    {
      id: 8,
      name: 'Collar de Plata',
      category: 'collares',
      price: 65.00,
      description: 'Collar de plata con diseño elegante',
      imageUrl: 'assets/products/collar-plata.jpg',
    },
    {
      id: 9,
      name: 'Collar de Perlas',
      category: 'collares',
      price: 89.99,
      description: 'Collar de perlas cultivadas',
      imageUrl: 'assets/products/collar-perlas.jpg',
    },
    {
      id: 10,
      name: 'Collar de Oro',
      category: 'collares',
      price: 250.00,
      description: 'Collar de oro de 18 quilates',
      imageUrl: 'assets/products/collar-oro.jpg',
    },
  ];

  constructor() {
    super();
  }

  // Método para obtener todos los productos
  getProducts(): Observable<Product[]> {
    // Aquí podrías conectar con tu API real cuando la tengas
    // return this.http.get<Product[]>(`${this.apiUrl}/products`);
    
    // Por ahora, devuelve datos simulados
    return of(this.products);
  }

  // Método para buscar productos
  searchProducts(query: string): Observable<Product[]> {
    // Si no hay consulta, devuelve todos los productos
    if (!query.trim()) {
      return of(this.products);
    }
    
    // Búsqueda insensible a mayúsculas/minúsculas
    const searchTerm = query.toLowerCase();
    
    // Filtrar productos que coincidan con la búsqueda
    const filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
    
    return of(filteredProducts);
  }

  // Método para obtener un producto por ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  // Método para obtener productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
    return of(filteredProducts);
  }
}
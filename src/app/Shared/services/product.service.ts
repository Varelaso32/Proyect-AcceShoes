import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../../app/models/products.model';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseHttpService {

  constructor() {
    super();
  }

  // Obtener todos los productos de la API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Buscar productos: si la API no tiene endpoint, filtras en frontend con mock (fallback)
  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return this.getProducts(); // o si quieres fallback, return of(this.products);
    }

    // Si la API no soporta búsqueda, se puede obtener todo y filtrar localmente
    return new Observable<Product[]>(observer => {
      this.getProducts().subscribe(products => {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          (product.category && product.category.toString().toLowerCase().includes(query.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
        );
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  // Obtener producto por id de la API
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Obtener productos por categoría - si no hay endpoint, filtro local (similar a search)
  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable<Product[]>(observer => {
      this.getProducts().subscribe(products => {
        const filtered = products.filter(
          p => p.category && p.category.toString().toLowerCase() === category.toLowerCase()
        );
        observer.next(filtered);
        observer.complete();
      });
    });
  }
}

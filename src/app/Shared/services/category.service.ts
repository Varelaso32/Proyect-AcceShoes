import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://fastacceshoes.onrender.com/categories/';

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Crear nueva categoría
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
  getAllCategories(skip = 0, limit = 100): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.apiUrl}/categories/?skip=${skip}&limit=${limit}`);
}

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://fastacceshoes.onrender.com/categories/';

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías (con paginación opcional)
  getCategories(skip = 0, limit = 100): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }
  getSubcategoriesByParent(parentCategoryName: string): Observable<Category[]> {
    return this.http.get<Category[]>(`/api/categories?parent=${parentCategoryName}`);
  }

  // Obtener categorías principales
  getMainCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}main`);
  }

  // Obtener subcategorías de una categoría padre
  getSubCategories(parentId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}${parentId}/children`);
  }

  // Obtiene una categoría con sus subcategorías anidadas
  getCategoryDetails(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}${categoryId}`);
  }
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  // Crear nueva categoría
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
}

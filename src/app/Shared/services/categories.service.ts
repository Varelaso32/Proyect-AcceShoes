import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryDto } from '../../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/categories`;

  // Listar todas las categorías
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/`);
  }

  // Listar categorías principales (sin padre)
  getMainCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/main`);
  }

  // Obtener detalles de una categoría específica
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva categoría o subcategoría
  create(data: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/`, data);
  }

  // Actualizar categoría
  update(id: number, data: Partial<CreateCategoryDto>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar categoría (requiere que no tenga subcategorías)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

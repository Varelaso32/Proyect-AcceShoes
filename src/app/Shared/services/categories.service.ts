import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryDto } from '../../models/category.model';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/categories`;

  constructor(private auditService: AuditService) {}

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
    return this.http.post<Category>(`${this.apiUrl}/`, data).pipe(
      tap((response) => {
        this.auditService.addLog({
          action: 'CREATE',
          entity: 'CATEGORY',
          entityId: response.id,
          details: { name: response.name, parentId: response.parent_id },
        });
      })
    );
  }

  // Actualizar categoría
  update(id: number, data: Partial<CreateCategoryDto>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, data).pipe(
      tap((response) => {
        this.auditService.addLog({
          action: 'UPDATE',
          entity: 'CATEGORY',
          entityId: id,
          details: { changes: data },
        });
      })
    );
  }

  // Eliminar categoría (requiere que no tenga subcategorías)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.auditService.addLog({
          action: 'DELETE',
          entity: 'CATEGORY',
          entityId: id,
        });
      })
    );
  }
}

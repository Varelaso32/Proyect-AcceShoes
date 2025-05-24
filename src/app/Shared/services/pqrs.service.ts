import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from '../../Shared/services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

interface PqrsForm {
  category: string;
  description: string;
}
@Injectable({
  providedIn: 'root',
})
export class PqrsService extends BaseHttpService {
  override http = inject(HttpClient);

  constructor(private auditService: AuditService) {
    super();
  }

  createPqrs(data: PqrsForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/pqrs/`, data).pipe(
      tap((response) => {
        this.auditService.addLog({
          action: 'CREATE',
          entity: 'PQRS',
          details: { category: data.category },
        });
      })
    );
  }

  // Obtener todas las PQRSD
  getAllPqrs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pqrs/`).pipe(
      tap(() => {
        this.auditService.addLog({
          action: 'READ_ALL',
          entity: 'PQRS',
          details: 'Se consultaron todas las PQRSD',
        });
      })
    );
  }

  getMyPqrs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pqrs/my-pqrs`).pipe(
      tap(() => {
        this.auditService.addLog({
          action: 'READ_MINE',
          entity: 'PQRS',
          details: 'Se consultaron las PQRSD del usuario actual',
        });
      })
    );
  }
}

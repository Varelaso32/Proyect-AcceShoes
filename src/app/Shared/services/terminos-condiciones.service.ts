import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { AuditService } from './audit.service';

// Modelos
export interface TermCondition {
  id: number;
  description: string;
  deleted_at?: string | null;
}

export interface CreateTermConditionDto {
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TermConditionService extends BaseHttpService {
  private termsCache: TermCondition[] = [];

  constructor(private auditService: AuditService) {
    super();
  }

  getTerms(): Observable<TermCondition[]> {
    return this.http.get<TermCondition[]>(
      `${this.apiUrl}/terms-and-conditions/`
    );
  }

  getTermById(id: number): TermCondition | undefined {
    return this.termsCache.find((term) => term.id === id);
  }

  createTerm(data: CreateTermConditionDto): Observable<TermCondition> {
    return this.http
      .post<TermCondition>(`${this.apiUrl}/terms-and-conditions/`, data)
      .pipe(
        tap((response) => {
          this.auditService.addLog({
            action: 'CREATE',
            entity: 'TERM_CONDITION',
            entityId: response.id,
            details: { description: response.description },
          });
        })
      );
  }

  updateTerm(
    id: number,
    data: CreateTermConditionDto
  ): Observable<TermCondition> {
    return this.http
      .put<TermCondition>(`${this.apiUrl}/terms-and-conditions/${id}`, data)
      .pipe(
        tap((response) => {
          this.auditService.addLog({
            action: 'UPDATE',
            entity: 'TERM_CONDITION',
            entityId: response.id,
            details: { description: response.description },
          });
        })
      );
  }

  deleteTerm(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/terms-and-conditions/${id}`)
      .pipe(
        tap(() => {
          this.auditService.addLog({
            action: 'DELETE',
            entity: 'TERM_CONDITION',
            entityId: id,
            details: null,
          });
        })
      );
  }
}

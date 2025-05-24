import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { AuditService } from './audit.service';

// Modelos
export interface PrivacyPolicy {
  id: number;
  description: string;
  deleted_at?: string | null;
}

export interface CreatePrivacyPolicyDto {
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrivacyPolicyService extends BaseHttpService {
  private policiesCache: PrivacyPolicy[] = [];

  constructor(private auditService: AuditService) {
    super();
  }

  getPolicies(): Observable<PrivacyPolicy[]> {
    return this.http.get<PrivacyPolicy[]>(`${this.apiUrl}/privacy-policies`);
  }

  getPolicyById(id: number): PrivacyPolicy | undefined {
    return this.policiesCache.find((policy) => policy.id === id);
  }

  createPolicy(data: CreatePrivacyPolicyDto): Observable<PrivacyPolicy> {
    return this.http
      .post<PrivacyPolicy>(`${this.apiUrl}/privacy-policies`, data)
      .pipe(
        tap((response) => {
          this.auditService.addLog({
            action: 'CREATE',
            entity: 'PRIVACY_POLICY',
            entityId: response.id,
            details: { description: response.description },
          });
        })
      );
  }

  updatePolicy(
    id: number,
    data: CreatePrivacyPolicyDto
  ): Observable<PrivacyPolicy> {
    return this.http
      .put<PrivacyPolicy>(`${this.apiUrl}/privacy-policies/${id}`, data)
      .pipe(
        tap((response) => {
          this.auditService.addLog({
            action: 'UPDATE',
            entity: 'PRIVACY_POLICY',
            entityId: response.id,
            details: { description: response.description },
          });
        })
      );
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/privacy-policies/${id}`).pipe(
      tap(() => {
        this.auditService.addLog({
          action: 'DELETE',
          entity: 'PRIVACY_POLICY',
          entityId: id,
          details: null,
        });
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable, tap } from 'rxjs';
import { CreatePlanDto, Plan } from '../../models/plan.model';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root',
})
export class PlansService extends BaseHttpService {
  private plansCache: Plan[] = [];

  constructor(private auditService: AuditService) {
    super();
  }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/plans`);
  }

  getPlanById(planId: number): Plan | undefined {
    return this.plansCache.find((plan) => plan.id === planId);
  }

  createPlan(plan: CreatePlanDto): Observable<Plan> {
    return this.http.post<Plan>(`${this.apiUrl}/plans`, plan).pipe(
      tap((response) => {
        this.auditService.addLog({
          action: 'CREATE',
          entity: 'PLAN',
          entityId: response.id,
          details: { name: response.name, price: response.price },
        });
      })
    );
  }
}

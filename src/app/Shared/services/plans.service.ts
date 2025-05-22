import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable, tap } from 'rxjs';
import { Plan } from '../../models/plan.model';

@Injectable({
  providedIn: 'root',
})
export class PlansService extends BaseHttpService {
  private plansCache: Plan[] = [];

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/plans`);
  }

  getPlanById(planId: number): Plan | undefined {
    return this.plansCache.find((plan) => plan.id === planId);
  }
}

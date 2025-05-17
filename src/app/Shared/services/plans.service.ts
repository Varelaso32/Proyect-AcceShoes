import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable } from 'rxjs';
import { Plan } from '../../models/plan.model';

@Injectable({
  providedIn: 'root',
})
export class PlansService extends BaseHttpService {
  private endpoint = `${this.apiUrl}/plans`;

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.endpoint);
  }
}

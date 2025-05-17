// transaction.service.ts
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseHttpService {
  createTransaction(transactionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions`, transactionData);
  }
}

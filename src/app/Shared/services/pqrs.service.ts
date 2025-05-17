import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from '../../Shared/services/base-http.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PqrsForm {
  category: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class PqrsService extends BaseHttpService {
  override http = inject(HttpClient);

  createPqrs(data: PqrsForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/pqrs/`, data);
  }
}

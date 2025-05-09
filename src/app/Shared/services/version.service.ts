import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  constructor(private http: HttpClient) {}

  // VersionService (Angular)
  getVersion(): Observable<{ name: string; version: string }> {
    return this.http.get<{ name: string; version: string }>(
      'assets/version.json'
    );
  }
}

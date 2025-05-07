import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://fastacceshoes.onrender.com/users/login';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<any> {
   
    return this.http.post<any>(this.apiUrl, {
      email: user.username, // email
      password: user.password
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://fastacceshoes.onrender.com'; 

  constructor(private http: HttpClient) {}

  // Método para hacer login
  
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }


  resetPassword(email: string, newPassword: string): Observable<any> {
    const body = {
      username: email,
      new_password: newPassword
    };
    return this.http.patch(`${this.apiUrl}/users/me/password`, body);
  }
  
  
}

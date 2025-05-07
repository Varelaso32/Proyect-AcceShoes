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
  login(user: User): Observable<any> {
    const endpoint = '/users/login'; 
    return this.http.post<any>(this.apiUrl + endpoint, user); 
  }

  register(user: { username: string, password: string, email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/`, user);
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    const body = {
      username: email,
      new_password: newPassword
    };
    return this.http.patch(`${this.apiUrl}/users/me/password`, body);
  }
  
  
}

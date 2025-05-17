import { Injectable } from '@angular/core';
import { UserResponse, UpdateUserDto } from '../../models/user.model';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/me`);
  }

  updateCurrentUser(data: UpdateUserDto): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/users/me`, data);
  }

  updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/me/password`, data);
  }

  getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${userId}`);
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/users`);
  }
  
}

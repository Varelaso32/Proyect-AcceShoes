import { Injectable } from '@angular/core';
import {
  UserResponse,
  UpdateUserDto,
  CreateUserDto,
  UpdateUserWithPasswordDto,
} from '../../models/user.model';
import { Observable, tap } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  private readonly BLOCKED_USERS_KEY = 'blocked_users';

  constructor(private auditService: AuditService) {
    super();
  }

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

  updateUserPlan(planId: number | null): Observable<UserResponse> {
    const params = planId !== null ? `?plan_id=${planId}` : '';
    return this.http
      .patch<UserResponse>(`${this.apiUrl}/users/me/plan${params}`, {})
      .pipe(
        tap((response) =>
          console.log('Respuesta de actualización de plan:', response)
        )
      );
  }

  createUser(data: CreateUserDto): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/users/`, data).pipe(
      tap((response) => {
        this.auditService.addLog({
          action: 'CREATE',
          entity: 'USER',
          entityId: response.id,
          details: { email: response.email, role: response.role },
        });
      })
    );
  }

  updateUser(
    userId: number,
    data: UpdateUserWithPasswordDto
  ): Observable<UserResponse> {
    return this.http
      .put<UserResponse>(`${this.apiUrl}/users/${userId}`, data)
      .pipe(
        tap((response) => {
          this.auditService.addLog({
            action: 'UPDATE',
            entity: 'USER',
            entityId: userId,
            details: { changes: data },
          });
        })
      );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`).pipe(
      tap(() => {
        this.auditService.addLog({
          action: 'DELETE',
          entity: 'USER',
          entityId: userId,
        });
      })
    );
  }

  changeUserRole(userId: number, role: string) {
    return this.http
      .patch(`${this.apiUrl}/users/${userId}/role`, {
        new_role: role.trim(),
      })
      .pipe(
        tap(() => {
          this.auditService.addLog({
            action: 'UPDATE_ROLE',
            entity: 'USER',
            entityId: userId,
            details: { newRole: role },
          });
        })
      );
  }

  changeUserPlan(userId: number, planId: number) {
    if (!planId) {
      throw new Error('El plan no puede ser nulo');
    }
    return this.http.patch(
      `${this.apiUrl}/users/${userId}/plan?plan_id=${planId}`,
      {}
    );
  }
  getBlockedUsers(): string[] {
    const blocked = localStorage.getItem(this.BLOCKED_USERS_KEY);
    return blocked ? JSON.parse(blocked) : [];
  }

  blockUser(email: string): void {
    const blocked = this.getBlockedUsers();
    if (!blocked.includes(email)) {
      blocked.push(email);
      localStorage.setItem(this.BLOCKED_USERS_KEY, JSON.stringify(blocked));
    }
  }

  unblockUser(email: string): void {
    const blocked = this.getBlockedUsers();
    const updated = blocked.filter((e) => e !== email);
    localStorage.setItem(this.BLOCKED_USERS_KEY, JSON.stringify(updated));
  }

  isUserBlocked(email: string): boolean {
    return this.getBlockedUsers().includes(email);
  }
}

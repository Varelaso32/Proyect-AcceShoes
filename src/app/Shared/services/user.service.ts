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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttpService {
  private readonly BLOCKED_USERS_KEY = 'blocked_users';
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auditService: AuditService) {
    super();
  }

  setCurrentUser(user: UserResponse) {
    this.currentUserSubject.next(user);
  }

  getCurrentUserValue(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http
      .get<UserResponse>(`${this.apiUrl}/users/me`)
      .pipe(tap((user) => this.setCurrentUser(user)));
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
        tap((updatedUser) => {
          this.setCurrentUser(updatedUser); // 🔄 Forzar actualización del BehaviorSubject
          console.log('Plan actualizado en userService:', updatedUser);
        })
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

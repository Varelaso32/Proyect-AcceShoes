import { effect, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../services/base-http.service';
import { UserResponse } from '../../models/user.model';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';

const STORE_KEY = 'login';
const TOKEN_KEY = 'access_token';
const FAILED_ATTEMPTS_KEY = 'failed_attempts';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  // Estado de login usando señales
  login = signal<boolean>(this.loadFromLocalStorage());

  constructor(private router: Router, private userService: UserService) {
    super();
    this.checkTokenValidity();
  }

  // Verificar si el token es válido
  private checkTokenValidity() {
    if (!localStorage.getItem(TOKEN_KEY)) {
      this.login.set(false);
    }
  }

  private loadFromLocalStorage(): boolean {
    try {
      const loginFromLocalStorage = localStorage.getItem(STORE_KEY);
      return loginFromLocalStorage ? JSON.parse(loginFromLocalStorage) : false;
    } catch (error) {
      console.error('Error loading login state:', error);
      return false;
    }
  }

  saveLoginToLocalStorage = effect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.login()));
  });

  getAuthToken(): Observable<boolean> {
    const token = localStorage.getItem(TOKEN_KEY);
    return of(!!token);
  }

  loginAuth(data: { email: string; password: string }) {
    if (this.userService.isUserBlocked(data.email)) {
      return throwError(
        () => new Error('Usuario bloqueado. Contacte al administrador.')
      );
    }

    return this.http.post(`${this.apiUrl}/users/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem(TOKEN_KEY, response.access_token);
        this.login.set(true);
        this.resetFailedAttempts(data.email);
      }),
      catchError((error) => {
        this.registerFailedAttempt(data.email);
        return throwError(() => error);
      })
    );
  }

  // Método para registrar intento fallido
  registerFailedAttempt(email: string): void {
    const attemptsKey = `${FAILED_ATTEMPTS_KEY}_${email}`;
    const attempts = Number(localStorage.getItem(attemptsKey)) || 0;
    const newAttempts = attempts + 1;

    localStorage.setItem(attemptsKey, newAttempts.toString());

    if (newAttempts >= 3) {
      this.userService.blockUser(email);
    }
  }

  // Método para resetear intentos fallidos
  resetFailedAttempts(email: string): void {
    const attemptsKey = `${FAILED_ATTEMPTS_KEY}_${email}`;
    localStorage.removeItem(attemptsKey);
  }

  getUserProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/me`);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/users/`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.login.set(true);
      })
    );
  }

  resetPassword(email: string, newPassword: string) {
    return this.http
      .post(`${this.apiUrl}/users/reset-password`, { email, newPassword })
      .pipe(tap((response: any) => {}));
  }

  logout() {
    try {
      console.log('Cerrando sesión desde AuthService');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STORE_KEY);

      this.login.set(false);

      this.router.navigate(['/login']).then(() => {
        console.log('Redirección a login completada');

        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      });
    } catch (error) {
      console.error('Error en proceso de logout:', error);
      window.location.href = '/login';
    }
  }
}

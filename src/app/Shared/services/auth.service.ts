import { effect, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../services/base-http.service';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

const STORE_KEY = 'login';
const TOKEN_KEY = 'access_token'; // Nombre para el token

const loadFromLocalStorage = () => {
  try {
    const loginFromLocalStorage = localStorage.getItem(STORE_KEY);
    if (loginFromLocalStorage === null) return false;
    return JSON.parse(loginFromLocalStorage.toString());
  } catch (error) {
    console.error('Error loading login state from localStorage:', error);
    return false;
  }
};

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  // Estado de login usando señales
  login = signal<boolean>(loadFromLocalStorage());

  constructor(private router: Router) {
    super();
    
    // Verificar token al inicio
    this.checkTokenValidity();
  }

  // Verificar si el token es válido
  private checkTokenValidity() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      this.login.set(false);
    }
  }

  // Guardar el estado de login en localStorage
  saveLoginToLocalStorage = effect(() => {
    try {
      const login = JSON.stringify(this.login());
      localStorage.setItem(STORE_KEY, login);
    } catch (error) {
      console.error('Error saving login state to localStorage:', error);
    }
  });

  // Obtener el token de autenticación
  getAuthToken(): Observable<boolean> {
    const token = localStorage.getItem(TOKEN_KEY);
    return of(!!token); // Si el token existe, retorna true
  }

  // Método para hacer login y guardar el token
  loginAuth(data: any) {
    return this.http.post(`${this.apiUrl}/users/login`, data).pipe(
      tap((response: any) => {
        // Guardar el token en el localStorage
        localStorage.setItem(TOKEN_KEY, response.access_token);
        this.login.set(true); // Establecer el estado de login a true
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/users/register`, data).pipe(
      tap((response: any) => {
        // Aquí puedes guardar el token o hacer cualquier otra acción después de registrar
        console.log('Registro exitoso ✅', response);
      })
    );
  }

  resetPassword(email: string, newPassword: string) {
    return this.http
      .post(`${this.apiUrl}/users/reset-password`, { email, newPassword })
      .pipe(
        tap((response: any) => {
          // Aquí puedes manejar la respuesta después de la actualización de la contraseña
          console.log('Contraseña actualizada ✅', response);
        })
      );
  }

  // Método para cerrar sesión
  logout() {
    try {
      console.log('Cerrando sesión desde AuthService');
      // Limpiar localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STORE_KEY);
      
      // Actualizar estado
      this.login.set(false);
      
      // Navegar a la página de login
      this.router.navigate(['/login']).then(() => {
        console.log('Redirección a login completada');
        
        // Si la redirección falla por alguna razón, forzar recarga
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      });
    } catch (error) {
      console.error('Error en proceso de logout:', error);
      // Intento de recuperación
      window.location.href = '/login';
    }
  }
}
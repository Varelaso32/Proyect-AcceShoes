import { effect, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../services/base-http.service';
import { Observable, of, tap } from 'rxjs';

const STORE_KEY = 'login';
const TOKEN_KEY = 'access_token'; // Nuevo nombre para el token

const loadFromLocalStorage = () => {
  const loginFromLocalStorage = localStorage.getItem(STORE_KEY) ?? false;
  const login = JSON.parse(loginFromLocalStorage.toString());
  return login;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  // Estado de login usando señales
  login = signal<boolean>(loadFromLocalStorage());

  // Guardar el estado de login en localStorage
  saveLoginToLocalStorage = effect(() => {
    const login = JSON.stringify(this.login());
    localStorage.setItem(STORE_KEY, login);
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
    return this.http.post(`${this.apiUrl}/users/`, data).pipe(
      tap((response: any) => {
        // Guardar el token en localStorage si el backend lo devuelve
        localStorage.setItem('access_token', response.access_token);
        this.login.set(true); // Cambiar el estado a logueado
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
    this.login.set(false);
    localStorage.removeItem(TOKEN_KEY); // Eliminar el token del localStorage
    window.location.reload();
  }
}

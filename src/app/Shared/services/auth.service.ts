import { effect, Injectable, signal } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { Observable, of } from 'rxjs';
import { Login } from '../../interfaces/store.interfaces';
const STORE_KEY = 'login';

const loadFromLocalStorage = () => {
  const loginFromLocalStorage = localStorage.getItem(STORE_KEY) ?? false;
  const login = JSON.parse(loginFromLocalStorage.toString());
  return login;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseHttpService {
  login = signal<boolean>(loadFromLocalStorage());

  saveLoginToLocalStorage = effect(() => {
    const login = JSON.stringify(this.login());
    localStorage.setItem(STORE_KEY, login);
  });

  getAuth(): Observable<boolean> {
    return of(this.login());
  }

  loginAuth(data: Login) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  logout() {
    this.login.set(false);
    window.location.reload();
  }
}

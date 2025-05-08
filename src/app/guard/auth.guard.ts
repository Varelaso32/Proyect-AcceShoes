import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Shared/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  let login = false;

  authService.getAuthToken().subscribe((isAuthenticated) => {
    login = isAuthenticated;
    console.log(login);
    if (!login) {
      router.navigateByUrl('login');
    }
  });

  return login;
};

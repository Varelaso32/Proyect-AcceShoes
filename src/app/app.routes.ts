import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () =>
      import('./Pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () =>
      import('./Pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    title: 'Recuperar contraseña',
    loadComponent: () =>
      import('./Pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'home',
    title: 'Inicio',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Pages/home/home.component').then((m) => m.default),
  },
  {
    path: 'politica-privacidad',
    title: 'Política de Privacidad',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './Pages/config/politica-privacidad/politica-privacidad.component'
      ).then((m) => m.PoliticaPrivacidadComponent),
  },
  {
    path: 'terminos-condiciones',
    title: 'Términos y Condiciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './Pages/config/terminos-condiciones/terminos-condiciones.component'
      ).then((m) => m.TerminosCondicionesComponent),
  },
  {
    path: 'search',
    title: 'Resultados de Búsqueda',
    loadComponent: () =>
      import(
        './Shared/components/search-results/search-results.component'
      ).then((m) => m.SearchResultsComponent),
  },
  {
    path: 'sobre-nosotros',
    title: 'Sobre Nosotros',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Pages/config/sobre-nosotros/sobre-nosotros.component').then(
        (m) => m.SobreNosotrosComponent
      ),
  },
  {
    path: 'product/:id',
    title: 'Detalle del Producto',
    loadComponent: () =>
      import('./Pages/product/product.component').then(
        (m) => m.ProductDetailComponent
      ),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];

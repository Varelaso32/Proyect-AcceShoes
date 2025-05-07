import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () =>
      import('../app/Pages/home/home.component').then((m) => m.default),
  },
  {
    path: 'politica-privacidad',
    title: 'Política de Privacidad',
    loadComponent: () =>
      import(
        './Pages/config/politica-privacidad/politica-privacidad.component'
      ).then((m) => m.PoliticaPrivacidadComponent),
  },
];

import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { NavbarLateralComponent } from './Pages/admin/components/navbar-lateral/navbar-lateral/navbar-lateral.component';

export const routes: Routes = [
  // Redirección inicial
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas públicas
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
    path: 'search',
    title: 'Resultados de Búsqueda',
    loadComponent: () =>
      import(
        './Shared/components/search-results/search-results.component'
      ).then((m) => m.SearchResultsComponent),
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
    path: 'category/:category',
    title: 'Categoría',
    loadComponent: () =>
      import('./Pages/category/category.component').then(
        (m) => m.CategoryComponent
      ),
  },
  {
    path: 'all-categories',
    title: 'Todos los Productos',
    loadComponent: () =>
      import('./Pages/all-categories/all-categories.component').then(
        (m) => m.AllCategoriesComponent
      ),
  },

  // Rutas protegidas por authGuard
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'Inicio',
        loadComponent: () =>
          import('./Pages/home/home.component').then((m) => m.default),
      },
      {
        path: 'configuracion',
        title: 'Configuración',
        loadComponent: () =>
          import('./Pages/config/configuracion/configuracion.component').then(
            (m) => m.ConfiguracionComponent
          ),
      },
      {
        path: 'home-admin',
        title: 'Inicio Admin',
        loadComponent: () =>
          import('./Pages/admin/home-admin/home-admin.component').then(
            (m) => m.HomeAdminComponent
          ),
      },
      {
        path: 'home-selector',
        title: 'Seleccionar Home',
        loadComponent: () =>
          import(
            './Pages/admin/components/home-selector/home-selector.component'
          ).then((m) => m.HomeSelectorComponent),
      },
      {
        path: 'politica-privacidad',
        title: 'Política de Privacidad',
        loadComponent: () =>
          import(
            './Pages/config/politica-privacidad/politica-privacidad.component'
          ).then((m) => m.PoliticaPrivacidadComponent),
      },
      {
        path: 'terminos-condiciones',
        title: 'Términos y Condiciones',
        loadComponent: () =>
          import(
            './Pages/config/terminos-condiciones/terminos-condiciones.component'
          ).then((m) => m.TerminosCondicionesComponent),
      },
      {
        path: 'agregar-ventas',
        title: 'Crear Venta de Producto',
        loadComponent: () =>
          import(
            './Pages/crear-producto/crear-producto.component'
          ).then((m) => m.CrearProductoComponent),
      },
      {
        path: 'perfil',
        title: 'Perfil',
        loadComponent: () =>
          import('./Pages/config/perfil/perfil.component').then(
            (m) => m.PerfilComponent
          ),
      },
      {
        path: 'usuarios/:id',
        title: 'Perfil de Usuario',
        loadComponent: () =>
          import('./Pages/config/perfil/perfil.component').then(
            (m) => m.PerfilComponent
          ),
      },
      {
        path: 'sobre-nosotros',
        title: 'Sobre Nosotros',
        loadComponent: () =>
          import('./Pages/config/sobre-nosotros/sobre-nosotros.component').then(
            (m) => m.SobreNosotrosComponent
          ),
      },
      {
        path: 'chat',
        title: 'Chat de Mensajes',
        loadComponent: () =>
          import('./Pages/chat/chat.component').then((m) => m.ChatComponent),
      },
      {
        path: 'metodo-pago',
        title: 'Pasarela de Pago',
        loadComponent: () =>
          import('./Pages/metodo-pagos/metodo-pagos.component').then(
            (m) => m.MetodoPagosComponent
          ),
      },
      {
        path: 'peticiones-pqrsd',
        title: 'PQRSD',
        loadComponent: () =>
          import('./Pages/pqrsd/pqrsd.component').then((m) => m.PqrsdComponent),
      },
      {
        path: 'ubicacion',
        title: 'Ubicación',
        loadComponent: () =>
          import('./Pages/ubicacion/ubicacion.component').then(
            (m) => m.UbicacionComponent
          ),
      },
      {
        path: 'cart',
        title: 'Carrito de Compras',
        loadComponent: () =>
          import('./Shared/components/cart/cart.component').then(
            (m) => m.CartComponent
          ),
      },
      {
        path: 'create-category',
        loadComponent: () =>
          import('./Pages/category-create/category-create.component').then(
            (m) => m.CategoryCreateComponent
          ),
      },
    ],
  },
  {
    path: 'create-product',
    title: 'Crear Producto',
    canActivate: [authGuard], // Si requiere autenticación
    loadComponent: () =>
      import('./Pages/create-product/create-product.component').then(
        (m) => m.CreateProductComponent
      ),
  },
  {
    path: 'all-products',
    title: 'Todos los Productos',
    loadComponent: () =>
      import('./Pages/all-categories/all-categories.component').then(
        (m) => m.AllCategoriesComponent
      ),
  },
  {
    path: 'category/:category',
    loadComponent: () =>
      import('./Pages/category/category.component').then(
        (m) => m.CategoryComponent
      ),
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    component: NavbarLateralComponent,
    children: [
      {
        path: 'usuarios',
        title: 'Gestión de Usuarios',
        loadComponent: () =>
          import(
            './Pages/admin/gestion-usuarios/gestion-usuarios.component'
          ).then((m) => m.GestionUsuariosComponent),
      },
      {
        path: 'categorias',
        title: 'Gestión de Categorias',
        loadComponent: () =>
          import(
            './Pages/admin/gestion-categorias/gestion-categorias.component'
          ).then((m) => m.GestionCategoriasComponent),
      },
      {
        path: 'configuracion',
        title: 'Configuración Admin',
        loadComponent: () =>
          import(
            './Pages/admin/configuracion-admin/configuracion-admin.component'
          ).then((m) => m.ConfiguracionAdminComponent),
      },
      {
        path: 'planes',
        title: 'Gestión de Planes',
        loadComponent: () =>
          import('./Pages/admin/gestion-planes/gestion-planes.component').then(
            (m) => m.GestionPlanesComponent
          ),
      },
      {
        path: 'gestion-pqrsd',
        title: 'Gestión de PQRSD',
        loadComponent: () =>
          import(
            './Pages/admin/revisiones/gestion-pqrsd/gestion-pqrsd.component'
          ).then((m) => m.GestionPqrsdComponent),
      },
      {
        path: 'gestion-politicas-privacidad',
        title: 'Gestión de Políticas de Privacidad',
        loadComponent: () =>
          import(
            './Pages/admin/terminos-legales/politicas-privacidad/politicas-privacidad.component'
          ).then((m) => m.PoliticasPrivacidadComponent),
      },
      {
        path: 'gestion-terminos-condiciones',
        title: 'Gestión de Términos y Condiciones',
        loadComponent: () =>
          import(
            './Pages/admin/terminos-legales/terminos-condiciones/terminos-condiciones.component'
          ).then((m) => m.TerminosCondicionesComponent),
      },
      {
        path: 'gestion-contactenos',
        title: 'Gestión de Contactenos',
        loadComponent: () =>
          import(
            './Pages/admin/gestion-contactenos/gestion-contactenos.component'
          ).then((m) => m.GestionContactenosComponent),
      },
      {
        path: 'seguimiento-app',
        title: 'Hisoriales de la Aplicación',
        loadComponent: () =>
          import(
            './Pages/admin/seguimiento-app/seguimiento-app.component'
          ).then((m) => m.SeguimientoAppComponent),
      },
      {
        path: 'perfil',
        title: 'Perfil',
        loadComponent: () =>
          import(
            './Pages/admin/config/perfil-admin/perfil-admin.component'
          ).then((m) => m.PerfilAdminComponent),
      },
      {
        path: 'reportes-user',
        title: 'Reportes de Usuarios',
        loadComponent: () =>
          import(
            './Pages/admin/revisiones/reportes-user/reportes-user.component'
          ).then((m) => m.ReportesUserComponent),
      },
      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full',
      },
    ],
  },

  // Ruta comodín
  { path: '**', redirectTo: 'login' },
];

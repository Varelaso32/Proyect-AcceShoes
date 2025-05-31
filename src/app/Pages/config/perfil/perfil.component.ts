import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../Shared/services/user.service';
import { PlansService } from '../../../Shared/services/plans.service';
import { UserResponse, UpdateUserDto } from './../../../models/user.model';
import { PqrsService } from '../../../Shared/services/pqrs.service';
import { Plan } from './../../../models/plan.model';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { forkJoin, combineLatest } from 'rxjs';
import { Pqrs } from '../../../models/pqrsd.model';
import { SalesService } from '../../../Shared/services/sales.service';
import { Product } from '../../../models/products.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  //Data general
  modalAbierto: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  misPqrsd: (Pqrs & { responded: boolean })[] = [];
  pqrsSeleccionada: any = null;
  productoSeleccionado: Product | null = null;
  productosDelUsuario: Product[] = [];
  isProductosLoading: boolean = false;
  isUpdatingProduct: boolean = false;

  //Data de user
  usuario: UserResponse | null = null;
  editData: UpdateUserDto = { name: '', email: '', img: '' };
  isLoading: boolean = false;
  isProfileLoading: boolean = true;
  isCurrentUser: boolean = true;
  //Data planes
  planes: Plan[] = [];
  isPlansLoading = false;
  planSeleccionado: Plan | null = null;
  planActual: Plan | undefined;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private plansService: PlansService,
    public router: Router,
    private pqrsService: PqrsService,
    private salesService: SalesService
  ) {}

  ngOnInit() {
    this.isProfileLoading = true;
    this.isPlansLoading = true;
    this.errorMessage = null;
    this.obtenerMisPqrsd();

    // ✅ Esperamos planes y usuario actual juntos
    combineLatest([
      this.userService.currentUser$,
      this.plansService.getPlans(),
    ]).subscribe(([user, plans]) => {
      if (user) {
        this.usuario = user;
        this.editData = { name: user.name, email: user.email, img: user.img };
      }

      this.planes = plans;
      this.planActual = plans.find((plan) => plan.id === user?.plan_id);

      if (user?.id) {
        this.cargarProductosDelUsuario(user.id);
      }

      this.isProfileLoading = false;
      this.isPlansLoading = false;
    });

    // 🔁 Al inicio, hacemos la llamada para que emita el currentUser$
    this.userService.getCurrentUser().subscribe();

    // ✅ Detectar si se viene de PayPal
    this.checkPaymentStatus();
  }

  setDefaultImage(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/no-img.jpg';
  }

  abrirModalProductos(): void {
    this.modalAbierto = 'productosModal';
  }

  editProducto: any = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    size: '',
    img: '',
    category: 0,
  };

  cargarProductosDelUsuario(userId: number): void {
    this.isProductosLoading = true;

    this.salesService.getAllProducts().subscribe({
      next: (productos) => {
        const productosDelUsuario = productos.filter(
          (p) => p.seller?.id === userId
        );

        const ids = productosDelUsuario.map((p) => p.id);

        this.salesService.getSaleProductsByList(ids).subscribe({
          next: (sales) => {
            const salesMap = new Map<number, any>();
            sales.forEach((sale: any) => {
              if (sale?.product?.id) {
                salesMap.set(sale.product.id, sale);
              }
            });

            this.productosDelUsuario = productosDelUsuario.map((prod) => ({
              ...prod,
              imageUrl: prod.img || 'assets/no-img.jpg',
              price: salesMap.get(prod.id)?.price ?? 0,
              stock: salesMap.get(prod.id)?.stock ?? 0,
            }));

            this.isProductosLoading = false;
          },
          error: (err) => {
            console.error('Error al cargar ventas:', err);
            this.isProductosLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.isProductosLoading = false;
      },
    });
  }

  abrirModalProducto(producto: Product) {
    const productoVenta = this.productosDelUsuario.find(
      (p) => p.id === producto.id
    );

    this.productoSeleccionado = productoVenta!;
    this.abrirModal('productoDetalleModal');

    this.editProducto = {
      id: productoVenta!.id,
      name: productoVenta!.name,
      description: productoVenta!.description,
      price: productoVenta!.price,
      stock: productoVenta!.stock, // ✅ ahora sí vendrá correctamente
      size: productoVenta!.size,
      img: productoVenta!.imageUrl || 'assets/no-img.jpg',
      category: productoVenta!.category_id ?? productoVenta!.category,
    };
  }

  onImageSelectedProducto(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.editProducto.img = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarEdicionProducto() {
    const { id, name, description, price, stock, size, img, category } =
      this.editProducto;

    const data = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      size,
      img,
      category: Number(category),
    };

    this.isUpdatingProduct = true;

    this.salesService.updateSaleProduct(id, data).subscribe({
      next: () => {
        this.isUpdatingProduct = false;
        this.mostrarExito('Producto actualizado correctamente');
        setTimeout(() => this.cerrarModal(), 200);
        this.cargarProductosDelUsuario(this.usuario!.id);
      },
      error: () => {
        this.isUpdatingProduct = false;
        this.mostrarError('No se pudo actualizar el producto');
      },
    });
  }

  obtenerMisPqrsd() {
    this.pqrsService.getMyPqrs().subscribe({
      next: (pqrs: Pqrs[]) => {
        this.misPqrsd = pqrs.map((p) => ({
          ...p,
          responded: !!p.answered_at,
        }));
      },
      error: (err) => {
        console.error('Error al cargar PQRSD del usuario:', err);
      },
    });
  }

  cargarPerfilUsuario() {
    this.isProfileLoading = true;
    this.errorMessage = null;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.usuario = user;
        this.editData = { name: user.name, email: user.email };

        // Obtenemos el plan actual usando el plan_id del usuario
        if (user.plan_id) {
          this.planActual = this.plansService.getPlanById(user.plan_id);
        }

        this.isProfileLoading = false;
      },
      error: (err) => this.handleProfileError(err),
    });
  }

  onImageSelectedPerfil(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        console.log('🖼️ Imagen base64:', base64); // DEBUG
        this.editData.img = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  cargarPlanes() {
    this.isPlansLoading = true;
    this.plansService.getPlans().subscribe({
      next: (res) => {
        this.planes = res;

        if (this.usuario?.plan_id) {
          this.planActual = res.find(
            (plan) => plan.id === this.usuario?.plan_id
          );
        }

        this.isPlansLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar planes:', err);
        this.isPlansLoading = false;
        this.mostrarError('No se pudieron cargar los planes');
      },
    });
  }

  private checkPaymentStatus() {
    this.route.queryParams.subscribe((params) => {
      if (params['payment'] === 'success') {
        this.mostrarExito('¡Pago completado! Tu plan ha sido actualizado.');

        this.userService.getCurrentUser().subscribe({
          next: (user) => {
            this.userService.setCurrentUser(user);
            this.usuario = user;
            this.cargarProductosDelUsuario(user.id);
          },
          error: (err) => this.handleProfileError(err),
        });

        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
  }

  seleccionarPlan(plan: Plan) {
    this.planSeleccionado = plan;
  }

  private handleProfileError(err: any) {
    console.error('Error:', err);
    this.isProfileLoading = false;

    if (err.status === 401) {
      this.errorMessage =
        'Sesión expirada. Por favor inicia sesión nuevamente.';
      this.router.navigate(['/login']);
    } else if (err.status === 403) {
      this.errorMessage = 'No tienes permisos para ver este recurso';
    } else {
      this.errorMessage = 'Error al cargar el perfil. Intenta nuevamente.';
    }
  }

  guardarCambios() {
    if (!this.usuario) return;

    if (!this.validateForm()) return;

    this.isLoading = true;

    this.userService
      .updateCurrentUser({
        name: this.editData.name,
        email: this.editData.email,
        img: this.editData.img || this.usuario.img,
        // Eliminamos el envío de currentPassword
      })
      .subscribe({
        next: (actualizado) => {
          this.handleUpdateSuccess(actualizado);
        },
        error: (err) => {
          this.handleUpdateError(err);
        },
      });
  }

  private validateForm(): boolean {
    if (!this.editData.name?.trim() || !this.editData.email?.trim()) {
      this.mostrarError('Nombre y correo son requeridos');
      return false;
    }
    // Eliminamos la validación de contraseña
    return true;
  }

  private handleUpdateSuccess(actualizado: UserResponse) {
    this.usuario = actualizado;
    this.userService.setCurrentUser(actualizado);
    this.mostrarExito('Perfil actualizado correctamente');
    this.cerrarModal();
    this.isLoading = false;
  }

  private handleUpdateError(err: any) {
    this.isLoading = false;

    if (err.status === 409) {
      this.mostrarError('El correo ya está registrado');
    } else if (err.status === 403) {
      this.mostrarError('No tienes permisos para esta acción');
    } else {
      this.mostrarError('Error al actualizar. Intenta nuevamente');
    }
  }

  private mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    setTimeout(() => (this.errorMessage = null), 5000);
  }

  private mostrarExito(mensaje: string) {
    this.errorMessage = null;
    this.successMessage = mensaje;
    setTimeout(() => (this.successMessage = null), 5000);
  }

  abrirModal(id: string) {
    this.modalAbierto = id;
    this.errorMessage = null;
    this.successMessage = null;

    if (id === 'planesModal') {
      this.cargarPlanes();
    }
  }

  irAMetodoPago() {
    if (this.planSeleccionado) {
      this.router.navigate(['/metodo-pago'], {
        state: { plan: this.planSeleccionado },
      });
      this.cerrarModal();
    }
  }

  abrirModalPqrs(pqrs: any) {
    this.pqrsSeleccionada = pqrs;
    this.abrirModal('pqrsDetalleModal');
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.pqrsSeleccionada = null;
    // Restauramos los datos originales al cerrar
    if (this.usuario) {
      this.editData = {
        name: this.usuario.name,
        email: this.usuario.email,
        img: this.usuario.img,
      };
    }
  }

  editarProductoSeleccionado() {
    if (this.productoSeleccionado) {
      // Abres otro modal, o rediriges a una vista de edición
      this.router.navigate(['/editar-producto', this.productoSeleccionado.id]);
      this.cerrarModal();
    }
  }

  aceptarModal(modalId: string) {
    this.mostrarExito(`Has confirmado la acción del modal: ${modalId}`);
    this.cerrarModal();
  }
}

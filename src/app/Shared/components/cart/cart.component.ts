import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Location } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';
import { ChatService } from '../../../Shared/services/chat.service';
import { UserService } from '../../../Shared/services/user.service';
import { SalesService } from '../../../Shared/services/sales.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  private userService = inject(UserService);
  private chatService = inject(ChatService);
  constructor(
    private cartService: CartService,
    private location: Location,
    private salesService: SalesService,
    private router: Router
  ) {} // Inyecta el servicio Location

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  removeItem(productId: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Este producto será eliminado de tu carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(productId);
        Swal.fire({
          title: 'Producto eliminado',
          text: 'Se eliminó correctamente del carrito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  async enviarMensajesDesdeCarrito() {
    const user = await this.userService.getCurrentUser().toPromise();
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }
    const convos =
      (await this.chatService.getConversations().toPromise()) ?? [];

    const acciones = this.cartItems.map(async (item) => {
      const sellerId = item.product.seller.id;

      // Buscar si ya existe conversación con ese vendedor
      const existing = convos.find((c) => {
        return (
          (c.seller.id === sellerId && c.buyer.id === user.id) ||
          (c.buyer.id === sellerId && c.seller.id === user.id)
        );
      });

      // Siempre consumir el endpoint de compra (descuenta stock)
      const compra = await this.salesService
        .buyProduct(item.product.id, item.quantity)
        .toPromise();

      // Si no existía la conversación, el endpoint devuelve el nuevo chat
      if (!existing) {
        console.log('✅ Nueva conversación creada:', compra);
      } else {
        console.log('✅ Ya existía conversación con vendedor:', existing.id);
      }
    });

    try {
      await Promise.all(acciones);
      this.cartService.clearCart();

      Swal.fire({
        icon: 'success',
        title: 'Compra realizada',
        text: 'Se enviaron los mensajes a todos los vendedores.',
        confirmButtonColor: '#10B981',
      }).then(() => {
        this.router.navigate(['/chat']);
      });
    } catch (error) {
      console.error('Error procesando compras:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar tu compra.',
      });
    }
  }

  clearCart(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará todos los productos de tu carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire({
          title: 'Carrito vaciado',
          text: 'Todos los productos han sido eliminados.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }
  // Método para devolver al usuario a la página anterior
  goBack(): void {
    this.location.back();
  }
  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.cartService.updateCart(this.cartItems);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cartItems);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Location } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import Swal from 'sweetalert2';


@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private location: Location) { }  // Inyecta el servicio Location

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotal(): number {
    return this.cartService.getTotalPrice();
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
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(productId);
        Swal.fire({
          title: 'Producto eliminado',
          text: 'Se eliminó correctamente del carrito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
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
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart();
        Swal.fire({
          title: 'Carrito vaciado',
          text: 'Todos los productos han sido eliminados.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
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

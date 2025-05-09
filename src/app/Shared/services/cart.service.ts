import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.getCart());
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {}

  private getCart(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  private updateCart(cart: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartItemsSubject.next(cart); // 🔥 Notifica cambios a los componentes
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.getCart();
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }

    this.updateCart(currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.getCart().filter(item => item.product.id !== productId);
    this.updateCart(currentCart);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotalPrice(): number {
    return this.getCart().reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}

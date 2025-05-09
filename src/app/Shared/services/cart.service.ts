import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItemsSubject.next(JSON.parse(storedCart));
    }
  }

  private updateLocalStorage(cartItems: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  addToCart(product: Product, quantity: number = 1) {
    const items = this.cartItemsSubject.getValue();
    const index = items.findIndex(item => item.product.id === product.id);

    if (index > -1) {
      items[index].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.cartItemsSubject.next(items);
    this.updateLocalStorage(items);
  }

  removeFromCart(productId: number) {
    const items = this.cartItemsSubject.getValue().filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(items);
    this.updateLocalStorage(items);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.getValue().reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}

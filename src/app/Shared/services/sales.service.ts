import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

export interface SaleProductForm {
  price: number;
  stock: number;
  name: string;
  description: string;
  size: string;
  img: string;
  category: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private http = inject(HttpClient);
  private api = 'https://fastacceshoes.onrender.com';

  // 🔹 Crear producto de venta
  createSaleProduct(data: SaleProductForm): Observable<any> {
    return this.http.post(`${this.api}/sales/products`, data);
  }

  // 🔹 Obtener producto de venta por ID
  getSaleProduct(id: number): Observable<any> {
    return this.http.get(`${this.api}/sales/products/${id}`);
  }

  getSaleProductsByList(ids: number[]): Observable<any[]> {
    return forkJoin(ids.map((id) => this.getSaleProduct(id)));
  }

  // 🔹 Actualizar producto de venta
  updateSaleProduct(id: number, data: SaleProductForm): Observable<any> {
    return this.http.put(`${this.api}/sales/products/${id}`, data);
  }

  // 🔹 Obtener todos los productos (públicos o internos)
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/products/`);
  }

  // 🔹 Obtener producto genérico por ID
  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.api}/products/${id}`);
  }

  // 🔹 Eliminar producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.api}/products/${id}`);
  }

  // 🔹 Cambiar estado (activar/desactivar)
  toggleProductStatus(id: number): Observable<any> {
    return this.http.patch(`${this.api}/products/${id}/status`, {});
  }

  // 🔹 Bloquear producto
  blockProduct(id: number): Observable<any> {
    return this.http.patch(`${this.api}/products/${id}/block`, {});
  }

  // 🔹 Marcar producto como vendido externamente
  sellProductExternally(id: number, amount: number): Observable<any> {
    return this.http.post(`${this.api}/products/${id}/sell`, { amount });
  }

  buyProduct(productId: number, amount: number): Observable<any> {
    return this.http.post(`${this.api}/sales/products/${productId}/buy`, {
      product_id: productId,
      amount,
    });
  }
}

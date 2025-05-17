import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseHttpService } from './base-http.service';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseHttpService {
  // Datos simulados de productos
  private products: Product[] = [
    {
      id: 1,
      name: 'Zapatos Deportivos',
      category: 'Zapatos',
      price: 89.99,
      description: 'Zapatos deportivos cómodos para correr',
      imageUrl: 'assets/zapatos.jpg',
    },
    {
      id: 2,
      name: 'Zapatos Formales',
      category: 'Zapatos',
      price: 120.00,
      description: 'Zapatos formales elegantes para ocasiones especiales',
      imageUrl: 'https://img.kwcdn.com/product/fancy/60af71e3-72b5-416c-848d-8835723bd69a.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp',
    },
    {
      id: 3,
      name: 'Zapatos Casuales',
      category: 'Zapatos',
      price: 75.50,
      description: 'Zapatos casuales para uso diario',
      imageUrl: 'https://media.revistagq.com/photos/622713b4eb46c38200386b9b/4:3/w_4114,h_3085,c_limit/GettyImages-1368472953.jpg',
    },
    {
      id: 4,
      name: 'Gorra Deportiva',
      category: 'Gorras',
      price: 25.99,
      description: 'Gorra deportiva con protección UV',
      imageUrl: 'https://comptonstar.com.co/wp-content/uploads/2024/12/DSC01372_1080x.webp',
    },
    {
      id: 5,
      name: 'Gorra de Moda',
      category: 'Gorras',
      price: 34.50,
      description: 'Gorra moderna con diseño a la moda',
      imageUrl: 'https://www.sportline.com.co/media/catalog/product/b/v/bv1078-100-phsfh001-1000_1.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:&format=jpeg',
    },
    {
      id: 6,
      name: 'Saco de Invierno',
      category: 'Sacos',
      price: 159.99,
      description: 'Saco cálido para temporada de frío',
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_998583-MCO74718776020_032024-O.webp',
    },
    {
      id: 7,
      name: 'Saco Formal',
      category: 'Sacos',
      price: 189.95,
      description: 'Saco formal elegante para eventos',
      imageUrl: 'https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/c37dba98716b4688bb73ac9f0109690c_9366/buzo-con-capucha-essentials_-felpa_-logo.jpg',
    },
    {
      id: 8,
      name: 'Collar de Plata',
      category: 'Collares',
      price: 65.00,
      description: 'Collar de plata con diseño elegante',
      imageUrl: 'https://down-co.img.susercontent.com/file/0dbd15943214d4799fc0f0b2ea6f62f9',
    },
    {
      id: 9,
      name: 'Collar de Perlas',
      category: 'Collares',
      price: 89.99,
      description: 'Collar de perlas cultivadas',
      imageUrl: 'https://tiendamarvi.com/cdn/shop/files/Collar_Perlas_de_Rio___Aretes_de_Perla_Para_Mujer_AVEMARIA_321159.jpg?v=1713879300',
    },
    {
      id: 10,
      name: 'Collar de Oro',
      category: 'Collares',
      price: 250.00,
      description: 'Collar de oro de 18 quilates',
      imageUrl: 'https://down-co.img.susercontent.com/file/d5c15838f877e289a7ee7ec344515727',
    },
  ];

  constructor() {
    super();
  }

  // Método para obtener todos los productos
  getProducts(): Observable<Product[]> {
    // Aquí podrías conectar con tu API real cuando la tengas
    // return this.http.get<Product[]>(`${this.apiUrl}/products`);

    // Por ahora, devuelve datos simulados
    return of(this.products);
  }

  // Método para buscar productos
  searchProducts(query: string): Observable<Product[]> {
    // Si no hay consulta, devuelve todos los productos
    if (!query.trim()) {
      return of(this.products);
    }

    // Búsqueda insensible a mayúsculas/minúsculas
    const searchTerm = query.toLowerCase();

    // Filtrar productos que coincidan con la búsqueda
    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );

    return of(filteredProducts);
  }

  // Método para obtener un producto por ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  // Método para obtener productos por categoría
  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
    return of(filteredProducts);
  }
}
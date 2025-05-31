import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { CartService } from '../../Shared/services/cart.service';
import { Product } from '../../models/products.model';
import Swal from 'sweetalert2';
import { SalesService } from '../../Shared/services/sales.service';
import { CategoryService } from '../../Shared/services/categories.service';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../Shared/services/chat.service';
import { UserService } from '../../Shared/services/user.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: (Product & { price: number; stock: number }) | undefined;
  categoryName: string = 'Cargando...';
  showModal = false;
  modalAbierto: string | null = null;
  cantidadSeleccionada = 1;
  private route = inject(ActivatedRoute);
  private productService = inject(SalesService);
  private salesService = inject(SalesService);
  private categoryService: CategoryService = inject(CategoryService);
  private location = inject(Location);
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private chatService = inject(ChatService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!productId) {
      console.error('ID de producto no válido');
      return;
    }

    this.productService.getSaleProduct(productId).subscribe((sale) => {
      if (sale?.product) {
        const prod = sale.product;
        this.product = {
          ...prod,
          imageUrl: prod.img,
          price: sale.price,
          stock: sale.stock,
        };

        if (prod.category_id) {
          this.categoryService.getById(prod.category_id).subscribe({
            next: (cat) => (this.categoryName = cat.name),
            error: () => (this.categoryName = 'Sin categoría'),
          });
        } else {
          this.categoryName = 'Sin categoría';
        }
      } else {
        console.error('Producto no encontrado');
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);

      Swal.fire({
        icon: 'success',
        title: 'Agregado al carrito',
        text: `${this.product.name} fue agregado correctamente`,
        confirmButtonColor: '#10B981',
        confirmButtonText: 'Ok',
      });
    }
  }

  enviarMensajeAlVendedor() {
    this.showModal = true;
  }

  abrirModal(nombre: string) {
    console.log('abriendo modal', nombre);

    this.modalAbierto = nombre;
  }

  cerrarModal() {
    this.modalAbierto = null;
  }

  confirmarCompra() {
    if (!this.product || this.cantidadSeleccionada < 1) return;

    this.userService.getCurrentUser().subscribe((user) => {
      this.chatService.getConversations().subscribe((convos) => {
        const productSellerId = this.product!.seller.id;
        const currentUserId = user.id;

        const existing = convos.find((c) => {
          const sellerId = c.seller.id;
          const buyerId = c.buyer.id;

          return (
            (sellerId === productSellerId && buyerId === currentUserId) ||
            (buyerId === productSellerId && sellerId === currentUserId)
          );
        });

        // 🔹 Siempre consumir el endpoint que descuenta stock
        this.salesService
          .buyProduct(this.product!.id, this.cantidadSeleccionada)
          .subscribe({
            next: (convo) => {
              this.cerrarModal();

              // 🔹 Si ya existía la conversación, navegar a esa
              if (existing) {
                this.router.navigate(['/chat', existing.id]);
              } else {
                // 🔹 Si no existía, usar la que devuelve el backend
                this.router.navigate(['/chat', convo.id]);
              }
            },
            error: (err) => {
              console.error('Error al registrar compra/conversación:', err);
            },
          });
      });
    });
  }

  goBack(): void {
    this.location.back();
  }
}

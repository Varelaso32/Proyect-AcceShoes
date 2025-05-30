import { Component, Input, OnInit } from '@angular/core';
import { environmentPaypal } from '../../../../environments/environment';
import { Plan } from '../../../models/plan.model';
import { UserService } from '../../../Shared/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  standalone: true,
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
})
export class PaypalComponent implements OnInit {
  @Input() plan: Plan | null = null;
  private paymentCompleted = false;
  isLoading = false;

  private readonly clientId = environmentPaypal.paypalClientId;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadPaypalScript().then(() => {
      this.renderPaypalButtons();
    });
  }

private async handlePaymentSuccess(details: any) {
  if (this.paymentCompleted) return;
  this.paymentCompleted = true;
  this.isLoading = true;

  try {
    await this.updateUserPlan();

    // ✅ Mostramos un SweetAlert y redirigimos automáticamente
    await Swal.fire({
      icon: 'success',
      title: '¡Pago exitoso!',
      text: 'Tu plan ha sido actualizado.',
      timer: 1800,
      showConfirmButton: false,
    });

    this.router.navigate(['/perfil'], {
      queryParams: { payment: 'success' },
      replaceUrl: true,
    });
  } catch (error) {
    console.error('Error al actualizar el plan:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error al actualizar el plan',
      text: 'El pago se procesó pero hubo un fallo al actualizar tu plan.',
    });
    this.router.navigate(['/perfil']);
  } finally {
    this.isLoading = false;
  }
}


  private async updateUserPlan() {
    if (!this.plan) throw new Error('No plan selected');
    return this.userService.updateUserPlan(this.plan.id).toPromise();
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}`;
      script.onload = () => resolve();
      script.onerror = (err: any) => reject(err);
      document.head.appendChild(script);
    });
  }

  private renderPaypalButtons(): void {
    if (!this.plan) return;

    (window as any).paypal
      .Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `Plan ${this.plan?.name}`,
                amount: {
                  value: (this.plan!.price / 100).toFixed(2),
                  currency_code: 'MXN',
                  breakdown: {
                    item_total: {
                      value: (this.plan!.price / 100).toFixed(2),
                      currency_code: 'MXN',
                    },
                  },
                },
                items: [
                  {
                    name: `Plan ${this.plan!.name}`,
                    description: this.plan!.description,
                    quantity: '1',
                    unit_amount: {
                      value: (this.plan!.price / 100).toFixed(2),
                      currency_code: 'MXN',
                    },
                  },
                ],
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture();
            await this.handlePaymentSuccess(details);
          } catch (error) {
            console.error('Error capturing payment:', error);
            alert('Error al procesar el pago. Por favor intente nuevamente.');
          }
        },
        onCancel: () => alert('Pago cancelado'),
        onError: (err: any) =>
          alert('Error en el proceso de pago: ' + err.message),
      })
      .render('#paypal-button-container');
  }
}

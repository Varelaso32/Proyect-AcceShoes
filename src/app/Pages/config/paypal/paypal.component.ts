// paypal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { environmentPaypal } from '../../../../environments/environment';
import { Plan } from '../../../models/plan.model';
import { UserService } from '../../../Shared/services/user.service';
import { TransactionService } from '../../../Shared/services/transaction.service';
import { Router } from '@angular/router';

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

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

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
      // 1. Registrar la transacción
      await this.registerTransaction(details);

      // 2. Actualizar el plan del usuario
      await this.updateUserPlan();

      // 3. Mostrar alerta y redirigir
      alert('¡Pago exitoso! Tu plan ha sido actualizado.');
      this.router.navigate(['/perfil'], {
        queryParams: { payment: 'success' },
        replaceUrl: true,
      });
    } catch (error) {
      console.error('Error en el proceso post-pago:', error);
      alert(
        'Pago completado, pero hubo un error al actualizar tu plan. Contacta al soporte.'
      );
      this.router.navigate(['/perfil']);
    } finally {
      this.isLoading = false;
    }
  }

  private async registerTransaction(details: any) {
    if (!this.plan) throw new Error('No plan selected');

    const transactionData = {
      plan_id: this.plan.id,
      amount: this.plan.price,
      payment_method: 'paypal',
      payment_id: details.id,
      status: 'completed',
    };

    return this.transactionService
      .createTransaction(transactionData)
      .toPromise();
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
      script.onerror = (err: any) => {
        console.error('Error loading PayPal SDK:', err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  }

  private renderPaypalButtons(): void {
    try {
      if (!this.plan) {
        console.error('No plan selected');
        return;
      }

      const amount = this.plan.price;
      if (isNaN(amount)) {
        console.error('Invalid plan price:', amount);
        return;
      }

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
          onCancel: (data: any) => {
            console.log('Payment cancelled:', data);
            alert('Pago cancelado');
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            alert('Error en el proceso de pago: ' + err.message);
          },
        })
        .render('#paypal-button-container');
    } catch (error) {
      console.error('Error rendering PayPal buttons:', error);
      alert('Error al inicializar el sistema de pagos');
    }
  }
}

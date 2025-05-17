// paypal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { environmentPaypal } from '../../../../environments/environment';
import { Plan } from '../../../models/plan.model';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  standalone: true,
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'], // si tienes estilos
})
export class PaypalComponent implements OnInit {
  @Input() plan: Plan | null = null;

  private readonly clientId = environmentPaypal.paypalClientId;

  ngOnInit(): void {
    this.loadPaypalScript().then(() => {
      this.renderPaypalButtons();
    });
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((<any>window).paypal) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}`;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private renderPaypalButtons(): void {
    try {
      if (!this.plan) {
        console.error('No plan selected');
        return;
      }

      // Validar que el precio sea correcto
      const amount = this.plan.price;
      if (isNaN(amount) || amount <= 0) {
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
                    value: (amount / 100).toFixed(2), // Asegurar formato decimal
                    currency_code: 'MXN',
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              console.log('Payment completed:', details);
              window.location.href = '/perfil';
            });
          },
          onCancel: (data: any) => {
            console.log('Payment cancelled:', data);
            alert('Pago cancelado');
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            alert('Error en el proceso de pago');
          },
        })
        .render('#paypal-button-container');
    } catch (error) {
      console.error('Error rendering PayPal buttons:', error);
    }
  }
}

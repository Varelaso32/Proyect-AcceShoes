// paypal.component.ts
import { Component, OnInit } from '@angular/core';
import { environmentPaypal } from '../../../../environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'], // si tienes estilos
})
export class PaypalComponent implements OnInit {
  private readonly clientId = environmentPaypal.paypalClientId;

  ngOnInit(): void {
    this.loadPaypalScript().then(() => {
      this.renderPaypalButtons();
    });
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((<any>window).paypal) {
        resolve(); // Si ya está cargado el SDK, resolver ya
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=MXN`;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private renderPaypalButtons(): void {
    paypal
      .Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay',
        },
        createOrder: (data: any, actions: any) => {
          // Aquí creamos la orden directamente sin backend
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: '100.00', // monto a cobrar
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          // Capturamos el pago directamente con el SDK sin backend
          return actions.order.capture().then(() => {
            window.location.href = '/pago-exitoso'; // o cualquier redirección que quieras
          });
        },
        onCancel: (data: any) => {
          alert('Pago Cancelado');
          console.log('Pago cancelado:', data);
        },
        onError: (err: any) => {
          console.error('Error PayPal:', err);
        },
      })
      .render('#paypal-button-container');
  }
}

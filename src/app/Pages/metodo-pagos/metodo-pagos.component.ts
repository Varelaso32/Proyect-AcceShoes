import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PaypalComponent } from '../config/paypal/paypal.component';

@Component({
  selector: 'app-metodo-pagos',
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterModule,
    PaypalComponent
  ],
  templateUrl: './metodo-pagos.component.html',
  styleUrl: './metodo-pagos.component.css',
})
export class MetodoPagosComponent {}

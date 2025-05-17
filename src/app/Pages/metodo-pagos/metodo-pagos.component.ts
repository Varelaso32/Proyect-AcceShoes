import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PaypalComponent } from '../config/paypal/paypal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Plan } from '../../models/plan.model';

@Component({
  selector: 'app-metodo-pagos',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterModule,
    PaypalComponent,
  ],
  templateUrl: './metodo-pagos.component.html',
  styleUrl: './metodo-pagos.component.css',
})
export class MetodoPagosComponent {
  plan: Plan | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.plan = navigation?.extras.state?.['plan'] as Plan;
  }
}

import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-lateral',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './navbar-lateral.component.html',
  styleUrl: './navbar-lateral.component.css',
})
export class NavbarLateralComponent {

}

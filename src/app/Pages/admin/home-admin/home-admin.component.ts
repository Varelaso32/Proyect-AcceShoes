import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarLateralComponent } from '../components/navbar-lateral/navbar-lateral/navbar-lateral.component';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarLateralComponent],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent {}

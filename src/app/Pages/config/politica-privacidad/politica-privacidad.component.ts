import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';

@Component({
  selector: 'app-politica-privacidad',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.css'],
})
export class PoliticaPrivacidadComponent {}

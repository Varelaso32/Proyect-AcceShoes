import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';
@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {

}

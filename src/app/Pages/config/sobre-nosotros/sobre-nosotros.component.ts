import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../../Shared/components/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ThemeService } from '../../../Shared/services/theme.service';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css',
})
export class SobreNosotrosComponent {
  mostrarFundadores = false;
  feedbackRespondido: boolean = false;
  mostrarContacto: boolean = false;
  gmailUrl: string;

  constructor(
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    public themeService: ThemeService
  ) {
    const subject = encodeURIComponent('Consulta AcceShoes');
    const body = encodeURIComponent(
      'Hola, quisiera hacer la siguiente consulta:\n\n'
    );

    this.gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=fcecepcomunitario@gmail.com&su=${subject}&body=${body}`;
  }

  toggleFundadores(): void {
    this.mostrarFundadores = !this.mostrarFundadores;
  }

  responderFeedback(): void {
    this.feedbackRespondido = true;
  }

  mostrarSeccionContacto(): void {
    this.mostrarContacto = true;
    this.mostrarFundadores = false;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  volver() {
    this.mostrarContacto = false;
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          this.scroller.scrollToAnchor(fragment);
        }, 0);
      }
    });
  }
}

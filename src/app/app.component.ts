import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './Shared/services/theme.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './Shared/components/navbar/navbar.component';
import { FooterComponent } from './Shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
  template: `
    <div [class.dark]="isDarkMode" [class.light]="!isDarkMode">
      <app-navbar></app-navbar>
      <main class="min-h-[calc(100vh-130px)]">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .dark {
        --tw-bg-opacity: 1;
        background-color: rgb(17 24 39 / var(--tw-bg-opacity));
        color: #f3f4f6;
      }
      .light {
        background-color: #ffffff;
        color: #111827;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = 'AcceShoes';
  isDarkMode = false;

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private themeService: ThemeService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  ngOnInit() {
    // Configura el tema inicial
    this.themeService.currentTheme$.subscribe(() => {
      this.isDarkMode = this.themeService.getEffectiveTheme() === 'dark';
    });
  }
}

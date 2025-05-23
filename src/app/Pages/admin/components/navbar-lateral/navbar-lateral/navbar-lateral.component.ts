import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-lateral',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './navbar-lateral.component.html',
  styleUrl: './navbar-lateral.component.css',
})
export class NavbarLateralComponent {
  submenuStates: { [key: string]: boolean } = {};
  profileMenuOpen = false;

  toggleSubmenu(name: string) {
    this.submenuStates[name] = !this.submenuStates[name];
  }

  isSubmenuOpen(name: string): boolean {
    return !!this.submenuStates[name];
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // Para cerrar el menú si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown-container')) {
      this.profileMenuOpen = false;
    }
  }
}

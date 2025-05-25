import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../Shared/services/user.service';
import { UserResponse } from '../../../../../models/user.model';
import { AuthService } from '../../../../../Shared/services/auth.service';

@Component({
  selector: 'app-navbar-lateral',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './navbar-lateral.component.html',
  styleUrl: './navbar-lateral.component.css',
})
export class NavbarLateralComponent {
  user: UserResponse | null = null;
  submenuStates: { [key: string]: boolean } = {};
  profileMenuOpen = false;
  sublistaAbierta = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error obteniendo usuario:', err);
      },
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  toggleSublista() {
    this.sublistaAbierta = !this.sublistaAbierta;
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

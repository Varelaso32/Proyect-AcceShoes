import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-selector.component.html',
  styleUrl: './home-selector.component.css',
})
export class HomeSelectorComponent {
  constructor(private router: Router) {}

  userName = '';

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name || 'Usuario';
    }
  }
  
  goToHome() {
    this.router.navigate(['/home']);
  }

  goToAdmin() {
    this.router.navigate(['/home-admin']);
  }
}

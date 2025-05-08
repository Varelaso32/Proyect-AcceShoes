import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarruselComponent } from '../../Shared/components/carrusel/carrusel.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CarruselComponent, FooterComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/moda.jpg',
    'assets/zapatos.jpg',
    'assets/gorras.jpg',
  ];
  currentImage: string = this.images[0];
  currentIndex: number = 0;

  intervalTime = 8000; 
  progress = 0;
  circumference = 2 * Math.PI * 20;
  progressOffset = 0;

  private intervalId!: ReturnType<typeof setInterval>;
  private progressIntervalId!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startImageRotation();
    this.startProgressCircle();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearInterval(this.progressIntervalId);
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.currentImage = this.images[this.currentIndex];
      this.progress = 0;
    }, this.intervalTime);
  }

  startProgressCircle() {
    const steps = 100;
    const intervalStep = this.intervalTime / steps;

    this.progressIntervalId = setInterval(() => {
      this.progress = (this.progress + 1) % (steps + 1);
      this.progressOffset = this.circumference * (1 - this.progress / 100);
    }, intervalStep);
  }
}

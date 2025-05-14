import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarruselComponent } from '../../Shared/components/carrusel/carrusel.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ChatMessage } from '../../models/chat.model';
import { ChatMessageComponent } from '../../Shared/components/chat-message/chat-message.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CarruselComponent,
    FooterComponent,
    NavbarComponent,
    RouterModule,
    ChatMessageComponent
  ],
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
  showChat = false;
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

  toggleChat() {
    this.showChat = !this.showChat;
  }

  chatMessages: ChatMessage[] = [
    {
      user: 'Obi-Wan Kenobi',
      avatar: 'https://img.daisyui.com/images/profile/demo/kenobee@192.webp',
      message: 'You were the Chosen One!',
      time: '12:45',
      side: 'start',
      status: 'Delivered',
    },
    {
      user: 'Anakin',
      avatar: 'https://img.daisyui.com/images/profile/demo/anakeen@192.webp',
      message: 'I hate you!',
      time: '12:46',
      side: 'end',
      status: 'Seen at 12:46',
    },
  ];
}

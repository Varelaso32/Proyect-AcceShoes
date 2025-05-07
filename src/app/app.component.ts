import { Component } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'; 
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


const config: SocketIoConfig = {
  url: 'http://localhost:3000',  // Dirección de tu servidor WebSocket
  options: {}
};

@Component({
  selector: 'app-root',
  imports: [
    BrowserModule,
    CommonModule, 
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {}

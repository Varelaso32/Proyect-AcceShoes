import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para standalone
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ChatService } from './chat.service';

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {},
};

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css',
})
export class ChatMessageComponent {
  messages: any[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.receiveMessages().subscribe((message: string) => {
      this.messages.push({
        sender: 'Anakin',
        avatar: 'https://img.daisyui.com/images/profile/demo/anakeen@192.webp',
        text: message,
        time: new Date().toLocaleTimeString(),
      });
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.messages.push({
        sender: 'Obi-Wan Kenobi',
        avatar: 'https://img.daisyui.com/images/profile/demo/kenobee@192.webp',
        text: this.newMessage,
        time: new Date().toLocaleTimeString(),
      });
      this.newMessage = ''; // Limpiar mensaje
    }
  }
}

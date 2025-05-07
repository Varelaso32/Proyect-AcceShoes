// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  // El servicio WebSocket de ngx-socket-io
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket) {}

  sendMessage(message: string): void {
    this.socket.emit('chat message', message);  // Enviar el mensaje al servidor
  }

  receiveMessages(): Observable<string> {
    return this.socket.fromEvent<string, string>('chat message');  // Recibir mensajes del servidor
  }
}

import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../models/chat.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [CommonModule],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() messages: ChatMessage[] = [];
}

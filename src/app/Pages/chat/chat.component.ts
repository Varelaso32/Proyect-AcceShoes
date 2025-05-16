import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';

interface ChatMessage {
  user: string;
  message: string;
  avatar: string;
  time: string;
  side: 'start' | 'end';
  status?: string;
}

interface Conversation {
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  conversations: Conversation[] = [
    {
      user: 'Bubucita 💞',
      avatar: 'https://i.pravatar.cc/100?img=1',
      lastMessage: 'Hola amor 😘',
      time: '5:56 p.m.',
      messages: [
        {
          user: 'Bubucita 💞',
          message: 'Hola amor 😘',
          avatar: 'https://i.pravatar.cc/100?img=1',
          time: '5:56 p.m.',
          side: 'start',
        },
        {
          user: 'Tú',
          message: 'Hola bb 💕',
          avatar: 'https://i.pravatar.cc/100?img=2',
          time: '5:57 p.m.',
          side: 'end',
        },
      ],
    },
    {
      user: 'Cruz',
      avatar: 'https://i.pravatar.cc/100?img=3',
      lastMessage: 'Sticker enviado',
      time: '11:00 a.m.',
      messages: [
        {
          user: 'Cruz',
          message: '🔥🔥🔥',
          avatar: 'https://i.pravatar.cc/100?img=3',
          time: '11:00 a.m.',
          side: 'start',
        },
      ],
    },
  ];

  selected?: Conversation;

  selectConversation(convo: Conversation) {
    this.selected = convo;
  }
}

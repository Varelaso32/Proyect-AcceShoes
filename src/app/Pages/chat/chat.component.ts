import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ChatService } from '../../Shared/services/chat.service';
import { Conversation, Message } from '../../models/chatMessage.model';
import { UserService } from '../../Shared/services/user.service';
import { UserResponse } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { CarruselComponent } from '../../Shared/components/carrusel/carrusel.component';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    CarruselComponent,
    FooterComponent,
    NavbarComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  conversations = signal<Conversation[]>([]);
  usersMap = new Map<number, UserResponse>();
  selectedConversation = signal<Conversation | null>(null);
  currentUser!: UserResponse;
  messageContent = '';
  convosWithNewMessages: Set<number> = new Set();
  newMessagesIds: Set<number> = new Set();
  private refreshSub?: Subscription;

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Cargar usuario actual y conversaciones iniciales
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.loadConversations();
      this.loadUsers();

      // Empezar refresh automático
      this.refreshSub = interval(10000).subscribe(() => {
        this.loadConversations();

        const convo = this.selectedConversation();
        if (convo) {
          this.loadConversationDetails(convo.id);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((users) => {
      for (const user of users) {
        this.usersMap.set(user.id, user);
      }
    });
  }

  loadConversations() {
    this.chatService.getConversations().subscribe((convos) => {
      this.conversations.set(convos);

      // Si hay conversación seleccionada, actualizarla también
      const selected = this.selectedConversation();
      if (selected) {
        // Comprobar si la conversación sigue en la lista y actualizar su último mensaje
        const updatedConvo = convos.find((c) => c.id === selected.id);
        if (updatedConvo) {
          this.selectedConversation.update((_) => ({ ...updatedConvo }));
        }
      }
    });
  }

  loadConversationDetails(convoId: number) {
    this.chatService.getConversationDetails(convoId).subscribe((details) => {
      this.selectedConversation.set(details);
    });
  }

  selectConversation(convo: Conversation) {
    this.loadConversationDetails(convo.id);
  }

  sendMessage() {
    const convo = this.selectedConversation();
    if (!convo || !this.messageContent.trim()) return;

    this.chatService
      .sendMessage(convo.id, this.messageContent.trim())
      .subscribe(() => {
        this.messageContent = '';
        // Recargar mensajes después de enviar
        this.loadConversationDetails(convo.id);
        this.loadConversations();
      });
  }

  get messages(): Message[] {
    return this.selectedConversation()?.messages || [];
  }

  getOtherUser(convo: Conversation): string {
    const isBuyer = convo.buyer_id === this.currentUser.id;
    return isBuyer
      ? `Vendedor #${convo.seller_id}`
      : `Comprador #${convo.buyer_id}`;
  }

  getSenderName(senderId: number): string {
    if (senderId === this.currentUser.id) return 'Tú';

    const convo = this.selectedConversation();
    if (!convo) return `Usuario #${senderId}`;

    if (senderId === convo.buyer_id) return `Comprador #${convo.buyer_id}`;
    if (senderId === convo.seller_id) return `Vendedor #${convo.seller_id}`;

    return `Usuario #${senderId}`;
  }
}

import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ChatService } from '../../Shared/services/chat.service';
import { Conversation, Message } from '../../models/chatMessage.model';
import { UserService } from '../../Shared/services/user.service';
import { UserResponse } from '../../models/user.model';
import { CommonModule } from '@angular/common';
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
    FooterComponent,
    NavbarComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer')
  messagesContainer?: ElementRef<HTMLDivElement>;

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
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.loadConversations();

      // Auto refrescar cada 10 segundos
      this.refreshSub = interval(10000).subscribe(() => {
        const selected = this.selectedConversation();
        if (selected && this.messages.length > 0) {
          const lastId = this.messages[this.messages.length - 1].id;
          this.chatService.getNewMessages(selected.id, lastId).subscribe();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  get selectedOtherUserName(): string {
    const convo = this.selectedConversation();
    if (!convo) return 'Selecciona un chat';
    const otherUser =
      convo.seller.id === this.currentUser.id ? convo.buyer : convo.seller;
    return otherUser?.name ?? `Usuario #${otherUser?.id}`;
  }

  loadUsers(conversations: Conversation[]) {
    const allUserIds = new Set<number>();

    conversations.forEach((convo) => {
      allUserIds.add(convo.buyer.id);
      allUserIds.add(convo.seller.id);
    });

    allUserIds.forEach((id) => {
      if (!this.usersMap.has(id)) {
        this.userService.getUserById(id).subscribe((user) => {
          this.usersMap.set(id, user);
          this.conversations.update((prev) => [...prev]);
          this.cdr.detectChanges();
        });
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer?.nativeElement.scrollTo({
        top: this.messagesContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100); // esperar un poco para que el DOM se actualice
  }

  loadConversations() {
    this.chatService.getConversations().subscribe((convos) => {
      this.loadUsers(convos); // Primero cargar usuarios
      this.conversations.set(convos); // Luego las conversaciones
      this.cdr.detectChanges();
    });
  }

  loadConversationDetails(convoId: number) {
    this.chatService.getConversationDetails(convoId).subscribe((details) => {
      this.selectedConversation.set(details);
      this.chatService.messages.set(details.messages);
      // 🚨 Cargar los usuarios involucrados en los mensajes
      const senderIds = new Set(details.messages.map((msg) => msg.sender_id));
      senderIds.add(details.buyer.id);
      senderIds.add(details.seller.id);

      senderIds.forEach((id) => {
        if (!this.usersMap.has(id)) {
          this.userService.getUserById(id).subscribe((user) => {
            this.usersMap.set(id, user);
            this.cdr.detectChanges();
          });
        }
      });

      this.markNewMessages(details.messages);
      this.scrollToBottom();
    });
  }

  markNewMessages(messages: Message[]) {
    const newIds = messages
      .filter((msg) => msg.sender_id !== this.currentUser.id)
      .map((msg) => msg.id);

    this.newMessagesIds = new Set(newIds);
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
    return this.chatService.messages();
  }

  getOtherUser(convo: Conversation): string {
    const otherUserId =
      this.currentUser.id === convo.buyer.id ? convo.seller.id : convo.buyer.id;
    const otherUser = this.usersMap.get(otherUserId);
    return otherUser ? otherUser.name : `Usuario #${otherUserId}`;
  }

  getSenderName(senderId: number): string {
    const user = this.usersMap.get(senderId);
    if (user) return user.name;

    // Cargar si no existe aún
    this.userService.getUserById(senderId).subscribe((user) => {
      this.usersMap.set(senderId, user);
      this.cdr.detectChanges(); // Forzar redibujo
    });

    return `Usuario #${senderId}`;
  }
}

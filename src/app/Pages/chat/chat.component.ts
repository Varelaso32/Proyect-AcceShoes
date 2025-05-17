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
        if (selected) {
          this.loadConversationDetails(selected.id);
        }
        this.loadConversations(); // actualiza también lista de conversaciones
      });
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  loadUsers(conversations: Conversation[]) {
    const allUserIds = new Set<number>();

    conversations.forEach((convo) => {
      allUserIds.add(convo.buyer_id);
      allUserIds.add(convo.seller_id);
    });

    allUserIds.forEach((id) => {
      if (!this.usersMap.has(id)) {
        this.userService.getUserById(id).subscribe((user) => {
          this.usersMap.set(id, user);
          this.conversations.update((prev) => [...prev]);
          this.cdr.detectChanges(); // Forzar actualización aquí
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
      if (details.messages) {
        this.markNewMessages(details.messages);
      }
      this.scrollToBottom(); // 👈 hacer scroll
    });
  }

  markNewMessages(messages: Message[]) {
    const newIds = messages
      .filter((msg) => msg.sender_id !== this.currentUser.id) // puedes agregar más lógica si usas "read"
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
    return this.selectedConversation()?.messages || [];
  }

  getOtherUser(convo: Conversation): string {
    const otherUserId =
      this.currentUser.id === convo.buyer_id ? convo.seller_id : convo.buyer_id;

    return this.usersMap.get(otherUserId)?.name || `Usuario #${otherUserId}`;
  }

  getSenderName(senderId: number): string {
    if (senderId === this.currentUser.id) return 'Tú';

    // Si el usuario ya está en el mapa
    if (this.usersMap.has(senderId)) {
      return this.usersMap.get(senderId)?.name || `Usuario #${senderId}`;
    }

    // Si no está, intentar cargarlo (solo si es necesario)
    this.userService.getUserById(senderId).subscribe((user) => {
      this.usersMap.set(senderId, user);
      this.conversations.update((convos) => [...convos]); // Forzar actualización
    });

    return `Usuario #${senderId}`; // Temporal hasta que se cargue
  }
}

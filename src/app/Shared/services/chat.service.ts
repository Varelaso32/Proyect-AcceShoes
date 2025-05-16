import { Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../services/base-http.service';
import { Observable, catchError, tap } from 'rxjs';
import {
  Conversation,
  Message,
  NewMessagesResponse,
} from '../../models/chatMessage.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseHttpService {
  // Señales para manejar el estado del chat
  conversations = signal<Conversation[]>([]);
  currentConversation = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);

  /**
   * Obtiene todas las conversaciones del usuario
   * @returns Observable con la lista de conversaciones
   */
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/chat/`).pipe(
      tap((conversations) => {
        this.conversations.set(conversations);
      }),
      catchError((error) => {
        console.error('Error fetching conversations:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene los detalles de una conversación específica
   * @param conversationId ID de la conversación
   * @returns Observable con los detalles de la conversación
   */
  getConversationDetails(conversationId: number): Observable<Conversation> {
    return this.http
      .get<Conversation>(`${this.apiUrl}/chat/${conversationId}`)
      .pipe(
        tap((conversation) => {
          this.currentConversation.set(conversation);
          this.messages.set(conversation.messages || []);
        }),
        catchError((error) => {
          console.error('Error fetching conversation details:', error);
          throw error;
        })
      );
  }

  /**
   * Envía un mensaje a una conversación
   * @param conversationId ID de la conversación
   * @param content Contenido del mensaje
   * @returns Observable con el mensaje creado
   */
  sendMessage(conversationId: number, content: string): Observable<Message> {
    return this.http
      .post<Message>(`${this.apiUrl}/chat/${conversationId}/message`, {
        content,
      })
      .pipe(
        tap((message) => {
          // Actualizamos el estado local con el nuevo mensaje
          this.messages.update((messages) => [...messages, message]);

          // Actualizamos la última fecha de mensaje en la conversación actual
          if (this.currentConversation()) {
            this.currentConversation.update((conv) => ({
              ...conv!,
              last_message: new Date().toISOString(),
            }));
          }

          // Actualizamos la última fecha de mensaje en la lista de conversaciones
          this.conversations.update((conversations) =>
            conversations.map((conv) =>
              conv.id === conversationId
                ? { ...conv, last_message: new Date().toISOString() }
                : conv
            )
          );
        }),
        catchError((error) => {
          console.error('Error sending message:', error);
          throw error;
        })
      );
  }

  /**
   * Obtiene nuevos mensajes de una conversación
   * @param conversationId ID de la conversación
   * @param lastMessageId ID del último mensaje recibido
   * @returns Observable con la lista de nuevos mensajes
   */
  getNewMessages(
    conversationId: number,
    lastMessageId: number
  ): Observable<NewMessagesResponse> {
    return this.http
      .get<NewMessagesResponse>(
        `${this.apiUrl}/chat/${conversationId}/update?message_id=${lastMessageId}`
      )
      .pipe(
        tap((newMessages) => {
          if (newMessages && newMessages.length > 0) {
            // Agregamos los nuevos mensajes al estado local
            this.messages.update((messages) => [...messages, ...newMessages]);

            // Actualizamos la última fecha de mensaje en la conversación actual
            if (this.currentConversation()) {
              this.currentConversation.update((conv) => ({
                ...conv!,
                last_message: newMessages[newMessages.length - 1].sent_at,
              }));
            }

            // Actualizamos la última fecha de mensaje en la lista de conversaciones
            this.conversations.update((conversations) =>
              conversations.map((conv) =>
                conv.id === conversationId
                  ? {
                      ...conv,
                      last_message: newMessages[newMessages.length - 1].sent_at,
                    }
                  : conv
              )
            );
          }
        }),
        catchError((error) => {
          console.error('Error fetching new messages:', error);
          throw error;
        })
      );
  }

  /**
   * Limpia el estado del chat (útil al cerrar sesión)
   */
  clearChatState(): void {
    this.conversations.set([]);
    this.currentConversation.set(null);
    this.messages.set([]);
  }
}

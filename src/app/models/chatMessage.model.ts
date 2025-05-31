import { UserResponse } from "./user.model";

export interface Conversation {
  id: number;
  created_at: string;
  last_message: string;
  seller: UserResponse;
  buyer: UserResponse;
  messages: Message[];
}

export interface Message {
  content: string;
  id: number;
  conversation_id: number;
  sender_id: number;
  sent_at: string;
}

export type NewMessagesResponse = Message[];

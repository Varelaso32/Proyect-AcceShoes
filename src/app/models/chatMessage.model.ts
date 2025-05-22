export interface Conversation {
  seller_id: number;
  buyer_id: number;
  id: number;
  created_at: string;
  last_message: string;
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

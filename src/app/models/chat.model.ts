export interface ChatMessage {
  user: string;
  message: string;
  avatar: string;
  time: string;
  side: 'start' | 'end';
  status?: string;
}

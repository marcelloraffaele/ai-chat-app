import { Message } from './Message';

/**
 * Chat request type definition based on the API schema
 */
export interface ChatRequest {
  conversationId: number;
  message: string;
  history: Message[];
}
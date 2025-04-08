import { Message } from './Message';

/**
 * Chat response type definition based on the API schema
 */
export interface ChatResponse {
  conversationId: number;
  response: string;
  history: Message[];
  timestamp: string;
}
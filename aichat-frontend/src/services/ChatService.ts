import axios from 'axios';
import { ChatRequest, ChatResponse, Message } from '../types';

// Define API base URL
const API_BASE_URL = 'http://localhost:8080';

/**
 * ChatService - Handles all API communication with the backend chat service
 */
const ChatService = {
  /**
   * Send a message to the chat API and get a response
   * @param request Chat request parameters
   * @returns Promise with the chat response
   */
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await axios.post<ChatResponse>(
      `${API_BASE_URL}/chat/completion`,
      request
    );
    return response.data;
  },

  /**
   * Get chat history for a specific conversation
   * @param conversationId ID of the conversation to retrieve
   * @returns Promise with array of messages
   */
  getChatHistory: async (conversationId: number): Promise<Message[]> => {
    const response = await axios.get<Message[]>(
      `${API_BASE_URL}/chat/history/${conversationId}`
    );
    return response.data;
  }
};

export default ChatService;
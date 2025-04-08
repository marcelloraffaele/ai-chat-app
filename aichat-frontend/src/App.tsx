import React, { useState, useEffect, useRef } from 'react';
import ChatService from './services/ChatService';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import LoadingIndicator from './components/LoadingIndicator';
import ChatSidebar from './components/ChatSidebar';
import ThemeToggle from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';
import { Message } from './types';
import './App.css';

const App: React.FC = () => {
  // State for managing conversations and messages
  const [conversations, setConversations] = useState<number[]>([1]); // Start with conversation 1
  const [activeConversationId, setActiveConversationId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Ref for scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when active conversation changes
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await ChatService.getChatHistory(activeConversationId);
        setMessages(history);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        // Start with empty history for new conversations
        setMessages([]);
      }
    };

    fetchHistory();
  }, [activeConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    // Create a new user message
    const userMessage: Message = { role: 'user', content };
    
    // Update UI immediately with user message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare request with conversation history
      const request = {
        conversationId: activeConversationId,
        message: content,
        history: messages
      };

      // Call API
      const response = await ChatService.sendMessage(request);
      
      // Update messages with AI response
      const aiMessage: Message = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, aiMessage]);
      
      // If this is a new conversation ID, add it to our list
      if (!conversations.includes(response.conversationId)) {
        setConversations(prev => [...prev, response.conversationId]);
        setActiveConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error to user
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request. Please try again.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    // Get the next conversation ID (max + 1)
    const nextId = Math.max(...conversations) + 1;
    setConversations(prev => [...prev, nextId]);
    setActiveConversationId(nextId);
    setMessages([]);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header with gradient background */}
        <header className="gradient-bg text-white py-3 px-4 shadow-md flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Chat Assistant</h1>
          <ThemeToggle />
        </header>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <ChatSidebar 
            activeConversationId={activeConversationId}
            conversations={conversations}
            onSelectConversation={setActiveConversationId}
            onNewChat={handleNewChat}
          />
          
          {/* Chat Container */}
          <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6">
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-300">Start a New Conversation</p>
                  <p className="text-center max-w-md text-gray-500 dark:text-gray-400">
                    Type a message below to start chatting with the AI assistant. Ask questions, get creative responses, or explore new ideas!
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <ErrorBoundary key={index}>
                      <MessageBubble message={message} />
                    </ErrorBoundary>
                  ))}
                  {isLoading && <LoadingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Input Area */}
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

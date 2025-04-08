import React from 'react';
import { FiPlus, FiMessageSquare } from 'react-icons/fi';

interface ChatSidebarProps {
  activeConversationId: number | null;
  conversations: number[];
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
}

/**
 * ChatSidebar component - Displays a list of conversations and a "New Chat" button
 */
const ChatSidebar: React.FC<ChatSidebarProps> = ({
  activeConversationId,
  conversations,
  onSelectConversation,
  onNewChat
}) => {
  return (
    <aside className="w-64 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
      {/* Header with gradient background */}
      <div className="gradient-bg text-white p-3 shadow-md">
        <h2 className="text-lg font-bold">Conversations</h2>
      </div>
      
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="m-3 flex items-center justify-center gap-2 btn-primary"
      >
        <FiPlus /> New Chat
      </button>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2">
          {conversations.map((id) => (
            <button
              key={id}
              onClick={() => onSelectConversation(id)}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ${
                activeConversationId === id
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className={`p-2 rounded-full mr-3 ${
                activeConversationId === id 
                  ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <FiMessageSquare />
              </div>
              <span className="text-sm font-medium truncate">Conversation {id}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
        AI Chat App © 2025
      </div>
    </aside>
  );
};

export default ChatSidebar;
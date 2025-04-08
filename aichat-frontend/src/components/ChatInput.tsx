import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

/**
 * ChatInput component - Input field and send button for user messages
 */
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-lg"
    >
      <div className="flex rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-inner border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-grow px-4 py-3 bg-transparent focus:outline-none dark:text-white text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`px-5 py-3 flex items-center justify-center ${
            !message.trim() || disabled 
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'gradient-bg text-white hover:opacity-90'
          } transition-all duration-200`}
          aria-label="Send message"
        >
          <FiSend size={18} />
        </button>
      </div>
      {disabled && (
        <div className="mt-2 text-xs text-center text-indigo-600 dark:text-indigo-400 animate-pulse">
          AI is thinking...
        </div>
      )}
    </form>
  );
};

export default ChatInput;
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Message } from '../types';
import ErrorBoundary from './ErrorBoundary';

interface MessageBubbleProps {
  message: Message;
}

/**
 * MessageBubble component - Displays a single message in the chat
 * Renders differently based on the role (user or assistant)
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Plain text fallback for when markdown rendering fails
  const PlainTextFallback = () => (
    <div className="whitespace-pre-wrap">{message.content || ''}</div>
  );
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-animation`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 shadow-md ${
          isUser 
            ? 'gradient-bg text-white font-medium' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        }`}
      >
        <ErrorBoundary fallback={<PlainTextFallback />}>
          {message.content ? (
            <ReactMarkdown 
              className="prose prose-sm dark:prose-invert max-w-none"
              remarkPlugins={[remarkGfm]} // Support GFM (tables, strikethrough, etc.)
              rehypePlugins={[rehypeRaw, rehypeSanitize]} // Sanitize HTML
              components={{
                // Customize link rendering
                a: ({ node, ...props }) => (
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${isUser ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400'} hover:underline`}
                    {...props} 
                  />
                ),
                // Customize code block rendering
                code: ({ node, inline, className, children, ...props }) => {
                  return inline ? (
                    <code className={`${isUser ? 'bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700'} px-1 py-0.5 rounded text-sm`} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={`block ${isUser ? 'bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700'} p-2 rounded text-sm overflow-x-auto`} {...props}>
                      {children}
                    </code>
                  );
                },
                // Prevent breaking the container with images and ensure responsive sizing
                img: ({ node, ...props }) => (
                  <img className="max-w-full h-auto rounded border border-gray-200 dark:border-gray-700" {...props} alt={props.alt || 'Image'} />
                ),
                // Enhance headings
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1" {...props} />,
                // Enhance lists
                ul: ({node, ...props}) => <ul className="pl-5 list-disc mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="pl-5 list-decimal mb-2" {...props} />,
                // Enhance blockquotes
                blockquote: ({node, ...props}) => (
                  <blockquote 
                    className={`border-l-4 ${isUser ? 'border-indigo-400' : 'border-indigo-500'} pl-3 italic my-2`} 
                    {...props} 
                  />
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="text-gray-400 italic">Empty message</div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default MessageBubble;
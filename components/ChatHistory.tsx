
import React, { useEffect, useRef } from 'react';
import { ChatMessage as AppChatMessage } from '../types'; // Renamed to avoid conflict with component name
import { ChatMessageItem } from './ChatMessageItem';

interface ChatHistoryProps {
  messages: AppChatMessage[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow p-4 space-y-4 overflow-y-auto">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25C7.861 20.25 4 16.556 4 12c0-4.556 3.861-8.25 8.625-8.25C17.139 3.75 21 7.444 21 12z" />
          </svg>
          <p>No messages yet.</p>
          <p className="text-sm">Upload a video and ask a question to start the chat!</p>
        </div>
      )}
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

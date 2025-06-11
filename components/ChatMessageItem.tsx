
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
  </svg>
);

const AiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.378 1.602a.75.75 0 00-.756 0L3.022 6.002a.75.75 0 00.327 1.39L7.5 8.017V12.75A2.25 2.25 0 009.75 15h4.5A2.25 2.25 0 0016.5 12.75V8.017l4.151-.625a.75.75 0 00.327-1.39l-8.6-4.4z" />
    <path d="M4.5 9.412V18a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 18V9.412c0-.239-.033-.471-.096-.697l-4.151.625V12.75a3.75 3.75 0 01-3.75 3.75h-1.5A3.75 3.75 0 018.25 12.75V9.34l-4.151-.625a1.494 1.494 0 00-.096.697z" />
  </svg>
);


export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timeFormatted = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
          <AiIcon className="w-5 h-5"/>
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow ${
          isUser ? 'bg-sky-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        <div className="text-sm markdown-content">
          {isUser ? (
            message.text
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        <p className={`text-xs mt-1 ${isUser ? 'text-sky-200 text-right' : 'text-gray-400 text-left'}`}>
          {timeFormatted}
        </p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
          <UserIcon className="w-5 h-5"/>
        </div>
      )}
    </div>
  );
};
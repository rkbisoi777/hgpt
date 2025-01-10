import React from 'react';
import { Message } from '../../types';

interface PropertyChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function PropertyChatMessages({ messages, isLoading }: PropertyChatMessagesProps) {
  return (
    <div className="space-y-4 text-sm">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-3 py-1.5 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
      <div className="bg-gray-50 rounded-full flex items-center justify-start min-w-8 gap-2">
  {['-0.3s', '-0.15s', '0s'].map((delay, index) => (
    <div
      key={index}
      className={`bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1 animate-bounce`}
      style={{ animationDelay: delay }}
    >
      <img
        src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
        alt="HouseGPT"
        className="w-3 h-3"
      />
    </div>
  ))}
</div>
      )}
    </div>
  );
}
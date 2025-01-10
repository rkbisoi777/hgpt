import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { ChatService } from '../lib/chat/chatService';
import { generateMessageId } from '../utils/messageUtils';
import { toast } from 'react-hot-toast';
import { ChatServiceError } from '../lib/chat/errors';

interface ChatInterfaceProps {
  initialQuery?: string;
}

export function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialQueryProcessed = useRef(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);

  useEffect(() => {
    const initChatService = async () => {
      try {
        const service = await ChatService.getInstance();
        setChatService(service);
      } catch (error) {
        toast.error('Failed to initialize chat service');
        console.error('Chat service initialization failed:', error);
      }
    };
    initChatService();
  }, []);

  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current && chatService) {
      initialQueryProcessed.current = true;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, chatService]);

  const handleSendMessage = async (content: string) => {
    if (!chatService) {
      toast.error('Chat service not available');
      return;
    }

    setIsLoading(true);
    const userMessage: Message = {
      id: generateMessageId(),
      content,
      role: 'user',
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const { response, properties } = await chatService.processMessage(content);
      const aiMessage: Message = {
        id: generateMessageId(),
        content: response,
        role: 'assistant',
        properties,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = error instanceof ChatServiceError
        ? `Error: ${error.message}`
        : 'An unexpected error occurred';
      toast.error(errorMessage);
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage}
        />
      </div>
      <div className="sticky bottom-2 bg-white mx-1 border rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
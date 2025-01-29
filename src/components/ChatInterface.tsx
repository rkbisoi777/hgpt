// import React, { useState, useEffect, useRef } from 'react';
// import { Message } from '../types';
// import { ChatInput } from './ChatInput';
// import { MessageList } from './MessageList';
// import { ChatService } from '../lib/chat/chatService';
// import { generateMessageId } from '../utils/messageUtils';
// import { toast } from 'react-hot-toast';
// import { ChatServiceError } from '../lib/chat/errors';
// import { useToken } from './TokenContext';

// const DAILY_LIMIT = 10000;

// interface ChatInterfaceProps {
//   initialQuery?: string;
//   shouldSendInitialQuery?: boolean;
// }

// export function ChatInterface({ initialQuery }: ChatInterfaceProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const initialQueryProcessed = useRef(false);
//   const [chatService, setChatService] = useState<ChatService | null>(null);

//   const { tokens, setTokens } = useToken(); // Using the global token state

//   const getCookie = (name: string): string | null => {
//     const cookies = document.cookie.split('; ');
//     for (const cookie of cookies) {
//       const [key, value] = cookie.split('=');
//       if (key === name) return decodeURIComponent(value);
//     }
//     return null;
//   };
  
//   const setCookie = (name: string, value: string, days: number): void => {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
//   };

//   useEffect(() => {
//     const storedTokens = getCookie('HouseGPTTokens');
//     const lastReset = getCookie('lastReset');
//     const today = new Date().toISOString().split('T')[0];

//     if (!lastReset || lastReset !== today) {
//       // Reset the daily limit
//       setCookie('HouseGPTTokens', String(DAILY_LIMIT), 1);
//       setCookie('lastReset', today, 1);
//       setTokens(DAILY_LIMIT);
//     } else if (storedTokens) {
//       setTokens(Number(storedTokens));
//     }
//   }, [setTokens]);

//   useEffect(() => {
//     const initChatService = async () => {
//       try {
//         const service = await ChatService.getInstance();
//         setChatService(service);
         
//       } catch (error) {
//         toast.error('Failed to initialize chat service');
//         console.error('Chat service initialization failed:', error);
//       }
//     };
//     initChatService();
//   }, []);

//   const subtractTokens = (amount: number): void => {
//     if (tokens - amount >= 0) {
//       const newTokenCount = tokens - amount;
//       setTokens(newTokenCount);
//       setCookie('HouseGPTTokens', String(newTokenCount), 1);
//     } else {
//       toast('Not enough tokens available.');
//     }
//   };

//   useEffect(() => {
//     if (initialQuery && !initialQueryProcessed.current && chatService) {
//       if(initialQuery !== "##**HouseGPT**#"){
//         initialQueryProcessed.current = true;
//         handleSendMessage(initialQuery);
//       }else{
//         setMessages([
//           {
//             id: generateMessageId(),
//             content: `Hi, I’m HouseGPT! I can help you find the perfect property and answer all your real estate questions with personalized recommendations. I can help you with:
// 🏡 Find your dream property
// 📊 Provide accurate property details
// 💰 Share pricing and market trends
// And much more...
// What would you like to know?`,
//             role: 'assistant',
//           },
//         ]);
//       }
//     }
//   }, [initialQuery, chatService]);

//   const handleSendMessage = async (content: string) => {
//     if (!chatService) {
//       toast.error('Chat service not available');
//       return;
//     }

//     setIsLoading(true);
//     const userMessage: Message = {
//       id: generateMessageId(),
//       content,
//       role: 'user',
//     };

//     setMessages(prev => [...prev, userMessage]);
    
//     try {
//       const { response, properties, inputLength, outputLength } = await chatService.processMessage(content);
//       const tokensUsed = inputLength + outputLength;
//       subtractTokens(tokensUsed);

//       const aiMessage: Message = {
//         id: generateMessageId(),
//         content: response,
//         role: 'assistant',
//         properties,
//       };

//       setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       const errorMessage = error instanceof ChatServiceError
//         ? `Error: ${error.message}`
//         : 'An unexpected error occurred';
//       toast.error(errorMessage);
//       console.error('Error processing message:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full relative bg-gray-50">
//       <MessageList messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
      
//       <div className="sticky bottom-1 bg-white mx-1 border rounded-lg shadow-md">
//         {/* <p><i className="fas fa-coins mr-1"></i>Tokens Available: {tokens}</p> */}
//         <div className="max-w-4xl mx-auto w-full">
//           <ChatInput onSend={handleSendMessage} disabled={isLoading} />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { ChatService } from '../lib/chat/chatService';
import { generateMessageId } from '../utils/messageUtils';
import { toast } from 'react-hot-toast';
import { ChatServiceError } from '../lib/chat/errors';
import { useToken } from './TokenContext';

const DAILY_LIMIT = 5000;

interface ChatInterfaceProps {
  initialQuery?: string;
  shouldSendInitialQuery?: boolean;
}

export function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialQueryProcessed = useRef(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>('');

  const { tokens, setTokens } = useToken();

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  };
  
  const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
  };

  useEffect(() => {
    const storedTokens = getCookie('HouseGPTTokens');
    const lastReset = getCookie('lastReset');
    const today = new Date().toISOString().split('T')[0];

    if (!lastReset || lastReset !== today) {
      setCookie('HouseGPTTokens', String(DAILY_LIMIT), 1);
      setCookie('lastReset', today, 1);
      setTokens(DAILY_LIMIT);
    } else if (storedTokens) {
      setTokens(Number(storedTokens));
    }
  }, [setTokens]);

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

  const subtractTokens = (amount: number): void => {
    if (tokens - amount >= 0) {
      const newTokenCount = tokens - amount;
      setTokens(newTokenCount);
      setCookie('HouseGPTTokens', String(newTokenCount), 1);
    } else {
      toast('Not enough tokens available.');
    }
  };

  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current && chatService) {
      if(initialQuery !== "##**HouseGPT**#"){
        initialQueryProcessed.current = true;
        handleSendMessage(initialQuery);
      } else {
        setMessages([
          {
            id: generateMessageId(),
            content: `Hi, I'm HouseGPT! I can help you find the perfect property and answer all your real estate questions with personalized recommendations. I can help you with:
🏡 Find your dream property
📊 Provide accurate property details
💰 Share pricing and market trends
And much more...
What would you like to know?`,
            role: 'assistant',
          },
        ]);
      }
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
    setCurrentStreamingMessage('');
    
    try {
      const messageId = generateMessageId();
      setMessages(prev => [...prev, { id: messageId, content: '', role: 'assistant' }]);

      const { properties, inputLength, outputLength } = await chatService.processMessage(
        content,
        (token) => {
          setCurrentStreamingMessage(prev => prev + token);
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: prev.find(m => m.id === messageId)?.content + token || token }
              : msg
          ));
        }
      );

      const tokensUsed = inputLength + outputLength;
      subtractTokens(tokensUsed);

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, properties }
          : msg
      ));
    } catch (error) {
      const errorMessage = error instanceof ChatServiceError
        ? `Error: ${error.message}`
        : 'An unexpected error occurred';
      toast.error(errorMessage);
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
      setCurrentStreamingMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-gray-50">
      <MessageList messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
      
      <div className="sticky bottom-1 bg-white mx-1 border rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
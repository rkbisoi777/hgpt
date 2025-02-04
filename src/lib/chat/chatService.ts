// // import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
// // import { Property } from '../../types';
// // import { propertyService } from '../propertyService';
// // import { GEMINI_CONFIG } from './config';
// // import { PROPERTY_ASSISTANT_PROMPT } from './prompts';
// // import { ChatResponse } from './types';
// // import { ChatServiceError, ChatErrorCodes } from './errors';

// // export class ChatService {
// //   private static instance: ChatService;
// //   private model: GenerativeModel;
// //   private initialized: boolean = false;

// //   private constructor() {
// //     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// //     if (!apiKey) {
// //       throw new ChatServiceError(
// //         'Missing Gemini API key',
// //         ChatErrorCodes.INITIALIZATION_FAILED
// //       );
// //     }

// //     try {
// //       const genAI = new GoogleGenerativeAI(apiKey);
// //       this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
// //       this.initialized = true;
// //     } catch (error) {
// //       throw new ChatServiceError(
// //         'Failed to initialize chat service',
// //         ChatErrorCodes.INITIALIZATION_FAILED,
// //         error
// //       );
// //     }
// //   }

// //   static async getInstance(): Promise<ChatService> {
// //     if (!ChatService.instance) {
// //       ChatService.instance = new ChatService();
// //     }
// //     return ChatService.instance;
// //   }

// //   private async searchProperties(query: string): Promise<Property[]> {
// //     try {
// //       const properties = await propertyService.searchProperties(query);
// //       return properties.map(p => ({
// //         ...p,
// //         imageUrl: p.imageUrl,
// //       }));
// //     } catch (error) {
// //       throw new ChatServiceError(
// //         'Failed to search properties',
// //         ChatErrorCodes.PROPERTY_SEARCH_FAILED,
// //         error
// //       );
// //     }
// //   }

// //   private async generateResponse(
// //     query: string,
// //     properties: Property[]
// //   ): Promise<string> {
// //     try {
// //       const propertiesContext = properties.length > 0
// //         ? `Found ${properties.length} properties matching the criteria:\n${
// //           properties.map(p => 
// //             `- ${p.title} (${p.bedrooms} beds, ${p.bathrooms} baths) at ₹${p.price.toLocaleString()} in ${p.location}`
// //           ).join('\n')
// //         }`
// //         : "No properties found matching the criteria.";

// //       const chat = await this.model.startChat({
// //         history: [
// //           {
// //             role: "user",
// //             parts: [{ text: "You are a real estate assistant. Be concise and helpful." }],
// //           },
// //           {
// //             role: "model",
// //             parts: [{ text: "I understand. I'll help users find properties and provide clear, relevant information." }],
// //           },
// //         ],
// //       });

// //       const result = await chat.sendMessage(
// //         `${PROPERTY_ASSISTANT_PROMPT}\n\nContext: ${propertiesContext}\n\nUser query: ${query}`
// //       );
// //       const response = result.response;
// //       return response.text();
// //     } catch (error) {
// //       console.error('Response generation error:', error);
// //       throw new ChatServiceError(
// //         'Failed to generate response',
// //         ChatErrorCodes.RESPONSE_GENERATION_FAILED,
// //         error
// //       );
// //     }
// //   }

// //   async processMessage(content: string): Promise<ChatResponse> {
// //     if (!this.initialized) {
// //       throw new ChatServiceError(
// //         'Chat service not initialized',
// //         ChatErrorCodes.INITIALIZATION_FAILED
// //       );
// //     }

// //     try {
// //       const properties = await this.searchProperties(content);
// //       const response = await this.generateResponse(content, properties);

// //       return {
// //         response,
// //         properties: properties.length > 0 ? properties : undefined,
// //       };
// //     } catch (error) {
// //       console.error('Process message error:', error);
// //       if (error instanceof ChatServiceError) {
// //         throw error;
// //       }
// //       throw new ChatServiceError(
// //         'Failed to process message',
// //         ChatErrorCodes.MODEL_ERROR,
// //         error
// //       );
// //     }
// //   }
// // }

// import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
// import { Property } from '../../types';
// import { propertyService } from '../propertyService';
// import { PROPERTY_ASSISTANT_PROMPT } from './prompts';
// import { ChatResponse } from './types';
// import { ChatServiceError, ChatErrorCodes } from './errors';

// export class ChatService {
//   private static instance: ChatService;
//   private model: GenerativeModel;
//   private initialized: boolean = false;

//   private constructor() {
//     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new ChatServiceError(
//         'Missing Gemini API key',
//         ChatErrorCodes.INITIALIZATION_FAILED
//       );
//     }

//     try {
//       const genAI = new GoogleGenerativeAI(apiKey);
//       this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       this.initialized = true;
//     } catch (error) {
//       throw new ChatServiceError(
//         'Failed to initialize chat service',
//         ChatErrorCodes.INITIALIZATION_FAILED,
//         error
//       );
//     }
//   }

//   static async getInstance(): Promise<ChatService> {
//     if (!ChatService.instance) {
//       ChatService.instance = new ChatService();
//     }
//     return ChatService.instance;
//   }

//   private calculateLength(text: string): number {
//     return text.length; // Character count
//   }

//   private async searchProperties(query: string): Promise<Property[]> {
//     try {
//       const properties = await propertyService.searchProperties(query);
//       return properties.map(p => ({
//         ...p,
//         imageUrl: p.imageUrl,
//       }));
//     } catch (error) {
//       throw new ChatServiceError(
//         'Failed to search properties',
//         ChatErrorCodes.PROPERTY_SEARCH_FAILED,
//         error
//       );
//     }
//   }

//   private async generateResponse(
//     query: string,
//     properties: Property[]
//   ): Promise<{ responseText: string; outputLength: number }> {
//     try {
//       const propertiesContext = properties.length > 0
//         ? `Found ${properties.length} properties matching the criteria:\n${
//           properties.map(p => 
//             `- ${p.title} (${p.bedrooms} beds, ${p.bathrooms} baths) at ₹${p.price.toLocaleString()} in ${p.location}`
//           ).join('\n')
//         }`
//         : "No properties found matching the criteria.";

//       const chat = await this.model.startChat({
//         history: [
//           {
//             role: "user",
//             parts: [{ text: "You are a real estate assistant. Be concise and helpful." }],
//           },
//           {
//             role: "model",
//             parts: [{ text: "I understand. I'll help users find properties and provide clear, relevant information." }],
//           },
//         ],
//       });

//       const result = await chat.sendMessage(
//         `${PROPERTY_ASSISTANT_PROMPT}\n\nContext: ${propertiesContext}\n\nUser query: ${query}`
//       );

//       const response = result.response.text();
//       const outputLength = this.calculateLength(response);

//       return { responseText: response, outputLength };
//     } catch (error) {
//       console.error('Response generation error:', error);
//       throw new ChatServiceError(
//         'Failed to generate response',
//         ChatErrorCodes.RESPONSE_GENERATION_FAILED,
//         error
//       );
//     }
//   }

//   async processMessage(content: string): Promise<ChatResponse> {
//     if (!this.initialized) {
//       throw new ChatServiceError(
//         'Chat service not initialized',
//         ChatErrorCodes.INITIALIZATION_FAILED
//       );
//     }

//     try {
//       const inputLength = this.calculateLength(content); // Character count for input
//       const properties = await this.searchProperties(content);

//       const { responseText, outputLength } = await this.generateResponse(content, properties);

//       return {
//         response: responseText,
//         inputLength, // Length of user input
//         outputLength, // Length of AI response
//         properties: properties.length > 0 ? properties : undefined,
//       };
//     } catch (error) {
//       console.error('Process message error:', error);
//       if (error instanceof ChatServiceError) {
//         throw error;
//       }
//       throw new ChatServiceError(
//         'Failed to process message',
//         ChatErrorCodes.MODEL_ERROR,
//         error
//       );
//     }
//   }
// }

// import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
// import { Property } from '../../types';
// import { propertyService } from '../propertyService';
// import { PROPERTY_ASSISTANT_PROMPT } from './prompts';
// import { ChatResponse } from './types';
// import { ChatServiceError, ChatErrorCodes } from './errors';

// export class ChatService {
//   private static instance: ChatService;
//   private model: GenerativeModel;
//   private initialized: boolean = false;

//   private constructor() {
//     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new ChatServiceError(
//         'Missing Gemini API key',
//         ChatErrorCodes.INITIALIZATION_FAILED
//       );
//     }

//     try {
//       const genAI = new GoogleGenerativeAI(apiKey);
//       this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       this.initialized = true;
//     } catch (error) {
//       throw new ChatServiceError(
//         'Failed to initialize chat service',
//         ChatErrorCodes.INITIALIZATION_FAILED,
//         error
//       );
//     }
//   }

//   static async getInstance(): Promise<ChatService> {
//     if (!ChatService.instance) {
//       ChatService.instance = new ChatService();
//     }
//     return ChatService.instance;
//   }

//   private calculateLength(text: string): number {
//     return text.length;
//   }

//   private async searchProperties(query: string): Promise<Property[]> {
//     try {
//       const properties = await propertyService.searchProperties(query);
//       return properties.map(p => ({
//         ...p,
//         imageUrl: p.imageUrl,
//       }));
//     } catch (error) {
//       throw new ChatServiceError(
//         'Failed to search properties',
//         ChatErrorCodes.PROPERTY_SEARCH_FAILED,
//         error
//       );
//     }
//   }

//   private async generateResponse(
//     query: string,
//     properties: Property[],
//     onToken: (token: string) => void
//   ): Promise<{ responseText: string; outputLength: number }> {
//     try {
//       const propertiesContext = properties.length > 0
//         ? `Found ${properties.length} properties matching the criteria:\n${
//           properties.map(p => 
//             `- ${p.title} (${p.bedrooms} beds, ${p.bathrooms} baths) at ₹${p.price.toLocaleString()} in ${p.location}`
//           ).join('\n')
//         }`
//         : "No properties found matching the criteria.";

//       const chat = await this.model.startChat({
//         history: [
//           {
//             role: "user",
//             parts: [{ text: "You are a real estate assistant. Be concise and helpful." }],
//           },
//           {
//             role: "model",
//             parts: [{ text: "I understand. I'll help users find properties and provide clear, relevant information." }],
//           },
//         ],
//       });

//       const result = await chat.sendMessageStream(
//         `${PROPERTY_ASSISTANT_PROMPT}\n\nContext: ${propertiesContext}\n\nUser query: ${query}`
//       );

//       let fullResponse = '';
//       for await (const chunk of result.stream) {
//         const chunkText = chunk.text();
//         fullResponse += chunkText;
//         onToken(chunkText);
//       }

//       const outputLength = this.calculateLength(fullResponse);
//       return { responseText: fullResponse, outputLength };
//     } catch (error) {
//       console.error('Response generation error:', error);
//       throw new ChatServiceError(
//         'Failed to generate response',
//         ChatErrorCodes.RESPONSE_GENERATION_FAILED,
//         error
//       );
//     }
//   }

//   async processMessage(
//     content: string,
//     onToken: (token: string) => void
//   ): Promise<ChatResponse> {
//     if (!this.initialized) {
//       throw new ChatServiceError(
//         'Chat service not initialized',
//         ChatErrorCodes.INITIALIZATION_FAILED
//       );
//     }

//     try {
//       const inputLength = this.calculateLength(content);
//       const properties = await this.searchProperties(content);

//       const { responseText, outputLength } = await this.generateResponse(
//         content,
//         properties,
//         onToken
//       );

//       return {
//         response: responseText,
//         inputLength,
//         outputLength,
//         properties: properties.length > 0 ? properties : undefined,
//       };
//     } catch (error) {
//       console.error('Process message error:', error);
//       if (error instanceof ChatServiceError) {
//         throw error;
//       }
//       throw new ChatServiceError(
//         'Failed to process message',
//         ChatErrorCodes.MODEL_ERROR,
//         error
//       );
//     }
//   }
// }

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { Property } from '../../types';
import { propertyService } from '../propertyService';
import { PROPERTY_ASSISTANT_PROMPT } from './prompts';
import { ChatResponse } from './types';
import { ChatServiceError, ChatErrorCodes } from './errors';

export class ChatService {
  private static instance: ChatService;
  private model: GenerativeModel;
  private initialized: boolean = false;

  private constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new ChatServiceError(
        'Missing Gemini API key',
        ChatErrorCodes.INITIALIZATION_FAILED
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
      this.initialized = true;
    } catch (error) {
      throw new ChatServiceError(
        'Failed to initialize chat service',
        ChatErrorCodes.INITIALIZATION_FAILED,
        error
      );
    }
  }

  static async getInstance(): Promise<ChatService> {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private calculateLength(text: string): number {
    return text.length;
  }

  private async searchProperties(query: string): Promise<Property[]> {
    try {
      const properties = await propertyService.searchProperties(query);
      return properties.map(p => ({
        ...p,
        imageUrl: p.imageUrl,
      }));
    } catch (error) {
      throw new ChatServiceError(
        'Failed to search properties',
        ChatErrorCodes.PROPERTY_SEARCH_FAILED,
        error
      );
    }
  }

  private async generateResponse(
    query: string,
    properties: Property[],
    onToken: (token: string) => void
  ): Promise<{ responseText: string; outputLength: number; suggestedQuestions: string[] }> {
    try {
      const propertiesContext = properties.length > 0
        ? `Found ${properties.length} properties matching the criteria:\n${
          properties.map(p => 
            `- ${p.title} (${p.bedrooms} beds, ${p.bathrooms} baths) at ₹${p.price.toLocaleString()} in ${p.location}`
          ).join('\n')
        }`
        : "No properties found matching the criteria.";

      const chat = await this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are a real estate assistant. Be concise and helpful. After each response, suggest 4 relevant follow-up questions based on the context." }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'll help users find properties, provide clear information, and suggest relevant follow-up questions to guide the conversation." }],
          },
        ],
      });

      const prompt = `${PROPERTY_ASSISTANT_PROMPT}\n\nContext: ${propertiesContext}\n\nUser query: ${query}\n\nAfter your response, generate 4 relevant follow-up questions based on the context. Format your response as:\n[Main response]\n\nSuggested questions:\n1. [Question 1]\n2. [Question 2]\n3. [Question 3]\n4. [Question 4]`;

      const result = await chat.sendMessageStream(prompt);

      let fullResponse = '';
      let suggestedQuestions: string[] = [];
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onToken(chunkText);
      }

      // Extract suggested questions from the response
      const parts = fullResponse.split('Suggested questions:');
      const mainResponse = parts[0].trim();
      
      if (parts.length > 1) {
        suggestedQuestions = parts[1]
          .trim()
          .split('\n')
          .map(q => q.replace(/^\d+\.\s*/, '').trim())
          .filter(q => q.length > 0)
          .slice(0, 4);
      }

      const outputLength = this.calculateLength(mainResponse);
      return { responseText: mainResponse, outputLength, suggestedQuestions };
    } catch (error) {
      console.error('Response generation error:', error);
      throw new ChatServiceError(
        'Failed to generate response',
        ChatErrorCodes.RESPONSE_GENERATION_FAILED,
        error
      );
    }
  }

  async processMessage(
    content: string,
    onToken: (token: string) => void
  ): Promise<ChatResponse> {
    if (!this.initialized) {
      throw new ChatServiceError(
        'Chat service not initialized',
        ChatErrorCodes.INITIALIZATION_FAILED
      );
    }

    try {
      const inputLength = this.calculateLength(content);
      const properties = await this.searchProperties(content);

      const { responseText, outputLength, suggestedQuestions } = await this.generateResponse(
        content,
        properties,
        onToken
      );

      return {
        response: responseText,
        inputLength,
        outputLength,
        properties: properties.length > 0 ? properties : undefined,
        suggestedQuestions
      };
    } catch (error) {
      console.error('Process message error:', error);
      if (error instanceof ChatServiceError) {
        throw error;
      }
      throw new ChatServiceError(
        'Failed to process message',
        ChatErrorCodes.MODEL_ERROR,
        error
      );
    }
  }
}
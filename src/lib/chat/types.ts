import { Property } from '../../types';

export interface ChatResponse {
  response: string;
  properties?: Property[];
}

export interface ChatError extends Error {
  code?: string;
  details?: unknown;
}
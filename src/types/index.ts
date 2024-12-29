export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageUrl: string;
  description: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  properties?: Property[];
}
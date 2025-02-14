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
  created_at: string;
  updated_at: string;
  images: {
    [key: string]: string | string[]; 
  };
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  properties?: Property[];
}
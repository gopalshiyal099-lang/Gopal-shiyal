
export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  category: 'Sale' | 'Rent' | 'Commercial';
  description: string;
  likes: number;
  views: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

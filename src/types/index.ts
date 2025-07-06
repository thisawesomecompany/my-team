export interface Team {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  avatar?: string;
  color: string;
  isBuiltIn: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  teamId: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}
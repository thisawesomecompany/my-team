import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { Message } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    // For now, we'll use a placeholder for the API key
    // In production, this should be handled more securely
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async sendMessage(
    messages: Message[],
    systemPrompt: string
  ): Promise<string> {
    try {
      // Convert our message format to Gemini's format
      const chatHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Start a chat session with the system prompt and history
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'I understand my role. How can I help you today?' }],
          },
          ...chatHistory.slice(0, -1), // All messages except the last one
        ],
      });

      // Send the latest message
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from Gemini API');
    }
  }
}
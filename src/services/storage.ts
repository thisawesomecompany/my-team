import type { Message, Chat } from '../types';

const STORAGE_KEY = 'my-team-chats';

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Get all chats from localStorage
  private getAllChats(): Record<string, Chat> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return {};
      
      const parsed = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      Object.values(parsed).forEach((chat) => {
        const chatData = chat as Chat;
        chatData.createdAt = new Date(chatData.createdAt);
        chatData.updatedAt = new Date(chatData.updatedAt);
        chatData.messages.forEach((message) => {
          const messageData = message as Message;
          messageData.timestamp = new Date(messageData.timestamp);
        });
      });
      
      return parsed;
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
      return {};
    }
  }

  // Save all chats to localStorage
  private saveAllChats(chats: Record<string, Chat>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to localStorage:', error);
    }
  }

  // Get messages for a specific team
  getMessagesForTeam(teamId: string): Message[] {
    const chats = this.getAllChats();
    const chat = chats[teamId];
    return chat ? chat.messages : [];
  }

  // Save messages for a specific team
  saveMessagesForTeam(teamId: string, messages: Message[]): void {
    const chats = this.getAllChats();
    
    if (chats[teamId]) {
      // Update existing chat
      chats[teamId].messages = messages;
      chats[teamId].updatedAt = new Date();
    } else {
      // Create new chat
      chats[teamId] = {
        id: teamId,
        teamId,
        title: messages.length > 0 ? this.generateChatTitle(messages[0].content) : undefined,
        messages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    this.saveAllChats(chats);
  }

  // Add a single message to a team's chat
  addMessageToTeam(teamId: string, message: Message): void {
    const existingMessages = this.getMessagesForTeam(teamId);
    const updatedMessages = [...existingMessages, message];
    this.saveMessagesForTeam(teamId, updatedMessages);
  }

  // Generate a title from the first message (first 50 characters)
  private generateChatTitle(firstMessage: string): string {
    return firstMessage.length > 50 
      ? firstMessage.substring(0, 50) + '...'
      : firstMessage;
  }

  // Clear all chat history
  clearAllChats(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Clear chat history for a specific team
  clearTeamChat(teamId: string): void {
    const chats = this.getAllChats();
    delete chats[teamId];
    this.saveAllChats(chats);
  }

  // Get all teams that have chat history
  getTeamsWithHistory(): string[] {
    const chats = this.getAllChats();
    return Object.keys(chats);
  }
}
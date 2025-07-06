import { useState, useRef, useEffect } from 'react';
import type { Team, Message } from '../types';
import { GeminiService } from '../services/gemini';
import { StorageService } from '../services/storage';

interface NewChatInterfaceProps {
  selectedTeam: Team | null;
}

export function NewChatInterface({ selectedTeam }: NewChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = useRef<GeminiService | null>(null);
  const storageService = useRef<StorageService>(StorageService.getInstance());

  useEffect(() => {
    try {
      geminiService.current = new GeminiService();
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages when team changes
  useEffect(() => {
    if (selectedTeam) {
      const savedMessages = storageService.current.getMessagesForTeam(selectedTeam.id);
      setMessages(savedMessages);
    } else {
      setMessages([]);
    }
  }, [selectedTeam]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !geminiService.current || !selectedTeam) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // Save user message immediately
    storageService.current.addMessageToTeam(selectedTeam.id, userMessage);

    try {
      const response = await geminiService.current.sendMessage(newMessages, selectedTeam.systemPrompt);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Save assistant message
      storageService.current.addMessageToTeam(selectedTeam.id, assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please make sure you have set up your Gemini API key.',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      
      // Save error message
      storageService.current.addMessageToTeam(selectedTeam.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedTeam) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to My Team
          </h2>
          <p className="text-gray-600">
            Select an AI assistant from the navigation above to get started
          </p>
        </div>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    const welcomes = {
      'life-coach': "Hi! What's on your mind today?",
      'financial-advisor': "Hello! Ready to work on your financial goals?",
      'doctor': "Hi there! How can I help with your health questions today?",
      'researcher': "Hello! What would you like me to research for you?",
      'executive-assistant': "Hi! How can I help you stay organized today?"
    };
    return welcomes[selectedTeam.id as keyof typeof welcomes] || "Hi! How can I help you today?";
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">
                  {selectedTeam.name.match(/^[^\s]+/)?.[0] || '🤖'}
                </span>
              </div>
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-md">
                <p className="text-sm">{getWelcomeMessage()}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className={`flex items-start space-x-4 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100'
                  }`}>
                    <span className="text-lg">
                      {message.role === 'user' 
                        ? '👤' 
                        : selectedTeam.name.match(/^[^\s]+/)?.[0] || '🤖'
                      }
                    </span>
                  </div>
                  <div className={`px-4 py-3 rounded-lg max-w-md ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">
                    {selectedTeam.name.match(/^[^\s]+/)?.[0] || '🤖'}
                  </span>
                </div>
                <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
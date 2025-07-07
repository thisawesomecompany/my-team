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
      'financial-advisor': "Hello! I'm your Financial Advisor. How can I assist you with your financial goals today?",
      'doctor': "Hi there! How can I help with your health questions today?",
      'researcher': "Hello! What would you like me to research for you?",
      'executive-assistant': "Hi! How can I help you stay organized today?",
      'mr-mean': "What do you want? Make it quick."
    };
    return welcomes[selectedTeam.id as keyof typeof welcomes] || "Hi! How can I help you today?";
  };

  const getTeamAvatar = () => {
    const avatars = {
      'life-coach': '/api/placeholder/40/40?text=W',
      'financial-advisor': '/api/placeholder/40/40?text=$',
      'doctor': '/api/placeholder/40/40?text=H',
      'researcher': '/api/placeholder/40/40?text=C',
      'executive-assistant': '/api/placeholder/40/40?text=T',
      'mr-mean': '/api/placeholder/40/40?text=M'
    };
    return avatars[selectedTeam.id as keyof typeof avatars] || '/api/placeholder/40/40?text=AI';
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <img 
                src={getTeamAvatar()} 
                alt="AI Assistant" 
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-md">
                <p className="text-sm leading-relaxed">{getWelcomeMessage()}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="mb-6">
                <div className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {message.role === 'user' ? (
                    <img 
                      src="/api/placeholder/40/40?text=You" 
                      alt="You" 
                      className="w-10 h-10 rounded-full bg-blue-500"
                    />
                  ) : (
                    <img 
                      src={getTeamAvatar()} 
                      alt="AI Assistant" 
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                  )}
                  <div className={`px-4 py-3 rounded-2xl max-w-md shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-sm'
                      : 'bg-white text-gray-900 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3 mb-6">
                <img 
                  src={getTeamAvatar()} 
                  alt="AI Assistant" 
                  className="w-10 h-10 rounded-full bg-gray-200"
                />
                <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <p className="text-sm text-gray-500">Thinking...</p>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 text-sm font-medium flex-shrink-0"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import type { Message } from '../types';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-lg',
        isUser
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-900'
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={cn(
          'text-xs mt-2',
          isUser ? 'text-blue-100' : 'text-gray-500'
        )}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
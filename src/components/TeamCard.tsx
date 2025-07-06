import type { Team } from '../types';
import { cn } from '../lib/utils';

interface TeamCardProps {
  team: Team;
  onClick: () => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    red: 'bg-red-50 border-red-200 hover:bg-red-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-6 rounded-lg border-2 cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:scale-105',
        colorClasses[team.color as keyof typeof colorClasses] || 'bg-gray-50 border-gray-200 hover:bg-gray-100'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl">
          {team.name.match(/^[^\s]+/)?.[0] || '🤖'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 text-gray-900">
            {team.name.replace(/^[^\s]+\s*/, '')}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {team.description}
          </p>
        </div>
      </div>
    </div>
  );
}
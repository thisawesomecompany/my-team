import { useEffect, useState } from 'react';
import type { Team } from '../types';
import { cn } from '../lib/utils';
import { StorageService } from '../services/storage';

interface TeamNavBarProps {
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
}

const teamConfig = {
  'life-coach': {
    name: 'Wellness',
    icon: '💚',
    color: 'green'
  },
  'financial-advisor': {
    name: 'Financial',
    icon: '$',
    color: 'blue'
  },
  'doctor': {
    name: 'Health',
    icon: '♡',
    color: 'red'
  },
  'researcher': {
    name: 'Career',
    icon: '💼',
    color: 'purple'
  },
  'executive-assistant': {
    name: 'Tech',
    icon: '💻',
    color: 'gray'
  },
  'mr-mean': {
    name: 'Mean',
    icon: '😈',
    color: 'red'
  }
} as const;

export function TeamNavBar({ teams, selectedTeam, onTeamSelect }: TeamNavBarProps) {
  const [teamsWithHistory, setTeamsWithHistory] = useState<string[]>([]);
  const storageService = StorageService.getInstance();

  useEffect(() => {
    const updateHistory = () => {
      setTeamsWithHistory(storageService.getTeamsWithHistory());
    };
    
    updateHistory();
    
    // Update when selectedTeam changes (after new messages are added)
    const timer = setTimeout(updateHistory, 100);
    return () => clearTimeout(timer);
  }, [selectedTeam, storageService]);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex space-x-0">
          {teams.map((team) => {
            const isSelected = selectedTeam?.id === team.id;
            const hasHistory = teamsWithHistory.includes(team.id);
            const config = teamConfig[team.id as keyof typeof teamConfig];
            const displayName = config?.name || team.name;
            const icon = config?.icon || '🤖';
            
            return (
              <button
                key={team.id}
                onClick={() => onTeamSelect(team)}
                className={cn(
                  'flex flex-col items-center py-4 px-6 transition-all duration-200 relative',
                  'hover:bg-gray-50',
                  isSelected ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-lg mb-2 transition-all duration-200',
                  isSelected 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-500'
                )}>
                  {icon}
                </div>
                <div className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                )}>
                  {displayName}
                </div>
                {hasHistory && !isSelected && (
                  <div className="absolute top-2 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                )}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
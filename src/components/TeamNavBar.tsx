import { useEffect, useState } from 'react';
import type { Team } from '../types';
import { cn } from '../lib/utils';
import { StorageService } from '../services/storage';

interface TeamNavBarProps {
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
}

const teamIcons = {
  'life-coach': '👨‍💼',
  'financial-advisor': '💰',
  'doctor': '⚕️',
  'researcher': '🔍',
  'executive-assistant': '👩‍💼'
} as const;

const teamNames = {
  'life-coach': 'Life Coach',
  'financial-advisor': 'Financial Advisor', 
  'doctor': 'Doctor',
  'researcher': 'Researcher',
  'executive-assistant': 'Executive'
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
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Team</h1>
        
        <div className="flex space-x-8">
          {teams.map((team) => {
            const isSelected = selectedTeam?.id === team.id;
            const hasHistory = teamsWithHistory.includes(team.id);
            const icon = teamIcons[team.id as keyof typeof teamIcons] || '🤖';
            const name = teamNames[team.id as keyof typeof teamNames] || team.name;
            
            return (
              <button
                key={team.id}
                onClick={() => onTeamSelect(team)}
                className={cn(
                  'flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200',
                  'hover:bg-gray-50',
                  isSelected && 'bg-blue-50'
                )}
              >
                <div className="relative">
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200',
                    isSelected 
                      ? 'bg-blue-100 ring-2 ring-blue-300' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}>
                    {icon}
                  </div>
                  {hasHistory && !isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="text-center">
                  <div className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-blue-700' : 'text-gray-700'
                  )}>
                    {name}
                  </div>
                  {isSelected && (
                    <div className="w-12 h-0.5 bg-blue-500 mt-1 mx-auto rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
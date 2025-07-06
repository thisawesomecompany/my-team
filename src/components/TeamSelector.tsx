import type { Team } from '../types';
import { TeamCard } from './TeamCard';

interface TeamSelectorProps {
  teams: Team[];
  onTeamSelect: (team: Team) => void;
}

export function TeamSelector({ teams, onTeamSelect }: TeamSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Team
          </h1>
          <p className="text-xl text-gray-600">
            Choose your AI assistant for personalized help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => onTeamSelect(team)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            + Create Custom Team
          </button>
        </div>
      </div>
    </div>
  );
}
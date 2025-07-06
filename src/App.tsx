import { useState } from 'react';
import type { Team } from './types';
import { BUILT_IN_TEAMS } from './data/teams';
import { TeamNavBar } from './components/TeamNavBar';
import { ContextSidebar } from './components/ContextSidebar';
import { NewChatInterface } from './components/NewChatInterface';

function App() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TeamNavBar 
        teams={BUILT_IN_TEAMS} 
        selectedTeam={selectedTeam}
        onTeamSelect={handleTeamSelect} 
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ContextSidebar selectedTeam={selectedTeam} />
        <NewChatInterface selectedTeam={selectedTeam} />
      </div>
    </div>
  );
}

export default App

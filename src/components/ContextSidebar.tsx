import type { Team } from '../types';

interface ContextSidebarProps {
  selectedTeam: Team | null;
}

export function ContextSidebar({ selectedTeam }: ContextSidebarProps) {
  if (!selectedTeam) {
    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
        <div className="text-center text-gray-500 mt-8">
          Select a team to get started
        </div>
      </div>
    );
  }

  // Mock data for demonstration - in real app this would come from localStorage/state
  const contextData = {
    'life-coach': {
      recentMemory: [
        'Age: 31',
        'Goal: improve work-life balance',
        'Recent focus: time management',
        'Challenge: prioritizing tasks'
      ]
    },
    'financial-advisor': {
      recentMemory: [
        'Monthly income: $5,000',
        'Goal: save for house down payment',
        'Risk tolerance: moderate',
        'Timeline: 2-3 years'
      ]
    },
    'doctor': {
      recentMemory: [
        'Age: 31',
        'Recent concern: sleep quality',
        'Exercise: 3x per week',
        'Last checkup: 6 months ago'
      ]
    },
    'researcher': {
      recentMemory: [
        'Current project: market analysis',
        'Interest: AI trends',
        'Deadline: next month',
        'Progress: 60% complete'
      ]
    },
    'executive-assistant': {
      recentMemory: [
        'Daily meetings: 4-6',
        'Priority: project deadlines',
        'Tools: calendar, task list',
        'Challenge: email overload'
      ]
    }
  };

  const memory = contextData[selectedTeam.id as keyof typeof contextData] || { recentMemory: [] };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-xl">
            {selectedTeam.name.match(/^[^\s]+/)?.[0] || '🤖'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            Jordan - {selectedTeam.name.replace(/^[^\s]+\s*/, '')}
          </h3>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent memory</h4>
        <div className="space-y-2">
          {memory.recentMemory.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
          <span>📅</span>
          <span>Set Reminder</span>
        </button>
        
        <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
          <span>🎯</span>
          <span>Add To Goal</span>
        </button>
      </div>
    </div>
  );
}
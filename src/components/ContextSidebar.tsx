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
    <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl">
            {selectedTeam.name.match(/^[^\s]+/)?.[0] || '🤖'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-base">
            {selectedTeam.name.replace(/^[^\s]+\s*/, '')} Assistant
          </h3>
          <p className="text-sm text-gray-500">AI Advisor</p>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Recent memory</h4>
        <div className="space-y-3">
          {memory.recentMemory.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Set Reminder</span>
        </button>
        
        <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Add To Goal</span>
        </button>
      </div>
    </div>
  );
}
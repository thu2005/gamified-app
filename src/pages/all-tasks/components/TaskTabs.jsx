import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskTabs = ({ activeTab, onTabChange, taskCounts }) => {
  const tabs = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: 'List',
      count: taskCounts?.all
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: 'Clock',
      count: taskCounts?.pending
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: 'CheckCircle',
      count: taskCounts?.completed
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-1 mb-6">
      <div className="flex space-x-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-md nav-transition flex-1 justify-center ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-card-foreground hover:bg-muted'
            }`}
          >
            <Icon 
              name={tab?.icon} 
              size={18} 
              color={activeTab === tab?.id ? 'white' : 'var(--color-muted-foreground)'} 
            />
            <span className="font-medium">{tab?.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activeTab === tab?.id
                ? 'bg-primary-foreground text-primary'
                : 'bg-muted text-muted-foreground'
            }`}>
              {tab?.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskTabs;
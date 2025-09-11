import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressStats = ({ stats }) => {
  const statCards = [
    {
      icon: 'Target',
      label: 'Tasks Completed',
      value: stats?.tasksCompleted,
      color: 'var(--color-success)',
      bgColor: 'bg-green-50'
    },
    {
      icon: 'Flame',
      label: 'Current Streak',
      value: `${stats?.currentStreak} days`,
      color: 'var(--color-warning)',
      bgColor: 'bg-orange-50'
    },
    {
      icon: 'Trophy',
      label: 'Best Streak',
      value: `${stats?.bestStreak} days`,
      color: 'var(--color-secondary)',
      bgColor: 'bg-blue-50'
    },
    {
      icon: 'Calendar',
      label: 'Days Active',
      value: stats?.daysActive,
      color: 'var(--color-primary)',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards?.map((stat, index) => (
        <div key={index} className={`${stat?.bgColor} rounded-xl p-4 border border-border`}>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon name={stat?.icon} size={24} color={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">
                {stat?.label}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {stat?.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressStats;
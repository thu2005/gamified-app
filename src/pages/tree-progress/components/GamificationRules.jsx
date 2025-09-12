import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GamificationRules = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const rules = [
    {
      icon: 'CheckCircle',
      title: 'Complete Tasks',
      description: 'Finish 1 task (or 2 subtasks) to earn 1 water drop',
      color: 'var(--color-success)'
    },
    {
      icon: 'Droplets',
      title: 'Water Your Tree',
      description: 'Save up 10 drops to water your tree and watch it grow',
      color: 'var(--color-primary)'
    },
    {
      icon: 'TrendingUp',
      title: 'Tree Growth',
      description: 'Each watering adds 10 health and unlocks new stages for your tree',
      color: 'var(--color-success)'
    },
    {
      icon: 'Flame',
      title: 'Maintain Streaks',
      description: 'Complete tasks every day to keep your streak. With streaks, every watering gets a bonus: + (streak × 10%) health',
      color: 'var(--color-warning)'
    },
    {
      icon: 'AlertTriangle',
      title: 'Avoid Missed Deadlines',
      description: 'Missing a deadline reduces 20 health and breaks your streak, even if you finished other tasks',
      color: 'var(--color-error)'
    },
    {
      icon: 'Skull',
      title: 'Tree Revival',
      description: '5 missed deadlines within 5 days will kill your tree (regardless of how many other tasks you complete). Revive it by completing 10 new tasks (starts again at 0 health)',
      color: 'var(--color-destructive)'
    }
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Icon name="BookOpen" size={20} color="var(--color-foreground)" />
          <h3 className="text-lg font-semibold text-foreground">How It Works</h3>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          color="var(--color-muted-foreground)" 
        />
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {rules?.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={rule?.icon} size={18} color={rule?.color} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {rule?.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rule?.description}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} color="var(--color-primary)" className="mt-0.5" />
              <div>
                <p className="text-xs font-medium text-primary mb-1">Pro Tip</p>
                <p className="text-xs text-muted-foreground">
                  Set realistic deadlines and break large tasks into smaller subtasks to maintain consistent progress and keep your tree healthy!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationRules;
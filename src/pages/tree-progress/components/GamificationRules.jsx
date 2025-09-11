import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GamificationRules = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const rules = [
    {
      icon: 'CheckCircle',
      title: 'Complete Tasks',
      description: 'Each completed task earns you 1 water drop',
      color: 'var(--color-success)'
    },
    {
      icon: 'Droplets',
      title: 'Water Your Tree',
      description: 'Collect 10 water drops to water your tree and help it grow',
      color: 'var(--color-primary)'
    },
    {
      icon: 'TrendingUp',
      title: 'Tree Growth',
      description: 'Regular watering increases tree health and unlocks new stages',
      color: 'var(--color-success)'
    },
    {
      icon: 'Flame',
      title: 'Maintain Streaks',
      description: 'Complete tasks daily to maintain your streak and boost growth',
      color: 'var(--color-warning)'
    },
    {
      icon: 'AlertTriangle',
      title: 'Avoid Missed Deadlines',
      description: 'Missing deadlines reduces tree health and breaks streaks',
      color: 'var(--color-error)'
    },
    {
      icon: 'Skull',
      title: 'Tree Revival',
      description: '5 missed deadlines kills your tree. Complete 10 tasks to revive it',
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
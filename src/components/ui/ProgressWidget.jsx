import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ProgressWidget = ({ isCollapsed = false, className = '' }) => {
  const [treeHealth, setTreeHealth] = useState(85);
  const [todayTasks, setTodayTasks] = useState({ completed: 7, total: 10 });
  const [streak, setStreak] = useState(12);
  const [showAnimation, setShowAnimation] = useState(false);

  // Simulate task completion animation
  const triggerGrowthAnimation = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 500);
  };

  useEffect(() => {
    // Listen for task completion events
    const handleTaskComplete = () => {
      triggerGrowthAnimation();
      setTreeHealth(prev => Math.min(100, prev + 2));
    };

    window.addEventListener('taskCompleted', handleTaskComplete);
    return () => window.removeEventListener('taskCompleted', handleTaskComplete);
  }, []);

  const getTreeIcon = () => {
    if (treeHealth >= 80) return 'TreePine';
    if (treeHealth >= 60) return 'Trees';
    if (treeHealth >= 40) return 'Leaf';
    return 'Sprout';
  };

  const getTreeColor = () => {
    if (treeHealth >= 80) return 'var(--color-success)';
    if (treeHealth >= 60) return 'var(--color-primary)';
    if (treeHealth >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  if (isCollapsed) {
    return (
      <div className={`flex items-center justify-center p-3 ${className}`}>
        <div className={`relative ${showAnimation ? 'tree-animation animate-tree-grow' : ''}`}>
          <Icon 
            name={getTreeIcon()} 
            size={24} 
            color={getTreeColor()} 
          />
          {showAnimation && (
            <div className="absolute -top-2 -right-2 animate-water-drop">
              <Icon name="Droplets" size={12} color="var(--color-primary)" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg p-4 space-y-4 ${className}`}>
      {/* Tree Visualization */}
      <div className="text-center">
        <div className={`relative inline-block ${showAnimation ? 'tree-animation animate-tree-grow' : ''}`}>
          <Icon 
            name={getTreeIcon()} 
            size={48} 
            color={getTreeColor()} 
          />
          {showAnimation && (
            <div className="absolute -top-3 -right-3 animate-water-drop">
              <Icon name="Droplets" size={16} color="var(--color-primary)" />
            </div>
          )}
        </div>
        <div className="mt-2">
          <div className="text-sm font-medium text-muted-foreground">Tree Health</div>
          <div className="text-2xl font-semibold text-foreground">{treeHealth}%</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Today's Progress</span>
          <span className="font-medium text-foreground">
            {todayTasks?.completed}/{todayTasks?.total}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full progress-transition"
            style={{ width: `${(todayTasks?.completed / todayTasks?.total) * 100}%` }}
          />
        </div>
      </div>
      {/* Streak Counter */}
      <div className="flex items-center justify-between p-3 bg-background rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Flame" size={16} color="var(--color-warning)" />
          <span className="text-sm font-medium text-foreground">Streak</span>
        </div>
        <span className="text-lg font-semibold text-warning">{streak} days</span>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-2 bg-background rounded-lg">
          <div className="text-lg font-semibold text-success">
            {Math.round((todayTasks?.completed / todayTasks?.total) * 100)}%
          </div>
          <div className="text-xs text-muted-foreground">Completion</div>
        </div>
        <div className="p-2 bg-background rounded-lg">
          <div className="text-lg font-semibold text-primary">
            {todayTasks?.total - todayTasks?.completed}
          </div>
          <div className="text-xs text-muted-foreground">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;
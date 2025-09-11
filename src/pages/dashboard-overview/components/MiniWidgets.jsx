import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const MiniWidgets = () => {
  const navigate = useNavigate();
  
  const [treeHealth, setTreeHealth] = useState(85);
  const [highestPriorityTask, setHighestPriorityTask] = useState({
    id: 1,
    title: "Complete React Assignment",
    priority: "High",
    dueTime: "23:59",
    progress: 50
  });

  // Simulate tree health changes
  useEffect(() => {
    const handleTaskComplete = () => {
      setTreeHealth(prev => Math.min(100, prev + 2));
    };

    window.addEventListener('taskCompleted', handleTaskComplete);
    return () => window.removeEventListener('taskCompleted', handleTaskComplete);
  }, []);

  const getTreeIcon = (health) => {
    if (health >= 80) return 'TreePine';
    if (health >= 60) return 'Trees';
    if (health >= 40) return 'Leaf';
    return 'Sprout';
  };

  const getTreeColor = (health) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-primary';
    if (health >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthMessage = (health) => {
    if (health >= 90) return 'Thriving';
    if (health >= 80) return 'Healthy';
    if (health >= 60) return 'Growing';
    if (health >= 40) return 'Developing';
    return 'Needs Care';
  };

  const handleTreeClick = () => {
    navigate('/tree-progress');
  };

  const handleTaskClick = () => {
    navigate(`/task-details?id=${highestPriorityTask?.id}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tree Health Widget */}
      <div 
        className="bg-card rounded-lg p-4 border border-border cursor-pointer transition-all hover:border-primary/40 hover:shadow-md"
        onClick={handleTreeClick}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Tree Health</h3>
          <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Icon
              name={getTreeIcon(treeHealth)}
              size={32}
              className={getTreeColor(treeHealth)}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xl font-bold ${getTreeColor(treeHealth)}`}>
                {treeHealth}%
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getTreeColor(treeHealth)?.replace('text-', 'bg-')?.replace('text-', 'text-')} bg-opacity-10`}>
                {getHealthMessage(treeHealth)}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getTreeColor(treeHealth)?.replace('text-', 'bg-')}`}
                style={{ width: `${treeHealth}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Click to view full progress
        </p>
      </div>
      {/* Focus Today Widget */}
      <div 
        className="bg-card rounded-lg p-4 border border-border cursor-pointer transition-all hover:border-primary/40 hover:shadow-md"
        onClick={handleTaskClick}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Focus Today</h3>
          <Icon name="Target" size={14} className="text-muted-foreground" />
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {highestPriorityTask?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Due at {highestPriorityTask?.dueTime}
              </p>
            </div>
            
            <span className={`ml-2 text-xs px-2 py-1 rounded-full border ${getPriorityColor(highestPriorityTask?.priority)}`}>
              {highestPriorityTask?.priority}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs text-muted-foreground">{highestPriorityTask?.progress}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${highestPriorityTask?.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Click to start Pomodoro
            </span>
            <Icon name="Play" size={12} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniWidgets;
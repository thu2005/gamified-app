import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import useTreeProgress from '../../../hooks/useTreeProgress';
import { useTasks } from '../../../hooks/useTasks';

const MiniWidgets = () => {
  const navigate = useNavigate();
  
  // Get real tree progress data
  const {
    treeHealth,
    treeStage,
    waterDrops,
    isDead
  } = useTreeProgress();

  // Get tasks data for Focus Today widget
  const { tasks } = useTasks();
  
  // Get highest priority incomplete task for Focus Today
  const getHighestPriorityTask = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length === 0) return null;
    
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return incompleteTasks.sort((a, b) => {
      const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    })[0];
  };

  const highestPriorityTask = getHighestPriorityTask();

  // Get tree icon based on stage from useTreeProgress
  const getTreeIcon = () => {
    if (isDead) return 'Skull';
    if (treeStage === 'Seed') return 'Dot'; // Small seed icon
    if (treeStage === 'Sprout') return 'Sprout'; // Just sprouting
    if (treeStage === 'Sapling') return 'Leaf'; // Young with leaves
    if (treeStage === 'Young Tree') return 'Trees'; // Multiple branches
    if (treeStage === 'Ancient Tree') return 'TreePine'; // Full grown tree
    return 'Dot';
  };

  const getTreeColor = (health) => {
    if (isDead) return 'text-destructive';
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-primary';
    if (health >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthMessage = (health) => {
    if (isDead) return 'Dead';
    if (health >= 90) return treeStage;
    if (health >= 80) return 'Healthy';
    if (health >= 60) return 'Growing';
    if (health >= 40) return 'Developing';
    return 'Needs Care';
  };

  const handleTreeClick = () => {
    navigate('/tree-progress');
  };

  const handleTaskClick = () => {
    if (highestPriorityTask) {
      navigate(`/task-details?id=${highestPriorityTask.id}`);
    }
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
              name={getTreeIcon()}
              size={32}
              className={getTreeColor(treeHealth)}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xl font-bold ${getTreeColor(treeHealth)}`}>
                {isDead ? '💀' : Math.round(treeHealth)}
              </span>
            </div>
            
            <div className="mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getTreeColor(treeHealth)?.replace('text-', 'bg-')?.replace('text-', 'text-')} bg-opacity-10`}>
                {getHealthMessage(treeHealth)}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getTreeColor(treeHealth)?.replace('text-', 'bg-')}`}
                style={{ width: `${isDead ? 0 : Math.min(100, (treeHealth / 100) * 100)}%` }}
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
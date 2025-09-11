import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAddTask = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const handleQuickAdd = () => {
    if (taskTitle?.trim()) {
      // Here you would normally save the task
      console.log('Quick task added:', taskTitle);
      setTaskTitle('');
      setIsExpanded(false);
      
      // Navigate to task details for full creation
      navigate(`/task-details?title=${encodeURIComponent(taskTitle?.trim())}&mode=create`);
    }
  };

  const handleFullAdd = () => {
    navigate('/task-details?mode=create');
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && taskTitle?.trim()) {
      handleQuickAdd();
    }
    if (e?.key === 'Escape') {
      setIsExpanded(false);
      setTaskTitle('');
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <Icon name="Zap" size={20} className="text-primary" />
      </div>

      <div className="space-y-4">
        {/* Quick Add Task */}
        <div className="space-y-3">
          <Button
            variant={isExpanded ? "secondary" : "default"}
            fullWidth
            onClick={() => setIsExpanded(!isExpanded)}
            iconName="Plus"
            className="justify-start"
          >
            Quick Add Task
          </Button>

          {isExpanded && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e?.target?.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="What needs to be done today?"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleQuickAdd}
                  disabled={!taskTitle?.trim()}
                  iconName="Check"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to add or Escape to cancel
              </p>
            </div>
          )}
        </div>

        {/* Full Add Task */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleFullAdd}
          iconName="FileText"
          className="justify-start"
        >
          Create Detailed Task
        </Button>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/all-tasks?filter=today')}
            iconName="Clock"
            className="flex-col h-16 space-y-1"
          >
            <span className="text-xs">View</span>
            <span className="text-xs">Today</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/all-tasks?filter=overdue')}
            iconName="AlertTriangle"
            className="flex-col h-16 space-y-1 text-destructive hover:text-destructive/80"
          >
            <span className="text-xs">Check</span>
            <span className="text-xs">Overdue</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tree-progress')}
            iconName="TreePine"
            className="flex-col h-16 space-y-1 text-success hover:text-success/80"
          >
            <span className="text-xs">Tree</span>
            <span className="text-xs">Progress</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/all-tasks?sortBy=priority')}
            iconName="Star"
            className="flex-col h-16 space-y-1 text-warning hover:text-warning/80"
          >
            <span className="text-xs">High</span>
            <span className="text-xs">Priority</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddTask;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TodayTasks = () => {
  const navigate = useNavigate();
  
  const [todayTasks, setTodayTasks] = useState([
    {
      id: 1,
      title: "Complete React Assignment",
      priority: "High",
      completed: false,
      dueTime: "23:59"
    },
    {
      id: 2,
      title: "Group Project Meeting",
      priority: "Medium",
      completed: false,
      dueTime: "14:00"
    },
    {
      id: 3,
      title: "Morning Workout",
      priority: "Low",
      completed: true,
      dueTime: "07:00"
    },
    {
      id: 5,
      title: "Attend Physics Lecture",
      priority: "Medium",
      completed: false,
      dueTime: "10:00"
    },
    {
      id: 8,
      title: "Grocery Shopping",
      priority: "Medium",
      completed: true,
      dueTime: "16:00"
    }
  ]);

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { icon: 'AlertTriangle', color: 'text-destructive' };
      case 'medium':
        return { icon: 'AlertCircle', color: 'text-warning' };
      case 'low':
        return { icon: 'Info', color: 'text-success' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const handleTaskComplete = (taskId, completed) => {
    setTodayTasks(prev => prev?.map(task =>
      task?.id === taskId ? { ...task, completed } : task
    ));
    
    // Trigger tree growth animation if task completed
    if (completed) {
      window.dispatchEvent(new CustomEvent('taskCompleted'));
    }
  };

  const handleViewAll = () => {
    navigate('/all-tasks');
  };

  // Sort tasks: incomplete first, then by time
  const sortedTasks = [...todayTasks]?.sort((a, b) => {
    if (a?.completed !== b?.completed) {
      return a?.completed ? 1 : -1;
    }
    return a?.dueTime?.localeCompare(b?.dueTime);
  });

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Today's Tasks</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAll}
          className="text-primary hover:text-primary/80"
        >
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {sortedTasks?.slice(0, 5)?.map((task) => {
          const priorityConfig = getPriorityIcon(task?.priority);
          
          return (
            <div
              key={task?.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                task?.completed
                  ? 'bg-muted/30 opacity-60' :'bg-muted/10 hover:bg-muted/20'
              }`}
            >
              <Checkbox
                checked={task?.completed}
                onChange={(e) => handleTaskComplete(task?.id, e?.target?.checked)}
                className="flex-shrink-0"
              />
              
              <Icon
                name={priorityConfig?.icon}
                size={16}
                className={`flex-shrink-0 ${priorityConfig?.color}`}
              />
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  task?.completed 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground'
                }`}>
                  {task?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Due at {task?.dueTime}
                </p>
              </div>
              
              <div className={`text-xs px-2 py-1 rounded-full ${
                task?.priority?.toLowerCase() === 'high' ?'bg-destructive/10 text-destructive'
                  : task?.priority?.toLowerCase() === 'medium' ?'bg-warning/10 text-warning' :'bg-success/10 text-success'
              }`}>
                {task?.priority}
              </div>
            </div>
          );
        })}
      </div>

      {todayTasks?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No tasks due today. Great job staying ahead!
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayTasks;
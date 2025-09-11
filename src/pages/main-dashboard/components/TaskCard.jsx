import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-error border-error bg-red-50';
      case 'Medium': return 'text-warning border-warning bg-yellow-50';
      case 'Low': return 'text-success border-success bg-green-50';
      default: return 'text-muted-foreground border-border bg-muted';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Study': 'bg-blue-100 text-blue-800',
      'Group Project': 'bg-purple-100 text-purple-800',
      'Class': 'bg-green-100 text-green-800',
      'Work/Part-time': 'bg-orange-100 text-orange-800',
      'Health': 'bg-pink-100 text-pink-800',
      'Personal/Social': 'bg-indigo-100 text-indigo-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  const getTimeUntilDeadline = () => {
    const now = new Date();
    const deadline = new Date(task.dueDate);
    const diffInHours = Math.ceil((deadline - now) / (1000 * 60 * 60));
    
    if (diffInHours < 0) return { text: 'Overdue', urgent: true };
    if (diffInHours < 2) return { text: `${diffInHours}h left`, urgent: true };
    if (diffInHours < 24) return { text: `${diffInHours}h left`, urgent: false };
    
    const diffInDays = Math.ceil(diffInHours / 24);
    return { text: `${diffInDays}d left`, urgent: false };
  };

  const timeInfo = getTimeUntilDeadline();

  return (
    <div 
      className={`relative bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
        task?.completed ? 'opacity-75' : ''
      } ${timeInfo?.urgent && !task?.completed ? 'animate-pulse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Fire animation for urgent tasks */}
      {timeInfo?.urgent && !task?.completed && (
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Icon name="Flame" size={20} color="var(--color-error)" />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task?.id)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              task?.completed 
                ? 'bg-primary border-primary' :'border-border hover:border-primary'
            }`}
          >
            {task?.completed && (
              <Icon name="Check" size={14} color="white" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-foreground ${
              task?.completed ? 'line-through text-muted-foreground' : ''
            }`}>
              {task?.title}
            </h3>
            {task?.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task?.description}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Icon name="Edit2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task?.id)}
              className="h-8 w-8 text-error hover:text-error"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        )}
      </div>
      {/* Task metadata */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task?.priority)}`}>
            {task?.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task?.category)}`}>
            {task?.category}
          </span>
        </div>
        
        <div className={`text-xs font-medium ${timeInfo?.urgent ? 'text-error' : 'text-muted-foreground'}`}>
          {timeInfo?.text}
        </div>
      </div>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{task?.progress}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${task?.progress}%` }}
          />
        </div>
      </div>
      {/* Subtasks indicator */}
      {task?.subtasks && task?.subtasks?.length > 0 && (
        <div className="flex items-center space-x-2 mt-3 text-sm text-muted-foreground">
          <Icon name="List" size={14} />
          <span>
            {task?.subtasks?.filter(st => st?.completed)?.length}/{task?.subtasks?.length} subtasks
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
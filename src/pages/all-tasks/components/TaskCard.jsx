import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({ task, onStatusChange, onDelete, onEdit, onSubtaskToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-error text-error-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Study': 'bg-primary text-primary-foreground',
      'Group Project': 'bg-secondary text-secondary-foreground',
      'Class': 'bg-accent text-accent-foreground',
      'Work/Part-time': 'bg-warning text-warning-foreground',
      'Health': 'bg-success text-success-foreground',
      'Personal/Social': 'bg-muted text-muted-foreground'
    };
    return colors?.[category] || 'bg-muted text-muted-foreground';
  };

  const getDeadlineStatus = (dueDate) => {
    if (!dueDate) return { status: 'none', color: 'text-muted-foreground' };
    
    const now = new Date();
    const deadline = new Date(dueDate);
    
    // Check if date is invalid
    if (isNaN(deadline.getTime())) return { status: 'invalid', color: 'text-muted-foreground' };
    
    const diffHours = (deadline - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { status: 'overdue', color: 'text-error' };
    if (diffHours < 24) return { status: 'urgent', color: 'text-warning' };
    if (diffHours < 72) return { status: 'approaching', color: 'text-warning' };
    return { status: 'normal', color: 'text-muted-foreground' };
  };

  const formatDeadline = (dueDate) => {
    if (!dueDate) return 'No due date';
    
    const date = new Date(dueDate);
    
    // Check if date is invalid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const deadlineInfo = getDeadlineStatus(task?.dueDate);
  const completedSubtasks = task?.subtasks?.filter(sub => sub?.completed)?.length || 0;
  const totalSubtasks = task?.subtasks?.length || 0;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : task?.completed ? 100 : 0;

  const handleStatusToggle = () => {
    onStatusChange(task?.id, !task?.completed);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover-scale soft-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
              {task?.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task?.category)}`}>
              {task?.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">{task?.title}</h3>
          {task?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{task?.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {deadlineInfo?.status === 'urgent' && (
            <div className="animate-pulse">
              <Icon name="Flame" size={16} color="var(--color-warning)" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-card-foreground">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full progress-transition"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {totalSubtasks > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            {completedSubtasks}/{totalSubtasks} subtasks completed
          </div>
        )}
      </div>
      {/* Deadline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={14} color="var(--color-muted-foreground)" />
          <span className={`text-sm ${deadlineInfo?.color}`}>
            {formatDeadline(task?.dueDate)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(task.dueDate)?.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border pt-3 space-y-3">
          {/* Subtasks */}
          {task?.subtasks && task?.subtasks?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Subtasks</h4>
              <div className="space-y-2">
                {task?.subtasks?.map((subtask) => (
                  <div 
                    key={subtask?.id} 
                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                    onClick={() => onSubtaskToggle && onSubtaskToggle(task.id, subtask.id)}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      subtask?.completed ? 'bg-primary border-primary' : 'border-border hover:border-primary/50'
                    }`}>
                      {subtask?.completed && (
                        <Icon name="Check" size={12} color="white" />
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${
                      subtask?.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
                    }`}>
                      {subtask?.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant={task?.completed ? "success" : "outline"}
                size="sm"
                onClick={handleStatusToggle}
                iconName={task?.completed ? "CheckCircle" : "Circle"}
                iconPosition="left"
              >
                {task?.completed ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to={`/task-details?id=${task?.id}`}>
                <Button variant="ghost" size="sm" iconName="Eye">
                  View
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                iconName="Edit"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task?.id)}
                iconName="Trash2"
                className="text-error hover:text-error"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
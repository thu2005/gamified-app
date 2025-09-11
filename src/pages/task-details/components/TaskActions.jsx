import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskActions = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleComplete = () => {
    const updatedTask = { ...task, completed: !task?.completed };
    onTaskUpdate(updatedTask);
    
    // Trigger water drop animation for completion
    if (!task?.completed) {
      window.dispatchEvent(new CustomEvent('taskCompleted'));
    }
  };

  const handleDuplicate = () => {
    const duplicatedTask = {
      ...task,
      id: Date.now(),
      title: `${task?.title} (Copy)`,
      completed: false,
      createdAt: new Date()?.toISOString(),
      subtasks: task?.subtasks?.map(subtask => ({
        ...subtask,
        id: Date.now() + Math.random(),
        completed: false
      })) || []
    };
    onTaskUpdate(duplicatedTask);
  };

  const handleDelete = () => {
    onTaskDelete(task?.id);
    setShowDeleteConfirm(false);
  };

  const getTimeUntilDeadline = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diffMs = deadline - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) {
      return { text: 'Overdue', status: 'overdue', color: 'text-error' };
    } else if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return { text: `${diffMins} minutes left`, status: 'critical', color: 'text-error' };
    } else if (diffHours < 24) {
      return { text: `${diffHours} hours left`, status: 'urgent', color: 'text-warning' };
    } else if (diffDays < 7) {
      return { text: `${diffDays} days left`, status: 'soon', color: 'text-primary' };
    } else {
      return { text: `${diffDays} days left`, status: 'normal', color: 'text-muted-foreground' };
    }
  };

  const timeInfo = getTimeUntilDeadline();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Task Actions</h2>
      {/* Completion Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon 
              name={task?.completed ? "CheckCircle2" : "Circle"} 
              size={24} 
              color={task?.completed ? "var(--color-success)" : "var(--color-muted-foreground)"} 
            />
            <div>
              <div className="font-medium text-foreground">
                {task?.completed ? 'Task Completed' : 'Mark as Complete'}
              </div>
              <div className="text-sm text-muted-foreground">
                {task?.completed 
                  ? 'Great job! This task is finished.' :'Click to mark this task as completed'
                }
              </div>
            </div>
          </div>
          <Button
            variant={task?.completed ? "outline" : "default"}
            onClick={handleToggleComplete}
            iconName={task?.completed ? "RotateCcw" : "Check"}
          >
            {task?.completed ? 'Reopen' : 'Complete'}
          </Button>
        </div>
      </div>
      {/* Deadline Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon 
              name={timeInfo?.status === 'overdue' ? "Flame" : "Clock"} 
              size={20} 
              color={
                timeInfo?.status === 'overdue' ? 'var(--color-error)' :
                timeInfo?.status === 'critical' ? 'var(--color-error)' :
                timeInfo?.status === 'urgent' ? 'var(--color-warning)' :
                'var(--color-muted-foreground)'
              }
            />
            <div>
              <div className="font-medium text-foreground">Deadline Status</div>
              <div className={`text-sm ${timeInfo?.color}`}>
                {timeInfo?.text}
              </div>
            </div>
          </div>
          {timeInfo?.status === 'overdue' && (
            <div className="animate-pulse">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={handleDuplicate}
          iconName="Copy"
          iconPosition="left"
          fullWidth
        >
          Duplicate Task
        </Button>

        <Button
          variant="outline"
          onClick={() => window.print()}
          iconName="Printer"
          iconPosition="left"
          fullWidth
        >
          Print Task Details
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            const taskData = {
              title: task?.title,
              description: task?.description,
              deadline: new Date(task.deadline)?.toLocaleString(),
              priority: task?.priority,
              category: task?.category
            };
            navigator.clipboard?.writeText(JSON.stringify(taskData, null, 2));
          }}
          iconName="Share"
          iconPosition="left"
          fullWidth
        >
          Share Task
        </Button>

        <div className="pt-3 border-t border-border">
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              iconName="Trash2"
              iconPosition="left"
              fullWidth
            >
              Delete Task
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  fullWidth
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Task Statistics */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-medium text-foreground mb-3">Task Statistics</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-primary">
              {task?.subtasks?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Subtasks</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-success">
              {task?.subtasks?.filter(s => s?.completed)?.length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskActions;
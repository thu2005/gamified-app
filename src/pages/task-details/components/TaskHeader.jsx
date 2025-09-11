import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskHeader = ({ task, onTaskUpdate, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const categoryOptions = [
    { value: 'study', label: 'Study' },
    { value: 'group-project', label: 'Group Project' },
    { value: 'class', label: 'Class' },
    { value: 'work', label: 'Work/Part-time' },
    { value: 'health', label: 'Health' },
    { value: 'personal', label: 'Personal/Social' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-muted border-border';
    }
  };

  const handleSave = () => {
    onTaskUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffHours = (date - now) / (1000 * 60 * 60);
    
    const dateStr = date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (diffHours < 0) {
      return { text: `${dateStr} at ${timeStr}`, status: 'overdue' };
    } else if (diffHours < 24) {
      return { text: `Today at ${timeStr}`, status: 'urgent' };
    } else if (diffHours < 48) {
      return { text: `Tomorrow at ${timeStr}`, status: 'soon' };
    } else {
      return { text: `${dateStr} at ${timeStr}`, status: 'normal' };
    }
  };

  const deadlineInfo = formatDeadline(task?.deadline);

  return (
    <div className={`bg-card rounded-lg border ${getPriorityBg(task?.priority)} p-6 mb-6`}>
      <div className="flex items-start justify-between mb-4">
        <Button
          variant="ghost"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
          className="mb-2"
        >
          Back to Tasks
        </Button>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Task
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                iconName="X"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                iconName="Check"
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{task?.title}</h1>
            {task?.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">{task?.description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="Flag" size={16} color="currentColor" />
              <span className={`font-medium ${getPriorityColor(task?.priority)}`}>
                {task?.priority?.charAt(0)?.toUpperCase() + task?.priority?.slice(1)} Priority
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Icon name="Tag" size={16} color="var(--color-muted-foreground)" />
              <span className="text-muted-foreground font-medium">
                {categoryOptions?.find(cat => cat?.value === task?.category)?.label || task?.category}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Icon 
                name={deadlineInfo?.status === 'overdue' ? 'Flame' : 'Clock'} 
                size={16} 
                color={
                  deadlineInfo?.status === 'overdue' ? 'var(--color-error)' :
                  deadlineInfo?.status === 'urgent' ? 'var(--color-warning)' :
                  'var(--color-muted-foreground)'
                }
              />
              <span className={`font-medium ${
                deadlineInfo?.status === 'overdue' ? 'text-error' :
                deadlineInfo?.status === 'urgent'? 'text-warning' : 'text-muted-foreground'
              }`}>
                {deadlineInfo?.text}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Task Title"
            type="text"
            value={editedTask?.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e?.target?.value })}
            placeholder="Enter task title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              value={editedTask?.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e?.target?.value })}
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority Level"
              options={priorityOptions}
              value={editedTask?.priority}
              onChange={(value) => setEditedTask({ ...editedTask, priority: value })}
            />

            <Select
              label="Category"
              options={categoryOptions}
              value={editedTask?.category}
              onChange={(value) => setEditedTask({ ...editedTask, category: value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={editedTask?.deadline?.split('T')?.[0]}
              onChange={(e) => {
                const currentTime = editedTask?.deadline?.split('T')?.[1] || '23:59';
                setEditedTask({ ...editedTask, deadline: `${e?.target?.value}T${currentTime}` });
              }}
              required
            />

            <Input
              label="Due Time"
              type="time"
              value={editedTask?.deadline?.split('T')?.[1]?.substring(0, 5) || '23:59'}
              onChange={(e) => {
                const currentDate = editedTask?.deadline?.split('T')?.[0];
                setEditedTask({ ...editedTask, deadline: `${currentDate}T${e?.target?.value}` });
              }}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskHeader;
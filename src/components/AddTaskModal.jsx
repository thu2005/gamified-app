import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    category: 'Study',
    dueDate: '',
    dueTime: '',
    subtasks: []
  });

  const [newSubtask, setNewSubtask] = useState('');

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority', color: 'bg-success' },
    { value: 'Medium', label: 'Medium Priority', color: 'bg-warning' },
    { value: 'High', label: 'High Priority', color: 'bg-error' }
  ];

  const categoryOptions = [
    { value: 'Study', label: 'Study' },
    { value: 'Group Project', label: 'Group Project' },
    { value: 'Class', label: 'Class' },
    { value: 'Work/Part-time', label: 'Work/Part-time' },
    { value: 'Health', label: 'Health' },
    { value: 'Personal/Social', label: 'Personal/Social' }
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'Low',
        category: 'Study',
        dueDate: '',
        dueTime: '',
        subtasks: []
      });
      setNewSubtask('');
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now().toString(),
          title: newSubtask.trim(),
          completed: false
        }]
      }));
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl mx-4">
        {/* Header with gradient background */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={18} className="text-primary-foreground" />
              </div>
              Create New Task
            </h2>
            <p className="text-muted-foreground mt-1">Add a new task to your to-do list</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-primary/10"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icon name="Edit3" size={16} className="text-primary" />
              Task Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary"
              required
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Icon name="FileText" size={16} className="text-primary" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter task description (optional)..."
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary resize-none"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            {/* Due Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Time</label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleInputChange('dueTime', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={!formData.dueDate}
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Icon name="List" size={16} className="text-primary" />
                Subtasks
              </label>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                {formData.subtasks.length} subtask{formData.subtasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Add Subtask Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
                className="hover:bg-primary hover:text-primary-foreground border-primary/20"
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>

            {/* Subtasks List */}
            {formData.subtasks.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-lg"
                  >
                    <div className="w-4 h-4 rounded border border-input bg-background" />
                    <span className="flex-1 text-sm text-foreground">
                      {subtask.title}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => handleRemoveSubtask(subtask.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-error"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!formData.title.trim()}
              iconName="Plus"
              iconPosition="left"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;

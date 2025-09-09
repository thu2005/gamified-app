import { useState, useEffect } from 'react';
import type { Task } from '../types/Task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task;
  onCancel?: () => void;
}

export const TaskForm = ({ onSubmit, editingTask, onCancel }: TaskFormProps) => {
  // Helper function to extract date and time from ISO string
  const getDateTimeFromISO = (isoString?: string) => {
    if (!isoString) return { date: '', time: '' };
    const date = new Date(isoString);
    return {
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      time: date.toTimeString().slice(0, 5)   // HH:MM
    };
  };

  const { date: initialDate, time: initialTime } = getDateTimeFromISO(editingTask?.dueDate);

  const [formData, setFormData] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    priority: editingTask?.priority || 'medium' as const,
    category: editingTask?.category || '',
    dueDate: initialDate,
    dueTime: initialTime
  });

  // Force English locale for date/time inputs
  useEffect(() => {
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    const timeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
    
    if (dateInput) {
      dateInput.setAttribute('lang', 'en-US');
    }
    if (timeInput) {
      timeInput.setAttribute('lang', 'en-US');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    // Combine date and time into ISO string
    let combinedDateTime: string | undefined;
    if (formData.dueDate) {
      if (formData.dueTime) {
        combinedDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
      } else {
        // Default to end of day if no time specified
        combinedDateTime = new Date(`${formData.dueDate}T23:59`).toISOString();
      }
    }

    onSubmit({
      ...formData,
      completed: editingTask?.completed || false,
      dueDate: combinedDateTime
    });

    // Reset form if not editing
    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: '',
        dueTime: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Task title *"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              priority: e.target.value as 'low' | 'medium' | 'high'
            }))}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="due-date">Due Date:</label>
          <input
            id="due-date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            lang="en-US"
            data-locale="en-US"
          />
        </div>

        <div className="form-group">
          <label htmlFor="due-time">Due Time:</label>
          <input
            id="due-time"
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
            lang="en-US"
            data-locale="en-US"
            disabled={!formData.dueDate}
            placeholder={formData.dueDate ? "Select time" : "Select date first"}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        
        {editingTask && onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

import { useState } from 'react';
import type { Task } from '../types/Task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task;
  onCancel?: () => void;
}

export const TaskForm = ({ onSubmit, editingTask, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    priority: editingTask?.priority || 'medium' as const,
    category: editingTask?.category || '',
    dueDate: editingTask?.dueDate?.split('T')[0] || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      completed: editingTask?.completed || false,
      dueDate: formData.dueDate || undefined
    });

    // Reset form if not editing
    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: ''
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
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
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

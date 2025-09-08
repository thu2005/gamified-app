import type { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa726';
      case 'low': return '#26a69a';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
          </div>
          
          <div className="task-info">
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
        </div>

        <div className="task-meta">
          <div className="task-details">
            <span 
              className="task-priority"
              style={{ color: getPriorityColor(task.priority) }}
            >
              {task.priority.toUpperCase()}
            </span>
            
            {task.category && (
              <span className="task-category">{task.category}</span>
            )}
            
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                Due: {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          <div className="task-actions">
            <button 
              onClick={() => onEdit(task)}
              className="btn-edit"
              title="Edit task"
            >
              ✏️
            </button>
            
            <button 
              onClick={() => onDelete(task.id)}
              className="btn-delete"
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

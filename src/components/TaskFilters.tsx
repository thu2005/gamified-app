import type { TaskFilter, TaskSort } from '../types/Task';

interface TaskFiltersProps {
  filter: TaskFilter;
  sortBy: TaskSort;
  onFilterChange: (filter: TaskFilter) => void;
  onSortChange: (sort: TaskSort) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    completionRate: number;
  };
}

export const TaskFilters = ({ 
  filter, 
  sortBy, 
  onFilterChange, 
  onSortChange, 
  stats 
}: TaskFiltersProps) => {
  return (
    <div className="task-filters">
      <div className="filter-stats">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        
        {stats.overdue > 0 && (
          <div className="stat-item overdue">
            <span className="stat-number">{stats.overdue}</span>
            <span className="stat-label">Overdue</span>
          </div>
        )}
        
        <div className="stat-item">
          <span className="stat-number">{Math.round(stats.completionRate)}%</span>
          <span className="stat-label">Complete</span>
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Show:</label>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => onFilterChange('all')}
            >
              All
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => onFilterChange('pending')}
            >
              Pending
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => onFilterChange('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as TaskSort)}
          >
            <option value="createdAt">Recently Added</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
};

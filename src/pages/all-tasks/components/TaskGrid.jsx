import React, { useState } from 'react';
import TaskCard from './TaskCard';
import BulkActions from './BulkActions';
import EmptyState from './EmptyState';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskGrid = ({ 
  tasks, 
  activeTab, 
  hasFilters, 
  onClearFilters, 
  onTaskStatusChange, 
  onTaskDelete, 
  onTaskEdit,
  onSubtaskToggle,
  onAddTask
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleTaskSelect = (taskId, isSelected) => {
    if (isSelected) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev?.filter(id => id !== taskId));
    }
  };

  const handleSelectAll = () => {
    setSelectedTasks(tasks?.map(task => task?.id));
  };

  const handleDeselectAll = () => {
    setSelectedTasks([]);
  };

  const handleBulkComplete = () => {
    selectedTasks?.forEach(taskId => {
      onTaskStatusChange(taskId, true);
    });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    selectedTasks?.forEach(taskId => {
      onTaskDelete(taskId);
    });
    setSelectedTasks([]);
  };

  const isAllSelected = tasks?.length > 0 && selectedTasks?.length === tasks?.length;

  if (tasks?.length === 0) {
    return (
      <EmptyState 
        activeTab={activeTab}
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
        onAddTask={onAddTask}
      />
    );
  }

  return (
    <div>
      <BulkActions
        selectedTasks={selectedTasks}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={handleBulkDelete}
        totalTasks={tasks?.length}
        isAllSelected={isAllSelected}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks?.map((task) => (
          <div key={task?.id} className="relative">
            {/* Selection Checkbox - moved to top right */}
            <div className="absolute top-7 right-14 z-10">
              <Checkbox
                checked={selectedTasks?.includes(task?.id)}
                onChange={(e) => handleTaskSelect(task?.id, e?.target?.checked)}
                size="sm"
              />
            </div>
            
            <TaskCard
              task={task}
              onStatusChange={onTaskStatusChange}
              onDelete={onTaskDelete}
              onEdit={onTaskEdit}
              onSubtaskToggle={onSubtaskToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskGrid;
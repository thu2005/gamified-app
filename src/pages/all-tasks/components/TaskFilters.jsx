import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';


const TaskFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  searchTerm, 
  onSearchChange 
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Study', label: 'Study' },
    { value: 'Group Project', label: 'Group Project' },
    { value: 'Class', label: 'Class' },
    { value: 'Work/Part-time', label: 'Work/Part-time' },
    { value: 'Health', label: 'Health' },
    { value: 'Personal/Social', label: 'Personal/Social' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'recentlyAdded', label: 'Recently Added' },
    { value: 'progress', label: 'Progress' }
  ];

  const dueDateOptions = [
    { value: '', label: 'All Dates' },
    { value: 'today', label: 'Due Today' },
    { value: 'tomorrow', label: 'Due Tomorrow' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'nextWeek', label: 'Next Week' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const hasActiveFilters = filters?.category || filters?.priority || filters?.dueDate || searchTerm;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
          placeholder="Select category"
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => onFilterChange('priority', value)}
          placeholder="Select priority"
        />

        <Select
          label="Due Date"
          options={dueDateOptions}
          value={filters?.dueDate}
          onChange={(value) => onFilterChange('dueDate', value)}
          placeholder="Select due date"
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
          placeholder="Sort by"
        />
      </div>
      {/* Filter Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange('sortOrder', filters?.sortOrder === 'asc' ? 'desc' : 'asc')}
            iconName={filters?.sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"}
          >
            {filters?.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
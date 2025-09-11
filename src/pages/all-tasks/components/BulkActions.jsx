import React from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedTasks, 
  onSelectAll, 
  onDeselectAll, 
  onBulkComplete, 
  onBulkDelete,
  totalTasks,
  isAllSelected 
}) => {
  const selectedCount = selectedTasks?.length;
  const hasSelection = selectedCount > 0;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 mb-4 transition-all duration-300 ${
      hasSelection ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={isAllSelected}
            onChange={isAllSelected ? onDeselectAll : onSelectAll}
            label={`${selectedCount} of ${totalTasks} tasks selected`}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkComplete}
            iconName="CheckCircle"
            iconPosition="left"
            disabled={!hasSelection}
          >
            Mark Complete ({selectedCount})
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            iconName="Trash2"
            iconPosition="left"
            disabled={!hasSelection}
          >
            Delete ({selectedCount})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
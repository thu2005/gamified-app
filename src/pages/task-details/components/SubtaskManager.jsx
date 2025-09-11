import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SubtaskManager = ({ subtasks, onSubtasksUpdate, taskProgress }) => {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAddSubtask = () => {
    if (newSubtaskTitle?.trim()) {
      const newSubtask = {
        id: Date.now(),
        title: newSubtaskTitle?.trim(),
        completed: false,
        createdAt: new Date()?.toISOString()
      };
      onSubtasksUpdate([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = (subtaskId) => {
    const updatedSubtasks = subtasks?.map(subtask =>
      subtask?.id === subtaskId
        ? { ...subtask, completed: !subtask?.completed }
        : subtask
    );
    onSubtasksUpdate(updatedSubtasks);

    // Trigger water drop animation for completion
    if (!subtasks?.find(s => s?.id === subtaskId)?.completed) {
      window.dispatchEvent(new CustomEvent('taskCompleted'));
    }
  };

  const handleDeleteSubtask = (subtaskId) => {
    const updatedSubtasks = subtasks?.filter(subtask => subtask?.id !== subtaskId);
    onSubtasksUpdate(updatedSubtasks);
  };

  const handleEditSubtask = (subtask) => {
    setEditingSubtask(subtask?.id);
    setEditTitle(subtask?.title);
  };

  const handleSaveEdit = () => {
    if (editTitle?.trim()) {
      const updatedSubtasks = subtasks?.map(subtask =>
        subtask?.id === editingSubtask
          ? { ...subtask, title: editTitle?.trim() }
          : subtask
      );
      onSubtasksUpdate(updatedSubtasks);
    }
    setEditingSubtask(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingSubtask(null);
    setEditTitle('');
  };

  const completedCount = subtasks?.filter(s => s?.completed)?.length;
  const totalCount = subtasks?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Subtasks</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
            {totalCount > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full progress-transition"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary">{Math.round(taskProgress)}%</span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsAddingSubtask(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Subtask
        </Button>
      </div>
      {/* Add New Subtask Form */}
      {isAddingSubtask && (
        <div className="bg-muted rounded-lg p-4 mb-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                label="Subtask Title"
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e?.target?.value)}
                placeholder="Enter subtask title"
                onKeyPress={(e) => e?.key === 'Enter' && handleAddSubtask()}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingSubtask(false);
                  setNewSubtaskTitle('');
                }}
                iconName="X"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleAddSubtask}
                iconName="Check"
                disabled={!newSubtaskTitle?.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Subtasks List */}
      <div className="space-y-3">
        {subtasks?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="ListTodo" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-muted-foreground">No subtasks yet</p>
            <p className="text-sm text-muted-foreground">Break down your task into smaller, manageable steps</p>
          </div>
        ) : (
          subtasks?.map((subtask) => (
            <div
              key={subtask?.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                subtask?.completed
                  ? 'bg-success/5 border-success/20' :'bg-background border-border hover:border-primary/30'
              }`}
            >
              <Checkbox
                checked={subtask?.completed}
                onChange={() => handleToggleSubtask(subtask?.id)}
                className="flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                {editingSubtask === subtask?.id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e?.target?.value)}
                      onKeyPress={(e) => e?.key === 'Enter' && handleSaveEdit()}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      onClick={handleSaveEdit}
                      iconName="Check"
                      size="sm"
                    />
                    <Button
                      variant="ghost"
                      onClick={handleCancelEdit}
                      iconName="X"
                      size="sm"
                    />
                  </div>
                ) : (
                  <span
                    className={`block truncate ${
                      subtask?.completed
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }`}
                  >
                    {subtask?.title}
                  </span>
                )}
              </div>

              {editingSubtask !== subtask?.id && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditSubtask(subtask)}
                    iconName="Edit"
                    size="sm"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteSubtask(subtask?.id)}
                    iconName="Trash2"
                    size="sm"
                    className="text-error hover:text-error"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Progress Summary */}
      {subtasks?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <div className="flex items-center space-x-2">
              {taskProgress === 100 && (
                <Icon name="Trophy" size={16} color="var(--color-success)" />
              )}
              <span className="font-medium text-foreground">{Math.round(taskProgress)}% Complete</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskManager;
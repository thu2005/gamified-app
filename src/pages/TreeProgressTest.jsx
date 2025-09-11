import React, { useState } from 'react';
import useTreeProgress from '../hooks/useTreeProgress';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const TreeProgressTest = () => {
  const [testTaskId, setTestTaskId] = useState(1);
  const [testSubtaskId, setTestSubtaskId] = useState(1);
  const [subtaskCount, setSubtaskCount] = useState(3);
  
  // Track individual subtask states for task type 2
  const [subtaskStates, setSubtaskStates] = useState({});

  const {
    // State
    treeStage,
    treeHealth,
    waterDrops,
    streak,
    missedDeadlines,
    isDead,
    revivalTasksCount,
    
    // Actions
    completeTask,
    uncompleteTask,
    completeSubtask,
    uncompleteSubtask,
    waterTree,
    missDeadline,
    reviveTree,
    getStageInfo,
    
    // Utilities
    canWater,
    needsRevival,
    tasksUntilRevival
  } = useTreeProgress();

  const stageInfo = getStageInfo();

  const handleCompleteTask = () => {
    completeTask(testTaskId, false, 0);
    setTestTaskId(prev => prev + 1);
  };

  const handleCompleteTaskWithSubtasks = () => {
    completeTask(testTaskId, true, subtaskCount);
    // Keep same task ID for testing related subtasks
  };

  const handleUncompleteTask = () => {
    if (testTaskId > 1) {
      uncompleteTask(testTaskId - 1, false, 0);
    }
  };

  const handleUncompleteTaskWithSubtasks = () => {
    if (testTaskId > 1) {
      uncompleteTask(testTaskId - 1, true, subtaskCount);
    }
  };

  const handleCompleteSubtask = () => {
    completeSubtask(testTaskId, testSubtaskId);
    setTestSubtaskId(prev => prev + 1);
  };

  const handleUncompleteSubtask = () => {
    if (testSubtaskId > 1) {
      uncompleteSubtask(testTaskId, testSubtaskId - 1);
      setTestSubtaskId(prev => prev - 1);
    }
  };

  const handleMissDeadline = () => {
    missDeadline(testTaskId);
    setTestTaskId(prev => prev + 1);
  };

  // Task Type 2 handlers
  const handleCompleteTaskParent = () => {
    completeTask(2, true, subtaskCount);
    
    // Update UI: mark all subtasks as completed
    const newStates = {};
    for (let i = 1; i <= subtaskCount; i++) {
      newStates[`task2_subtask${i}`] = true;
    }
    setSubtaskStates(newStates);
  };

  const handleUncompleteTaskParent = () => {
    uncompleteTask(2, true, subtaskCount);
    
    // Update UI: mark all subtasks as uncompleted
    setSubtaskStates({});
  };

  const handleToggleSubtask = (index) => {
    const currentState = subtaskStates[`task2_subtask${index}`] || false;
    const newState = !currentState;
    
    setSubtaskStates(prev => ({
      ...prev,
      [`task2_subtask${index}`]: newState
    }));

    if (newState) {
      completeSubtask(2, `subtask${index}`);
    } else {
      uncompleteSubtask(2, `subtask${index}`);
    }
  };

  const handleChangeSubtaskCount = (newCount) => {
    setSubtaskCount(newCount);
    // Reset subtask states when count changes
    setSubtaskStates({});
  };

  const resetLocalStorage = () => {
    const keys = [
      'treeProgress_absoluteHealth',
      'treeProgress_waterDrops',
      'treeProgress_subtaskProgress',
      'treeProgress_streak',
      'treeProgress_lastActiveDate',
      'treeProgress_missedDeadlines',
      'treeProgress_isDead',
      'treeProgress_revivalTasksCount'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tree Progress Test</h1>
          <p className="text-muted-foreground">Test the useTreeProgress hook functionality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tree Status */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name={stageInfo.icon} size={24} color="var(--color-primary)" />
              <span>Tree Status</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stage:</span>
                <div className="flex items-center space-x-2">
                  <Icon name={stageInfo.icon} size={16} color="var(--color-success)" />
                  <span className="font-medium text-foreground">{treeStage}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Health:</span>
                <span className="font-medium text-foreground">{treeHealth}/{stageInfo.maxHealth}</span>
              </div>
              
              <div className="w-full bg-border rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(treeHealth / stageInfo.maxHealth) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Water Drops:</span>
                <div className="flex items-center space-x-2">
                  <Icon name="Droplets" size={16} color="var(--color-primary)" />
                  <span className="font-medium text-foreground">{waterDrops.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Streak:</span>
                <div className="flex items-center space-x-2">
                  <Icon name="Flame" size={16} color="var(--color-warning)" />
                  <span className="font-medium text-foreground">{streak} days</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Missed Deadlines:</span>
                <span className="font-medium text-error">{missedDeadlines}</span>
              </div>
              
              {isDead && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-error">
                    <Icon name="Skull" size={16} />
                    <span className="font-medium">Tree is Dead</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete {tasksUntilRevival} more tasks to revive ({revivalTasksCount}/10)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              {/* Task Type 1: Simple Tasks */}
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Task Type 1: Simple Tasks</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCompleteTask}
                    iconName="CheckCircle"
                    size="sm"
                    disabled={isDead && revivalTasksCount >= 10}
                  >
                    Complete Task
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleUncompleteTask}
                    iconName="XCircle"
                    size="sm"
                    disabled={isDead || testTaskId <= 1}
                  >
                    Uncomplete Task
                  </Button>
                </div>
              </div>

              {/* Task Type 2: Tasks with Subtasks */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium text-foreground">Task Type 2: Task with Subtasks</h3>
                
                {/* Task Parent Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCompleteTaskParent}
                    iconName="CheckSquare"
                    size="sm"
                    disabled={isDead && revivalTasksCount >= 10}
                  >
                    Complete Task Parent
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleUncompleteTaskParent}
                    iconName="Square"
                    size="sm"
                    disabled={isDead}
                  >
                    Uncomplete Task Parent
                  </Button>
                </div>

                {/* Subtask Count Config */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-muted-foreground">Subtasks number:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subtaskCount}
                    onChange={(e) => handleChangeSubtaskCount(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 border border-border rounded text-sm"
                  />
                </div>

                {/* Individual Subtask Controls */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Individual Subtasks:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {Array.from({ length: subtaskCount }, (_, index) => {
                      const isCompleted = subtaskStates[`task2_subtask${index + 1}`] || false;
                      return (
                        <Button
                          key={index}
                          variant={isCompleted ? "default" : "outline"}
                          onClick={() => handleToggleSubtask(index + 1)}
                          iconName={isCompleted ? "CheckSquare" : "Square"}
                          size="sm"
                          disabled={isDead}
                        >
                          Subtask {index + 1}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legacy Subtask Actions (for backward compatibility) */}
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Legacy Subtask Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCompleteSubtask}
                    iconName="Plus"
                    size="sm"
                    disabled={isDead}
                  >
                    Complete Subtask
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleUncompleteSubtask}
                    iconName="Minus"
                    size="sm"
                    disabled={isDead || testSubtaskId <= 1}
                  >
                    Uncomplete Subtask
                  </Button>
                </div>
              </div>

              {/* Tree Actions */}
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Tree Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="default"
                    onClick={waterTree}
                    iconName="Droplets"
                    disabled={!canWater}
                    fullWidth
                  >
                    Water Tree ({waterDrops.toFixed(1)}/10)
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleMissDeadline}
                    iconName="Clock"
                    disabled={isDead}
                    fullWidth
                  >
                    Miss Deadline (-20 Health)
                  </Button>
                  
                  {needsRevival && (
                    <Button
                      variant="default"
                      onClick={reviveTree}
                      iconName="Heart"
                      disabled={revivalTasksCount < 10}
                      fullWidth
                    >
                      {revivalTasksCount >= 10 ? 'Revive Tree' : `Need ${10 - revivalTasksCount} more tasks`}
                    </Button>
                  )}
                </div>
              </div>

              {/* Debug Controls */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  onClick={resetLocalStorage}
                  iconName="RotateCcw"
                  size="sm"
                  fullWidth
                >
                  Reset All Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-muted rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-2">Debug Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Can Water:</span>
              <span className="ml-2 font-medium">{canWater ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Needs Revival:</span>
              <span className="ml-2 font-medium">{needsRevival ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Revival Count:</span>
              <span className="ml-2 font-medium">{revivalTasksCount}/10</span>
            </div>
            <div>
              <span className="text-muted-foreground">Is Dead:</span>
              <span className="ml-2 font-medium">{isDead ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Next Task ID:</span>
              <span className="ml-2 font-medium">{testTaskId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Next Subtask ID:</span>
              <span className="ml-2 font-medium">{testSubtaskId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeProgressTest;

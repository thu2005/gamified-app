import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import TaskTabs from './components/TaskTabs';
import TaskFilters from './components/TaskFilters';
import TaskGrid from './components/TaskGrid';
import AddTaskModal from '../../components/AddTaskModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useTasks } from '../../hooks/useTasks';
import useTreeProgress from '../../hooks/useTreeProgress';

const AllTasks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    dueDate: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  // Use the useTasks hook
  const {
    tasks: allTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    toggleSubtaskCompletion,
    getTasksStats
  } = useTasks();

  // Use the useTreeProgress hook for gamification
  const {
    completeTask: treeCompleteTask,
    uncompleteTask: treeUncompleteTask,
    completeSubtask: treeCompleteSubtask,
    uncompleteSubtask: treeUncompleteSubtask,
    missDeadline: treeMissDeadline
  } = useTreeProgress();

  // Enhanced task completion handler that also updates tree progress
  const handleTaskToggle = (taskId) => {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    console.log('Task toggle:', { taskId, task, completed: task.completed });

    // Determine new completion state (opposite of current)
    const newCompleted = !task.completed;

    // Update task completion status first
    toggleTaskCompletion(taskId);

    // Update tree progress based on new state
    if (newCompleted) {
      // Task is being completed
      console.log('🎯 ALL-TASKS: Completing task for tree progress', { 
        taskId, 
        hasSubtasks: task.subtasks?.length > 0, 
        subtaskCount: task.subtasks?.length || 0 
      });
      treeCompleteTask(taskId, task.subtasks?.length > 0, task.subtasks?.length || 0);
    } else {
      // Task is being uncompleted
      console.log('🎯 ALL-TASKS: Uncompleting task for tree progress', {
        taskId, 
        hasSubtasks: task.subtasks?.length > 0, 
        subtaskCount: task.subtasks?.length || 0 
      });
      treeUncompleteTask(taskId, task.subtasks?.length > 0, task.subtasks?.length || 0);
    }
  };

  // Check for overdue tasks and handle missed deadlines
  useEffect(() => {
    const now = new Date();
    const overdueTaskIds = [];
    
    allTasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < now) {
          // Only add if we haven't already processed this overdue task
          const taskKey = `missed_${task.id}`;
          const alreadyProcessed = localStorage.getItem(taskKey);
          if (!alreadyProcessed) {
            overdueTaskIds.push(task.id);
            localStorage.setItem(taskKey, 'true');
          }
        }
      }
    });

    // Only process if there are new overdue tasks
    if (overdueTaskIds.length > 0) {
      console.log('Processing overdue tasks:', overdueTaskIds);
      overdueTaskIds.forEach(taskId => {
        treeMissDeadline(taskId);
      });
    }
  }, [allTasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...allTasks];

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered?.filter(task => !task?.completed);
    } else if (activeTab === 'completed') {
      filtered = filtered?.filter(task => task?.completed);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered?.filter(task =>
        task?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        task?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Filter by category
    if (filters?.category) {
      filtered = filtered?.filter(task => task?.category === filters?.category);
    }

    // Filter by priority
    if (filters?.priority) {
      filtered = filtered?.filter(task => task?.priority === filters?.priority);
    }

    // Filter by due date
    if (filters?.dueDate) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow?.setDate(tomorrow?.getDate() + 1);
      const thisWeekEnd = new Date(today);
      thisWeekEnd?.setDate(thisWeekEnd?.getDate() + 7);
      const nextWeekEnd = new Date(today);
      nextWeekEnd?.setDate(nextWeekEnd?.getDate() + 14);

      filtered = filtered?.filter(task => {
        const dueDate = new Date(task.dueDate);
        switch (filters?.dueDate) {
          case 'today':
            return dueDate >= today && dueDate < tomorrow;
          case 'tomorrow':
            return dueDate >= tomorrow && dueDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case 'thisWeek':
            return dueDate >= today && dueDate <= thisWeekEnd;
          case 'nextWeek':
            return dueDate > thisWeekEnd && dueDate <= nextWeekEnd;
          case 'overdue':
            return dueDate < now && !task?.completed;
          default:
            return true;
        }
      });
    }

    // Sort tasks
    filtered?.sort((a, b) => {
      let comparison = 0;
      
      switch (filters?.sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
          break;
        case 'title':
          comparison = a?.title?.localeCompare(b?.title);
          break;
        case 'recentlyAdded':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'progress':
          const getProgress = (task) => {
            if (task?.completed) return 100;
            if (!task?.subtasks || task?.subtasks?.length === 0) return 0;
            return (task?.subtasks?.filter(sub => sub?.completed)?.length / task?.subtasks?.length) * 100;
          };
          comparison = getProgress(b) - getProgress(a);
          break;
        default:
          comparison = 0;
      }

      return filters?.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [allTasks, activeTab, searchTerm, filters]);

  // Calculate task counts using stats from useTasks
  const stats = getTasksStats();
  const taskCounts = useMemo(() => ({
    all: stats.total,
    pending: stats.pending,
    completed: stats.completed
  }), [stats]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      priority: '',
      dueDate: '',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
    setSearchTerm('');
  };

  const handleTaskStatusChange = (taskId, completed) => {
    handleTaskToggle(taskId);
    
    // Trigger tree growth animation if task completed
    if (completed) {
      window.dispatchEvent(new CustomEvent('taskCompleted'));
    }
  };

  const handleTaskDelete = (taskId) => {
    deleteTask(taskId);
  };

  const handleTaskEdit = (task) => {
    navigate(`/task-details?id=${task?.id}&edit=true`);
  };

  const handleAddTask = (taskData) => {
    try {
      addTask(taskData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      // You can add error handling UI here
    }
  };

  const handleSubtaskToggle = (taskId, subtaskId) => {
    const task = allTasks.find(t => t.id === taskId);
    const subtask = task?.subtasks?.find(s => s.id === subtaskId);
    if (!task || !subtask) return;

    console.log('Subtask toggle:', { taskId, subtaskId, subtask, completed: subtask.completed });

    // Determine new completion state (opposite of current)
    const newCompleted = !subtask.completed;

    // Update subtask completion status first
    toggleSubtaskCompletion(taskId, subtaskId);

    // Update tree progress based on new state
    if (newCompleted) {
      // Subtask is being completed
      console.log('Completing subtask for tree progress', { taskId, subtaskId });
      treeCompleteSubtask(taskId, subtaskId);
    } else {
      // Subtask is being uncompleted
      console.log('Uncompleting subtask for tree progress', { taskId, subtaskId });
      treeUncompleteSubtask(taskId, subtaskId);
    }
  };

  const hasFilters = filters?.category || filters?.priority || filters?.dueDate || searchTerm;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
              <p className="text-muted-foreground mt-2">
                Manage and organize all your academic tasks in one place
              </p>
            </div>
            
            <Button
              variant="default"
              onClick={() => setIsAddModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              className="hidden sm:flex"
            >
              Add New Task
            </Button>
            
            {/* Mobile Add Button */}
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsAddModalOpen(true)}
              className="sm:hidden"
            >
              <Icon name="Plus" size={20} />
            </Button>
          </div>

          {/* Task Tabs */}
          <TaskTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            taskCounts={taskCounts}
          />

          {/* Filters */}
          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Task Grid */}
          <TaskGrid
            tasks={filteredTasks}
            activeTab={activeTab}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            onSubtaskToggle={handleSubtaskToggle}
            onAddTask={() => setIsAddModalOpen(true)}
          />
        </div>
      </main>

      <MobileBottomNav />
      
      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
};

export default AllTasks;
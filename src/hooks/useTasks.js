import { useState, useEffect, useCallback } from 'react';
import useTreeProgress from './useTreeProgress';

const LOCAL_STORAGE_KEY = 'treetask_tasks';

// Default values
const DEFAULT_PRIORITY = 'Low';
const DEFAULT_DUE_TIME = '23:59';

// Helper function to generate UUID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to calculate progress
const calculateProgress = (subtasks) => {
  if (!subtasks || subtasks.length === 0) {
    return 0; // No subtasks means 0% progress initially
  }
  const completedSubtasks = subtasks.filter(subtask => subtask.completed);
  return Math.round((completedSubtasks.length / subtasks.length) * 100);
};

// Helper function to validate and normalize task data
const normalizeTaskData = (taskData) => {
  const normalized = {
    id: taskData.id || generateId(),
    title: taskData.title?.trim() || '',
    description: taskData.description?.trim() || '',
    priority: taskData.priority || DEFAULT_PRIORITY,
    category: taskData.category || '',
    dueDate: taskData.dueDate || '',
    dueTime: taskData.dueTime || (taskData.dueDate ? DEFAULT_DUE_TIME : ''),
    subtasks: taskData.subtasks || [],
    completed: taskData.completed || false,
    createdAt: taskData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Calculate progress
  normalized.progress = normalized.completed ? 100 : calculateProgress(normalized.subtasks);
  
  return normalized;
};

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { trackActivity } = useTreeProgress();

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Ensure all tasks have proper structure and calculated progress
        const normalizedTasks = parsedTasks.map(task => normalizeTaskData(task));
        setTasks(normalizedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      setTasks([]);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  // Get task by ID
  const getTaskById = useCallback((id) => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  // Add new task
  const addTask = useCallback((taskData) => {
    if (!taskData.title?.trim()) {
      throw new Error('Task title is required');
    }

    const newTask = normalizeTaskData(taskData);
    
    // Track activity for adding task (Option 2: Moderate)
    trackActivity('add_task');
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  }, [trackActivity]);

  // Update existing task
  const updateTask = useCallback((id, updates) => {
    // Track activity for editing task (Option 2: Moderate)
    trackActivity('edit_task');
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === id) {
          const updatedTask = {
            ...task,
            ...updates,
            id, // Ensure ID cannot be changed
            updatedAt: new Date().toISOString()
          };
          
          // Recalculate progress if subtasks were updated
          if (updates.subtasks !== undefined || updates.completed !== undefined) {
            updatedTask.progress = updatedTask.completed ? 100 : calculateProgress(updatedTask.subtasks);
          }
          
          return updatedTask;
        }
        return task;
      });
      
      return updatedTasks;
    });
  }, [trackActivity]);

  // Delete task
  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  // Toggle task completion with auto-sync subtasks
  const toggleTaskCompletion = useCallback((id) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          
          // When marking task as completed, mark all subtasks as completed
          // When marking task as incomplete, mark all subtasks as incomplete
          const updatedSubtasks = task.subtasks.map(subtask => ({
            ...subtask,
            completed: newCompleted
          }));
          
          return {
            ...task,
            completed: newCompleted,
            subtasks: updatedSubtasks,
            progress: newCompleted ? 100 : calculateProgress(updatedSubtasks),
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      });
    });
  }, []);

  // Add subtask to a task
  const addSubtask = useCallback((taskId, subtaskTitle) => {
    if (!subtaskTitle?.trim()) {
      throw new Error('Subtask title is required');
    }

    // Track activity for adding subtask (Option 2: Moderate)
    trackActivity('add_subtask');

    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: generateId(),
            title: subtaskTitle.trim(),
            completed: false
          };
          
          const updatedSubtasks = [...task.subtasks, newSubtask];
          const updatedTask = {
            ...task,
            subtasks: updatedSubtasks,
            progress: task.completed ? 100 : calculateProgress(updatedSubtasks),
            updatedAt: new Date().toISOString()
          };
          
          return updatedTask;
        }
        return task;
      });
    });
  }, [trackActivity]);

  // Toggle subtask completion with auto-sync task completion
  const toggleSubtaskCompletion = useCallback((taskId, subtaskId) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(subtask => {
            if (subtask.id === subtaskId) {
              return {
                ...subtask,
                completed: !subtask.completed
              };
            }
            return subtask;
          });
          
          // Auto-sync task completion based on subtasks
          let newTaskCompleted = task.completed;
          
          if (task.subtasks.length > 0) {
            // If all subtasks are completed, mark task as completed
            const allSubtasksCompleted = updatedSubtasks.every(subtask => subtask.completed);
            // If any subtask is incomplete, mark task as incomplete
            const anySubtaskIncomplete = updatedSubtasks.some(subtask => !subtask.completed);
            
            if (allSubtasksCompleted && !task.completed) {
              newTaskCompleted = true;
            } else if (anySubtaskIncomplete && task.completed) {
              newTaskCompleted = false;
            }
          }
          
          const updatedTask = {
            ...task,
            completed: newTaskCompleted,
            subtasks: updatedSubtasks,
            progress: newTaskCompleted ? 100 : calculateProgress(updatedSubtasks),
            updatedAt: new Date().toISOString()
          };
          
          return updatedTask;
        }
        return task;
      });
    });
  }, []);

  // Delete subtask
  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
          const updatedTask = {
            ...task,
            subtasks: updatedSubtasks,
            progress: task.completed ? 100 : calculateProgress(updatedSubtasks),
            updatedAt: new Date().toISOString()
          };
          
          return updatedTask;
        }
        return task;
      });
    });
  }, []);

  // Clear all tasks (useful for testing/reset)
  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  // Get tasks statistics
  const getTasksStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(task => {
      if (task.completed) return false;
      if (!task.dueDate) return false;
      
      const now = new Date();
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || DEFAULT_DUE_TIME}`);
      return dueDateTime < now;
    }).length;
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  return {
    // State
    tasks,
    
    // Getters
    getTaskById,
    getTasksStats,
    
    // CRUD operations
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    
    // Subtask operations
    addSubtask,
    toggleSubtaskCompletion,
    deleteSubtask,
    
    // Utility
    clearAllTasks
  };
};

export default useTasks;

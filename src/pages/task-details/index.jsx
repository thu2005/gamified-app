import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import TaskHeader from './components/TaskHeader';
import SubtaskManager from './components/SubtaskManager';
import PomodoroTimer from './components/PomodoroTimer';
import TaskActions from './components/TaskActions';

const TaskDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock task data - in real app this would come from props or API
  const mockTask = {
    id: 1,
    title: "Complete React Project Documentation",
    description: `Create comprehensive documentation for the TreeTask React application including component architecture, API integration patterns, and deployment guidelines. This documentation should serve as a reference for future development and maintenance of the application.\n\nThe documentation should cover all major components, their props, state management patterns, and integration points with external services.`,
    priority: "high",
    category: "study",
    deadline: "2025-01-15T14:30:00",
    completed: false,
    createdAt: "2025-01-09T10:00:00",
    subtasks: [
      {
        id: 101,
        title: "Document component architecture and hierarchy",
        completed: true,
        createdAt: "2025-01-09T10:15:00"
      },
      {
        id: 102,
        title: "Create API integration documentation",
        completed: false,
        createdAt: "2025-01-09T10:30:00"
      },
      {
        id: 103,
        title: "Write deployment and setup instructions",
        completed: false,
        createdAt: "2025-01-09T10:45:00"
      },
      {
        id: 104,
        title: "Add code examples and best practices",
        completed: false,
        createdAt: "2025-01-09T11:00:00"
      },
      {
        id: 105,
        title: "Review and finalize documentation",
        completed: false,
        createdAt: "2025-01-09T11:15:00"
      }
    ]
  };

  useEffect(() => {
    // Simulate loading task data
    const timer = setTimeout(() => {
      setTask(mockTask);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const calculateTaskProgress = (subtasks) => {
    if (!subtasks || subtasks?.length === 0) return 0;
    const completedCount = subtasks?.filter(subtask => subtask?.completed)?.length;
    return (completedCount / subtasks?.length) * 100;
  };

  const handleTaskUpdate = (updatedTask) => {
    setTask(updatedTask);
    // In real app, this would sync with backend/localStorage
  };

  const handleSubtasksUpdate = (updatedSubtasks) => {
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    setTask(updatedTask);
    // In real app, this would sync with backend/localStorage
  };

  const handleTaskDelete = (taskId) => {
    // In real app, this would delete from backend/localStorage
    navigate('/all-tasks');
  };

  const handleBack = () => {
    // Navigate back to previous page or default to all tasks
    if (location?.state?.from) {
      navigate(location?.state?.from);
    } else {
      navigate('/all-tasks');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-foreground mb-4">Task Not Found</h1>
              <p className="text-muted-foreground mb-6">The requested task could not be found.</p>
              <button
                onClick={handleBack}
                className="text-primary hover:text-primary/80 font-medium"
              >
                ← Back to Tasks
              </button>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const taskProgress = calculateTaskProgress(task?.subtasks);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <TaskHeader
                task={task}
                onTaskUpdate={handleTaskUpdate}
                onBack={handleBack}
              />

              <SubtaskManager
                subtasks={task?.subtasks || []}
                onSubtasksUpdate={handleSubtasksUpdate}
                taskProgress={taskProgress}
              />

              <PomodoroTimer taskTitle={task?.title} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TaskActions
                task={task}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </div>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default TaskDetails;
import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

// Simple test component to demonstrate useTasks hook
const TaskTester = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addSubtask,
    toggleSubtaskCompletion,
    deleteSubtask,
    getTaskById,
    getTasksStats,
    clearAllTasks
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Low');
  const [newTaskCategory, setNewTaskCategory] = useState('Study');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskDueTime, setNewTaskDueTime] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const stats = getTasksStats();

  // Options for dropdowns
  const priorityOptions = ['Low', 'Medium', 'High'];
  const categoryOptions = ['Study', 'Group Project', 'Class', 'Work/Part-time', 'Health', 'Personal/Social'];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        category: newTaskCategory,
        dueDate: newTaskDueDate,
        dueTime: newTaskDueTime
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('Low');
      setNewTaskCategory('Study');
      setNewTaskDueDate('');
      setNewTaskDueTime('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !selectedTaskId) return;

    try {
      addSubtask(selectedTaskId, newSubtaskTitle);
      setNewSubtaskTitle('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>useTasks Hook Tester</h1>
      
      {/* Stats */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3>Statistics</h3>
        <p>Total: {stats.total} | Completed: {stats.completed} | Pending: {stats.pending} | Overdue: {stats.overdue}</p>
        <p>Completion Rate: {stats.completionRate}%</p>
      </div>

      {/* Add Task Form */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Add New Task</h3>
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Task Title */}
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            style={{ padding: '8px' }}
            required
          />
          
          {/* Task Description */}
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Enter task description (optional)..."
            style={{ padding: '8px', minHeight: '60px' }}
          />
          
          {/* Priority and Category in a row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Priority:</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              >
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Category:</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Due Date and Time in a row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Due Date:</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Due Time:</label>
              <input
                type="time"
                value={newTaskDueTime}
                onChange={(e) => setNewTaskDueTime(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          </div>
          
          <button type="submit" style={{ padding: '12px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Add Task
          </button>
        </form>
      </div>

      {/* Add Subtask Form */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Add Subtask</h3>
        <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '10px' }}>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="">Select a task...</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="Enter subtask title..."
            style={{ flex: 1, padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 16px' }}>
            Add Subtask
          </button>
        </form>
      </div>

      {/* Clear All Button */}
      <button 
        onClick={clearAllTasks}
        style={{ 
          backgroundColor: '#ff4444', 
          color: 'white', 
          padding: '8px 16px', 
          border: 'none', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}
      >
        Clear All Tasks
      </button>

      {/* Tasks List */}
      <div>
        <h3>Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No tasks yet. Add some tasks to test the functionality!</p>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                marginBottom: '10px', 
                borderRadius: '8px',
                backgroundColor: task.completed ? '#f0f8f0' : '#fff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                />
                <h4 style={{ 
                  margin: 0, 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  flex: 1
                }}>
                  {task.title}
                </h4>
                <span style={{ 
                  backgroundColor: task.priority === 'High' ? '#ff6b6b' : 
                                   task.priority === 'Medium' ? '#feca57' : '#48dbfb',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {task.priority}
                </span>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {task.progress}%
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ 
                    backgroundColor: '#ff4444', 
                    color: 'white', 
                    border: 'none', 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
              
              {task.description && (
                <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                  {task.description}
                </p>
              )}
              
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                Category: {task.category} | Due: {task.dueDate} {task.dueTime}
              </div>

              {/* Subtasks */}
              {task.subtasks.length > 0 && (
                <div style={{ marginTop: '15px', paddingLeft: '20px' }}>
                  <strong style={{ fontSize: '14px' }}>Subtasks:</strong>
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginTop: '5px' 
                    }}>
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                      />
                      <span style={{ 
                        textDecoration: subtask.completed ? 'line-through' : 'none',
                        fontSize: '14px',
                        flex: 1
                      }}>
                        {subtask.title}
                      </span>
                      <button
                        onClick={() => deleteSubtask(task.id, subtask.id)}
                        style={{ 
                          backgroundColor: '#ff4444', 
                          color: 'white', 
                          border: 'none', 
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '10px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskTester;

import { useState } from 'react'
import './App.css'
import type { Task } from './types/Task'
import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { TaskItem } from './components/TaskItem'
import { TaskFilters } from './components/TaskFilters'

function App() {
  const { 
    tasks, 
    filter, 
    sortBy, 
    stats, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask, 
    setFilter, 
    setSortBy 
  } = useTasks()

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData)
    setShowForm(false)
  }

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setEditingTask(null)
    }
  }

  const handleStartEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(false)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(id)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Student Task Manager</h1>
        <p>Stay organized, beat procrastination, ace your studies!</p>
      </header>

      <main className="app-main">
        <div className="task-section">
          {/* Add Task Button */}
          {!showForm && !editingTask && (
            <button 
              className="btn-add-task"
              onClick={() => setShowForm(true)}
            >
              ➕ Add New Task
            </button>
          )}

          {/* Task Form */}
          {(showForm || editingTask) && (
            <div className="form-section">
              <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
              <TaskForm
                onSubmit={editingTask ? handleEditTask : handleAddTask}
                editingTask={editingTask || undefined}
                onCancel={editingTask ? handleCancelEdit : () => setShowForm(false)}
              />
            </div>
          )}

          {/* Task Filters and Stats */}
          <TaskFilters
            filter={filter}
            sortBy={sortBy}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            stats={stats}
          />

          {/* Task List */}
          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks found. Add your first task to get started! 🚀</p>
              </div>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={handleStartEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
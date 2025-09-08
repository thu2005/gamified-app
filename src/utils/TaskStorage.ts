import type { Task } from '../types/Task';

const STORAGE_KEY = 'student-tasks';

export const TaskStorage = {
    // Get all tasks from localStorage
    getTasks(): Task[] {
        try {
            const tasks = localStorage.getItem(STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    },

    // Save all tasks to localStorage
    saveTasks(tasks: Task[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    },

    // Add new task
    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const tasks = this.getTasks();
        tasks.push(newTask);
        this.saveTasks(tasks);

        return newTask;
    },

    // Update existing task
    updateTask(id: string, updates: Partial<Task>): Task | null {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) return null;

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        this.saveTasks(tasks);
        return tasks[taskIndex];
    },

    // Delete task
    deleteTask(id: string): boolean {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);

        if (filteredTasks.length === tasks.length) return false;

        this.saveTasks(filteredTasks);
        return true;
    },

    // Toggle task completion
    toggleTask(id: string): Task | null {
        const tasks = this.getTasks();
        const task = tasks.find(t => t.id === id);

        if (!task) return null;

        return this.updateTask(id, { completed: !task.completed });
    }
};

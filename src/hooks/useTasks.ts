import { useState, useEffect } from 'react';
import type { Task, TaskFilter, TaskSort } from '../types/Task';
import { TaskStorage } from '../utils/TaskStorage';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<TaskFilter>('all');
    const [sortBy, setSortBy] = useState<TaskSort>('createdAt');

    // Load tasks on mount
    useEffect(() => {
        const loadedTasks = TaskStorage.getTasks();
        setTasks(loadedTasks);
    }, []);

    // Add new task
    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask = TaskStorage.addTask(taskData);
        setTasks(prev => [...prev, newTask]);
    };

    // Update task
    const updateTask = (id: string, updates: Partial<Task>) => {
        const updatedTask = TaskStorage.updateTask(id, updates);
        if (updatedTask) {
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
        }
    };

    // Delete task
    const deleteTask = (id: string) => {
        const success = TaskStorage.deleteTask(id);
        if (success) {
            setTasks(prev => prev.filter(task => task.id !== id));
        }
    };

    // Toggle task completion
    const toggleTask = (id: string) => {
        const updatedTask = TaskStorage.toggleTask(id);
        if (updatedTask) {
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
        }
    };

    // Filter tasks
    const getFilteredTasks = () => {
        let filtered = tasks;

        // Apply filter
        switch (filter) {
            case 'pending':
                filtered = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filtered = tasks.filter(task => task.completed);
                break;
            default:
                filtered = tasks;
        }

        // Apply sort
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];

                case 'title':
                    return a.title.localeCompare(b.title);

                case 'createdAt':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
    };

    // Get stats
    const getStats = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const overdueTasks = tasks.filter(task =>
            !task.completed &&
            task.dueDate &&
            new Date(task.dueDate) < new Date()
        ).length;

        return {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            overdue: overdueTasks,
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
    };

    return {
        tasks: getFilteredTasks(),
        filter,
        sortBy,
        stats: getStats(),
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        setFilter,
        setSortBy
    };
};

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export type TaskFilter = 'all' | 'pending' | 'completed';

export type TaskSort = 'dueDate' | 'priority' | 'createdAt' | 'title';

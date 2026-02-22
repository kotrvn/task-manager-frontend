// src/mocks/db.ts
import type { Comment, Task } from '../store/types';

// Начальные данные
export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Изучить React',
    description: 'Пройти курс по React и выполнить практические задания',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Иван Петров',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    dueDate: '2024-02-01',
    tags: ['обучение', 'frontend']
  },
  {
    id: '2',
    title: 'Написать документацию',
    description: 'Создать документацию для API',
    status: 'todo',
    priority: 'medium',
    assignee: 'Мария Иванова',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    dueDate: '2024-01-30',
    tags: ['документация']
  },
  {
    id: '3',
    title: 'Исправить баги',
    description: 'Исправить критические ошибки в продкшене',
    status: 'todo',
    priority: 'high',
    assignee: 'Петр Сидоров',
    createdAt: '2024-01-16T14:15:00Z',
    updatedAt: '2024-01-16T14:15:00Z',
    dueDate: '2024-01-18',
    tags: ['баги', 'срочно']
  },
  {
    id: '4',
    title: 'Написать тесты',
    description: 'Покрыть проект тестами',
    status: 'todo',
    priority: 'medium',
    assignee: 'Анна Смирнова',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
    dueDate: '2024-02-15',
    tags: ['тестирование']
  },
  {
    id: '5',
    title: 'Оптимизировать производительность',
    description: 'Улучшить скорость загрузки приложения',
    status: 'todo',
    priority: 'low',
    assignee: 'Алексей Козлов',
    createdAt: '2024-01-18T11:20:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    dueDate: '2024-03-01',
    tags: ['оптимизация']
  }
];

export const initialComments: Comment[] = [
  {
    id: '101',
    taskId: '1',
    author: 'Анна',
    content: 'Отличная задача! Нужно будет изучить хуки подробнее.',
    createdAt: '2024-01-15T11:30:00Z'
  },
  {
    id: '102',
    taskId: '1',
    author: 'Иван',
    content: 'Уже начал делать, очень интересно',
    createdAt: '2024-01-15T12:15:00Z'
  },
  {
    id: '103',
    taskId: '1',
    author: 'Петр',
    content: 'React 19 уже вышел, может стоит его изучить?',
    createdAt: '2024-01-16T09:20:00Z'
  },
  {
    id: '104',
    taskId: '2',
    author: 'Мария',
    content: 'Документация должна быть на русском и английском',
    createdAt: '2024-01-16T10:45:00Z'
  },
  {
    id: '105',
    taskId: '3',
    author: 'Петр',
    content: 'Срочно! Баги блокируют работу',
    createdAt: '2024-01-16T15:30:00Z'
  },
  {
    id: '106',
    taskId: '4',
    author: 'Анна',
    content: 'Нужно добавить тесты для API',
    createdAt: '2024-01-17T10:15:00Z'
  }
];

// Класс для работы с базой данных в памяти
export class MockDB {
  private tasks: Task[] = [...initialTasks];
  private comments: Comment[] = [...initialComments];

  // ========== TASKS ==========
  
  getTasks() {
    return { 
      tasks: this.tasks, 
      total: this.tasks.length 
    };
  }

  getTaskById(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.tasks[index];
  }

  deleteTask(id: string) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(index, 1);
    // Удаляем связанные комментарии
    this.comments = this.comments.filter(c => c.taskId !== id);
    return { success: true };
  }

  // ========== COMMENTS ==========
  
  getComments(taskId?: string) {
    if (taskId) {
      return this.comments.filter(c => c.taskId === taskId);
    }
    return this.comments;
  }

  getCommentById(id: string) {
    const comment = this.comments.find(c => c.id === id);
    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }

  createComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    this.comments.push(newComment);
    return newComment;
  }

  updateComment(id: string, content: string) {
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    
    this.comments[index] = {
      ...this.comments[index],
      content,
      updatedAt: new Date().toISOString()
    };
    return this.comments[index];
  }

  deleteComment(id: string) {
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Comment not found');
    }
    this.comments.splice(index, 1);
    return { success: true };
  }

  // ========== UTILITY ==========
  
  reset() {
    this.tasks = [...initialTasks];
    this.comments = [...initialComments];
  }

  getStats() {
    return {
      tasks: this.tasks.length,
      comments: this.comments.length,
      tasksByStatus: {
        todo: this.tasks.filter(t => t.status === 'todo').length,
        'in-progress': this.tasks.filter(t => t.status === 'in-progress').length,
        done: this.tasks.filter(t => t.status === 'done').length
      },
      tasksByPriority: {
        low: this.tasks.filter(t => t.priority === 'low').length,
        medium: this.tasks.filter(t => t.priority === 'medium').length,
        high: this.tasks.filter(t => t.priority === 'high').length
      }
    };
  }
}

// Создаем и экспортируем единственный экземпляр базы данных
export const db = new MockDB();
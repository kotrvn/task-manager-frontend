// src/utils/api.ts
import type { Comment, Task } from '../store/types';

// Используем относительные пути - моки перехватят запросы
const API_BASE = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP error ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // ========== TASKS ==========
  
  async getTasks() {
    return this.request<{ tasks: Task[]; total: number }>('/tasks');
  }

  async getTaskById(id: string) {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: Partial<Task>) {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string) {
    return this.request<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== COMMENTS ==========
  
  async getComments(taskId: string) {
    return this.request<{ comments: Comment[]; total: number }>(
      `/tasks/${taskId}/comments`
    );
  }

  async addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async updateComment(id: string, content: string) {
    return this.request<Comment>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(id: string) {
    return this.request<{ success: boolean }>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== UTILITY ==========
  
  async resetDatabase() {
    return this.request<{ message: string; stats: any }>('/reset', {
      method: 'POST',
    });
  }

  async getStats() {
    return this.request<any>('/stats');
  }

  async healthCheck() {
    return this.request<any>('/health');
  }
}

// Создаем и экспортируем единственный экземпляр
export const api = new ApiClient();

// Для удобства экспортируем типы
export type { Comment, Task };

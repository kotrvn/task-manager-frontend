// src/store/taskStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { api } from '../utils/api';
import type { Task, TaskState } from './types';
import { useUIStore } from './uiStore';

interface TaskStore extends TaskState {
  // ========== CRUD ОПЕРАЦИИ ==========
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // ========== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ==========
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  getOverdueTasks: () => Task[];
  getTasksCount: () => number;

  // ========== ВСПОМОГАТЕЛЬНЫЕ ==========
  reset: () => void;
}

// Начальное состояние
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const useTaskStore = create<TaskStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // ========== CRUD ОПЕРАЦИИ ==========

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await api.getTasks();
          
          set((state) => {
            state.tasks = data.tasks;
            state.isLoading = false;
          });
          
          // Показываем уведомление через UI стор
          useUIStore.getState().addNotification('success', 'Задачи загружены', 3000);
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = (error as Error).message;
          });
          
          useUIStore.getState().addNotification('error', 'Ошибка загрузки задач', 5000);
        }
      },

      fetchTaskById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const task = await api.getTaskById(id);
          
          set((state) => {
            state.currentTask = task;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = (error as Error).message;
          });
          
          useUIStore.getState().addNotification('error', 'Ошибка загрузки задачи', 5000);
        }
      },

      createTask: async (taskData) => {
        const tempId = `temp-${Date.now()}`;
        const tempTask: Task = {
          ...taskData,
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Оптимистичное обновление
        set((state) => {
          state.tasks.unshift(tempTask);
          state.isSaving = true;
        });

        try {
          const newTask = await api.createTask(taskData);
          
          set((state) => {
            state.tasks = state.tasks.map((t) =>
              t.id === tempId ? newTask : t
            );
            state.isSaving = false;
          });

          useUIStore.getState().addNotification('success', 'Задача успешно создана', 3000);
        } catch (error) {
          // Откат при ошибке
          set((state) => {
            state.tasks = state.tasks.filter((t) => t.id !== tempId);
            state.isSaving = false;
            state.error = (error as Error).message;
          });

          useUIStore.getState().addNotification('error', 'Ошибка при создании задачи', 5000);
        }
      },

      updateTask: async (id: string, updates: Partial<Task>) => {
        const originalTask = get().tasks.find((t) => t.id === id);
        
        // Оптимистичное обновление
        set((state) => {
          state.tasks = state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          );
          if (state.currentTask?.id === id) {
            state.currentTask = { ...state.currentTask, ...updates };
          }
          state.isSaving = true;
        });

        try {
          const updatedTask = await api.updateTask(id, updates);
          
          set((state) => {
            state.tasks = state.tasks.map((t) =>
              t.id === id ? updatedTask : t
            );
            if (state.currentTask?.id === id) {
              state.currentTask = updatedTask;
            }
            state.isSaving = false;
          });

          useUIStore.getState().addNotification('success', 'Задача обновлена', 3000);
        } catch (error) {
          // Откат при ошибке
          if (originalTask) {
            set((state) => {
              state.tasks = state.tasks.map((t) =>
                t.id === id ? originalTask : t
              );
              if (state.currentTask?.id === id) {
                state.currentTask = originalTask;
              }
              state.isSaving = false;
              state.error = (error as Error).message;
            });
          }

          useUIStore.getState().addNotification('error', 'Ошибка при обновлении задачи', 5000);
        }
      },

      deleteTask: async (id: string) => {
        const taskToDelete = get().tasks.find((t) => t.id === id);
        
        // Оптимистичное удаление
        set((state) => {
          state.tasks = state.tasks.filter((t) => t.id !== id);
          state.isSaving = true;
        });

        try {
          await api.deleteTask(id);
          
          set({ isSaving: false });

          useUIStore.getState().addNotification('success', 'Задача удалена', 3000);
        } catch (error) {
          // Восстанавливаем при ошибке
          if (taskToDelete) {
            set((state) => {
              state.tasks.push(taskToDelete);
              state.isSaving = false;
              state.error = (error as Error).message;
            });
          }

          useUIStore.getState().addNotification('error', 'Ошибка при удалении задачи', 5000);
        }
      },

      // ========== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ==========

      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority);
      },

      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter(
          (task) => task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
        );
      },

      getTasksCount: () => {
        return get().tasks.length;
      },

      // ========== СБРОС ==========

      reset: () => {
        set(initialState);
      },
    })),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    }
  )
);
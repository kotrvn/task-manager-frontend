// src/store/commentStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '../utils/api';
import type { Comment, CommentState } from './types';
import { useUIStore } from './uiStore';

interface CommentStore extends CommentState {
  // ========== CRUD ОПЕРАЦИИ ==========
  fetchComments: (taskId: string) => Promise<void>;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;

  // ========== ВСПОМОГАТЕЛЬНЫЕ ==========
  getReplies: (taskId: string, commentId: string) => Comment[];
  clearComments: (taskId?: string) => void;
}

// Начальное состояние
const initialState: CommentState = {
  comments: {},
  isLoading: false,
  error: null,
};

export const useCommentStore = create<CommentStore>()(
  immer((set, get) => ({
    ...initialState,

    fetchComments: async (taskId: string) => {
      set({ isLoading: true, error: null });
      
      try {
        const data = await api.getComments(taskId);
        
        set((state) => {
          state.comments[taskId] = data.comments;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = (error as Error).message;
        });
        
        useUIStore.getState().addNotification('error', 'Ошибка загрузки комментариев', 5000);
      }
    },

    addComment: async (commentData) => {
      const tempId = `temp-${Date.now()}`;
      const tempComment: Comment = {
        ...commentData,
        id: tempId,
        createdAt: new Date().toISOString(),
      };

      // Оптимистичное обновление
      set((state) => {
        if (!state.comments[commentData.taskId]) {
          state.comments[commentData.taskId] = [];
        }
        state.comments[commentData.taskId].unshift(tempComment);
      });

      try {
        const newComment = await api.addComment(commentData);

        set((state) => {
          state.comments[commentData.taskId] = state.comments[commentData.taskId].map((c) =>
            c.id === tempId ? newComment : c
          );
        });

        useUIStore.getState().addNotification('success', 'Комментарий добавлен', 3000);
      } catch (error) {
        // Откат при ошибке
        set((state) => {
          state.comments[commentData.taskId] = state.comments[commentData.taskId].filter(
            (c) => c.id !== tempId
          );
          state.error = (error as Error).message;
        });

        useUIStore.getState().addNotification('error', 'Ошибка при добавлении комментария', 5000);
      }
    },

    updateComment: async (commentId: string, content: string) => {
      // Находим комментарий
      let taskId = '';
      let originalComment: Comment | undefined;

      for (const [tId, comments] of Object.entries(get().comments)) {
        const found = comments.find((c) => c.id === commentId);
        if (found) {
          taskId = tId;
          originalComment = found;
          break;
        }
      }

      if (!taskId || !originalComment) return;

      // Оптимистичное обновление
      set((state) => {
        state.comments[taskId] = state.comments[taskId].map((c) =>
          c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
        );
      });

      try {
        const updatedComment = await api.updateComment(commentId, content);
        
        set((state) => {
          state.comments[taskId] = state.comments[taskId].map((c) =>
            c.id === commentId ? updatedComment : c
          );
        });

        useUIStore.getState().addNotification('success', 'Комментарий обновлен', 3000);
      } catch (error) {
        // Откат
        set((state) => {
          state.comments[taskId] = state.comments[taskId].map((c) =>
            c.id === commentId ? originalComment! : c
          );
          state.error = (error as Error).message;
        });

        useUIStore.getState().addNotification('error', 'Ошибка при обновлении комментария', 5000);
      }
    },

    deleteComment: async (commentId: string) => {
      // Находим комментарий
      let taskId = '';
      let commentToDelete: Comment | undefined;

      for (const [tId, comments] of Object.entries(get().comments)) {
        const found = comments.find((c) => c.id === commentId);
        if (found) {
          taskId = tId;
          commentToDelete = found;
          break;
        }
      }

      if (!taskId || !commentToDelete) return;

      // Оптимистичное удаление
      set((state) => {
        state.comments[taskId] = state.comments[taskId].filter((c) => c.id !== commentId);
      });

      try {
        await api.deleteComment(commentId);

        useUIStore.getState().addNotification('success', 'Комментарий удален', 3000);
      } catch (error) {
        // Восстанавливаем
        set((state) => {
          state.comments[taskId].push(commentToDelete);
          state.error = (error as Error).message;
        });

        useUIStore.getState().addNotification('error', 'Ошибка при удалении комментария', 5000);
      }
    },

    getReplies: (taskId: string, commentId: string) => {
      const taskComments = get().comments[taskId] || [];
      return taskComments.filter(c => c.replyToId === commentId);
    },

    clearComments: (taskId?: string) => {
      set((state) => {
        if (taskId) {
          delete state.comments[taskId];
        } else {
          state.comments = {};
        }
      });
    },
  }))
);
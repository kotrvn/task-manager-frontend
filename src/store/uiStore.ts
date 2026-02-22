// src/store/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConfirmationModal, ModalState, NotificationType, UIState } from './types';

// Начальное состояние
const initialState = {
  theme: 'light' as const,
  sidebarOpen: true,
  tableColumns: ['title', 'status', 'priority', 'assignee', 'dueDate', 'actions'],
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  confirmationModal: null,
  notifications: [],
};

interface UIStore extends UIState {
  // ========== ТЕМА ==========
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // ========== МОДАЛКИ ==========
  openModal: (type: ModalState['type'], data?: any) => void;
  closeModal: () => void;

  // ========== МОДАЛКА ПОДТВЕРЖДЕНИЯ ==========
  openConfirmation: (config: Omit<ConfirmationModal, 'isOpen'>) => void;
  closeConfirmation: () => void;

  // ========== БОКОВАЯ ПАНЕЛЬ ==========
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // ========== НАСТРОЙКИ ТАБЛИЦЫ ==========
  setTableColumns: (columns: string[]) => void;
  toggleColumn: (column: string) => void;

  // ========== УВЕДОМЛЕНИЯ ==========
  addNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // ========== СБРОС ==========
  reset: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // ========== ТЕМА ==========
      toggleTheme: () => {
        set((state) => {
          state.theme = state.theme === 'light' ? 'dark' : 'light';
        });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      // ========== МОДАЛКИ ==========
      openModal: (type, data) => {
        set((state) => {
          state.modal = { isOpen: true, type, data };
        });
      },

      closeModal: () => {
        set((state) => {
          state.modal = { isOpen: false, type: null, data: null };
        });
      },

      // ========== МОДАЛКА ПОДТВЕРЖДЕНИЯ ==========
      openConfirmation: (config) => {
        set((state) => {
          state.confirmationModal = {
            ...config,
            isOpen: true,
          };
        });
      },

      closeConfirmation: () => {
        const { confirmationModal } = get();
        
        // Вызываем onCancel если он есть
        if (confirmationModal?.onCancel) {
          confirmationModal.onCancel();
        }
        
        set((state) => {
          state.confirmationModal = null;
        });
      },

      // ========== БОКОВАЯ ПАНЕЛЬ ==========
      toggleSidebar: () => {
        set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        });
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      // ========== НАСТРОЙКИ ТАБЛИЦЫ ==========
      setTableColumns: (columns) => {
        set({ tableColumns: columns });
      },

      toggleColumn: (column) => {
        set((state) => {
          if (state.tableColumns.includes(column)) {
            state.tableColumns = state.tableColumns.filter((c) => c !== column);
          } else {
            state.tableColumns.push(column);
          }
        });
      },

      // ========== УВЕДОМЛЕНИЯ ==========
      addNotification: (type, message, duration = 5000) => {
        const id = Date.now().toString();
        
        set((state) => {
          state.notifications.push({ id, type, message, duration });
        });

        // Автоматически удаляем уведомление через duration
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },

      removeNotification: (id) => {
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // ========== СБРОС ==========
      reset: () => {
        set(initialState);
      },
    })),
    {
      name: 'ui-storage', // Ключ в localStorage
      partialize: (state) => ({
        // Сохраняем только нужные поля
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        tableColumns: state.tableColumns,
        // Не сохраняем модалки и уведомления
      }),
    }
  )
);
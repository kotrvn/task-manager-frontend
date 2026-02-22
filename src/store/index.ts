// src/store/index.ts
export * from './commentStore';
export * from './taskStore';
export * from './types';
export * from './uiStore';

// Для удобства можно экспортировать хуки с селекторами
import { useCommentStore } from './commentStore';
import { useTaskStore } from './taskStore';
import { useUIStore } from './uiStore';

// Селекторы для UI
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebar = () => useUIStore((state) => state.sidebarOpen);
export const useModal = () => useUIStore((state) => state.modal);
export const useConfirmationModal = () => useUIStore((state) => state.confirmationModal);
export const useNotifications = () => useUIStore((state) => state.notifications);

// Селекторы для задач
export const useTasks = () => useTaskStore((state) => state.tasks);
export const useCurrentTask = () => useTaskStore((state) => state.currentTask);
export const useTasksLoading = () => useTaskStore((state) => state.isLoading);
export const useTasksError = () => useTaskStore((state) => state.error);

// Селекторы для комментариев
export const useComments = (taskId: string) => 
  useCommentStore((state) => state.comments[taskId] || []);
export const useCommentsLoading = () => useCommentStore((state) => state.isLoading);
export const useCommentsError = () => useCommentStore((state) => state.error);
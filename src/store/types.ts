// src/store/types.ts
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  projectId?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replyToId?: string | null; // ID комментария, на который это ответ
}

export interface Filters {
  status: TaskStatus[];
  priority: TaskPriority[];
  assignee: string[];
  search: string;
  tags: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Sort {
  field: keyof Task;
  order: 'asc' | 'desc';
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | null;
  data?: any;
}

// Интерфейс для модалки подтверждения
export interface ConfirmationModal {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

// Интерфейс для UI состояния
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  tableColumns: string[];
  modal: ModalState;
  confirmationModal: ConfirmationModal | null;
  notifications: Notification[];
}

// Интерфейс для состояния задач
export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

// Интерфейс для состояния комментариев
export interface CommentState {
  comments: Record<string, Comment[]>; // Индекс по taskId
  isLoading: boolean;
  error: string | null;
}
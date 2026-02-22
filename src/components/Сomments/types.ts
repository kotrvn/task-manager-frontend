// src/components/comments/types.ts
import type { Comment } from '../../store/types';

// Расширяем тип Comment для поддержки ответов
export interface CommentWithReplies extends Comment {
  replies?: Comment[];
  replyToId?: string | null;
  showReplyForm?: boolean;
}

export interface CommentFormData {
  content: string;
  replyToId?: string | null;
}
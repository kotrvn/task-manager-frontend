// src/components/comments/CommentList.tsx (обновленная версия с пропсами)
import React, { useState } from 'react';
import type { Comment } from '../../store/types';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { theme } from '../../styles/theme';

const styles = {
  container: {
    marginTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.lg,
    color: theme.colors.dark,
  },
  stats: {
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
  mainForm: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.sm,
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.md,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: theme.spacing.xl,
    color: theme.colors.gray[500],
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.fontSize.lg,
  },
};

interface CommentListProps {
  taskId: string;
  comments: Comment[];
  currentUser?: string;
  onAddComment: (content: string, replyToId?: string | null) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({
  taskId,
  comments,
  currentUser = 'Текущий пользователь',
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [showMainForm, setShowMainForm] = useState(false);

  // Группируем комментарии: основные и ответы
  const mainComments = comments.filter(c => !c.replyToId);
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.replyToId) {
      if (!acc[comment.replyToId]) {
        acc[comment.replyToId] = [];
      }
      acc[comment.replyToId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const handleReply = async (content: string, replyToId: string) => {
    await onAddComment(content, replyToId);
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={styles.title}>Комментарии</h2>
        <span style={styles.stats}>
          {comments.length} {comments.length === 1 ? 'комментарий' :
            comments.length >= 2 && comments.length <= 4 ? 'комментария' :
              'комментариев'}
        </span>
      </div>

      {!showMainForm ? (
        <button
          onClick={() => setShowMainForm(true)}
          style={{
            width: '100%',
            padding: theme.spacing.md,
            backgroundColor: theme.colors.white,
            border: `2px dashed ${theme.colors.gray[300]}`,
            borderRadius: theme.borderRadius.lg,
            color: theme.colors.gray[600],
            fontSize: theme.fontSize.md,
            cursor: 'pointer',
            marginBottom: theme.spacing.xl,
            transition: theme.transitions.default,
            ':hover': {
              borderColor: theme.colors.primary,
              color: theme.colors.primary,
              backgroundColor: theme.colors.gray[100],
            },
          }}
        >
          + Написать комментарий
        </button>
      ) : (
        <div style={styles.mainForm}>
          <CommentForm
            onSubmit={async (content) => {
              await onAddComment(content);
              setShowMainForm(false);
            }}
            onCancel={() => setShowMainForm(false)}
          />
        </div>
      )}

      {comments.length === 0 ? (
        <div style={styles.emptyState}>
          💬 Пока нет комментариев. Будьте первым!
        </div>
      ) : (
        <div style={styles.commentsList}>
          {mainComments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentUser={currentUser}
                onReply={handleReply}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
              />

              {/* Ответы на комментарий */}
              {repliesMap[comment.id]?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onReply={handleReply}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                  level="reply"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
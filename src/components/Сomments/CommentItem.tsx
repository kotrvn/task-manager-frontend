// src/components/comments/CommentItem.tsx
import React, { useState } from 'react';
import type { Comment } from '../../store/types';
import { theme } from '../../styles/theme';
import { CommentForm } from './CommentForm';

const styles = {
  comment: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.sm,
  },
  replyComment: {
    marginLeft: theme.spacing.xl,
    backgroundColor: theme.colors.gray[100],
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  author: {
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  content: {
    marginBottom: theme.spacing.sm,
    lineHeight: 1.5,
    color: theme.colors.dark,
  },
  actions: {
    display: 'flex',
    gap: theme.spacing.md,
  },
  actionButton: {
    background: 'none',
    border: 'none',
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.sm,
    cursor: 'pointer',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    transition: theme.transitions.default,
    ':hover': {
      backgroundColor: theme.colors.gray[200],
      color: theme.colors.primary,
    },
  },
  deleteButton: {
    ':hover': {
      color: theme.colors.danger,
    },
  },
  replyForm: {
    marginTop: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    borderLeft: `2px solid ${theme.colors.gray[300]}`,
  },
  edited: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
    fontStyle: 'italic',
    marginLeft: theme.spacing.sm,
  },
};

interface CommentItemProps {
  comment: Comment;
  currentUser?: string;
  onReply: (content: string, replyToId: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  level?: 'comment' | 'reply';
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser = 'Текущий пользователь',
  onReply,
  onEdit,
  onDelete,
  level = 'comment',
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleReply = async (content: string) => {
    await onReply(content, comment.id);
    setIsReplying(false);
  };

  const handleEdit = async () => {
    if (onEdit && editContent.trim() !== comment.content) {
      await onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (onDelete && window.confirm('Удалить комментарий?')) {
      await onDelete(comment.id);
    }
  };

  const isAuthor = comment.author === currentUser;
  const commentDate = new Date(comment.createdAt).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{
      ...styles.comment,
      ...(level === 'reply' ? styles.replyComment : {})
    }}>
      <div style={styles.header}>
        <span style={styles.author}>{comment.author}</span>
        <div>
          <span style={styles.date}>{commentDate}</span>
          {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
            <span style={styles.edited}>(ред.)</span>
          )}
        </div>
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm,
              border: `1px solid ${theme.colors.gray[300]}`,
              marginBottom: theme.spacing.sm,
              minHeight: '80px',
            }}
          />
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <button
              onClick={handleEdit}
              style={{ ...styles.actionButton, color: theme.colors.success }}
            >
              Сохранить
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={styles.actionButton}
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={styles.content}>{comment.content}</div>

          <div style={styles.actions}>
            <button
              onClick={() => setIsReplying(!isReplying)}
              style={styles.actionButton}
            >
              {isReplying ? 'Отмена' : 'Ответить'}
            </button>

            {isAuthor && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.actionButton}
              >
                Редактировать
              </button>
            )}

            {isAuthor && onDelete && (
              <button
                onClick={handleDelete}
                style={{ ...styles.actionButton, ...styles.deleteButton }}
              >
                Удалить
              </button>
            )}
          </div>
        </>
      )}

      {isReplying && (
        <div style={styles.replyForm}>
          <CommentForm
            onSubmit={async (content) => {
              await handleReply(content);
              setIsReplying(false);
            }}
            onCancel={() => setIsReplying(false)}
            replyToAuthor={comment.author}
            replyToId={comment.id}
            placeholder={`Ответ ${comment.author}...`}
            submitLabel="Ответить"
          />
        </div>
      )}
    </div>
  );
};
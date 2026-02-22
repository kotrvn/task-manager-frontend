// src/components/comments/CommentForm.tsx
import React, { useState } from 'react';
import { theme } from '../../styles/theme';

const styles = {
  form: {
    marginBottom: theme.spacing.lg,
  },
  textarea: {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    minHeight: '100px',
    marginBottom: theme.spacing.sm,
    transition: theme.transitions.default,
    ':focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    fontSize: theme.fontSize.md,
    cursor: 'pointer',
    transition: theme.transitions.default,
    ':hover': {
      backgroundColor: '#0052a3',
    },
    ':disabled': {
      backgroundColor: theme.colors.gray[400],
      cursor: 'not-allowed',
    },
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: theme.colors.gray[600],
    border: `1px solid ${theme.colors.gray[300]}`,
    marginRight: theme.spacing.sm,
    ':hover': {
      backgroundColor: theme.colors.gray[100],
    },
  },
  replyInfo: {
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: theme.colors.gray[500],
    cursor: 'pointer',
    fontSize: theme.fontSize.lg,
    padding: `0 ${theme.spacing.xs}`,
    ':hover': {
      color: theme.colors.danger,
    },
  },
};

interface CommentFormProps {
  onSubmit: (content: string, replyToId?: string | null) => Promise<void>;
  onCancel?: () => void;
  replyToAuthor?: string;
  replyToId?: string | null;
  placeholder?: string;
  submitLabel?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  replyToAuthor,
  replyToId,
  placeholder = 'Напишите комментарий...',
  submitLabel = 'Отправить',
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), replyToId);
      setContent('');
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {replyToAuthor && (
        <div style={styles.replyInfo}>
          <span style={styles.replyText}>
            Ответ пользователю <strong>{replyToAuthor}</strong>
          </span>
          <button
            type="button"
            onClick={onCancel}
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        style={styles.textarea}
        disabled={isSubmitting}
      />

      <div style={styles.footer}>
        <div>
          {onCancel && !replyToAuthor && (
            <button
              type="button"
              onClick={onCancel}
              style={{ ...styles.button, ...styles.cancelButton }}
            >
              Отмена
            </button>
          )}
        </div>
        <button
          type="submit"
          style={styles.button}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
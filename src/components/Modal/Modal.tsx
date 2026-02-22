// src/components/common/Modal.tsx
import React, { useEffect } from 'react';
import { theme } from '../../styles/theme';

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: theme.shadows.lg,
    animation: 'slideIn 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.dark,
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: theme.colors.gray[500],
    ':hover': {
      color: theme.colors.danger,
    },
  },
  content: {
    marginBottom: theme.spacing.xl,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
  },
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.content}>
          {children}
        </div>

        {footer && (
          <div style={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
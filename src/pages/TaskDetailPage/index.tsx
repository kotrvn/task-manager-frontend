import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal';
import { TaskEditForm } from '../../components/TaskEditForm/TaskEditForm';
import { CommentList } from '../../components/Сomments/CommentList';
import { useCommentStore } from '../../store/commentStore';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../styles/theme';


const styles = {
  container: {
    padding: theme.spacing.lg,
    maxWidth: '800px',
    margin: '0 auto',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    cursor: 'pointer',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    ':hover': {
      textDecoration: 'underline',
    },
  },
  taskCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
    marginBottom: theme.spacing.xl,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.dark,
    margin: 0,
  },
  meta: {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap' as const,
  },
  status: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
  statusTodo: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusInProgress: {
    backgroundColor: '#cce5ff',
    color: '#004085',
  },
  statusDone: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  priority: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
  priorityLow: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  priorityMedium: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  priorityHigh: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  description: {
    fontSize: theme.fontSize.lg,
    lineHeight: 1.6,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.xl,
    whiteSpace: 'pre-wrap' as const,
  },
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.dark,
    fontWeight: 'bold',
  },
  tags: {
    display: 'flex',
    gap: theme.spacing.sm,
    flexWrap: 'wrap' as const,
  },
  tag: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
  },
  actions: {
    display: 'flex',
    gap: theme.spacing.md,
    justifyContent: 'flex-end',
  },
  button: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.md,
    cursor: 'pointer',
    transition: theme.transitions.default,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    ':hover': {
      backgroundColor: '#0052a3',
    },
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
    ':hover': {
      backgroundColor: '#bd2130',
    },
  },
  loading: {
    textAlign: 'center' as const,
    padding: theme.spacing.xl,
    color: theme.colors.gray[600],
  },
  error: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  editModal: {
    maxWidth: '600px',
    width: '90%',
  },
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'todo':
      return { ...styles.status, ...styles.statusTodo };
    case 'in-progress':
      return { ...styles.status, ...styles.statusInProgress };
    case 'done':
      return { ...styles.status, ...styles.statusDone };
    default:
      return styles.status;
  }
};

const getStatusText = (status: string) => {
  const statusMap = {
    'todo': 'К выполнению',
    'in-progress': 'В работе',
    'done': 'Выполнено',
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'low':
      return { ...styles.priority, ...styles.priorityLow };
    case 'medium':
      return { ...styles.priority, ...styles.priorityMedium };
    case 'high':
      return { ...styles.priority, ...styles.priorityHigh };
    default:
      return styles.priority;
  }
};

const getPriorityText = (priority: string) => {
  const priorityMap = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': 'Высокий',
  };
  return priorityMap[priority as keyof typeof priorityMap] || priority;
};

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentTask, isLoading, error, fetchTaskById, updateTask, deleteTask } = useTaskStore();
  const { comments, fetchComments, addComment, updateComment, deleteComment } = useCommentStore();
  const { openConfirmation } = useUIStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<Task> | null>(null);

  useEffect(() => {
    if (id) {
      fetchTaskById(id);
      fetchComments(id);
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Функция вызывается из формы при нажатии "Сохранить изменения"
  const handleSaveClick = (updatedTask: Partial<Task>) => {
    // Сохраняем изменения в состояние
    setPendingChanges(updatedTask);

    // Открываем модалку подтверждения
    openConfirmation({
      title: 'Сохранить изменения?',
      message: 'Вы уверены, что хотите сохранить изменения в задаче?',
      confirmText: 'Сохранить',
      cancelText: 'Отмена',
      onConfirm: async () => {
        if (id && updatedTask) { // Используем updatedTask напрямую, не из pendingChanges
          await updateTask(id, updatedTask);
          setIsEditModalOpen(false);
          setPendingChanges(null);
        }
      },
      onCancel: () => {
        // Просто закрываем модалку подтверждения, остаемся в режиме редактирования
        setPendingChanges(null);
      },
    });
  };

  const handleCancelEdit = () => {
    if (pendingChanges) {
      // Если есть несохраненные изменения, спрашиваем
      openConfirmation({
        title: 'Отменить изменения?',
        message: 'У вас есть несохраненные изменения. Вы действительно хотите выйти?',
        confirmText: 'Выйти',
        cancelText: 'Продолжить редактирование',
        onConfirm: () => {
          setIsEditModalOpen(false);
          setPendingChanges(null);
        },
        onCancel: () => {
          // Остаемся в режиме редактирования
        },
      });
    } else {
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = () => {
    if (!id) return;

    openConfirmation({
      title: 'Удаление задачи',
      message: 'Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      onConfirm: async () => {
        await deleteTask(id);
        navigate('/');
      },
    });
  };

  const handleAddComment = async (content: string, replyToId?: string | null) => {
    if (!id) return;

    await addComment({
      taskId: id,
      author: 'Текущий пользователь',
      content,
      replyToId: replyToId || null,
    });
  };

  const handleEditComment = async (commentId: string, content: string) => {
    await updateComment(commentId, content);
  };

  const handleDeleteComment = async (commentId: string) => {
    openConfirmation({
      title: 'Удаление комментария',
      message: 'Вы уверены, что хотите удалить этот комментарий?',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      onConfirm: async () => {
        await deleteComment(commentId);
      },
    });
  };

  if (isLoading) {
    return <div style={styles.loading}>Загрузка задачи...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!currentTask) {
    return <div style={styles.loading}>Задача не найдена</div>;
  }

  const taskComments = comments[id!] || [];

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate(-1)}
        style={styles.backButton}
      >
        ← Назад к списку
      </button>

      <div style={styles.taskCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>{currentTask.title}</h1>
          <div style={styles.meta}>
            <span style={getStatusStyle(currentTask.status)}>
              {getStatusText(currentTask.status)}
            </span>
            <span style={getPriorityStyle(currentTask.priority)}>
              {getPriorityText(currentTask.priority)}
            </span>
          </div>
        </div>

        <div style={styles.description}>
          {currentTask.description}
        </div>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Исполнитель</span>
            <span style={styles.detailValue}>{currentTask.assignee}</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Создана</span>
            <span style={styles.detailValue}>
              {new Date(currentTask.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {currentTask.dueDate && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Срок выполнения</span>
              <span style={styles.detailValue}>
                {new Date(currentTask.dueDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          {currentTask.tags && currentTask.tags.length > 0 && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Теги</span>
              <div style={styles.tags}>
                {currentTask.tags.map(tag => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={styles.actions}>
          <button
            onClick={handleEditClick}
            style={{ ...styles.button, ...styles.editButton }}
          >
            Редактировать
          </button>
          <button
            onClick={handleDeleteClick}
            style={{ ...styles.button, ...styles.deleteButton }}
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Модалка редактирования */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="Редактирование задачи"
      >
        {currentTask && (
          <TaskEditForm
            task={currentTask}
            onSave={handleSaveClick}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>

      <CommentList
        taskId={id!}
        comments={taskComments}
        currentUser="Текущий пользователь"
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

export default TaskDetailPage;
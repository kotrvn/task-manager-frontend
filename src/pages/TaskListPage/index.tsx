import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFiltersStore } from '../../store/filtersStore';
import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { theme } from '../../styles/theme';

const styles = {
  container: {
    padding: theme.spacing.lg,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.dark,
    margin: 0,
  },
  createButton: {
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
  },
  filters: {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
    flex: 1,
    minWidth: '200px',
  },
  select: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.white,
    cursor: 'pointer',
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing.lg,
  },
  taskCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.sm,
    transition: theme.transitions.default,
    cursor: 'pointer',
    ':hover': {
      boxShadow: theme.shadows.md,
      transform: 'translateY(-2px)',
    },
  },
  taskTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.dark,
  },
  taskMeta: {
    display: 'flex',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap' as const,
  },
  status: {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
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
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
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
  taskDescription: {
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
    lineHeight: 1.5,
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  assignee: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
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
  emptyState: {
    textAlign: 'center' as const,
    padding: theme.spacing.xl,
    color: theme.colors.gray[500],
    fontSize: theme.fontSize.lg,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.colors.danger,
    cursor: 'pointer',
    fontSize: theme.fontSize.lg,
    padding: theme.spacing.xs,
    ':hover': {
      opacity: 0.8,
    },
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

const getStatusText = (status: string) => {
  const statusMap = {
    'todo': 'К выполнению',
    'in-progress': 'В работе',
    'done': 'Выполнено',
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const getPriorityText = (priority: string) => {
  const priorityMap = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': 'Высокий',
  };
  return priorityMap[priority as keyof typeof priorityMap] || priority;
};

export const TaskListPage: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, deleteTask } = useTaskStore();
  const { filters, setFilters, searchQuery, setSearchQuery } = useFiltersStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFilters({ search: e.target.value });
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      status: value ? [value as any] : []
    });
  };

  const handlePriorityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      priority: value ? [value as any] : []
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
      await deleteTask(id);
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Загрузка задач...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Список задач</h1>
        <button
          style={styles.createButton}
          onClick={() => openModal('create')}
        >
          + Новая задача
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchInput}
        />

        <select
          onChange={handleStatusFilter}
          style={styles.select}
          defaultValue=""
        >
          <option value="">Все статусы</option>
          <option value="todo">К выполнению</option>
          <option value="in-progress">В работе</option>
          <option value="done">Выполнено</option>
        </select>

        <select
          onChange={handlePriorityFilter}
          style={styles.select}
          defaultValue=""
        >
          <option value="">Все приоритеты</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div style={styles.emptyState}>
          {searchQuery || filters.status.length || filters.priority.length
            ? 'Задачи не найдены по выбранным фильтрам'
            : 'Создайте свою первую задачу!'}
        </div>
      ) : (
        <div style={styles.taskGrid}>
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/task/${task.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={styles.taskCard}>
                <div style={styles.taskTitle}>{task.title}</div>

                <div style={styles.taskMeta}>
                  <span style={getStatusStyle(task.status)}>
                    {getStatusText(task.status)}
                  </span>
                  <span style={getPriorityStyle(task.priority)}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>

                <div style={styles.taskDescription}>
                  {task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </div>

                <div style={styles.taskFooter}>
                  <div style={styles.assignee}>
                    <span>👤</span>
                    <span>{task.assignee}</span>
                  </div>
                  <div>
                    {new Date(task.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                  <button
                    onClick={(e) => handleDelete(task.id, e)}
                    style={styles.deleteButton}
                    title="Удалить задачу"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
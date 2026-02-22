// src/components/tasks/TaskEditForm.tsx
import React, { useState } from 'react';
import type { Task } from '../../store/types';
import { theme } from '../../styles/theme';



interface TaskEditFormProps {
  task: Task;
  onSave: (updatedTask: Partial<Task>) => void;
  onCancel: () => void;
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
  task,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    dueDate: task.dueDate || '',
    tags: task.tags.join(', '),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask: Partial<Task> = {
      title: formData.title,
      description: formData.description,
      status: formData.status as Task['status'],
      priority: formData.priority as Task['priority'],
      assignee: formData.assignee,
      dueDate: formData.dueDate || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    onSave(updatedTask);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>Название задачи</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Статус</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="todo">К выполнению</option>
            <option value="in-progress">В работе</option>
            <option value="done">Выполнено</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Приоритет</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Исполнитель</label>
          <input
            type="text"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Срок выполнения</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            style={styles.dateInput}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>
          Теги (через запятую)
          <span style={{ fontSize: theme.fontSize.sm, color: theme.colors.gray[500], marginLeft: theme.spacing.sm }}>
            например: работа, срочно, обучение
          </span>
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          style={styles.input}
          placeholder="работа, срочно, обучение"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.gray[300]}`,
            borderRadius: theme.borderRadius.sm,
            color: theme.colors.gray[700],
            cursor: 'pointer',
            fontSize: theme.fontSize.md,
          }}
        >
          Отмена
        </button>
        <button
          type="submit"
          style={{
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.primary,
            border: 'none',
            borderRadius: theme.borderRadius.sm,
            color: theme.colors.white,
            cursor: 'pointer',
            fontSize: theme.fontSize.md,
          }}
        >
          Сохранить изменения
        </button>
      </div>
    </form>
  );
};
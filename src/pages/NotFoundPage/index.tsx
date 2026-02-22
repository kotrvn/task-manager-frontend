// src/pages/NotFoundPage/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';

const styles = {
  container: {
    textAlign: 'center' as const,
    padding: theme.spacing.xxl,
  },
  title: {
    fontSize: '4rem',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xl,
  },
  link: {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontSize: theme.fontSize.lg,
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Страница не найдена</h2>
      <Link to="/" style={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFoundPage;
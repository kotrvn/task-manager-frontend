import React from 'react';
import { theme } from '../../styles/theme';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    width: '100%',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `3px solid ${theme.colors.gray[200]}`,
    borderTopColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
    </div>
  );
};

// Для Suspense
export const PageLoader: React.FC = () => (
  <div style={{ padding: theme.spacing.xl }}>
    <LoadingSpinner />
  </div>
);
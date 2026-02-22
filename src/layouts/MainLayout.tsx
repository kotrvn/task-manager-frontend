import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { theme } from '../styles/theme';

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    backgroundColor: theme.colors.dark,
    color: theme.colors.white,
    padding: theme.spacing.md,
    boxShadow: theme.shadows.md,
  },
  nav: {
    display: 'flex',
    gap: theme.spacing.lg,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  navLink: {
    color: theme.colors.gray[300],
    textDecoration: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    transition: theme.transitions.default,
    ':hover': {
      color: theme.colors.white,
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  activeNavLink: {
    color: theme.colors.white,
    backgroundColor: theme.colors.primary,
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing.xl,
    width: '100%',
  },
  footer: {
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing.lg,
    textAlign: 'center' as const,
    color: theme.colors.gray[600],
    borderTop: `1px solid ${theme.colors.gray[200]}`,
  },
};

export const MainLayout: React.FC = () => {
  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeNavLink : {}),
            })}
          >
            📋 Список задач
          </NavLink>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeNavLink : {}),
            })}
          >
            📊 Дашборд
          </NavLink>
        </nav>
      </header>

      <main style={styles.main}>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      <footer style={styles.footer}>
        <p>Task Manager © 2024 - Управление задачами</p>
      </footer>
    </div>
  );
};
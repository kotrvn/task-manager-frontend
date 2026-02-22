import { theme } from '../../../styles/theme';

export const styles = {
  nav: {
    display: 'flex',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.dark,
  },
  link: {
    color: theme.colors.white,
    textDecoration: 'none',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  active: {
    backgroundColor: theme.colors.primary,
  },
};
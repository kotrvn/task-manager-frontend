import { theme } from "../../../styles/theme";

export const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.md,
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.gray[700],
  },
  input: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
    transition: theme.transitions.default,
    ':focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
    },
  },
  textarea: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
    minHeight: '100px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    ':focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
    },
  },
  select: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
    backgroundColor: theme.colors.white,
    cursor: 'pointer',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.md,
  },
  dateInput: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.gray[300]}`,
    fontSize: theme.fontSize.md,
  },
};
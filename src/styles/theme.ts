// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#212529',
    white: '#ffffff',
    gray: {
      100: '#f8f9fa',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  fontSize: {
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem'
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    round: '50%'
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 25px rgba(0,0,0,0.1)'
  },
  
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease'
  }
};

// CSS custom properties для глобальных стилей
export const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: `var(--bg-primary, ${theme.colors.light})`,
    color: `var(--text-primary, ${theme.colors.dark})`,
    lineHeight: 1.5,
    transition: theme.transitions.default
  },
  ':root': {
    '--bg-primary': theme.colors.light,
    '--bg-secondary': theme.colors.white,
    '--text-primary': theme.colors.dark,
    '--text-secondary': theme.colors.gray[600],
    '--border-color': theme.colors.gray[300],
    '--primary-color': theme.colors.primary,
    '--success-color': theme.colors.success,
    '--danger-color': theme.colors.danger
  },
  
} as const;
import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2e7d32' },
    secondary: { main: '#D4AF37', contrastText: '#1a1a1a' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#666' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    // TAP-TARGET FLOOR — ≥44px
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 44 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: 44, minHeight: 44 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { minHeight: 44 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { minHeight: 44 },
      },
    },
    // VISIBLE KEYBOARD FOCUS RING — 2px PRIMARY OUTLINE WITH OFFSET
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '2px solid #2e7d32',
            outlineOffset: 2,
          },
        },
      },
    },
    // REDUCED MOTION — DISABLE NON-ESSENTIAL ANIMATION
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
  },
});

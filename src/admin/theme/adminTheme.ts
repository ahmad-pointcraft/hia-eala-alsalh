import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2e7d32' },
    secondary: { main: '#D4AF37' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#1a1a1a', secondary: '#666' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
});

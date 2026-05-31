import { createTheme } from '@mui/material/styles';
import { getTokens, type ThemeMode } from './tokens';

export function createAppTheme(mode: ThemeMode) {
  const t = getTokens(mode);

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 1024,
        lg: 1920,
        xl: 2560,
      },
    },
    palette: {
      mode,
      primary: {
        main: t.gold.main,
        light: t.gold.light,
        dark: t.gold.dark,
        contrastText: t.text.contrast,
      },
      secondary: {
        main: t.green.main,
        light: t.green.light,
        dark: t.green.dark,
        contrastText: t.text.onDark,
      },
      background: {
        default: t.background.default,
        paper: t.background.paper,
      },
      error: {
        main: t.error.main,
        light: t.error.light,
        dark: t.error.dark,
        contrastText: t.text.onDark,
      },
      text: {
        primary: t.text.primary,
        secondary: t.text.secondary,
      },
      divider: t.border.thin,
    },
    typography: {
      fontFamily: '"Open Sans", "Noto Naskh Arabic", sans-serif',
      h1: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.3,
      },
      h4: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h5: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
      },
      h6: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 600,
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      subtitle1: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      subtitle2: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      body1: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,
      },
      button: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 600,
        textTransform: 'none',
      },
      caption: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
      },
      overline: {
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            minHeight: 44,
            minWidth: 44,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            minWidth: 0,
            minHeight: 0,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#0a1f0a' : '#ffffff',
            backgroundImage: 'none',
            border: `1px solid ${t.border.thin}`,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.background.default,
            backgroundImage: `linear-gradient(45deg, ${t.border.faint} 25%, transparent 25%, transparent 75%, ${t.border.faint} 75%, ${t.border.faint}), linear-gradient(45deg, ${t.border.faint} 25%, transparent 25%, transparent 75%, ${t.border.faint} 75%, ${t.border.faint})`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: `${t.border.medium} transparent`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: t.background.paper,
            border: `1px solid ${t.border.subtle}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: t.background.paper,
            border: `1px solid ${t.border.subtle}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          containedPrimary: {
            color: t.text.onGold,
            '&:hover': {
              backgroundColor: t.gold.light,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: t.border.thin,
          },
        },
      },
    },
  });

  theme.palette.gold = {
    main: t.gold.main,
    light: t.gold.light,
    dark: t.gold.dark,
    onLight: t.gold.onLight,
  };
  theme.palette.surface = t.surface;
  theme.palette.border = t.border;
  theme.palette.glow = t.glow;
  Object.assign(theme.palette.text, {
    muted: t.text.muted,
    soft: t.text.soft,
  });

  return theme;
}

declare module '@mui/material/styles' {
  interface Palette {
    gold: { main: string; light: string; dark: string; onLight: string };
    surface: {
      overlay: string;
      raised: string;
      medium: string;
      deep: string;
      heavy: string;
      darker: string;
      opaque: string;
    };
    border: {
      faint: string;
      subtle: string;
      thin: string;
      light: string;
      default: string;
      medium: string;
      strong: string;
      prominent: string;
      intense: string;
    };
    glow: { subtle: string; medium: string; strong: string };
  }
  interface PaletteOptions {
    gold?: { main: string; light: string; dark: string; onLight: string };
    surface?: {
      overlay: string;
      raised: string;
      medium: string;
      deep: string;
      heavy: string;
      darker: string;
      opaque: string;
    };
    border?: {
      faint: string;
      subtle: string;
      thin: string;
      light: string;
      default: string;
      medium: string;
      strong: string;
      prominent: string;
      intense: string;
    };
    glow?: { subtle: string; medium: string; strong: string };
  }
  interface TypeText {
    muted: string;
    soft: string;
  }
}

export default createAppTheme;

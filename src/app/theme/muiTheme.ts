import { createTheme } from "@mui/material/styles";
import { colors } from "./tokens";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.gold.main,
      light: colors.gold.light,
      dark: colors.gold.dark,
      contrastText: colors.text.contrast,
    },
    secondary: {
      main: colors.green.main,
      light: colors.green.light,
      dark: colors.green.dark,
      contrastText: colors.text.onDark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
      contrastText: colors.text.onDark,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.border.thin,
  },
  typography: {
    fontFamily: '"Open Sans", "Noto Naskh Arabic", sans-serif',
    h1: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    subtitle1: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
    button: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.66,
    },
    overline: {
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: 2.66,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          backgroundImage:
            `linear-gradient(45deg, ${colors.border.faint} 25%, transparent 25%, transparent 75%, ${colors.border.faint} 75%, ${colors.border.faint}), linear-gradient(45deg, ${colors.border.faint} 25%, transparent 25%, transparent 75%, ${colors.border.faint} 75%, ${colors.border.faint})`,
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.border.medium} transparent`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.paper,
          border: `1px solid ${colors.border.subtle}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.paper,
          border: `1px solid ${colors.border.subtle}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          color: colors.text.onGold,
          "&:hover": {
            backgroundColor: colors.gold.light,
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
          borderColor: colors.border.thin,
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    gold: { main: string; light: string; dark: string };
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
    gold?: { main: string; light: string; dark: string };
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
  interface PaletteText {
    whiteMuted: string;
    whiteSoft: string;
  }
}

muiTheme.palette.gold = colors.gold;
muiTheme.palette.surface = colors.surface;
muiTheme.palette.border = colors.border;
muiTheme.palette.glow = colors.glow;
muiTheme.palette.text = {
  ...muiTheme.palette.text,
  whiteMuted: colors.text.whiteMuted,
  whiteSoft: colors.text.whiteSoft,
};

export default muiTheme;

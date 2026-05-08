import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D4AF37",
      light: "#FFD700",
      dark: "#B8960C",
      contrastText: "#0a1f0a",
    },
    secondary: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a1f0a",
      paper: "rgba(0,0,0,0.3)",
    },
    error: {
      main: "#d4183d",
      light: "#ff4d6a",
      dark: "#a30025",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#9ca3af",
    },
    divider: "rgba(212, 175, 55, 0.12)",
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
          backgroundColor: "#0a1f0a",
          backgroundImage:
            "linear-gradient(45deg, rgba(212, 175, 55, 0.02) 25%, transparent 25%, transparent 75%, rgba(212, 175, 55, 0.02) 75%, rgba(212, 175, 55, 0.02)), linear-gradient(45deg, rgba(212, 175, 55, 0.02) 25%, transparent 25%, transparent 75%, rgba(212, 175, 55, 0.02) 75%, rgba(212, 175, 55, 0.02))",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(212, 175, 55, 0.3) transparent",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(212, 175, 55, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(212, 175, 55, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          color: "#0a1f0a",
          "&:hover": {
            backgroundColor: "#FFD700",
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
          borderColor: "rgba(212, 175, 55, 0.12)",
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    gold: {
      main: string;
      light: string;
    };
  }
  interface PaletteOptions {
    gold?: {
      main: string;
      light: string;
    };
  }
}

muiTheme.palette.gold = {
  main: "#D4AF37",
  light: "#FFD700",
};

export default muiTheme;

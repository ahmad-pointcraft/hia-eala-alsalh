import { useState, useMemo, useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./muiTheme";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import type { ThemeMode } from "./tokens";

const STORAGE_KEY = "masjid-theme";

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return "dark";
}

function writeStoredMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage unavailable — ignore
  }
}

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export default function ThemeProviderWrapper({
  children,
}: ThemeProviderWrapperProps) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    writeStoredMode(next);
  };

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, toggleTheme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

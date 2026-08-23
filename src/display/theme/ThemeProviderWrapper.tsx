import { useState, useMemo, useEffect, type ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './muiTheme';
import { ThemeContext, type ThemeContextValue } from './ThemeContext';
import type { ThemeMode } from './tokens';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';

const STORAGE_KEY = 'masjid-theme';

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return 'dark';
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

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const configThemeMode = useMosqueConfigStore((s) => s.config.themeMode);
  const [mode, setModeState] = useState<ThemeMode>(() => configThemeMode || readStoredMode());

  // SYNCHRONIZE DISPLAY THEME WHEN ADMIN CONFIG CHANGES
  useEffect(() => {
    if (configThemeMode === 'light' || configThemeMode === 'dark') {
      setModeState(configThemeMode);
      writeStoredMode(configThemeMode);
    }
  }, [configThemeMode]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    writeStoredMode(next);
  };

  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
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

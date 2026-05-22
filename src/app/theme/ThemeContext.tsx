import { createContext, useContext } from "react";
import type { ThemeMode } from "./tokens";

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  setMode: () => {},
  toggleTheme: () => {},
});

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context;
}

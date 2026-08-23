import { useMediaQuery, useTheme } from '@mui/material';

/**
 * True when the viewport is strictly below the given stock MUI breakpoint.
 * `md` → phone/tablet layout (temporary drawer); `sm` → phone layout
 * (stacked cards, full-screen dialogs).
 */
export function useIsMobile(breakpoint: 'sm' | 'md'): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
}

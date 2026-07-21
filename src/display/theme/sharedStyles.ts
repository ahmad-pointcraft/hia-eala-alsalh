import type { Theme } from '@mui/material/styles';

export const floatingCardSx = (theme: Theme) => ({
  bgcolor: 'surface.raised' as const,
  border: '1px solid',
  borderColor: 'border.thin',
  borderRadius: '24px',
  backdropFilter: 'blur(16px)',
  boxShadow: `0 8px 32px ${theme.palette.surface.overlay}`,
});

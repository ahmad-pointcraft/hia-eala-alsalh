import type { ReactNode } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';

export interface EmptyStateAction {
  /** CTA button label, e.g., "Create your first announcement". */
  label: string;
  /** Owned by the parent list — EmptyState stays presentational. */
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Optional MUI icon node rendered above the title. */
  icon?: ReactNode;
  /** Primary empty-state line, e.g., "No announcements yet". */
  title: string;
  /** Optional explanatory line under the title. */
  description?: string;
  /** Optional "create first" CTA. */
  action?: EmptyStateAction;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        {icon && (
          <Typography color="action.active" aria-hidden="true">
            {icon}
          </Typography>
        )}
        <Typography color="text.secondary">{title}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {action && (
          <Button
            variant="contained"
            color="primary"
            onClick={action.onClick}
            sx={{
              mt: 1,
              fontWeight: '700',
              transition: 'all 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Paper>
  );
}

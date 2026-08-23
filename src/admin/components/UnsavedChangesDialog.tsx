import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import type { Blocker } from 'react-router-dom';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';

export interface UnsavedChangesDialogProps {
  /** The router navigation blocker returned from useDirtyGuard or useBlocker. */
  blocker: Blocker;
  /** Optional custom prompt message. */
  message?: string;
}

/**
 * Reusable modal dialog for router navigation blocking with unsaved changes.
 * Follows DRY across all form pages (Timings, DisplaySettings, etc.).
 */
export function UnsavedChangesDialog({
  blocker,
  message = 'You have unsaved changes. Leave without saving?',
}: UnsavedChangesDialogProps) {
  const fullScreen = useDialogFullScreen();

  if (blocker.state !== 'blocked') return null;

  return (
    <Dialog open onClose={() => blocker.reset?.()} fullScreen={fullScreen} maxWidth="xs" fullWidth>
      <DialogTitle>Unsaved Changes</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset?.()}>Stay</Button>
        <Button color="error" onClick={() => blocker.proceed?.()}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
}

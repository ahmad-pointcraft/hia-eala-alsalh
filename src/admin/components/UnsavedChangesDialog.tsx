import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { WarningAmberRounded as WarningIcon } from '@mui/icons-material';
import type { Blocker } from 'react-router-dom';
import { useDialogFullScreen } from '@/admin/hooks';

export interface UnsavedChangesDialogProps {
  /** The router navigation blocker returned from useDirtyGuard or useBlocker (for page routes). */
  blocker?: Blocker;
  /** Explicit open state (for standalone dialogs/modals). */
  open?: boolean;
  /** Optional custom prompt message. */
  message?: string;
  /** Stay callback when not using blocker. */
  onStay?: () => void;
  /** Discard / Leave callback when not using blocker. */
  onDiscard?: () => void;
}

/**
 * Reusable modal dialog for router navigation blocking with unsaved changes.
 * Supports both page navigation blocking (via router blocker) and modal closing guards (via open/onStay/onDiscard).
 */
export function UnsavedChangesDialog({
  blocker,
  open,
  message = 'You have unsaved changes. If you leave now, your modifications will be discarded.',
  onStay,
  onDiscard,
}: UnsavedChangesDialogProps) {
  const fullScreen = useDialogFullScreen();

  const isBlocked = blocker ? blocker.state === 'blocked' : Boolean(open);
  if (!isBlocked) return null;

  const handleStay = () => {
    if (blocker) blocker.reset?.();
    else onStay?.();
  };

  const handleDiscard = () => {
    if (blocker) blocker.proceed?.();
    else onDiscard?.();
  };

  return (
    <Dialog
      open
      onClose={handleStay}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'rgba(237, 108, 2, 0.12)',
            color: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WarningIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.1rem" lineHeight={1.2}>
            Unsaved Changes
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" fontSize="0.95rem" lineHeight={1.5}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ pt: 1, pb: 2.5, px: 3, justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleStay}
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 600,
            borderColor: 'rgba(0, 0, 0, 0.15)',
          }}
        >
          Stay
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDiscard}
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.25)',
          }}
        >
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}



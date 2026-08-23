import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack } from '@mui/material';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';

/**
 * Confirmation dialog shown before every delete
 */
export interface ConfirmDeleteDialogProps {
  open: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  open,
  itemName,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const fullScreen = useDialogFullScreen();

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <WarningAmberIcon color="error" />
          Delete?
        </Stack>
      </DialogTitle>
      <DialogContent>
        Are you sure you want to delete <strong>{itemName}</strong>? This cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

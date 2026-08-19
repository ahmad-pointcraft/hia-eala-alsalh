import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Stack } from '@mui/material';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';

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
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
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

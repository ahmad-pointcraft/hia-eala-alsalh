import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'rgba(211, 47, 47, 0.1)',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <DeleteIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.1rem" lineHeight={1.2}>
            Delete Item
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" fontSize="0.95rem" lineHeight={1.5}>
          Are you sure you want to delete{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {itemName}
          </Typography>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ pt: 1, pb: 2.5, px: 3, gap: 1.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          sx={{ borderRadius: 2, px: 2.5, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.25)',
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
  Box,
} from '@mui/material';
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';

interface UnpairDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onClose: () => void;
  onUnpaired: () => void;
}

export function UnpairDeviceDialog({ device, open, onClose, onUnpaired }: UnpairDeviceDialogProps) {
  const [error, setError] = useState('');

  async function handleUnpair() {
    if (!device) return;
    setError('');
    try {
      await api.unpairDevice(device.id);
      onUnpaired();
      onClose();
    } catch {
      setError('Failed to unpair device. Please try again.');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth fullScreen={useDialogFullScreen()}>
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
            Unpair TV Device
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Typography color="text.secondary" fontSize="0.95rem" lineHeight={1.5}>
          Are you sure you want to unpair{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {device?.name}
          </Typography>
          ? The TV display will disconnect and return to its 6-digit pairing screen.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pt: 1, pb: 2.5, px: 3, gap: 1.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{ borderRadius: 2, px: 2.5, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleUnpair}
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.25)',
          }}
        >
          Unpair Device
        </Button>
      </DialogActions>
    </Dialog>
  );
}


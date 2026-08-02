import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';

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
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Unpair Device?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography>
          This will remove "{device?.name}" from your masjid. The TV will return to its pairing code
          screen.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleUnpair}>
          Unpair
        </Button>
      </DialogActions>
    </Dialog>
  );
}

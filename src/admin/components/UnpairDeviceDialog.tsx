import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';

/* ------------------ UNPAIR DEVICE DIALOG COMPONENT ------------------ */

interface UnpairDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onClose: () => void;
  onUnpaired: () => void;
}

export function UnpairDeviceDialog({ device, open, onClose, onUnpaired }: UnpairDeviceDialogProps) {
  async function handleUnpair() {
    if (!device) return;
    try {
      await api.unpairDevice(device.id);
      onUnpaired();
      onClose();
    } catch {
      /* Keep dialog open on error */
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Unpair Device?</DialogTitle>
      <DialogContent>
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

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';

/* ------------------ RENAME DEVICE DIALOG COMPONENT ------------------ */

interface RenameDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function RenameDeviceDialog({ device, open, onClose, onSaved }: RenameDeviceDialogProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (device) {
      setName(device.name);
    }
  }, [device]);

  async function handleSave() {
    if (!device) return;
    try {
      await api.renameDevice(device.id, name);
      onSaved();
      onClose();
    } catch {
      /* Keep dialog open on error */
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rename Device</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

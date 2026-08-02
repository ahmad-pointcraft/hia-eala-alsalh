import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';

interface RenameDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function RenameDeviceDialog({ device, open, onClose, onSaved }: RenameDeviceDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (device) {
      setName(device.name);
      setError('');
    }
  }, [device]);

  async function handleSave() {
    if (!device) return;
    setError('');
    try {
      await api.renameDevice(device.id, name);
      onSaved();
      onClose();
    } catch {
      setError('Failed to rename device. Please try again.');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rename Device</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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

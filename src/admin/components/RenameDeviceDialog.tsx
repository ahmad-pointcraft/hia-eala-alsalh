import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';

const renameDeviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

interface RenameDeviceDialogProps {
  device: Device | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function RenameDeviceDialog({ device, open, onClose, onSaved }: RenameDeviceDialogProps) {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(renameDeviceSchema),
    mode: 'onChange',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (device) {
      reset({ name: device.name });
      setError('');
    }
  }, [device, reset]);

  async function onSubmit(data: { name: string }) {
    if (!device) return;
    setError('');
    try {
      await api.renameDevice(device.id, data.name);
      onSaved();
      onClose();
    } catch {
      setError('Failed to rename device. Please try again.');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth fullScreen={useDialogFullScreen()}>
      <DialogTitle>Rename Device</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          {...register('name')}
          // AUTOFOCUS IS INTENTIONAL — SINGLE-FIELD DIALOG FOCUS MANAGEMENT
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          label="Device Name"
          error={!!errors.name}
          helperText={errors.name?.message ?? ''}
          fullWidth
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={!isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

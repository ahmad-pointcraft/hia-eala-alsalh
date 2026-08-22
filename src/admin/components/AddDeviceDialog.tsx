import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';

const addDeviceSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  name: z.string(),
});

interface AddDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onPaired: () => void;
}

export function AddDeviceDialog({ open, onClose, onPaired }: AddDeviceDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(addDeviceSchema),
    mode: 'onChange',
    defaultValues: { code: '', name: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    reset({ code: '', name: '' });
    setError('');
    onClose();
  }

  async function onSubmit(data: { code: string; name: string }) {
    setLoading(true);
    setError('');
    try {
      await api.pairDevice(data.code, data.name.trim() || undefined);
      onPaired();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to pair device');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Device</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
          Enter the 6-digit code shown on the TV
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              autoFocus
              label="Pairing Code"
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputProps={{ inputMode: 'numeric', maxLength: 6 }}
              placeholder="000000"
              error={!!fieldError}
              helperText={fieldError?.message ?? ''}
              fullWidth
              sx={{ '& .MuiInputBase-input': { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' } }}
            />
          )}
        />
        <TextField
          {...register('name')}
          label="Device Name (optional)"
          placeholder="e.g. Main Hall TV"
          helperText="You can rename it later from the device list"
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={!isValid || loading}>
          {loading ? 'Pairing…' : 'Pair Device'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

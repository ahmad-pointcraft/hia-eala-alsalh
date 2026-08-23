import { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={useDialogFullScreen()}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: 'rgba(46, 125, 50, 0.1)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <EditIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.1rem" lineHeight={1.2}>
            Rename Device
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          {...register('name')}
          // AUTOFOCUS IS INTENTIONAL — SINGLE-FIELD DIALOG FOCUS MANAGEMENT
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          label="Device Name"
          error={!!errors.name}
          helperText={errors.name?.message ?? ''}
          fullWidth
          sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
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
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { Tv as TvIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/shared/api';
import { useSession } from '@/admin/store';
import { useDialogFullScreen } from '@/admin/hooks';

const addDeviceSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  name: z.string(),
});

export interface AddDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onPaired: () => void;
}

export function AddDeviceDialog({ open, onClose, onPaired }: AddDeviceDialogProps) {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
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
      await api.pairDevice(masjidId, data.code, data.name.trim() || undefined);
      onPaired();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to pair device');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          <TvIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.1rem" lineHeight={1.2}>
            Add TV Device
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
          Enter the 6-digit pairing code currently shown on your TV display screen.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState: { error: fieldError } }) => (
            <TextField
              {...field}
              // AUTOFOCUS IS INTENTIONAL — SINGLE-FIELD DIALOG FOCUS MANAGEMENT
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              label="Pairing Code"
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }}
              placeholder="000000"
              error={!!fieldError}
              helperText={fieldError?.message ?? ''}
              fullWidth
              sx={{
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fafafa',
                },
              }}
            />
          )}
        />
        <TextField
          {...register('name')}
          label="Device Name (optional)"
          placeholder="e.g. Main Hall TV"
          helperText="You can rename it later from the device list"
          fullWidth
          sx={{ mt: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </DialogContent>

      <DialogActions sx={{ pt: 1, pb: 2.5, px: 3, gap: 1.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClose}
          sx={{ borderRadius: 2, px: 2.5, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={!isValid || loading}
          sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
        >
          {loading ? 'Pairing…' : 'Pair Device'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

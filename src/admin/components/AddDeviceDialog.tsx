import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { api } from '@/shared/api';

interface AddDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onPaired: () => void;
}

export function AddDeviceDialog({ open, onClose, onPaired }: AddDeviceDialogProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setCode('');
    setError('');
    onClose();
  }

  async function handlePair() {
    setLoading(true);
    setError('');
    try {
      await api.pairDevice(code);
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
        <TextField
          autoFocus
          label="Pairing Code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputProps={{ inputMode: 'numeric', maxLength: 6 }}
          placeholder="000000"
          fullWidth
          sx={{ '& .MuiInputBase-input': { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handlePair} variant="contained" disabled={code.length !== 6 || loading}>
          {loading ? 'Pairing…' : 'Pair Device'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

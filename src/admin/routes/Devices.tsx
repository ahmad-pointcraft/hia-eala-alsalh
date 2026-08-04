import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';
import { formatLastSeen } from '@/shared/utils';
import { useSession } from '@/admin/store/useSession';
import { AddDeviceDialog } from '@/admin/components/AddDeviceDialog';
import { RenameDeviceDialog } from '@/admin/components/RenameDeviceDialog';
import { UnpairDeviceDialog } from '@/admin/components/UnpairDeviceDialog';

export function Devices() {
  const session = useSession((s) => s.session);
  const masjidId = session?.masjidId ?? '';
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Device | null>(null);
  const [unpairTarget, setUnpairTarget] = useState<Device | null>(null);

  const refresh = useCallback(async () => {
    if (!masjidId) return;
    setLoading(true);
    setFetchError('');
    try {
      const list = await api.listDevices(masjidId);
      setDevices(list);
    } catch {
      setFetchError('Failed to load devices. Showing last known list.');
    } finally {
      setLoading(false);
    }
  }, [masjidId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Devices</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          Add Device
        </Button>
      </Box>

      {fetchError && <Alert severity="warning" sx={{ mb: 2 }}>{fetchError}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : devices.length === 0 ? (
        <Typography color="text.secondary">
          No devices paired yet. Click "Add Device" to pair a TV.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.status}</TableCell>
                  <TableCell>{formatLastSeen(device.lastSeenAt)}</TableCell>
                  <TableCell>
                    <IconButton aria-label="Rename device" onClick={() => setRenameTarget(device)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Unpair device" onClick={() => setUnpairTarget(device)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddDeviceDialog open={addOpen} onClose={() => setAddOpen(false)} onPaired={refresh} />

      <RenameDeviceDialog
        device={renameTarget}
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onSaved={refresh}
      />

      <UnpairDeviceDialog
        device={unpairTarget}
        open={!!unpairTarget}
        onClose={() => setUnpairTarget(null)}
        onUnpaired={refresh}
      />
    </Box>
  );
}

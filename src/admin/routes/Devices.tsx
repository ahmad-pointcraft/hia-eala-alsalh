import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';
import { formatLastSeen } from '@/shared/utils';
import { useSession } from '@/admin/store/useSession';
import { useBoolean } from '@/shared/hooks/useBoolean';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';
import { useIsMobile } from '@/admin/hooks/useIsMobile';
import { AsyncState } from '@/admin/components/states/AsyncState';
import { AddDeviceDialog } from '@/admin/components/AddDeviceDialog';
import { RenameDeviceDialog } from '@/admin/components/RenameDeviceDialog';
import { UnpairDeviceDialog } from '@/admin/components/UnpairDeviceDialog';

function deviceRows(device: Device): { label: string; value: string }[] {
  return [
    { label: 'Name', value: device.name },
    { label: 'Status', value: device.status },
    { label: 'Last Seen', value: formatLastSeen(device.lastSeenAt) },
  ];
}

export function Devices() {
  const session = useSession((s) => s.session);
  const masjidId = session?.masjidId ?? '';
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const addDialog = useBoolean();
  const [renameTarget, setRenameTarget] = useState<Device | null>(null);
  const [unpairTarget, setUnpairTarget] = useState<Device | null>(null);
  const headingRef = useFocusHeading<HTMLHeadingElement>();
  const isPhone = useIsMobile('sm');

  const refresh = useCallback(async () => {
    if (!masjidId) return;
    setLoading(true);
    setFetchError(null);
    try {
      const list = await api.listDevices(masjidId);
      setDevices(list);
    } catch {
      setFetchError('Failed to load devices. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [masjidId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" component="h1" tabIndex={-1} ref={headingRef}>
          Devices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
            },
            fontWeight: '700',
          }}
          onClick={addDialog.onTrue}
        >
          Add Device
        </Button>
      </Box>

      {/* SINGLE STATE PIPELINE — SHARED PRIMITIVES (UNPAGED SHORT LIST) */}
      <AsyncState
        loading={loading}
        error={fetchError}
        isEmpty={devices.length === 0}
        skeletonColumns={4}
        onRetry={refresh}
        empty={{
          title: 'No devices paired yet',
          description: 'Pair a TV to show the masjid display.',
          action: { label: 'Add a device', onClick: addDialog.onTrue },
        }}
      >
        {isPhone ? (
          // PHONE LAYOUT — STACKED CARDS PRESERVING ALL DATA + ACTIONS (FR-013)
          <Stack spacing={1.5}>
            {devices.map((device) => (
              <Card key={device.id}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, '&:last-child': { pb: 2 } }}>
                  {deviceRows(device).map((row) => (
                    <Box key={row.label} sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" component="div">
                        {row.label}
                      </Typography>
                      <Typography sx={{ overflowWrap: 'anywhere' }}>{row.value}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 0.5 }}>
                    <IconButton aria-label={`Rename ${device.name}`} onClick={() => setRenameTarget(device)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton aria-label={`Unpair ${device.name}`} onClick={() => setUnpairTarget(device)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
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
      </AsyncState>

      <AddDeviceDialog open={addDialog.value} onClose={addDialog.onFalse} onPaired={refresh} />

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

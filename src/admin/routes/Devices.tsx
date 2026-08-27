import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { api } from '@/shared/api';
import type { Device } from '@/shared/api';
import { useSession } from '@/admin/store';
import { useBoolean } from '@/shared/hooks/useBoolean';
import { useFocusHeading, useIsMobile } from '@/admin/hooks';
import {
  AsyncState,
  DeviceTable,
  DeviceCardList,
  AddDeviceDialog,
  RenameDeviceDialog,
  UnpairDeviceDialog,
} from '@/admin/components';

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
    <Box sx={{ pb: 2 }}>
      {/* HEADER SECTION */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            tabIndex={-1}
            ref={headingRef}
            fontWeight={600}
            gutterBottom
          >
            Connected Devices
          </Typography>
          <Typography color="text.secondary" fontSize="0.95rem">
            Manage TV displays and kiosks paired to show live prayer schedules.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            px: 2.5,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
            },
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
          description: 'Pair a TV display with a 6-digit code to show the mosque prayer times.',
          action: { label: 'Pair a Device', onClick: addDialog.onTrue },
        }}
      >
        {isPhone ? (
          <DeviceCardList
            devices={devices}
            onRename={setRenameTarget}
            onUnpair={setUnpairTarget}
          />
        ) : (
          <DeviceTable
            devices={devices}
            onRename={setRenameTarget}
            onUnpair={setUnpairTarget}
          />
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

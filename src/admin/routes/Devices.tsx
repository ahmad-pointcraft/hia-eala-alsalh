import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
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
  Tooltip,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  Tv as TvIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
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
          // PHONE LAYOUT — STACKED MODERN CARDS
          <Stack spacing={2}>
            {devices.map((device) => (
              <Card
                key={device.id}
                sx={{
                  borderRadius: 3,
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: 'rgba(46, 125, 50, 0.08)',
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
                        <Typography fontWeight={700} fontSize="1rem">
                          {device.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          TV Screen
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      icon={
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: device.status === 'paired' ? 'success.main' : 'warning.main',
                            ml: '6px !important',
                          }}
                        />
                      }
                      label={device.status === 'paired' ? 'Connected' : device.status}
                      size="small"
                      sx={{
                        bgcolor:
                          device.status === 'paired'
                            ? 'rgba(46, 125, 50, 0.08)'
                            : 'rgba(237, 108, 2, 0.08)',
                        color: device.status === 'paired' ? 'success.dark' : 'warning.dark',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 24,
                        borderRadius: 1.5,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      pt: 1.5,
                      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <TimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {formatLastSeen(device.lastSeenAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        aria-label={`Rename ${device.name}`}
                        onClick={() => setRenameTarget(device)}
                        size="small"
                        sx={{ borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)', color: 'primary.main' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label={`Unpair ${device.name}`}
                        onClick={() => setUnpairTarget(device)}
                        size="small"
                        color="error"
                        sx={{ borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          // DESKTOP / TABLET MODERN TABLE
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: 'text.secondary', letterSpacing: 0.5, py: 1.75, pl: 3 }}>
                      DEVICE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: 'text.secondary', letterSpacing: 0.5, py: 1.75 }}>
                      STATUS
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: 'text.secondary', letterSpacing: 0.5, py: 1.75 }}>
                      LAST SEEN
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem', color: 'text.secondary', letterSpacing: 0.5, py: 1.75, pr: 3 }}>
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow
                      key={device.id}
                      sx={{
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.02)' },
                        '&:last-child td': { borderBottom: 0 },
                      }}
                    >
                      <TableCell sx={{ py: 2, pl: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 2,
                              bgcolor: 'rgba(46, 125, 50, 0.08)',
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
                            <Typography fontWeight={700} fontSize="0.95rem" color="text.primary">
                              {device.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              TV Display
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          icon={
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: device.status === 'paired' ? 'success.main' : 'warning.main',
                                ml: '6px !important',
                              }}
                            />
                          }
                          label={device.status === 'paired' ? 'Connected' : device.status}
                          size="small"
                          sx={{
                            bgcolor:
                              device.status === 'paired'
                                ? 'rgba(46, 125, 50, 0.08)'
                                : 'rgba(237, 108, 2, 0.08)',
                            color: device.status === 'paired' ? 'success.dark' : 'warning.dark',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 24,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <TimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                          <Typography variant="body2" color="text.secondary" fontSize="0.88rem">
                            {formatLastSeen(device.lastSeenAt)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                        <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                          <Tooltip title="Rename device">
                            <IconButton
                              aria-label={`Rename ${device.name}`}
                              onClick={() => setRenameTarget(device)}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                '&:hover': {
                                  bgcolor: 'rgba(46, 125, 50, 0.08)',
                                  color: 'primary.main',
                                  borderColor: 'primary.main',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Unpair device">
                            <IconButton
                              aria-label={`Unpair ${device.name}`}
                              onClick={() => setUnpairTarget(device)}
                              size="small"
                              color="error"
                              sx={{
                                borderRadius: 1.5,
                                border: '1px solid rgba(211, 47, 47, 0.15)',
                                '&:hover': {
                                  bgcolor: 'rgba(211, 47, 47, 0.08)',
                                  borderColor: 'error.main',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
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

import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Tv as TvIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import type { Device } from '@/shared/api';
import { formatLastSeen } from '@/shared/utils';
import { DeviceStatusChip } from './DeviceStatusChip';

export interface DeviceTableProps {
  devices: Device[];
  onRename: (device: Device) => void;
  onUnpair: (device: Device) => void;
}

/**
 * Desktop and Tablet table view for connected devices.
 */
export function DeviceTable({ devices, onRename, onUnpair }: DeviceTableProps) {
  return (
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
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: 'text.secondary',
                  letterSpacing: 0.5,
                  py: 1.75,
                  pl: 3,
                }}
              >
                DEVICE
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: 'text.secondary',
                  letterSpacing: 0.5,
                  py: 1.75,
                }}
              >
                STATUS
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: 'text.secondary',
                  letterSpacing: 0.5,
                  py: 1.75,
                }}
              >
                LAST SEEN
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: 'text.secondary',
                  letterSpacing: 0.5,
                  py: 1.75,
                  pr: 3,
                }}
              >
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
                  <DeviceStatusChip status={device.status} />
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
                        onClick={() => onRename(device)}
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
                        onClick={() => onUnpair(device)}
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
  );
}

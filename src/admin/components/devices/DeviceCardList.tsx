import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
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

export interface DeviceCardListProps {
  devices: Device[];
  onRename: (device: Device) => void;
  onUnpair: (device: Device) => void;
}

/**
 * Mobile phone card list view for connected devices.
 */
export function DeviceCardList({ devices, onRename, onUnpair }: DeviceCardListProps) {
  return (
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
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

              <DeviceStatusChip status={device.status} />
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
                  onClick={() => onRename(device)}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)', color: 'primary.main' },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label={`Unpair ${device.name}`}
                  onClick={() => onUnpair(device)}
                  size="small"
                  color="error"
                  sx={{
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

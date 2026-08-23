import { Box, Chip } from '@mui/material';

export interface DeviceStatusChipProps {
  status: string;
}

/**
 * Modern status indicator chip for connected devices.
 */
export function DeviceStatusChip({ status }: DeviceStatusChipProps) {
  const isPaired = status === 'paired';

  return (
    <Chip
      icon={
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: isPaired ? 'success.main' : 'warning.main',
            ml: '6px !important',
          }}
        />
      }
      label={isPaired ? 'Connected' : status}
      size="small"
      sx={{
        bgcolor: isPaired ? 'rgba(46, 125, 50, 0.08)' : 'rgba(237, 108, 2, 0.08)',
        color: isPaired ? 'success.dark' : 'warning.dark',
        fontWeight: 700,
        fontSize: '0.75rem',
        height: 24,
        borderRadius: 1.5,
      }}
    />
  );
}

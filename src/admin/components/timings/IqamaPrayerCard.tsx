import dayjs from 'dayjs';
import { Stack, Typography, TextField, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import type { PrayerKey, IqamaPrayerConfig } from '@/shared/types';

interface IqamaPrayerCardProps {
  prayer: Exclude<PrayerKey, 'Sunrise'>;
  config: IqamaPrayerConfig;
  error?: string;
  onChange: (patch: Partial<IqamaPrayerConfig>) => void;
}

const PRAYER_LABELS: Record<Exclude<PrayerKey, 'Sunrise'>, string> = {
  Fajr: 'Fajr',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
};

export function IqamaPrayerCard({ prayer, config, error, onChange }: IqamaPrayerCardProps) {
  function handleModeChange(_e: unknown, newMode: 'offset' | 'fixed' | null) {
    if (newMode === null) return;
    if (newMode === 'offset') {
      onChange({ mode: 'offset', value: 0 });
    } else {
      onChange({ mode: 'fixed', value: '00:00' });
    }
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: '#fafafa',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Typography
        sx={{
          minWidth: 100,
          fontWeight: 700,
          fontSize: '1rem',
          color: 'text.primary',
        }}
      >
        {PRAYER_LABELS[prayer]}
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ flexGrow: 1, justifyContent: 'flex-end' }}
      >
        <ToggleButtonGroup
          value={config.mode}
          exclusive
          size="small"
          onChange={handleModeChange}
          sx={{
            bgcolor: '#f1f3f5',
            p: 0.5,
            borderRadius: 2,
            border: 'none',
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: 1.5,
              py: 0.5,
              px: 2,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'text.secondary',
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(46, 125, 50, 0.25)',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            },
          }}
        >
          <ToggleButton value="offset">Offset (+min)</ToggleButton>
          <ToggleButton value="fixed">Fixed Time</ToggleButton>
        </ToggleButtonGroup>

        {config.mode === 'offset' ? (
          <TextField
            type="number"
            label="Minutes after Adhan"
            value={config.value}
            onChange={(e) => onChange({ value: parseInt(e.target.value, 10) || 0 })}
            slotProps={{ htmlInput: { min: 0, max: 60 } }}
            error={!!error}
            helperText={error}
            sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#ffffff' } }}
            size="small"
          />
        ) : (
          <MobileTimePicker
            label="Iqama Time"
            value={dayjs(config.value as string, 'HH:mm')}
            onChange={(newValue) => {
              if (newValue) {
                onChange({ value: newValue.format('HH:mm') });
              }
            }}
            slotProps={{
              textField: {
                size: 'small',
                error: !!error,
                helperText: error,
                sx: { minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#ffffff' } },
              },
            }}
          />
        )}
      </Stack>
    </Box>
  );
}


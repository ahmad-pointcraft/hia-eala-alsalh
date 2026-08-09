import dayjs from 'dayjs';
import { Stack, Typography, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography sx={{ minWidth: 80, fontWeight: 600 }}>
        {PRAYER_LABELS[prayer]}
      </Typography>

      <ToggleButtonGroup
        value={config.mode}
        exclusive
        size="small"
        onChange={handleModeChange}
      >
        <ToggleButton value="offset">Offset</ToggleButton>
        <ToggleButton value="fixed">Fixed</ToggleButton>
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
          sx={{ maxWidth: 200 }}
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
              sx: { maxWidth: 200 },
            },
          }}
        />
      )}
    </Stack>
  );
}

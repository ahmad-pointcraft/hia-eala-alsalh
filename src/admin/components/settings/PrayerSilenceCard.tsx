import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';

export function PrayerSilenceCard() {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);
  const duration = draft.silenceDurationMin ?? 15;

  const handleStep = (delta: number) => {
    const next = Math.min(60, Math.max(5, duration + delta));
    setField({ silenceDurationMin: next });
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Prayer Silence
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Automatically dim displays and prompt silence during congregational prayer.
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.silenceAfterIqama ?? true}
                  onChange={(e) => setField({ silenceAfterIqama: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Dim screen during congregational prayer' } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Dim Screen during Salah
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Show quiet screen when Iqama timer ends
                  </Typography>
                </Box>
              }
              sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
            />
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500} component="div" sx={{ mb: 1 }}>
              Silence Duration
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleStep(-5)}
                disabled={!draft.silenceAfterIqama || duration <= 5}
                aria-label="Decrease silence duration"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography variant="body1" fontWeight={600}>
                {duration} minutes
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleStep(5)}
                disabled={!draft.silenceAfterIqama || duration >= 60}
                aria-label="Increase silence duration"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

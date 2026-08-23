import {
  Box,
  Card,
  CardContent,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';
import type { TickerSpeed } from '@/shared/types';

const SLIDE_MARKS = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
];

export function SlideshowTickerCard() {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Slideshow & Ticker
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Control slide transition pacing and announcement ticker speed.
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Slide Rotation Interval
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {draft.slideDurationSec ?? 10}s
              </Typography>
            </Box>
            <Box sx={{ px: 1 }}>
              <Slider
                value={draft.slideDurationSec ?? 10}
                min={5}
                max={60}
                step={5}
                marks={SLIDE_MARKS}
                valueLabelDisplay="auto"
                onChange={(_, val) => setField({ slideDurationSec: val as number })}
                aria-label="Slide rotation interval in seconds"
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500} component="div" sx={{ mb: 1 }}>
              Ticker Speed
            </Typography>
            <ToggleButtonGroup
              value={draft.tickerSpeed ?? 'normal'}
              exclusive
              fullWidth
              size="small"
              onChange={(_, val: TickerSpeed | null) => {
                if (val) setField({ tickerSpeed: val });
              }}
              aria-label="Ticker speed selection"
            >
              <ToggleButton
                value="slow"
                sx={{
                  py: 1,
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                Slow
              </ToggleButton>
              <ToggleButton
                value="normal"
                sx={{
                  py: 1,
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                Normal
              </ToggleButton>
              <ToggleButton
                value="fast"
                sx={{
                  py: 1,
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                Fast
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

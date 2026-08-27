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
import { Slideshow as SlideshowIcon } from '@mui/icons-material';
import { useDisplaySettingsForm } from '@/admin/store';
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
  const speed = draft.tickerSpeed ?? 'normal';

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(46, 125, 50, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <SlideshowIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
            Slideshow & Ticker
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
                Slide Rotation Interval
              </Typography>
              <Box
                sx={{
                  px: 1.25,
                  py: 0.25,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(46, 125, 50, 0.1)',
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {draft.slideDurationSec ?? 10}s
              </Box>
            </Box>
            <Box sx={{ px: 1, pt: 0.5 }}>
              <Slider
                value={draft.slideDurationSec ?? 10}
                min={5}
                max={60}
                step={5}
                marks={SLIDE_MARKS}
                valueLabelDisplay="auto"
                onChange={(_, val) => setField({ slideDurationSec: val as number })}
                aria-label="Slide rotation interval in seconds"
                sx={{
                  color: 'primary.main',
                  height: 6,
                  '& .MuiSlider-thumb': {
                    width: 18,
                    height: 18,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(46, 125, 50, 0.16)',
                    },
                  },
                  '& .MuiSlider-markLabel': {
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} component="div" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Announcement Ticker Speed
            </Typography>
            <ToggleButtonGroup
              value={speed}
              exclusive
              fullWidth
              size="small"
              onChange={(_, val: TickerSpeed | null) => {
                if (val) setField({ tickerSpeed: val });
              }}
              aria-label="Ticker speed selection"
              sx={{
                bgcolor: '#f1f3f5',
                p: 0.5,
                borderRadius: 2,
                border: 'none',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 1.5,
                  py: 0.75,
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
              <ToggleButton value="slow">Slow</ToggleButton>
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="fast">Fast</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}



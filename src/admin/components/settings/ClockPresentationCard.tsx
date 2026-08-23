import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';
import type { TimeFormat, LanguageOrder } from '@/shared/types';

export function ClockPresentationCard() {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Clock & Presentation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set clock format, digital seconds visibility, and bilingual priority.
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500} component="div" sx={{ mb: 1 }}>
              Time Format
            </Typography>
            <ToggleButtonGroup
              value={draft.timeFormat ?? '12h'}
              exclusive
              fullWidth
              size="small"
              onChange={(_, val: TimeFormat | null) => {
                if (val) setField({ timeFormat: val });
              }}
              aria-label="Time format selection"
            >
              <ToggleButton
                value="12h"
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
                12-Hour (AM/PM)
              </ToggleButton>
              <ToggleButton
                value="24h"
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
                24-Hour
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.showSeconds ?? true}
                  onChange={(e) => setField({ showSeconds: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Show seconds on display clocks' } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Show Seconds
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Display ticking seconds on digital clocks
                  </Typography>
                </Box>
              }
              sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
            />
          </Box>

          <Box>
            <FormControl fullWidth size="small">
              <InputLabel id="language-order-label">Bilingual Display Order</InputLabel>
              <Select
                labelId="language-order-label"
                id="language-order"
                value={draft.languageOrder ?? 'en-first'}
                label="Bilingual Display Order"
                onChange={(e) => setField({ languageOrder: e.target.value as LanguageOrder })}
              >
                <MenuItem value="en-first">English first / Arabic second</MenuItem>
                <MenuItem value="ar-first">Arabic first / English second</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

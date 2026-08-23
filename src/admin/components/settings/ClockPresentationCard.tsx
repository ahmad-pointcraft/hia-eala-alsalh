import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';
import type { TimeFormat, LanguageOrder } from '@/shared/types';

export function ClockPresentationCard() {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);

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
            <TimeIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
            Clock & Presentation
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} component="div" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.4 }}>
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
              <ToggleButton value="12h">12-Hour (AM/PM)</ToggleButton>
              <ToggleButton value="24h">24-Hour</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#fafafa',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={draft.showSeconds ?? true}
                  onChange={(e) => setField({ showSeconds: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Show seconds on display clocks' } }}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
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
            <Typography variant="caption" color="text.secondary" fontWeight={600} component="div" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Default Display Language
            </Typography>
            <ToggleButtonGroup
              value={draft.languageOrder ?? 'en-first'}
              exclusive
              fullWidth
              size="small"
              onChange={(_, val: LanguageOrder | null) => {
                if (val) setField({ languageOrder: val });
              }}
              aria-label="Default display language selection"
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
              <ToggleButton value="en-first">English</ToggleButton>
              <ToggleButton value="ar-first">العربية</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}




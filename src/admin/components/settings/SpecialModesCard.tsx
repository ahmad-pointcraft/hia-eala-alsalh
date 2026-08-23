import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';

export function SpecialModesCard() {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Special Modes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Activate temporary display layouts and occasion-specific behavior.
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.ramadanMode ?? false}
                  onChange={(e) => setField({ ramadanMode: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Enable Ramadan Mode' } }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        Ramadan Mode
                      </Typography>
                      {draft.ramadanMode && (
                        <Chip
                          size="small"
                          label="🌙 Active"
                          sx={{
                            bgcolor: 'secondary.main',
                            color: 'secondary.contrastText',
                            fontWeight: 700,
                            height: 22,
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Suhoor/Iftar countdowns & Taraweeh board
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.jumuahSilence ?? false}
                  onChange={(e) => setField({ jumuahSilence: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Enable Jumuah Khutbah Silence' } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Jumu&apos;ah Khutbah Silence
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Quiet screen during Friday sermon
                  </Typography>
                </Box>
              }
              sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

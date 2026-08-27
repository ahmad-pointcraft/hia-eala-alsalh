import { ToggleButton, ToggleButtonGroup, Stack, Typography } from '@mui/material';
import { useTimingsForm } from '@/admin/store';
import type { Madhab } from '@/shared/types';

export function MadhabToggle() {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  return (
    <Stack spacing={1}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
      >
        Juristic Method (Asr Shadow)
      </Typography>
      <ToggleButtonGroup
        value={draft.madhab}
        exclusive
        fullWidth
        size="small"
        onChange={(_, value: Madhab | null) => {
          if (value) setField({ madhab: value });
        }}
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
        <ToggleButton value="Shafi">Shafi / Standard</ToggleButton>
        <ToggleButton value="Hanafi">Hanafi</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}


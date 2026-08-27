import { ToggleButton, ToggleButtonGroup, Stack, Typography } from '@mui/material';
import { useTimingsForm } from '@/admin/store';

const OFFSETS = [-2, -1, 0, 1, 2] as const;

export function HijriOffsetControl() {
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
        Hijri Date Offset (Days)
      </Typography>
      <ToggleButtonGroup
        value={draft.hijriOffset}
        exclusive
        fullWidth
        size="small"
        onChange={(_, value: number | null) => {
          if (value !== null) setField({ hijriOffset: value as -2 | -1 | 0 | 1 | 2 });
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
            fontWeight: 700,
            fontSize: '0.85rem',
            color: 'text.secondary',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(46, 125, 50, 0.25)',
              '&:hover': { bgcolor: 'primary.dark' },
            },
          },
        }}
      >
        {OFFSETS.map((offset) => (
          <ToggleButton key={offset} value={offset}>
            {offset > 0 ? `+${offset}` : offset}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}


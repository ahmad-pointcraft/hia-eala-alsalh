import { MenuItem, TextField, Stack, Typography } from '@mui/material';
import { useTimingsForm } from '@/admin/store';
import type { HighLatitudeRule } from '@/shared/types';

export function HighLatRuleSelect() {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  const rules: { value: HighLatitudeRule; label: string }[] = [
    { value: 'MiddleOfTheNight', label: 'Middle of the Night' },
    { value: 'SeventhOfTheNight', label: 'Seventh of the Night' },
    { value: 'TwilightAngle', label: 'Twilight Angle' },
  ];

  return (
    <Stack spacing={1}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
      >
        High Latitude Rule
      </Typography>
      <TextField
        select
        size="small"
        value={draft.highLatitudeRule}
        onChange={(e) => setField({ highLatitudeRule: e.target.value as HighLatitudeRule })}
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      >
        {rules.map((rule) => (
          <MenuItem key={rule.value} value={rule.value}>
            {rule.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}


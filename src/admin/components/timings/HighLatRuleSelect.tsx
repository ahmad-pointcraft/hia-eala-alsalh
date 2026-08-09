import { MenuItem, TextField } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
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
    <TextField
      select
      label="High Latitude Rule"
      value={draft.highLatitudeRule}
      onChange={(e) => setField({ highLatitudeRule: e.target.value as HighLatitudeRule })}
      fullWidth
    >
      {rules.map((rule) => (
        <MenuItem key={rule.value} value={rule.value}>
          {rule.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

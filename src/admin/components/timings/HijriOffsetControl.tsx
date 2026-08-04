import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';

const OFFSETS = [-2, -1, 0, 1, 2] as const;

export function HijriOffsetControl() {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  return (
    <ToggleButtonGroup
      value={draft.hijriOffset}
      exclusive
      onChange={(_, value: number | null) => {
        if (value !== null) setField({ hijriOffset: value as -2 | -1 | 0 | 1 | 2 });
      }}
    >
      {OFFSETS.map((offset) => (
        <ToggleButton key={offset} value={offset}>
          {offset > 0 ? `+${offset}` : offset}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

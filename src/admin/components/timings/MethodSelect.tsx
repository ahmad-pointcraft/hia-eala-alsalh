import { MenuItem, TextField } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
import { ADHAN_METHOD_LABELS } from '@/admin/utils/timings/methodLabels';

export function MethodSelect() {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  return (
    <TextField
      select
      label="Calculation Method"
      value={draft.calculationMethod}
      onChange={(e) => setField({ calculationMethod: e.target.value as typeof draft.calculationMethod })}
      fullWidth
    >
      {(Object.entries(ADHAN_METHOD_LABELS) as [typeof draft.calculationMethod, { label: string; regionHint: string }][]).map(
        ([value, { label, regionHint }]) => (
          <MenuItem key={value} value={value}>
            {label} — {regionHint}
          </MenuItem>
        ),
      )}
    </TextField>
  );
}

import { MenuItem, TextField, Stack, Typography } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
import { ADHAN_METHOD_LABELS } from '@/admin/utils/timings/methodLabels';

export function MethodSelect() {
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
        Calculation Method
      </Typography>
      <TextField
        select
        size="small"
        value={draft.calculationMethod}
        onChange={(e) =>
          setField({ calculationMethod: e.target.value as typeof draft.calculationMethod })
        }
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      >
        {(
          Object.entries(ADHAN_METHOD_LABELS) as [
            typeof draft.calculationMethod,
            { label: string; regionHint: string },
          ][]
        ).map(([value, { label, regionHint }]) => (
          <MenuItem key={value} value={value}>
            {label} — {regionHint}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}


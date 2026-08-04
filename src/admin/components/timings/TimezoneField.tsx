import { Stack, TextField, Button } from '@mui/material';
import { LocationSearching as LocationSearchingIcon } from '@mui/icons-material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';

export function TimezoneField() {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  function handleDetect() {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected) {
      setField({ timeZone: detected });
    }
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        label="Timezone"
        value={draft.timeZone}
        slotProps={{ input: { readOnly: true } }}
        fullWidth
      />
      <Button
        variant="outlined"
        startIcon={<LocationSearchingIcon />}
        onClick={handleDetect}
        size="small"
      >
        Detect
      </Button>
    </Stack>
  );
}

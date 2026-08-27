import { Stack, TextField, Button, Box, Typography } from '@mui/material';
import { LocationSearching as LocationSearchingIcon } from '@mui/icons-material';
import { useTimingsForm } from '@/admin/store';

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
    <Stack spacing={1}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
      >
        Timezone
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <TextField
          size="small"
          value={draft.timeZone}
          slotProps={{ input: { readOnly: true } }}
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fafafa' } }}
        />
        <Button
          variant="outlined"
          startIcon={<LocationSearchingIcon />}
          onClick={handleDetect}
          size="small"
          sx={{ borderRadius: 2, px: 2, whiteSpace: 'nowrap', fontWeight: 600 }}
        >
          Detect
        </Button>
      </Box>
    </Stack>
  );
}


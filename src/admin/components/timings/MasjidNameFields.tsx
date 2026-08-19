import { Stack, TextField } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';

export function MasjidNameFields({ errors }: { errors: Record<string, string> }) {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        label="Masjid Name (English)"
        value={draft.masjidName_en}
        onChange={(e) => setField({ masjidName_en: e.target.value })}
        error={Boolean(errors.masjidName_en)}
        helperText={errors.masjidName_en ?? ''}
        fullWidth
      />
      <TextField
        label="Masjid Name (Arabic)"
        value={draft.masjidName_ar}
        onChange={(e) => setField({ masjidName_ar: e.target.value })}
        error={Boolean(errors.masjidName_ar)}
        helperText={errors.masjidName_ar ?? ''}
        dir="rtl"
        fullWidth
      />
    </Stack>
  );
}

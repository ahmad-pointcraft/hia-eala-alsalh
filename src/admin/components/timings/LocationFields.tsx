import { Stack, TextField, Button } from '@mui/material';
import { MyLocation as MyLocationIcon } from '@mui/icons-material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';

interface LocationFieldsProps {
  errors?: Record<string, string>;
}

export function LocationFields({ errors = {} }: LocationFieldsProps) {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setField({
          latitude: parseFloat(latitude.toFixed(4)),
          longitude: parseFloat(longitude.toFixed(4)),
        });
      },
      (error) => {
        console.warn('[Location] Geolocation failed:', error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Latitude"
          type="number"
          value={draft.latitude}
          onChange={(e) => setField({ latitude: parseFloat(e.target.value) || 0 })}
          error={!!errors['latitude']}
          helperText={errors['latitude']}
          fullWidth
        />
        <TextField
          label="Longitude"
          type="number"
          value={draft.longitude}
          onChange={(e) => setField({ longitude: parseFloat(e.target.value) || 0 })}
          error={!!errors['longitude']}
          helperText={errors['longitude']}
          fullWidth
        />
      </Stack>
      {typeof navigator !== 'undefined' && navigator.geolocation && (
        <Button
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={handleUseMyLocation}
          size="small"
        >
          Use my location
        </Button>
      )}
    </Stack>
  );
}

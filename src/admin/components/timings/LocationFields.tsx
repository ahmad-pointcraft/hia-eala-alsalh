import { Stack, TextField, Button, Box, Typography } from '@mui/material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}
        >
          Coordinates
        </Typography>
        {typeof navigator !== 'undefined' && navigator.geolocation && (
          <Button
            variant="text"
            startIcon={<MyLocationIcon fontSize="small" />}
            onClick={handleUseMyLocation}
            size="small"
            sx={{ fontWeight: 600, textTransform: 'none', py: 0.25 }}
          >
            Detect GPS
          </Button>
        )}
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Latitude"
          type="number"
          size="small"
          value={draft.latitude}
          onChange={(e) => setField({ latitude: parseFloat(e.target.value) || 0 })}
          error={!!errors['latitude']}
          helperText={errors['latitude']}
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          label="Longitude"
          type="number"
          size="small"
          value={draft.longitude}
          onChange={(e) => setField({ longitude: parseFloat(e.target.value) || 0 })}
          error={!!errors['longitude']}
          helperText={errors['longitude']}
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Stack>
    </Stack>
  );
}


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useSession } from '@/admin/hooks/useSession';

export function Preview() {
  const session = useSession((s) => s.session);
  const masjidId = session?.masjidId ?? '';
  const displayUrl = import.meta.env.VITE_DISPLAY_APP_URL || '/';

  function handlePreview() {
    window.open(`${displayUrl}?masjid=${masjidId}`, '_blank');
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Preview Display</Typography>
      <Typography sx={{ mb: 3, color: 'text.secondary' }}>
        Open the live masjid display in a new browser tab.
      </Typography>
      <Button variant="contained" size="large" onClick={handlePreview}>
        View Display
      </Button>
    </Box>
  );
}

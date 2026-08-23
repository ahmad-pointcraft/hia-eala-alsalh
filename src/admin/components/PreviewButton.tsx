import { Button } from '@mui/material';
import { Monitor as MonitorIcon } from '@mui/icons-material';
import { useSession } from '@/admin/store/useSession';
import { useToast } from '@/admin/components/ToastProvider';

/**
 * Always-visible header action: opens the live masjid display in a new tab,
 * with the masjid context passed via query parameter so the display renders
 * the correct masjid. Falls back to the same-origin display entry when
 * VITE_DISPLAY_APP_URL is not configured.
 */
export function PreviewButton() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');
  const toast = useToast();

  const handleClick = () => {
    const base = import.meta.env.VITE_DISPLAY_APP_URL || import.meta.env.BASE_URL;
    const url = `${base}?masjid=${masjidId}`;
    const opened = window.open(url, '_blank');
    if (!opened) {
      toast.info('Popup blocked — please allow popups to view the display.');
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      size="large"
      startIcon={<MonitorIcon />}
      onClick={handleClick}
      sx={{
        transition: 'all 0.2s ease-in-out',
        '&:hover': { transform: 'scale(1.1)', bgcolor: 'primary.main', color: 'white' },
      }}
    >
      View Display
    </Button>
  );
}

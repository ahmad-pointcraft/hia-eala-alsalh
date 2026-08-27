import { Button, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSession } from '@/admin/store';

/**
 * Sticky/header action to open the live kiosk display in a new tab.
 * Uses the masjidId from active session.
 */
export function PreviewButton() {
  const masjidId = useSession((s) => s.session?.masjidId ?? '');

  const handleOpenPreview = () => {
    const displayUrl = `${window.location.origin}${import.meta.env.BASE_URL}?masjid=${encodeURIComponent(masjidId)}`;
    window.open(displayUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Tooltip title="Open the live kiosk display in a new tab" arrow>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<VisibilityIcon />}
        onClick={handleOpenPreview}
        sx={{
          whiteSpace: 'nowrap',
          px: 2,
          py: 0.75,
          fontWeight: 700,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.35)',
          },
        }}
      >
        View Display
      </Button>
    </Tooltip>
  );
}

import { Box, Typography } from '@mui/material';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';

export function DisplaySettings() {
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  return (
    <Box>
      <Typography variant="h5" component="h1" tabIndex={-1} ref={headingRef} gutterBottom>
        Display Settings
      </Typography>
      <Typography color="text.secondary">
        Configure screen settings, layout, and behaviors for the masjid kiosks.
      </Typography>
    </Box>
  );
}

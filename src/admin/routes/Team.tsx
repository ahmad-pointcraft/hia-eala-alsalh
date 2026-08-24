import { Box, Typography } from '@mui/material';

/**
 * Team members management route.
 * Allows masjid_admin to manage staff and invite new members.
 */
export function Team(): JSX.Element {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
        Team Members
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage administrative staff and permissions for this mosque.
      </Typography>
    </Box>
  );
}

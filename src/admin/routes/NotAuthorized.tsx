import { Box, Paper, Typography, Button } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Dedicated 403 Forbidden screen shown when a user navigates to an unauthorized route.
 */
export function NotAuthorized(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          width: '100%',
          p: 4,
          textAlign: 'center',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <LockOutlined sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h5" component="h1" fontWeight={600}>
          Not Authorized
        </Typography>

        <Typography variant="body2" color="text.secondary">
          You do not have permission to access this section. Please contact your mosque administrator if you require access.
        </Typography>

        <Button
          component={RouterLink}
          to="/content"
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Back to Content
        </Button>
      </Paper>
    </Box>
  );
}

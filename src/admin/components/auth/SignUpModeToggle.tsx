import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import {
  AddBusinessOutlined as CreateIcon,
  GroupAddOutlined as JoinIcon,
} from '@mui/icons-material';

export interface SignUpModeToggleProps {
  mode: 'create' | 'join';
  onChange: (newMode: 'create' | 'join') => void;
}

/**
 * Segmented mode switch control and contextual header for Mosque registration vs team joining.
 */
export function SignUpModeToggle({ mode, onChange }: SignUpModeToggleProps): JSX.Element {
  return (
    <>
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography
          variant="h6"
          component="h2"
          fontWeight={700}
          sx={{ color: 'text.primary', fontSize: '1.2rem' }}
        >
          {mode === 'create' ? 'Create Mosque Portal' : 'Join Mosque Team'}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 0.25 }}
        >
          {mode === 'create'
            ? 'Register your mosque and begin managing prayer displays'
            : 'Enter your 6-digit invitation code to join your team'}
        </Typography>
      </Box>

      <Box sx={{ p: 0.4, bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: 2.5, mb: 2 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_event, newMode: 'create' | 'join' | null) => {
            if (newMode) {
              onChange(newMode);
            }
          }}
          fullWidth
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: 2,
              py: 0.6,
              fontWeight: 600,
              fontSize: '0.82rem',
              textTransform: 'none',
              color: 'text.secondary',
              transition: 'all 0.15s ease',
              '&.Mui-selected': {
                bgcolor: '#ffffff',
                color: 'primary.main',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                fontWeight: 700,
                '&:hover': { bgcolor: '#ffffff' },
              },
            },
          }}
        >
          <ToggleButton value="create" sx={{ gap: 0.75 }}>
            <CreateIcon fontSize="small" />
            Create New Masjid
          </ToggleButton>
          <ToggleButton value="join" sx={{ gap: 0.75 }}>
            <JoinIcon fontSize="small" />
            Join with Code
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  );
}

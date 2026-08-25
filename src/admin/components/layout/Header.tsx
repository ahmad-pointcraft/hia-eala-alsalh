import { AppBar, Box, IconButton, Toolbar, Typography, Chip } from '@mui/material';
import { Menu as MenuIcon, Wifi as WifiIcon } from '@mui/icons-material';
import { PreviewButton } from './PreviewButton';
import appLogo from '@/assets/app-logo.png';

export interface AdminHeaderProps {
  /** Called when hamburger icon is clicked on mobile/tablet. */
  onOpenDrawer?: () => void;
  /** Whether the current viewport is mobile/tablet. */
  isTabletDown?: boolean;
}

/**
 * Modern Admin Header bar with glassmorphic backdrop, title, and docked View Display action.
 */
export function AdminHeader({ onOpenDrawer, isTabletDown = false }: AdminHeaderProps) {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        px: { xs: 2, sm: 3, md: 4 },
        py: 0.5,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar disableGutters sx={{ gap: 1.5, minHeight: { xs: 56, sm: 64 } }}>
        {isTabletDown && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open navigation"
            onClick={onOpenDrawer}
            sx={{
              mr: 0.5,
              borderRadius: 2,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <Box
              component="img"
              src={appLogo}
              alt="Hayya 'Ala Al-Salah"
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Typography
            variant="h6"
            component="h2"
            noWrap
            fontWeight={700}
            fontSize={{ xs: '1.05rem', sm: '1.15rem' }}
            color="text.primary"
            letterSpacing="-0.01em"
          >
            Masjid Admin
          </Typography>
          <Chip
            icon={<WifiIcon sx={{ fontSize: '14px !important', color: 'success.main' }} />}
            label="Live Sync"
            size="small"
            variant="outlined"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderColor: 'rgba(46, 125, 50, 0.25)',
              bgcolor: 'rgba(46, 125, 50, 0.05)',
              color: 'primary.dark',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PreviewButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

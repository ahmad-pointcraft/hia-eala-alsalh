import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { PreviewButton } from './PreviewButton';
import { useIsMobile } from '@/admin/hooks/useIsMobile';

export function AdminLayout() {
  const location = useLocation();
  const isTabletDown = useIsMobile('md');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // CLOSE THE TEMPORARY DRAWER ON NAVIGATION
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, minWidth: 0 }}>
        <AppBar position="sticky" color="default" elevation={0}>
          <Toolbar sx={{ gap: 1, '&.MuiToolbar-root': { px: 0 } }}>
            {isTabletDown && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Open navigation"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" component="h2" noWrap>
                Masjid Admin
              </Typography>
            </Box>
            <PreviewButton />
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

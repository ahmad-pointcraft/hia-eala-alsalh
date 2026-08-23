import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './Header';
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#f8fafc',
        }}
      >
        <AdminHeader onOpenDrawer={() => setDrawerOpen(true)} isTabletDown={isTabletDown} />
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2.5, sm: 3 },
            maxWidth: 1600,
            width: '100%',
            mx: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

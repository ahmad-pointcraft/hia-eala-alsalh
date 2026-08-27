import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './Header';
import { useIsMobile } from '@/admin/hooks';
import appLogo from '@/assets/app-logo.png';
import pointcraftLogo from '@/assets/logo.png';

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
            pt: { xs: 2.5, sm: 3 },
            pb: 0,
            maxWidth: 1600,
            width: '100%',
            mx: 'auto',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />

          {/* PAGE FOOTER */}
          <Box
            component="footer"
            sx={{
              mt: 'auto',
              pt: 4,
              pb: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.85,
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
              '&:hover': { opacity: 1 },
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 8,
                bgcolor: 'white',
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
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ fontSize: '0.75rem' }}
            >
              Hayya 'Ala Al-Salah
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
              •
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
              sx={{ fontSize: '0.75rem' }}
            >
              Powered by
            </Typography>
            <Box
              component="a"
              href="https://point-craft.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Pointcraft website"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                '&:hover': { opacity: 0.8, transform: 'scale(1.05)' },
              }}
            >
              <Box
                component="img"
                src={pointcraftLogo}
                alt="Pointcraft"
                sx={{ height: 23, width: 'auto', objectFit: 'contain' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

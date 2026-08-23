import { Outlet } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Sidebar } from './Sidebar';
import { PreviewButton } from './PreviewButton';

export function AdminLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, px: 3,py:2, minWidth: 0 }}>
        <AppBar position="sticky" color="default" elevation={0}>
          <Toolbar sx={{ gap: 2, "&.MuiToolbar-root":{ px: 0 }}}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h5" component="h1" noWrap>
                Masjid Admin
              </Typography>
            </Box>
            <PreviewButton />
          </Toolbar>
        </AppBar>
        <Box sx={{mt: 4}}>

        <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';

export function AdminLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

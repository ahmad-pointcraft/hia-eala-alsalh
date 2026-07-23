import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Devices', path: '/devices' },
  { label: 'Timings', path: '/timings' },
  { label: 'Content', path: '/content' },
  { label: 'Images', path: '/images' },
  { label: 'Setups', path: '/setups' },
  { label: 'Preview', path: '/preview' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight={700}>
          Masjid Admin
        </Typography>
      </Box>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

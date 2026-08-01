import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useSession } from '@/admin/hooks/useSession';
import { api } from '@/shared/api';
import type { MosqueConfig } from '@/shared/types/mosqueConfig';

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
  const session = useSession((s) => s.session);
  const [config, setConfig] = useState<MosqueConfig | null>(null);

  useEffect(() => {
    if (!session?.masjidId) return;

    let mounted = true;

    api.getMasjidConfig(session.masjidId)
      .then((cfg) => {
        if (mounted) setConfig(cfg);
      })
      .catch(() => {
        /* fallback */
      });

    const unsub = api.subscribe(session.masjidId, {
      onConfigChange: (newCfg) => {
        if (mounted) setConfig(newCfg);
      },
      onContentChange: () => {},
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [session?.masjidId]);

  const title = config?.masjidName_en ? `${config.masjidName_en}` : 'Masjid Admin';

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
        <Typography variant="h6" color="primary" fontWeight={700} noWrap title={title}>
          {title}
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

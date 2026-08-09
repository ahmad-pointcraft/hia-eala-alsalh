import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useSession } from '@/admin/store/useSession';
import { api } from '@/shared/api';
import type { MosqueConfig } from '@/shared/types';

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
  const signOut = useSession((s) => s.signOut);
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

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight={700} noWrap title={title}>
          {title}
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1 }}>
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
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="outlined" onClick={handleSignOut} sx={{
          transition: 'all 0.3s ease',
          "&:hover": {
            backgroundColor: 'primary.light',
            color: 'white',
            transform: 'scale(1.05)'
          },
        }}>
          <Typography variant="button" fontWeight={700} noWrap title="Sign Out">
            Sign Out
          </Typography>
        </Button>
      </Box>
    </Drawer>
  );
}

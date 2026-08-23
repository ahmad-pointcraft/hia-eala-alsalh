import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Devices as DevicesIcon,
  AccessTime as TimingsIcon,
  FolderOutlined as ContentIcon,
  ImageOutlined as ImagesIcon,
  DisplaySettings as SettingsIcon,
  Mosque as MosqueIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useSession } from '@/admin/store/useSession';
import { api } from '@/shared/api';
import type { MosqueConfig } from '@/shared/types';
import { useIsMobile } from '@/admin/hooks/useIsMobile';

const DRAWER_WIDTH = 250;

const NAV_ITEMS = [
  { label: 'Devices', path: '/devices', icon: DevicesIcon },
  { label: 'Timings', path: '/timings', icon: TimingsIcon },
  { label: 'Content', path: '/content', icon: ContentIcon },
  { label: 'Images', path: '/images', icon: ImagesIcon },
  { label: 'Display Settings', path: '/settings', icon: SettingsIcon },
];

export interface SidebarProps {
  /** Below md: temporary-drawer open state (owned by AdminLayout). */
  open?: boolean;
  /** Below md: called to close the temporary drawer. */
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const location = useLocation();
  const isTabletDown = useIsMobile('md');
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
      variant={isTabletDown ? 'temporary' : 'permanent'}
      open={isTabletDown ? open : true}
      onClose={onClose}
      sx={{
        width: isTabletDown ? undefined : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <MosqueIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" color="primary" fontWeight={700} noWrap title={title} sx={{ fontSize: '1.1rem' }}>
          {title}
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, px: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={selected}
                aria-current={selected ? 'page' : undefined}
                onClick={isTabletDown ? onClose : undefined}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  transition: 'all 0.15s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(46, 125, 50, 0.12)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.18)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: selected ? 'primary.main' : 'text.secondary' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.92rem',
                    fontWeight: selected ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        >
          <Typography variant="button" fontWeight={700} noWrap title="Sign Out">
            Sign Out
          </Typography>
        </Button>
      </Box>
    </Drawer>
  );
}

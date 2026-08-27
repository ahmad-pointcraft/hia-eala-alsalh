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
  PeopleOutline as TeamIcon,
  Mosque as MosqueIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useSession } from '@/admin/store';
import { api } from '@/shared/api';
import type { MosqueConfig } from '@/shared/types';
import { useIsMobile } from '@/admin/hooks';
import { hasPermission, type Permission } from '@/admin/utils';

const DRAWER_WIDTH = 250;

interface NavItem {
  label: string;
  path: string;
  icon: typeof DevicesIcon;
  permission: Permission;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Devices', path: '/devices', icon: DevicesIcon, permission: 'devices:manage' },
  { label: 'Timings', path: '/timings', icon: TimingsIcon, permission: 'timings:manage' },
  { label: 'Content', path: '/content', icon: ContentIcon, permission: 'content:manage' },
  { label: 'Images', path: '/images', icon: ImagesIcon, permission: 'images:manage' },
  {
    label: 'Display Settings',
    path: '/settings',
    icon: SettingsIcon,
    permission: 'settings:manage',
  },
  { label: 'Team', path: '/team', icon: TeamIcon, permission: 'team:manage' },
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

    api
      .getMasjidConfig(session.masjidId)
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

  const [imgError, setImgError] = useState(false);
  const title = config?.masjidName_en ? `${config.masjidName_en}` : 'Masjid Admin';
  const masjidLogo = config?.logoUrl?.trim() || '';

  useEffect(() => {
    setImgError(false);
  }, [masjidLogo]);

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
          bgcolor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {/* BRANDING HEADER TILE */}
      <Box sx={{ p: 2.5, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: 'rgba(46, 125, 50, 0.08)',
            border: '1px solid rgba(46, 125, 50, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {masjidLogo && !imgError ? (
            <Box
              component="img"
              src={masjidLogo}
              alt={title}
              onError={() => setImgError(true)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <MosqueIcon sx={{ color: 'primary.main', fontSize: 24 }} />
          )}
        </Box>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            color="text.primary"
            fontWeight={700}
            noWrap
            title={title}
            sx={{ fontSize: '0.95rem', lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ fontSize: '0.72rem', display: 'block', mt: 0.25 }}
          >
            Admin Management
          </Typography>
        </Box>
      </Box>

      {/* NAVIGATION LIST */}
      <Box sx={{ px: 1, py: 1, flexGrow: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            px: 2,
            py: 0.75,
            display: 'block',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          Menu
        </Typography>
        <List sx={{ p: 0 }}>
          {NAV_ITEMS.filter((item) => hasPermission(session?.user?.role, item.permission)).map(
            (item) => {
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
                      px: 2,
                      mx: 0.5,
                      transition: 'all 0.15s ease-in-out',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(46, 125, 50, 0.09)',
                        color: 'primary.main',
                        fontWeight: 700,
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.14)',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 36, color: selected ? 'primary.main' : 'text.secondary' }}
                    >
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          fontSize: '0.9rem',
                          fontWeight: selected ? 700 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            },
          )}
        </List>
      </Box>

      {/* PINNED FOOTER */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{
            borderRadius: 2,
            py: 0.8,
            color: 'text.secondary',
            borderColor: 'rgba(0, 0, 0, 0.12)',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              backgroundColor: 'rgba(46, 125, 50, 0.05)',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
}

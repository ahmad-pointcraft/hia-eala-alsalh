import { useState, useEffect } from 'react';
import {
  Box,
  Menu,
  Switch,
  AppBar,
  Toolbar,
  MenuItem,
  ButtonBase,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { Heart, WifiOff, Settings, Check } from 'lucide-react';
import LightMode from '@mui/icons-material/LightMode';
import DarkMode from '@mui/icons-material/DarkMode';
import type { Language, Translations } from '@/display/types';
import type { HijriDateInfo } from '@/shared/types';
import { getFontFamily, getDirection, toArabicNumerals } from '@/display/utils/helpers';
import { useThemeMode } from '@/display/theme/ThemeContext';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onShowFundraising: () => void;
  translations: Translations;
  currentTime: Date;
  hijriDate: HijriDateInfo;
  holidays?: string[];
}

export function Header({
  language,
  onToggleLanguage,
  onShowFundraising,
  translations,
  currentTime,
  hijriDate,
}: HeaderProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { mode, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isSettingsOpen = Boolean(anchorEl);

  const handleOpenSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };



  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const formatTime = (date: Date) => {
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return language === 'ar' ? toArabicNumerals(timeStr) : timeStr;
  };

  const getHijriDate = () => {
    const dateStr = language === 'ar' ? toArabicNumerals(hijriDate.formatted_ar) : hijriDate.formatted_en;
    return dateStr;
  };

  const getGregorianDate = () => {
    const dateStr = currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return language === 'ar' ? toArabicNumerals(dateStr) : dateStr;
  };

  const pillSx = {
    bgcolor: 'surface.raised',
    backdropFilter: 'blur(12px)',
    border: '1px solid',
    borderColor: 'border.thin',
    borderRadius: 24,
  } as const;

  return (
    <AppBar
      position="static"
      dir={getDirection(language)}
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        backgroundImage: 'none',
        border: 'none',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          py: { xs: '8px', sm: '10px', md: '12px', lg: '12px' },
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <ButtonBase
            onClick={onShowFundraising}
            aria-label={translations.donate}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 0.75, sm: 1, md: 1 },
              borderRadius: 24,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.gold.dark}, ${theme.palette.gold.main})`,
              color: 'text.onGold',
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem' },
              fontWeight: 600,
              fontFamily: getFontFamily(language),
              textTransform: 'none',
              border: 'none',
              transition: 'all 200ms cubic-bezier(0.25, 1, 0.5, 1)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <Heart size={16} />
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              {translations.donate}
            </Box>
          </ButtonBase>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          <Box
            sx={{
              ...pillSx,
              px: { xs: 2, sm: 3, md: 4, lg: 4 },
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography
              role="timer"
              aria-label={language === 'en' ? 'Current time' : 'الوقت الحالي'}
              sx={{
                color: 'text.primary',
                fontFamily: '"Roboto Mono", monospace',
                letterSpacing: '0.05em',
                fontSize: {
                  xs: '28px',
                  sm: '36px',
                  md: '40px',
                  lg: '44px',
                  xl: '48px',
                },
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {formatTime(currentTime)}
            </Typography>
            {isOffline && (
              <Box
                component="span"
                role="status"
                aria-label={language === 'en' ? 'Offline' : 'غير متصل'}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  color: 'text.muted',
                }}
              >
                <WifiOff size={18} aria-hidden="true" />
              </Box>
            )}
          </Box>
          <Typography
            sx={{
              color: 'text.soft',
              fontSize: { xs: '13px', sm: '14px', md: '14px', lg: '15px' },
              fontWeight: 600,
              fontFamily: getFontFamily(language),
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {getHijriDate()} ·{' '}
            </Box>
            {getGregorianDate()}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton
            onClick={handleOpenSettings}
            aria-label="Settings"
            id="settings-button"
            aria-controls={isSettingsOpen ? 'settings-menu' : undefined}
            aria-expanded={isSettingsOpen ? 'true' : undefined}
            aria-haspopup="true"
            sx={{
              width: 44,
              height: 44,
              border: '1px solid',
              borderColor: 'border.thin',
              bgcolor: 'surface.raised',
              color: 'text.secondary',
              transition: 'transform 0.3s ease, color 0.3s ease',
              '&:hover': {
                color: 'primary.main',
                transform: 'rotate(45deg)',
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '&:hover': { transform: 'none' },
              },
            }}
          >
            <Settings size={20} />
          </IconButton>

          <Menu
            id="settings-menu"
            anchorEl={anchorEl}
            open={isSettingsOpen}
            onClose={handleCloseSettings}
            MenuListProps={{
              'aria-labelledby': 'settings-button',
            }}
            transformOrigin={{ vertical: 'top', horizontal: language === 'ar' ? 'left' : 'right' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: language === 'ar' ? 'left' : 'right' }}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: 'background.default',
                  backgroundImage: 'none',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'border.thin',
                  minWidth: 200,
                },
              },
            }}
          >
            <MenuItem onClick={() => { if (language !== 'en') onToggleLanguage(); handleCloseSettings(); }}>
              <ListItemIcon sx={{ minWidth: '36px !important' }}>
                {language === 'en' ? <Check size={16} /> : <Box sx={{ width: 16 }} />}
              </ListItemIcon>
              <ListItemText>English</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { if (language !== 'ar') onToggleLanguage(); handleCloseSettings(); }}>
              <ListItemIcon sx={{ minWidth: '36px !important' }}>
                {language === 'ar' ? <Check size={16} /> : <Box sx={{ width: 16 }} />}
              </ListItemIcon>
              <ListItemText>العربية</ListItemText>
            </MenuItem>
            
            <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', my: 1 }} />

            <MenuItem onClick={toggleTheme}>
              <ListItemIcon sx={{ minWidth: '36px !important' }}>
                {mode === 'dark' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
              </ListItemIcon>
              <ListItemText>
                {mode === 'dark'
                  ? (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')
                  : (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode')}
              </ListItemText>
              <Switch
                edge="end"
                checked={mode === 'dark'}
                size="small"
                sx={{ ml: 'auto' }}
              />
            </MenuItem>

          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

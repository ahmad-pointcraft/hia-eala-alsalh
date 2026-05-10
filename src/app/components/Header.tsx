import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Languages, Heart, CalendarClock, WifiOff } from 'lucide-react';
import { Language } from '../utils/translations';
import type { Translations } from '../utils/translations';
import { getFontFamily, getDirection } from '../utils/helpers';

interface HeaderProps {
  eventMode: boolean;
  onToggleEventMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onShowFundraising: () => void;
  translations: Translations;
  currentTime: Date;
}

export function Header({ eventMode, onToggleEventMode, language, onToggleLanguage, onShowFundraising, translations, currentTime }: HeaderProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <AppBar
      position="static"
      dir={getDirection(language)}
      sx={{
        bgcolor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        borderBottom: '1px solid rgba(212,175,55,0.3)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, px: '20px !important', py: '10px' }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            onClick={onToggleLanguage}
            aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            startIcon={<Languages style={{ width: 16, height: 16 }} />}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 1.5, sm: 2 },
              py: 1,
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'primary.main',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 'bold',
              border: '1px solid rgba(212,175,55,0.5)',
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.95)' },
            }}
          >
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                fontFamily: getFontFamily(language),
                fontSize: 'inherit',
                fontWeight: 'inherit',
              }}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Typography>
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Typography
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            sx={{
              color: 'text.primary',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {formatTime(currentTime)}
          </Typography>
          {isOffline && (
            <Box
              component="span"
              aria-live="polite"
              sx={{ display: 'flex', alignItems: 'center', color: 'grey.500', ml: 1 }}
            >
              <WifiOff size={18} />
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={onShowFundraising}
            title={translations.donate}
            aria-label={translations.donate}
            startIcon={<Heart size={18} />}
            sx={{
              px: 1.5,
              py: 1,
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'primary.main',
              border: '1px solid rgba(212,175,55,0.5)',
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.95)' },
            }}
          >
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', lg: 'inline' },
                fontFamily: getFontFamily(language),
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 'bold',
              }}
            >
              {translations.donate}
            </Typography>
          </Button>

          <Button
            onClick={onToggleEventMode}
            aria-label={eventMode ? translations.exitEvent : translations.comingEvent}
            startIcon={<CalendarClock size={18} />}
            sx={{
              px: { xs: 1.5, sm: 2 },
              py: 1,
              bgcolor: 'rgba(212,175,55,0.8)',
              color: 'primary.contrastText',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 'bold',
              borderRadius: 2,
              backdropFilter: 'blur(4px)',
              textTransform: 'none',
              '&:hover': { bgcolor: 'primary.main' },
            }}
          >
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' },
                fontFamily: getFontFamily(language),
                fontSize: 'inherit',
                fontWeight: 'inherit',
              }}
            >
              {eventMode ? translations.exitEvent : translations.comingEvent}
            </Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

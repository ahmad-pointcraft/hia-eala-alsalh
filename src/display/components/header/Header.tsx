import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, ButtonBase, Typography } from '@mui/material';

import { Heart, WifiOff } from 'lucide-react';
import type { Language, Translations } from '@/display/types';
import type { HijriDateInfo } from '@/shared/types';
import {
  getFontFamily,
  getDirection,
  toArabicNumerals,
  getWallClockSeconds,
} from '@/display/utils';
import { useMosqueConfigStore } from '@/display/store';

interface HeaderProps {
  language: Language;
  onShowFundraising: () => void;
  translations: Translations;
  currentTime: Date;
  hijriDate: HijriDateInfo;
  holidays?: string[];
}

export function Header({
  language,
  onShowFundraising,
  translations,
  currentTime,
  hijriDate,
}: HeaderProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const timeFormat = useMosqueConfigStore((s) => s.config.timeFormat ?? '12h');
  const showSeconds = useMosqueConfigStore((s) => s.config.showSeconds ?? true);
  const timeZone = useMosqueConfigStore((s) => s.config.timeZone);

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
    const is12h = timeFormat === '12h';
    // WALL-CLOCK PARTS IN THE MASJID TIME ZONE — prayer times are formatted in
    // the same zone, so the displayed clock must match it, not the browser.
    const totalSeconds = getWallClockSeconds(date, timeZone);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');

    let displayHours: string;
    let periodSuffix = '';

    if (is12h) {
      const h12 = hours % 12 || 12;
      displayHours = h12.toString();
      const period =
        hours >= 12 ? (language === 'ar' ? ' م' : ' PM') : language === 'ar' ? ' ص' : ' AM';
      periodSuffix = period;
    } else {
      displayHours = pad(hours);
    }

    const minStr = pad(minutes);
    const secStr = showSeconds ? `:${pad(seconds)}` : '';
    const rawTime = `${displayHours}:${minStr}${secStr}${periodSuffix}`;

    return language === 'ar' ? toArabicNumerals(rawTime) : rawTime;
  };

  const getHijriDate = () => {
    const dateStr =
      language === 'ar' ? toArabicNumerals(hijriDate.formatted_ar) : hijriDate.formatted_en;
    return dateStr;
  };

  const getGregorianDate = () => {
    const dateStr = currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone,
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
          }}
        />
      </Toolbar>
    </AppBar>
  );
}

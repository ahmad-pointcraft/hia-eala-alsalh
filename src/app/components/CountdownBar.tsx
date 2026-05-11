import { useRef } from 'react';
import { Language } from '../utils/translations';
import { Paper, Box, Typography } from '@mui/material';
import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers';

interface CountdownBarProps {
  nextPrayer: string;
  nextPrayerTime: string;
  language: Language;
  currentTime: Date;
}

export function CountdownBar({ nextPrayer, nextPrayerTime, language, currentTime }: CountdownBarProps) {
  const lastAnnouncedMinute = useRef<number>(-1);

  const [hours, minutes] = nextPrayerTime.split(':').map(Number);
  const target = new Date(currentTime);
  target.setHours(hours, minutes, 0, 0);

  if (target < currentTime) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - currentTime.getTime();
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  const countdown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const displayCountdown = language === 'ar' ? toArabicNumerals(countdown) : countdown;
  const prayerText = language === 'ar' ? `${nextPrayer} بعد` : `${nextPrayer} in`;

  const currentMinute = m;
  const shouldAnnounce = currentMinute !== lastAnnouncedMinute.current;
  if (shouldAnnounce) {
    lastAnnouncedMinute.current = currentMinute;
  }
  const announcementText = shouldAnnounce
    ? language === 'ar'
      ? `${nextPrayer} ${toArabicNumerals(countdown)}`
      : `${nextPrayer} in ${countdown}`
    : undefined;

  return (
    <Paper
      dir={getDirection(language)}
      role="timer"
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(4px)',
        border: '1px solid',
        borderColor: 'rgba(212,175,55,0.3)',
        borderRadius: 2,
        p: { xs: 1, sm: 1.5, lg: 2 },
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1, sm: 2 } }}>
        <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '14px', fontFamily: getFontFamily(language) }}>
          {prayerText}
        </Typography>

        <Typography sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '16px' }}>
          {displayCountdown}
        </Typography>
      </Box>
      {announcementText !== undefined && (
        <Box
          component="span"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
        >
          {announcementText}
        </Box>
      )}
    </Paper>
  );
}

import { useEffect, useState } from 'react';
import { Language } from '../utils/translations';
import { Paper, Box, Typography } from '@mui/material';

interface CountdownBarProps {
  nextPrayer: string;
  nextPrayerTime: string;
  language: Language;
  nextPrayerLabel: string;
}

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export function CountdownBar({ nextPrayer, nextPrayerTime, language, nextPrayerLabel }: CountdownBarProps) {
  const [countdown, setCountdown] = useState('03:45:23');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = nextPrayerTime.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayerTime]);

  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  const displayCountdown = language === 'ar' ? toArabicNumerals(countdown) : countdown;
  const prayerText = language === 'ar' ? `${nextPrayer} بعد` : `${nextPrayer} in`;

  return (
    <Paper
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(4px)',
        border: '1px solid',
        borderColor: 'rgba(212,175,55,0.3)',
        borderRadius: 2,
        p: { xs: 1, sm: 1.5, lg: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1, sm: 2 } }}>
        {/* Prayer Info */}
        <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '14px', fontFamily }}>
          {prayerText}
        </Typography>

        {/* Countdown */}
        <Typography sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '16px' }}>
          {displayCountdown}
        </Typography>
      </Box>
    </Paper>
  );
}

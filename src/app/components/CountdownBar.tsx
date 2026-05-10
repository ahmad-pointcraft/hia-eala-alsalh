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

  return (
    <Paper
      dir={getDirection(language)}
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
        <Typography sx={{ color: 'text.primary', fontWeight: 'bold', fontSize: '14px', fontFamily: getFontFamily(language) }}>
          {prayerText}
        </Typography>

        <Typography sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.05em', fontSize: '16px' }}>
          {displayCountdown}
        </Typography>
      </Box>
    </Paper>
  );
}

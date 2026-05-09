import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Star,
} from 'lucide-react';
import { Language } from '../utils/translations';
import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers';
import type { PrayerKey } from '../utils/prayerTimes';

interface PrayerCardProps {
  name: string;
  time: string;
  iqamaTime: string;
  isActive?: boolean;
  language: Language;
  iqamaLabel: string;
  prayerKey: PrayerKey;
}

const prayerIcons: Record<PrayerKey, React.ComponentType<{ className?: string }>> = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: CloudSun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export function PrayerCard({
  name,
  time,
  iqamaTime,
  isActive = false,
  language,
  iqamaLabel,
  prayerKey,
}: PrayerCardProps) {
  const Icon = prayerIcons[prayerKey] || Star;

  const displayTime = language === 'ar' ? toArabicNumerals(time) : time;
  const displayIqamaTime = language === 'ar' ? toArabicNumerals(iqamaTime) : iqamaTime;

  return (
    <Card
      dir={getDirection(language)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0.75, sm: 1, lg: 1.5 },
        borderRadius: 2,
        transition: 'all 300ms',
        ...(isActive
          ? {
              bgcolor: 'rgba(212,175,55,0.2)',
              border: '1px solid',
              borderColor: 'primary.main',
              boxShadow: '0 0 30px rgba(212,175,55,0.5)',
              transform: { xs: 'scale(1.05)', lg: 'scale(1.10)' },
            }
          : {
              bgcolor: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(212,175,55,0.3)',
            }),
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            mb: { xs: 0.25, sm: 0.5, lg: 1 },
            color: isActive ? 'primary.main' : 'grey.500',
            '& svg': { width: { xs: 20, sm: 24, lg: 32 }, height: { xs: 20, sm: 24, lg: 32 } },
          }}
        >
          <Icon />
        </Box>

        <Typography
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            mb: { xs: 0.25, sm: 0.5 },
            fontWeight: isActive ? 'bold' : 'normal',
            fontSize: { xs: '10px', sm: '16px' },
            fontFamily: getFontFamily(language),
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            color: 'text.primary',
            fontWeight: 'bold',
            mb: { xs: 0.25, sm: 0.5 },
            fontSize: isActive
              ? { xs: '1.875rem', sm: '2.25rem', lg: '3rem' }
              : { xs: '1.25rem', lg: '1.5rem' },
            fontFamily: getFontFamily(language),
          }}
        >
          {displayTime}
        </Typography>

        <Typography
          sx={{
            color: 'primary.main',
            fontSize: { xs: '8px', sm: '10px', lg: '0.875rem' },
            fontWeight: isActive ? 'bold' : 'normal',
            fontFamily: getFontFamily(language),
          }}
        >
          {iqamaLabel}: {displayIqamaTime}
        </Typography>
      </CardContent>
    </Card>
  );
}

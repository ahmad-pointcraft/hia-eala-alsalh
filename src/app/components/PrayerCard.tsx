import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Moon, Sun, Sunrise, Sunset, CloudSun, Star } from 'lucide-react';
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
  const theme = useTheme();
  const Icon = prayerIcons[prayerKey] || Star;

  const displayTime = language === 'ar' ? toArabicNumerals(time) : time;
  const displayIqamaTime = language === 'ar' ? toArabicNumerals(iqamaTime) : iqamaTime;

  return (
    <Card
      dir={getDirection(language)}
      aria-current={isActive ? 'true' : undefined}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0.75, sm: 1, md: 1.25, lg: 1.5 },
        borderRadius: '16px',
        transition: 'all 300ms cubic-bezier(0.25, 1, 0.5, 1)',
        ...(isActive
          ? {
              bgcolor: 'border.default',
              border: '1px solid',
              borderColor: 'primary.main',
              boxShadow: `0 0 30px ${theme.palette.glow.medium}`,
              transform: 'scale(1.02)',
            }
          : {
              bgcolor: 'surface.overlay',
              border: '1px solid',
              borderColor: 'border.medium',
            }),
      }}
    >
      <CardContent
        sx={{
          p: 0,
          '&:last-child': { pb: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            mb: { xs: 0.25, sm: 0.5, md: 0.75, lg: 1 },
            color: isActive ? (theme) => theme.palette.gold.onLight : 'text.secondary',
            '& svg': {
              width: { xs: 20, sm: 24, md: 26, lg: 28 },
              height: { xs: 20, sm: 24, md: 26, lg: 28 },
            },
          }}
        >
          <Icon aria-hidden="true" />
        </Box>

        <Typography
          sx={{
            color: 'text.secondary',
            textTransform: language === 'ar' ? 'none' : 'uppercase',
            letterSpacing: '0.05em',
            mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 0.75 },
            fontWeight: 'normal',
            fontSize: { xs: '10px', sm: '16px', md: '14px', lg: '16px' },
            fontFamily: getFontFamily(language),
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            color: 'text.primary',
            fontWeight: 'bold',
            mb: { xs: 0.25, sm: 0.5, md: 0.5, lg: 0.75 },
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem', lg: '1.5rem' },
            fontFamily: getFontFamily(language),
          }}
        >
          {displayTime}
        </Typography>

        <Typography
          sx={{
            color: (theme) => theme.palette.gold.onLight,
            fontSize: { xs: '8px', sm: '10px', md: '12px', lg: '0.875rem' },
            fontWeight: 'normal',
            fontFamily: getFontFamily(language),
          }}
        >
          {iqamaLabel}: {displayIqamaTime}
        </Typography>
      </CardContent>
    </Card>
  );
}

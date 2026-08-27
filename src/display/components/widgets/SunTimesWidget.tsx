import { Sunrise, Sunset } from 'lucide-react';
import type { Language, Translations } from '@/display/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { toArabicNumerals, getDirection } from '@/display/utils';
import { floatingCardSx } from '@/display/theme/sharedStyles';
import type { Theme } from '@mui/material/styles';

interface SunTimesWidgetProps {
  language: Language;
  translations: Translations;
  sunriseTime: string;
  sunsetTime: string;
}

const cardSx = (theme: Theme) => ({
  ...floatingCardSx(theme),
  flex: 1,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 0.5,
  py: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
  px: { xs: 1.5, sm: 2.5, md: 2.5, lg: 2.5 },
});

const labelSx = {
  color: 'text.muted',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  fontWeight: 600,
  fontSize: { xs: '9px', sm: '10px', md: '11px', lg: '12px', xl: '12px' },
  lineHeight: 1,
} as const;

const timeSx = {
  fontFamily: '"Roboto Mono", monospace',
  fontSize: { xs: '18px', sm: '20px', md: '22px', lg: '24px', xl: '26px' },
  fontWeight: 700,
  color: 'text.primary',
  letterSpacing: '0.05em',
  lineHeight: 1.1,
} as const;

export function SunTimesWidget({
  language,
  translations,
  sunriseTime,
  sunsetTime,
}: SunTimesWidgetProps) {
  const dir = getDirection(language);
  const displaySunrise = language === 'ar' ? toArabicNumerals(sunriseTime) : sunriseTime;
  const displaySunset = language === 'ar' ? toArabicNumerals(sunsetTime) : sunsetTime;

  return (
    <Box
      dir={dir}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        flex: 1,
        width: '100%',
      }}
    >
      <Box sx={cardSx}>
        <Box sx={{ color: 'text.muted', flexShrink: 0, display: 'flex' }}>
          <Sunrise size={26} />
        </Box>
        <Typography sx={labelSx}>{translations.prayers.sunrise}</Typography>
        <Typography sx={timeSx}>{displaySunrise}</Typography>
      </Box>
      <Box sx={cardSx}>
        <Box sx={{ color: 'text.muted', flexShrink: 0, display: 'flex' }}>
          <Sunset size={26} />
        </Box>
        <Typography sx={labelSx}>{translations.sunset}</Typography>
        <Typography sx={timeSx}>{displaySunset}</Typography>
      </Box>
    </Box>
  );
}

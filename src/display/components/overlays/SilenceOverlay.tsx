import { useMemo } from 'react';
import { motion } from 'motion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Sunrise, Sun, CloudSun, Sunset, Moon, Star, type LucideIcon } from 'lucide-react';
import { IslamicGeometricOverlay } from './IslamicGeometricOverlay';
import type { Language, Translations } from '@/display/types/i18n';
import type { PrayerTime } from '@/display/types/prayer';
import { getFontFamily } from '@/display/utils/helpers';
import { STANDING_DURATION_SEC, SILENCE_DURATION_SEC } from '@/display/constants/prayerPhases';

interface SilenceOverlayProps {
  language: Language;
  prayingPrayer: PrayerTime | null;
  currentTime: Date;
  translations: Translations;
}

// Icon mapping matching the prayer card designs
const prayerIcons: Record<string, LucideIcon> = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: CloudSun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export function SilenceOverlay({
  language,
  prayingPrayer,
  currentTime,
  translations,
}: SilenceOverlayProps) {
  const theme = useTheme();

  const progress = useMemo(() => {
    if (!prayingPrayer || !prayingPrayer.iqamaTime) return 0;
    const parts = prayingPrayer.iqamaTime.split(':').map(Number);
    const iqamaHours = parts[0] ?? 0;
    const iqamaMinutes = parts[1] ?? 0;

    const iqamaDate = new Date(currentTime);
    iqamaDate.setHours(iqamaHours, iqamaMinutes, 0, 0);

    // SILENCE OVERLAY STARTS EXACTLY STANDING_DURATION_SEC SECONDS AFTER IQAMA
    const overlayStartMs = iqamaDate.getTime() + STANDING_DURATION_SEC * 1000;
    const elapsedMs = currentTime.getTime() - overlayStartMs;
    const totalMs = SILENCE_DURATION_SEC * 1000;
    return Math.min(1, Math.max(0, 1 - elapsedMs / totalMs));
  }, [prayingPrayer, currentTime]);

  if (!prayingPrayer) return null;

  const isLight = theme.palette.mode === 'light';
  const goldColor = theme.palette.gold.onLight;
  const textColor = theme.palette.text.primary;
  const softText = theme.palette.text.soft;

  // Solid gold gradient badge matching the mockup design
  const badgeBg = `linear-gradient(135deg, ${theme.palette.gold.light} 0%, ${theme.palette.gold.main} 50%, ${theme.palette.gold.dark} 100%)`;
  const badgeTextColor = theme.palette.primary.contrastText;

  const calligraphyFont = language === 'ar' ? '"Reem Kufi", sans-serif' : '"Cinzel", serif';

  // Retrieve the matching prayer icon, fallback to Star
  const Icon = prayerIcons[prayingPrayer.key] || Star;

  return (
    <Box
      role="alert"
      aria-label={language === 'en' ? 'Prayer in progress - please observe silence' : 'الصلاة جارية - يرجى الالتزام بالهدوء'}
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${theme.palette.background.default}B3`, 
        backdropFilter: 'blur(16px)', 
        color: textColor,
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box sx={{ opacity: 0.3, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <IslamicGeometricOverlay />
      </Box>

      {/* Top Countdown Line */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: 4,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, transparent 0%, ${theme.palette.gold.main} 50%, transparent 100%)`,
          boxShadow: `0 0 20px 4px ${theme.palette.glow.subtle}`,
          transition: 'width 1s linear',
        }}
      />

      {/* Content Stack */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 4, sm: 5, md: 6 },
          zIndex: 21,
          textAlign: 'center',
          px: 4,
          maxWidth: '100%',
        }}
      >
        {/* Prayer Badge */}
        <Box
          sx={{
            background: badgeBg,
            boxShadow: isLight ? 'none' : `0 0 15px ${theme.palette.glow.subtle}`,
            borderRadius: '9999px',
            px: { xs: 4, sm: 5 },
            py: { xs: 1, sm: 1.25 },
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: badgeTextColor,
              fontWeight: 700,
              fontSize: { xs: '16px', sm: '20px', md: '24px' },
              fontFamily: getFontFamily(language),
              letterSpacing: language === 'en' ? '0.02em' : 'normal',
            }}
          >
            {language === 'ar' ? `صلاة ${prayingPrayer.name}` : `${prayingPrayer.name} Prayer`}
          </Typography>
        </Box>

        {/* Dynamic Prayer Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: goldColor,
            opacity: 0.9,
            '& svg': {
              width: 56,
              height: 56,
            },
          }}
        >
          <Icon aria-hidden="true" strokeWidth={1.5} />
        </Box>

        {/* Primary Calligraphy Text */}
        <Typography
          sx={{
            fontFamily: calligraphyFont,
            fontWeight: language === 'ar' ? 800 : 600,
            fontSize: language === 'ar'
              ? { xs: '48px', sm: '72px', md: '96px', lg: '110px', xl: '128px' }
              : { xs: '38px', sm: '56px', md: '72px', lg: '84px' },
            color: goldColor,
            lineHeight: 1.2,
            letterSpacing: language === 'en' ? '0.04em' : 'normal',
            textShadow: isLight ? 'none' : `0 0 24px ${theme.palette.glow.subtle}`,
          }}
        >
          {language === 'ar'
            ? `صلاة ${prayingPrayer.name} جارية`
            : `${prayingPrayer.name} in Progress`}
        </Typography>

        {/* Secondary Text */}
        <Typography
          sx={{
            fontFamily: getFontFamily(language),
            fontWeight: 400,
            fontSize: { xs: '18px', sm: '24px', md: '32px' },
            color: softText,
            maxWidth: '800px',
            lineHeight: 1.6,
          }}
        >
          {translations.pleaseObserveSilence}
        </Typography>
      </Box>

      {/* Bottom Countdown Line */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: 4,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, transparent 0%, ${theme.palette.gold.main} 50%, transparent 100%)`,
          boxShadow: `0 0 20px 4px ${theme.palette.glow.subtle}`,
          transition: 'width 1s linear',
        }}
      />
    </Box>
  );
}

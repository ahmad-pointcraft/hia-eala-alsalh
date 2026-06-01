import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { IslamicGeometricOverlay } from './IslamicGeometricOverlay';
import type { Language, Translations } from '@/app/types/i18n';
import type { PrayerTime } from '@/app/types/prayer';
import { getFontFamily } from '@/app/utils/helpers';
import calligraphyDark from '../../../assets/calligraphy_dark.png';
import calligraphyLight from '../../../assets/calligraphy_light.png';

interface SilenceOverlayProps {
  language: Language;
  prayingPrayer: PrayerTime | null;
  currentTime: Date;
  translations: Translations;
}

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

    const elapsedMs = currentTime.getTime() - iqamaDate.getTime();
    const totalMs = 8 * 60 * 1000;
    return Math.min(1, Math.max(0, 1 - elapsedMs / totalMs));
  }, [prayingPrayer, currentTime]);

  if (!prayingPrayer) return null;

  const isLight = theme.palette.mode === 'light';
  const goldColor = theme.palette.gold.onLight;
  const textColor = theme.palette.text.primary;
  const softText = theme.palette.text.soft;

  const badgeBg = isLight ? 'rgba(154, 125, 0, 0.08)' : 'rgba(0, 0, 0, 0.4)';
  const badgeBorder = isLight ? '1px solid rgba(154, 125, 0, 0.2)' : `1px solid ${theme.palette.border.medium}`;

  return (
    <Box
      role="alert"
      aria-label={language === 'en' ? 'Prayer in progress - please observe silence' : 'الصلاة جارية - يرجى الالتزام بالهدوء'}
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${theme.palette.background.default}D9`,
        color: textColor,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ opacity: 0.3, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <IslamicGeometricOverlay />
      </Box>

      <Box
        sx={{
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 3, sm: 4, md: 5 },
          zIndex: 21,
          textAlign: 'center',
          px: 4,
          maxWidth: '100%',
        }}
      >
        <Box
          sx={{
            bgcolor: badgeBg,
            border: badgeBorder,
            borderRadius: '9999px',
            px: { xs: 3, sm: 4 },
            py: { xs: 0.75, sm: 1 },
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: goldColor,
              fontWeight: 600,
              fontSize: { xs: '14px', sm: '18px', md: '22px' },
              fontFamily: getFontFamily(language),
            }}
          >
            {language === 'ar' ? `\u0635\u0644\u0627\u0629 ${prayingPrayer.name}` : `${prayingPrayer.name} Prayer`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: goldColor,
            opacity: 0.85,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
          </svg>
        </Box>

        {language === 'ar' ? (
          <Box
            component="img"
            src={isLight ? calligraphyLight : calligraphyDark}
            alt="\u0627\u0644\u0635\u0644\u0627\u0629 \u062C\u0627\u0631\u064A\u0629"
            sx={{
              maxWidth: '90%',
              width: { xs: 320, sm: 450, md: 550, lg: 700, xl: 850 },
              height: 'auto',
              filter: isLight ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' : `drop-shadow(0 0 8px ${theme.palette.glow.subtle})`,
            }}
          />
        ) : (
          <Typography
            sx={{
              fontFamily: getFontFamily(language),
              fontWeight: 700,
              fontSize: { xs: '32px', sm: '48px', md: '64px', lg: '80px', xl: '96px' },
              color: goldColor,
              letterSpacing: '-0.02em',
              textShadow: isLight ? 'none' : `0 0 20px ${theme.palette.glow.subtle}`,
            }}
          >
            {translations.prayerInProgress}
          </Typography>
        )}

        <Typography
          sx={{
            fontFamily: getFontFamily(language),
            fontWeight: 400,
            fontSize: { xs: '16px', sm: '20px', md: '28px', lg: '32px' },
            color: softText,
            maxWidth: '600px',
            lineHeight: 1.5,
          }}
        >
          {translations.pleaseObserveSilence}
        </Typography>
      </Box>

      <Box
        sx={{
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

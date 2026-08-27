import { Volume2, Clock, Users, Star } from 'lucide-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Language, Translations } from '@/display/types';
import type { PrayerWidgetState } from '@/display/hooks';
import { getFontFamily, getDirection, toArabicNumerals } from '@/display/utils';

interface PrayerStatusWidgetProps {
  widgetState: PrayerWidgetState;
  language: Language;
  translations: Translations;
}

// FORMAT SECONDS TO MM:SS
const formatMMSS = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export function PrayerStatusWidget({
  widgetState,
  language,
  translations,
}: PrayerStatusWidgetProps) {
  const theme = useTheme();

  if (widgetState.phase === 'none' || widgetState.phase === 'silence') {
    return null;
  }

  const { prayerName, timeRemainingSec, totalDurationSec } = widgetState;
  const progress =
    totalDurationSec > 0 ? Math.min(1, Math.max(0, timeRemainingSec / totalDurationSec)) : 0;

  // PROGRESS BAR TRANSITION STYLE
  const progressWidth = `${progress * 100}%`;

  // PHASE CONFIGURATION
  let phaseTitle = '';
  let phaseSubtitle = '';
  let Icon = Star;
  let timerText = '';
  let showTimer = true;
  let pulseAnimation = false;

  if (widgetState.phase === 'azan') {
    // DYNAMIC FORMAT FOR ADHAN
    phaseTitle =
      language === 'ar'
        ? `${translations.prayerWidget.adhanLabel} ${prayerName}`
        : `${prayerName} ${translations.prayerWidget.adhanLabel}`;
    phaseSubtitle = translations.prayerWidget.pleasePrepare;
    Icon = Volume2;
    showTimer = false;
    pulseAnimation = true;
  } else if (widgetState.phase === 'countdown') {
    phaseTitle = translations.prayerWidget.iqamaIn;
    // DYNAMIC FORMAT FOR IQAMA
    phaseSubtitle =
      language === 'ar'
        ? `${translations.prayerWidget.iqamaPrayerLabel} ${prayerName}`
        : `${prayerName} ${translations.prayerWidget.iqamaPrayerLabel}`;
    Icon = Clock;
    timerText = formatMMSS(timeRemainingSec);
  } else if (widgetState.phase === 'standing') {
    phaseTitle = translations.prayerWidget.standStraighten;
    phaseSubtitle = translations.prayerWidget.congregationStarting;
    Icon = Users;
    timerText = formatMMSS(timeRemainingSec);
    pulseAnimation = true;
  }

  const displayTimer = language === 'ar' ? toArabicNumerals(timerText) : timerText;
  const displayTitle = phaseTitle;
  const displaySubtitle = phaseSubtitle;

  return (
    <Box
      dir={getDirection(language)}
      role="timer"
      aria-label={displayTitle}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '24px',
        bgcolor: 'surface.overlay',
        border: '1px solid',
        borderColor: 'border.thin',
        boxShadow: `0 8px 32px ${theme.palette.surface.overlay}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4 },
        px: 2,
      }}
    >
      {/* GLOW BACKGROUND EFFORTS */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: `radial-gradient(circle, ${theme.palette.glow.subtle} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ICON ELEMENT */}
      <Box
        sx={{
          mb: 2,
          color: theme.palette.gold.onLight,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& svg': {
            width: { xs: 36, sm: 44, md: 48 },
            height: { xs: 36, sm: 44, md: 48 },
          },
          ...(pulseAnimation && {
            animation: 'widgetPulse 2s infinite ease-in-out',
            '@keyframes widgetPulse': {
              '0%': { transform: 'scale(1)', opacity: 0.8 },
              '50%': { transform: 'scale(1.08)', opacity: 1 },
              '100%': { transform: 'scale(1)', opacity: 0.8 },
            },
          }),
        }}
      >
        <Icon aria-hidden="true" strokeWidth={1.5} />
      </Box>

      {/* PHASE HEADER */}
      <Typography
        sx={{
          color: theme.palette.gold.onLight,
          // BOLDER WEIGHT IN ADHAN PHASE
          fontWeight: widgetState.phase === 'azan' ? 900 : 800,
          // LARGER SIZE IN ADHAN PHASE
          fontSize:
            widgetState.phase === 'azan'
              ? { xs: '26px', sm: '36px', md: '44px' }
              : { xs: '20px', sm: '24px', md: '28px' },
          fontFamily: getFontFamily(language),
          zIndex: 1,
          lineHeight: 1.2,
          textAlign: 'center',
          textTransform: language === 'ar' ? 'none' : 'uppercase',
          letterSpacing: language === 'ar' ? '0' : '0.05em',
        }}
      >
        {displayTitle}
      </Typography>

      {/* PHASE TIMER */}
      {showTimer && (
        <Typography
          sx={{
            color: 'text.primary',
            fontFamily: '"Roboto Mono", monospace',
            fontWeight: 700,
            letterSpacing: '0.05em',
            fontSize: { xs: '38px', sm: '52px', md: '60px' },
            lineHeight: 1.1,
            my: 1.5,
            zIndex: 1,
          }}
        >
          {displayTimer}
        </Typography>
      )}

      {/* SUBTITLE LABELS */}
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '13px', sm: '15px', md: '16px' },
          fontFamily: getFontFamily(language),
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {displaySubtitle}
      </Typography>

      {/* PROGRESS TRACK LINE */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 6,
          width: '100%',
          bgcolor: 'border.thin',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: progressWidth,
            background: `linear-gradient(90deg, ${theme.palette.gold.light} 0%, ${theme.palette.gold.main} 100%)`,
            boxShadow: `0 0 10px ${theme.palette.glow.subtle}`,
            transition: 'width 1s linear',
          }}
        />
      </Box>
    </Box>
  );
}

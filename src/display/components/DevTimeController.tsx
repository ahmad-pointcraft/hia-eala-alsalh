import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useMosqueConfigStore } from '@/display/store';
import type { PrayerTime } from '@/shared/types';
import type { Language } from '@/display/types';
import { getDirection } from '@/display/utils';
import { Wrench, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DevTimeControllerProps {
  prayers: PrayerTime[];
  language: Language;
}

// LOCAL TRANSLATIONS FOR DEVELOPMENT CONTROLLER
const devTranslations = {
  en: {
    title: '🛠️ DEV TIME CONTROLLER',
    reset: 'Reset Real Time',
    offset: 'Offset:',
    phases: {
      azan: 'Adhan Phase',
      countdown: 'Countdown',
      standing: 'Standing',
      silence: 'Silence',
    },
  },
  ar: {
    title: '🛠️ لوحة اختبار الوقت',
    reset: 'إعادة الوقت الفعلي',
    offset: 'الفارق:',
    phases: {
      azan: 'مرحلة الأذان',
      countdown: 'العد التنازلي',
      standing: 'مرحلة القيام',
      silence: 'مرحلة الصمت',
    },
  },
};

// LOCALIZED SHORT LABELS FOR PRAYER BUTTONS
const prayerLabels = {
  en: { Fajr: 'F', Dhuhr: 'D', Asr: 'A', Maghrib: 'M', Isha: 'I' } as Record<string, string>,
  ar: { Fajr: 'ف', Dhuhr: 'ظ', Asr: 'ع', Maghrib: 'م', Isha: 'ش' } as Record<string, string>,
};

export function DevTimeController({ prayers, language }: DevTimeControllerProps) {
  const setMockClockOffsetMs = useMosqueConfigStore((s) => s.setMockClockOffsetMs);
  const mockClockOffsetMs = useMosqueConfigStore((s) => s.mockClockOffsetMs || 0);
  const [selectedPrayer, setSelectedPrayer] = useState('Fajr');
  const [isMinimized, setIsMinimized] = useState(false);

  // MATCH SELECTED PRAYER CARD
  const targetPrayer = prayers.find((p) => p.key === selectedPrayer);

  const setTimeOffset = (phase: 'azan' | 'countdown' | 'standing' | 'silence' | 'reset') => {
    if (phase === 'reset') {
      setMockClockOffsetMs(0);
      return;
    }

    if (!targetPrayer || targetPrayer.iqamaTime === '\u2014') return;

    // PARSE TIME TO TODAY DATE OBJECT
    const parseTimeToDate = (timeStr: string): Date => {
      const d = new Date();
      const parts = timeStr.split(':').map(Number);
      d.setHours(parts[0] ?? 0, parts[1] ?? 0, 0, 0);
      return d;
    };

    const adhanDate = parseTimeToDate(targetPrayer.time);
    const iqamaDate = parseTimeToDate(targetPrayer.iqamaTime);
    const gapMs = iqamaDate.getTime() - adhanDate.getTime();

    let targetDate = new Date();

    switch (phase) {
      case 'azan':
        // 10 SECONDS AFTER ADHAN
        targetDate = new Date(adhanDate.getTime() + 10 * 1000);
        break;
      case 'countdown':
        {
          // MIDPOINT OF COUNTDOWN WINDOW
          const adhanDurationMs = Math.min(3 * 60 * 1000, gapMs);
          const countdownStart = adhanDate.getTime() + adhanDurationMs;
          const countdownEnd = iqamaDate.getTime();
          targetDate = new Date((countdownStart + countdownEnd) / 2);
        }
        break;
      case 'standing':
        // 10 SECONDS AFTER IQAMA
        targetDate = new Date(iqamaDate.getTime() + 10 * 1000);
        break;
      case 'silence':
        // 60 SECONDS AFTER IQAMA
        targetDate = new Date(iqamaDate.getTime() + 60 * 1000);
        break;
    }

    // CALCULATE OFFSET TO SYSTEM TIME
    const realNow = Date.now();
    const offset = targetDate.getTime() - realNow;
    setMockClockOffsetMs(offset);
  };

  const t = devTranslations[language] || devTranslations.en;
  const labels = prayerLabels[language] || prayerLabels.en;

  const containerStyle = {
    position: 'absolute' as const,
    bottom: 70,
    right: language === 'ar' ? 'auto' : 16,
    left: language === 'ar' ? 16 : 'auto',
    zIndex: 99999,
  };

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        // MINIMIZED VIEW - FLOATING ACTION BUTTON
        <motion.div
          key="minimized"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={containerStyle}
        >
          <Box
            role="button"
            aria-label="Open Dev Time Controller"
            onClick={() => setIsMinimized(false)}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#122612' : '#ffffff'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'border.medium' : 'divider'),
              boxShadow: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: (theme) => theme.palette.gold.onLight,
              transition: 'all 200ms ease',
              '&:hover': {
                transform: 'scale(1.08)',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1a381a' : '#f5f5f5'),
              },
            }}
          >
            <Wrench size={20} />
          </Box>
        </motion.div>
      ) : (
        // MAXIMIZED VIEW - SETTINGS CARD PANEL
        <motion.div
          key="maximized"
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          style={containerStyle}
        >
          <Box
            dir={getDirection(language)}
            sx={{
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#122612' : '#ffffff'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? 'border.medium' : 'divider'),
              borderRadius: 2,
              p: 2,
              boxShadow: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              minWidth: 280,
            }}
          >
            {/* HEADER WITH COLLAPSE TRIGGER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {t.title}
              </Typography>
              <Box
                role="button"
                aria-label="Minimize Dev Controller"
                onClick={() => setIsMinimized(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'text.secondary',
                  p: 0.5,
                  borderRadius: '50%',
                  transition: 'all 200ms ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: 'text.primary',
                  },
                }}
              >
                <Minus size={16} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((pKey) => (
                <Button
                  key={pKey}
                  size="small"
                  variant={selectedPrayer === pKey ? 'contained' : 'outlined'}
                  onClick={() => setSelectedPrayer(pKey)}
                  sx={{ px: 1, minWidth: 0, flex: 1 }}
                >
                  {labels[pKey] || pKey[0]}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => setTimeOffset('azan')}
              >
                {t.phases.azan}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => setTimeOffset('countdown')}
              >
                {t.phases.countdown}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => setTimeOffset('standing')}
              >
                {t.phases.standing}
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => setTimeOffset('silence')}
              >
                {t.phases.silence}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => setTimeOffset('reset')}
                sx={{ flex: 1 }}
              >
                {t.reset}
              </Button>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t.offset} {Math.round(mockClockOffsetMs / 1000)}s
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

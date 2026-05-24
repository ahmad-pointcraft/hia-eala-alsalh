import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { Header } from './components/header';
import { PrayerCard } from './components/prayer';
import { CountdownBar } from './components/prayer';
import { HadithPanel } from './components/widgets';
import { SunTimesWidget } from './components/widgets';
import { AnnouncementsTicker } from './components/widgets';
import { FundraisingOverlay } from './components/overlays';
import { IslamicGeometricOverlay } from './components/overlays';
import { EventSlideshow } from './components/events';
import type { EventSlide } from './components/events';
import { useLanguage } from '@/app/store';
import { useClock, usePrayerState, useFundraisingScheduler } from '@/app/hooks';
import { floatingCardSx } from '@/app/theme/sharedStyles';
import mosque1 from '../assets/mosque-1.jpg';
import mosque2 from '../assets/mosque-2.jpg';
import mosque3 from '../assets/mosque-3.jpg';

const carouselImages = [mosque1, mosque2, mosque3];

export default function App() {
  const { language, toggleLanguage, t, dir } = useLanguage();
  const { currentTime } = useClock();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const defaultTransition = useMemo(
    () => (prefersReducedMotion ? { duration: 0 } : undefined),
    [prefersReducedMotion],
  );

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const { prayers, activePrayer, nextPrayer, isPraying, prayerPrayers, sunrisePrayer, sunsetTime } =
    usePrayerState(currentTime, t.prayers);
  const { showFundraising, onShowFundraising, onCloseFundraising } = useFundraisingScheduler(
    prayers,
    currentTime,
  );

  const eventSlides: EventSlide[] = t.events.map((e) => ({
    title: e.title,
    speakerName: e.speakerName,
    dateValue: e.dateValue,
    timeValue: e.timeValue,
    locationValue: e.locationValue,
    badge: e.badge,
    cta: e.cta,
  }));

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        '@media (prefers-reduced-motion: no-preference)': {
          animation: 'pixelShift 60s ease-in-out infinite',
        },
        '@keyframes pixelShift': {
          '0%, 95%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(1px, 1px)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'background.default',
        }}
      />

      <Stack
        sx={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          maxWidth: '2560px',
          mx: 'auto',
          width: '100%',
        }}
      >
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
          onShowFundraising={onShowFundraising}
          translations={t}
          currentTime={currentTime}
        />

        {isPraying && (
          <Box
            role="alert"
            aria-label={language === 'en' ? 'Prayer in progress' : 'الصلاة جارية'}
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${theme.palette.background.default}D9`,
            })}
          >
            <Box sx={{ opacity: 0.3, position: 'absolute', inset: 0 }}>
              <IslamicGeometricOverlay />
            </Box>
          </Box>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key="normal-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={defaultTransition ?? { duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                px: { xs: 2, sm: 3, md: 4, lg: 6 },
                py: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <Box
                  sx={{
                    flex: { xs: 'none', sm: 3.15, md: 2 },
                    minWidth: 0,
                    minHeight: { xs: 220, sm: 0 },
                  }}
                >
                  <EventSlideshow
                    events={eventSlides}
                    images={carouselImages}
                    interval={5000}
                    language={language}
                  />
                </Box>
                <Box
                  sx={(theme) => ({
                    flex: { xs: 'none', sm: 3, md: 1 },
                    ...floatingCardSx(theme),
                    minWidth: 0,
                  })}
                >
                  <CountdownBar
                    nextPrayer={nextPrayer.name}
                    nextPrayerTime={nextPrayer.time}
                    nextPrayerIqamaTime={nextPrayer.iqamaTime}
                    language={language}
                    currentTime={currentTime}
                    translations={t}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={(theme) => ({
                    flex: { xs: 'none', sm: 3.15 },
                    ...floatingCardSx(theme),
                    minWidth: 0,
                    minHeight: { xs: 220, sm: 0 },
                  })}
                >
                  <HadithPanel language={language} translations={t} />
                </Box>
                <Box
                  sx={{
                    flex: { xs: 'none', sm: 2 },
                    display: 'flex',
                    minWidth: 0,
                  }}
                >
                  <SunTimesWidget
                    language={language}
                    translations={t}
                    sunriseTime={sunrisePrayer?.time ?? '--:--'}
                    sunsetTime={sunsetTime}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ flexShrink: 0, px: { xs: 2, sm: 3, md: 4, lg: 6 }, pb: 1 }}>
              <Box
                dir={dir}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(5, 1fr)',
                    lg: 'repeat(5, 1fr)',
                  },
                  gap: { xs: 1, sm: 1.5, md: 2, lg: 2 },
                }}
              >
                {prayerPrayers.map((prayer, index) => (
                  <motion.div
                    key={prayer.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      defaultTransition ?? {
                        delay: index * 0.05,
                        duration: 0.3,
                      }
                    }
                  >
                    <PrayerCard
                      name={prayer.name}
                      time={prayer.time}
                      iqamaTime={prayer.iqamaTime}
                      isActive={prayer.key === activePrayer?.key}
                      language={language}
                      iqamaLabel={t.iqama}
                      prayerKey={prayer.key}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        <AnnouncementsTicker language={language} announcements={t.announcementsList} />
      </Stack>

      {showFundraising && (
        <FundraisingOverlay
          onClose={onCloseFundraising}
          language={language}
          translations={t}
          currentTime={currentTime}
        />
      )}
    </Box>
  );
}

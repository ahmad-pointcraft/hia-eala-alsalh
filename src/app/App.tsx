import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { Header } from './components/header';
import { PrayerCard } from './components/prayer';
import { CountdownBar } from './components/prayer';
import { WisdomPanel } from './components/widgets';
import { SunTimesWidget } from './components/widgets';
import { AnnouncementsTicker } from './components/widgets';
import { FundraisingOverlay, SilenceOverlay } from './components/overlays';
import { EventSlideshow } from './components/events';
import type { EventSlide } from './components/events';
import type { WisdomContent } from '@/app/types/wisdom';
import { useLanguage, useMosqueConfigStore } from '@/app/store';
import { translations as allTranslations } from '@/app/data/translations';
import {
  useClock,
  usePrayerState,
  useFundraisingScheduler,
  useHijriDate,
  useDailyHadith,
  useDailyQuranVerse,
  useAnnouncements,
  useEvents,
  useFundraising,
} from '@/app/hooks';
import { floatingCardSx } from '@/app/theme/sharedStyles';
import mosque1 from '../assets/mosque-1.jpg';
import mosque2 from '../assets/mosque-2.jpg';
import mosque3 from '../assets/mosque-3.jpg';

const carouselImages = [mosque1, mosque2, mosque3];

export default function App() {
  const { language, toggleLanguage, t, dir } = useLanguage();
  const { config, setConfig } = useMosqueConfigStore();

  useEffect(() => {
    // Only auto-detect on startup if coordinates or timezone are at defaults
    const isDefaultLocation =
      Math.abs(config.latitude - 24.7136) < 0.0001 &&
      Math.abs(config.longitude - 46.6753) < 0.0001;
    const isDefaultTimeZone = config.timeZone === 'Asia/Riyadh';

    if (isDefaultTimeZone) {
      const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (systemTimeZone) {
        setConfig({ timeZone: systemTimeZone });
      }
    }

    if (isDefaultLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setConfig({
            latitude: parseFloat(latitude.toFixed(6)),
            longitude: parseFloat(longitude.toFixed(6)),
          });
        },
        (error) => {
          console.warn('[Location] Auto-detect failed:', error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const { prayers, activePrayer, nextPrayer, isPraying, prayingPrayer, prayerPrayers, sunrisePrayer, sunsetTime } =
    usePrayerState(currentTime, t.prayers);
  const { showFundraising, onShowFundraising, onCloseFundraising } = useFundraisingScheduler(
    prayers,
    currentTime,
  );

  const { hijriDate, holidays } = useHijriDate(currentTime);
  const { hadith } = useDailyHadith(hijriDate, currentTime);
  const { verse } = useDailyQuranVerse(hijriDate, currentTime);
  const { announcements: dynamicAnnouncements } = useAnnouncements(currentTime);
  const { events: dynamicEvents } = useEvents(currentTime);
  const { fundraising: fundraisingData } = useFundraising(currentTime);

  const fallbackHadith = useMemo(() => ({
    kind: 'hadith' as const,
    data: {
      text_ar: allTranslations.ar.hadithText,
      text_en: allTranslations.en.hadithText,
      source: language === 'ar' ? allTranslations.ar.hadithSource : allTranslations.en.hadithSource,
      narrator: '',
      book: '',
      hadithNumber: 0,
    },
  }), [language]);

  const wisdom: WisdomContent | undefined = useMemo(() => {
    if (hijriDate.day % 2 === 1) {
      if (hadith) return { kind: 'hadith', data: hadith };
      if (verse) return { kind: 'quran', data: verse };
      return undefined;
    }
    if (verse) return { kind: 'quran', data: verse };
    if (hadith) return { kind: 'hadith', data: hadith };
    return undefined;
  }, [hijriDate.day, hadith, verse]);

  const eventSlides: EventSlide[] = dynamicEvents.map((e) => ({
    title: e.title,
    speakerName: e.speakerName,
    dateValue: e.dateValue,
    timeValue: e.timeValue,
    locationValue: e.locationValue,
    badge: e.badge,
    cta: e.cta,
    imageUrl: e.imageUrl,
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
          hijriDate={hijriDate}
          holidays={holidays}
        />

        <AnimatePresence>
          {isPraying && (
            <motion.div
              key="silence-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={defaultTransition ?? { duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
              style={{ position: 'absolute', inset: 0, zIndex: 20 }}
            >
              <SilenceOverlay
                language={language}
                prayingPrayer={prayingPrayer}
                currentTime={currentTime}
                translations={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
                  <WisdomPanel language={language} wisdom={wisdom ?? fallbackHadith} fallbackTitle={t.hadithOfTheDay} />
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

        <AnnouncementsTicker language={language} announcements={dynamicAnnouncements} />
      </Stack>

      {showFundraising && (
        <FundraisingOverlay
          onClose={onCloseFundraising}
          language={language}
          translations={t}
          currentTime={currentTime}
          fundraising={fundraisingData}
        />
      )}
    </Box>
  );
}

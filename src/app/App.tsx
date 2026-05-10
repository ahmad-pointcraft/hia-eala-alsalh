import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { Header } from "./components/Header";
import { MasjidInfo } from "./components/MasjidInfo";
import { PrayerCard } from "./components/PrayerCard";
import { CountdownBar } from "./components/CountdownBar";
import { HadithPanel } from "./components/HadithPanel";
import { WeatherWidget } from "./components/WeatherWidget";
import { AnnouncementsTicker } from "./components/AnnouncementsTicker";
import { FundraisingOverlay } from "./components/FundraisingOverlay";
import { IslamicGeometricOverlay } from "./components/IslamicGeometricOverlay";
import { EventModeDisplay } from "./components/EventModeDisplay";
import { ImageCarousel } from "./components/ImageCarousel";
import { translations, Language } from "./utils/translations";
import { getCurrentPrayer, getNextPrayer, getTimeToNextPrayer } from "./utils/prayerTimes";
import type { PrayerTime } from "./utils/prayerTimes";

export default function App() {
  const [showFundraising, setShowFundraising] = useState(false);
  const [eventMode, setEventMode] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [currentTime, setCurrentTime] = useState(new Date());
  const fundraisingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const carouselImages = [
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
  ];

  const t = translations[language];

  const prayers: PrayerTime[] = [
    { name: t.prayers.fajr, key: "Fajr", time: "05:30", iqamaTime: "05:45" },
    { name: t.prayers.sunrise, key: "Sunrise", time: "06:52", iqamaTime: "\u2014" },
    { name: t.prayers.dhuhr, key: "Dhuhr", time: "12:45", iqamaTime: "13:00" },
    { name: t.prayers.asr, key: "Asr", time: "16:15", iqamaTime: "16:30" },
    { name: t.prayers.maghrib, key: "Maghrib", time: "19:28", iqamaTime: "19:30" },
    { name: t.prayers.isha, key: "Isha", time: "20:45", iqamaTime: "21:00" },
  ];

  const activePrayer = getCurrentPrayer(prayers, currentTime);
  const nextPrayer = getNextPrayer(prayers, currentTime);

  useEffect(() => {
    const scheduleFundraising = () => {
      if (fundraisingTimerRef.current) {
        clearTimeout(fundraisingTimerRef.current);
      }
      fundraisingTimerRef.current = setTimeout(
        () => {
          if (getTimeToNextPrayer(prayers, new Date()) > 10 * 60) {
            setShowFundraising(true);
          }
          scheduleFundraising();
        },
        10 * 60 * 1000,
      );
    };

    if (fundraisingTimerRef.current) {
      clearTimeout(fundraisingTimerRef.current);
    }
    fundraisingTimerRef.current = setTimeout(
      () => {
        if (getTimeToNextPrayer(prayers, new Date()) > 10 * 60) {
          setShowFundraising(true);
        }
        scheduleFundraising();
      },
      1 * 60 * 1000,
    );

    return () => {
      if (fundraisingTimerRef.current) {
        clearTimeout(fundraisingTimerRef.current);
      }
    };
  }, [prayers]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "background.default",
          transition: "all 1000ms",
          backgroundImage:
            "linear-gradient(45deg, rgba(212, 175, 55, 0.02) 25%, transparent 25%, transparent 75%, rgba(212, 175, 55, 0.02) 75%, rgba(212, 175, 55, 0.02)), linear-gradient(45deg, rgba(212, 175, 55, 0.02) 25%, transparent 25%, transparent 75%, rgba(212, 175, 55, 0.02) 75%, rgba(212, 175, 55, 0.02))",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
        }}
      />

      <AnimatePresence>
        {eventMode && <IslamicGeometricOverlay />}
      </AnimatePresence>

      <Stack sx={{ position: "relative", zIndex: 10, height: "100%" }}>
        <Header
          eventMode={eventMode}
          onToggleEventMode={() => setEventMode(!eventMode)}
          language={language}
          onToggleLanguage={toggleLanguage}
          onShowFundraising={() => setShowFundraising(true)}
          translations={t}
        />

        <AnimatePresence mode="wait">
          {eventMode ? (
            <motion.div
              key="event-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, position: "relative", overflow: "hidden" }}
            >
              <EventModeDisplay
                language={language}
                translations={t}
              />
            </motion.div>
          ) : (
            <motion.div
              key="normal-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
            >
              <Box sx={{ flexShrink: 0 }}>
                <MasjidInfo
                  language={language}
                  translations={t}
                />
              </Box>

              <Box sx={{ flex: 1, overflow: "auto", px: "16px", py: "10px" }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Grid container spacing={{ xs: 1, sm: 1.5 }} sx={{ mb: { xs: 1, sm: 1.5 } }}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <CountdownBar
                          nextPrayer={nextPrayer.name}
                          nextPrayerTime={nextPrayer.time}
                          language={language}
                          nextPrayerLabel={t.nextPrayer}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <WeatherWidget
                        language={language}
                        translations={t}
                      />
                    </Grid>
                  </Grid>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Box sx={{ height: { xs: 256, sm: 320, lg: 360 } }}>
                    <ImageCarousel
                      images={carouselImages}
                      interval={5000}
                    />
                  </Box>
                </motion.div>
              </Box>

              <Box sx={{ flexShrink: 0, mx: 0, my: "5px", px: "20px", pt: 0, pb: "10px" }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Box sx={{ mb: 1 }}>
                    <HadithPanel
                      language={language}
                      translations={t}
                    />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <Grid
                    container
                    spacing={{ xs: 1, sm: 1.5 }}
                    dir={language === "ar" ? "rtl" : "ltr"}
                    sx={{ mt: 1.5 }}
                  >
                    {prayers.map((prayer, index) => (
                      <Grid key={prayer.key} size={{ xs: 6, sm: 4, lg: 2 }}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
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
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <AnnouncementsTicker
          language={language}
          announcementsLabel={t.announcements}
          announcements={t.announcementsList}
        />
      </Stack>

      {showFundraising && (
        <FundraisingOverlay
          onClose={() => setShowFundraising(false)}
          language={language}
          translations={t}
        />
      )}
    </Box>
  );
}

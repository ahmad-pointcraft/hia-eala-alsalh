import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Languages } from "lucide-react";
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

export default function App() {
  const [showFundraising, setShowFundraising] = useState(false);
  const [eventMode, setEventMode] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  // Placeholder images for carousel - replace with actual image URLs
  const carouselImages = [
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
  ];

  // Prayer times in minutes from midnight for easy comparison
  const prayerTimesInMinutes = [
    { name: "Fajr", time: 5 * 60 + 30 }, // 05:30
    { name: "Dhuhr", time: 12 * 60 + 45 }, // 12:45
    { name: "Asr", time: 16 * 60 + 15 }, // 16:15
    { name: "Maghrib", time: 19 * 60 + 28 }, // 19:28
    { name: "Isha", time: 20 * 60 + 45 }, // 20:45
  ];

  const isNearPrayerTime = () => {
    const now = new Date();
    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerTimesInMinutes) {
      const timeDiff = Math.abs(currentMinutes - prayer.time);
      // Check if within 10 minutes before or after prayer time
      if (timeDiff <= 10) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    let fundraisingTimer: NodeJS.Timeout;

    const scheduleFundraising = () => {
      fundraisingTimer = setTimeout(
        () => {
          // Only show if not near prayer time
          if (!isNearPrayerTime()) {
            setShowFundraising(true);
          }
          // Schedule next fundraising in 10 minutes
          scheduleFundraising();
        },
        10 * 60 * 1000,
      ); // 10 minutes in milliseconds
    };

    // Initial delay of 1 minute, then every 10 minutes
    fundraisingTimer = setTimeout(
      () => {
        if (!isNearPrayerTime()) {
          setShowFundraising(true);
        }
        scheduleFundraising();
      },
      1 * 60 * 1000,
    ); // 1 minute initial delay

    return () => clearTimeout(fundraisingTimer);
  }, []);

  const t = translations[language];

  const prayers = [
    {
      name: t.prayers.fajr,
      key: "Fajr",
      time: "05:30",
      iqamaTime: "05:45",
    },
    {
      name: t.prayers.sunrise,
      key: "Sunrise",
      time: "06:52",
      iqamaTime: "—",
    },
    {
      name: t.prayers.dhuhr,
      key: "Dhuhr",
      time: "12:45",
      iqamaTime: "13:00",
    },
    {
      name: t.prayers.asr,
      key: "Asr",
      time: "16:15",
      iqamaTime: "16:30",
    },
    {
      name: t.prayers.maghrib,
      key: "Maghrib",
      time: "19:28",
      iqamaTime: "19:30",
    },
    {
      name: t.prayers.isha,
      key: "Isha",
      time: "20:45",
      iqamaTime: "21:00",
    },
  ];

  const currentPrayer = "Dhuhr";

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background with diagonal grid pattern */}
      <div
        className="absolute inset-0 transition-all duration-1000 bg-[#0a1f0a]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(212, 175, 55, 0.02) 25%, transparent 25%, transparent 75%, rgba(212, 175, 55, 0.02) 75%, rgba(212, 175, 55, 0.02)), linear-gradient(45deg, rgba(212, 175, 55, 0.02) 25%, transparent 25%, transparent 75%, rgba(212, 175, 55, 0.02) 75%, rgba(212, 175, 55, 0.02))",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px",
        }}
      />

      {/* Islamic Geometric Overlay - only visible in event mode */}
      <AnimatePresence>
        {eventMode && <IslamicGeometricOverlay />}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
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
            // Event Mode - Full screen display
            <motion.div
              key="event-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 relative overflow-hidden"
            >
              <EventModeDisplay
                language={language}
                translations={t}
              />
            </motion.div>
          ) : (
            // Normal Mode - Prayer times display
            <motion.div
              key="normal-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Fixed top section - Masjid Info only */}
              <div className="shrink-0">
                <MasjidInfo
                  language={language}
                  translations={t}
                />
              </div>

              {/* Scrollable middle section - Countdown & Weather, Image Carousel */}
              <div className="flex-1 overflow-auto px-[16px] py-[10px]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3"
                >
                  <CountdownBar
                    nextPrayer={t.prayers.asr}
                    nextPrayerTime="16:15"
                    language={language}
                    nextPrayerLabel={t.nextPrayer}
                  />
                  <WeatherWidget
                    language={language}
                    translations={t}
                  />
                </motion.div>

                {/* Image Carousel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="h-64 sm:h-80 lg:h-90"
                >
                  <ImageCarousel
                    images={carouselImages}
                    interval={5000}
                  />
                </motion.div>
              </div>

              {/* Fixed bottom section - Hadith Panel & Prayer Cards */}
              <div className="shrink-0 mx-[0px] my-[5px] px-[20px] pt-[0px] pb-[10px]">
                {/* Hadith Panel - Above Prayer Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="mb-2"
                >
                  <HadithPanel
                    language={language}
                    translations={t}
                  />
                </motion.div>

                {/* Prayer Cards Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-3 justify-content-center"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {prayers.map((prayer, index) => (
                    <motion.div
                      key={prayer.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                      }}
                    >
                      <PrayerCard
                        name={prayer.name}
                        time={prayer.time}
                        iqamaTime={prayer.iqamaTime}
                        isActive={prayer.key === currentPrayer}
                        language={language}
                        iqamaLabel={t.iqama}
                        prayerKey={prayer.key}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Announcements Ticker - always visible */}
        <AnnouncementsTicker
          language={language}
          announcementsLabel={t.announcements}
          announcements={t.announcementsList}
        />
      </div>

      {/* Fundraising Overlay */}
      {showFundraising && (
        <FundraisingOverlay
          onClose={() => setShowFundraising(false)}
          language={language}
          translations={t}
        />
      )}
    </div>
  );
}
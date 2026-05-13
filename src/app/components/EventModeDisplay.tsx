import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AccessTime from "@mui/icons-material/AccessTime";
import LocationOn from "@mui/icons-material/LocationOn";
import { Language } from "../utils/translations";
import type { Translations } from "../utils/translations";
import { getFontFamily, getDirection } from "../utils/helpers";

interface EventModeDisplayProps {
  language: Language;
  translations: Translations;
  onClose?: () => void;
}

interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
}

const eventsEn: EventItem[] = [
  {
    title: "The Science of the Quran",
    date: "Wednesday, May 13",
    time: "7:30 PM - 9:00 PM",
    location: "Main Prayer Hall, Second Floor",
  },
  {
    title: "Youth Islamic Education Program",
    date: "Saturday, May 16",
    time: "10:00 AM - 12:00 PM",
    location: "Community Center",
  },
  {
    title: "Community Food Bank Drive",
    date: "Sunday, May 17",
    time: "After Dhuhr Prayer",
    location: "Masjid Parking Lot",
  },
];

const eventsAr: EventItem[] = [
  {
    title: "العلم في القرآن",
    date: "الأربعاء، ١٣ مايو",
    time: "٧:٣٠ - ٩:٠٠ مساءً",
    location: "قاعة الصلاة الرئيسية، الطابق الثاني",
  },
  {
    title: "برنامج التعليم الإسلامي للشباب",
    date: "السبت، ١٦ مايو",
    time: "١٠:٠٠ صباحاً - ١٢:٠٠ ظهراً",
    location: "المركز المجتمعي",
  },
  {
    title: "حملة بنك الطعام المجتمعي",
    date: "الأحد، ١٧ مايو",
    time: "بعد صلاة الظهر",
    location: "موقف السيارات",
  },
];

export function EventModeDisplay({ language, onClose }: EventModeDisplayProps) {
  const dir = getDirection(language);
  const fontFamily = getFontFamily(language);
  const events = language === "ar" ? eventsAr : eventsEn;
  const heading = language === "en" ? "Upcoming Events" : "الأحداث القادمة";

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 30000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <AnimatePresence>
      <Box
        onClick={handleClose}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
        dir={dir}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 520 }}
        >
          <Box
            sx={{
              bgcolor: "surface.heavy",
              backdropFilter: "blur(16px)",
              border: "1px solid",
              borderColor: "border.thin",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 16px 64px rgba(0,0,0,0.5)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderBottomColor: "border.thin",
              }}
            >
              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {heading}
              </Typography>
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{ color: "text.whiteMuted" }}
                aria-label={language === "en" ? "Close" : "إغلاق"}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 1 }}>
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Box
                    sx={{
                      py: 2,
                      borderBottom: index < events.length - 1 ? "1px solid" : "none",
                      borderBottomColor: "border.thin",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "text.primary",
                        fontWeight: 600,
                        fontSize: "0.9375rem",
                        fontFamily,
                        mb: 1,
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarMonth sx={{ fontSize: 14, color: "text.whiteMuted" }} />
                        <Typography sx={{ color: "text.whiteSoft", fontSize: "0.8125rem", fontFamily }}>
                          {event.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTime sx={{ fontSize: 14, color: "text.whiteMuted" }} />
                        <Typography sx={{ color: "text.whiteSoft", fontSize: "0.8125rem", fontFamily }}>
                          {event.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn sx={{ fontSize: 14, color: "text.whiteMuted" }} />
                        <Typography sx={{ color: "text.whiteSoft", fontSize: "0.8125rem", fontFamily }}>
                          {event.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>

            <Box
              sx={{
                px: 3,
                py: 1.5,
                borderTop: "1px solid",
                borderTopColor: "border.thin",
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "text.whiteMuted", fontSize: "0.75rem", fontFamily }}>
                {language === "en" ? "Auto-closes in 30 seconds" : "يُغلق تلقائياً بعد ٣٠ ثانية"}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
}

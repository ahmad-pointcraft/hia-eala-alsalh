import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Language } from '../utils/translations';

interface EventModeDisplayProps {
  language: Language;
  translations: any;
}

export function EventModeDisplay({ language, translations }: EventModeDisplayProps) {
  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center px-3 sm:px-6 lg:px-8 py-3 sm:py-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Main Event Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative max-w-6xl w-full"
      >
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] rounded-xl opacity-30 blur-xl"></div>

        <div className="relative bg-black/60 backdrop-blur-xl border-t-2 border-b-2 border-[#D4AF37]/50 rounded-xl p-4 sm:p-6 lg:p-8">
          {/* Decorative corner ornaments - hidden on mobile */}
          <div className="hidden sm:block absolute top-4 left-4 w-12 h-12 border-t-2 border-[#D4AF37]/40"></div>
          <div className="hidden sm:block absolute top-4 right-4 w-12 h-12 border-t-2 border-[#D4AF37]/40"></div>
          <div className="hidden sm:block absolute bottom-4 left-4 w-12 h-12 border-b-2 border-[#D4AF37]/40"></div>
          <div className="hidden sm:block absolute bottom-4 right-4 w-12 h-12 border-b-2 border-[#D4AF37]/40"></div>

          {/* Event Type Badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-3 sm:mb-4"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full text-[#D4AF37] text-xs sm:text-sm uppercase tracking-wider font-bold" style={{ fontFamily }}>
              {translations.event.badge}
            </span>
          </motion.div>

          {/* Event Title and Speaker - Combined */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-3xl lg:text-5xl text-[#D4AF37] mb-2 sm:mb-3 leading-tight" style={{ fontFamily }}>
              {translations.event.title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mb-1" style={{ fontFamily }}>{translations.event.guestSpeaker}</p>
            <p className="text-white text-lg sm:text-2xl lg:text-3xl font-bold" style={{ fontFamily }}>
              {translations.event.speakerName}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1" style={{ fontFamily }}>
              {translations.event.speakerTitle}
            </p>
          </motion.div>

          {/* Event Details Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6"
          >
            <div className="flex flex-col items-center p-3 sm:p-4 bg-black/40 rounded-lg border border-[#D4AF37]/20">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] mb-1 sm:mb-2" />
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ fontFamily }}>{translations.event.date}</p>
              <p className="text-white text-sm sm:text-lg lg:text-xl font-bold" style={{ fontFamily }}>{translations.event.tonight}</p>
              <p className="text-gray-300 text-[10px] sm:text-xs" style={{ fontFamily }}>{translations.event.dateValue}</p>
            </div>

            <div className="flex flex-col items-center p-3 sm:p-4 bg-black/40 rounded-lg border border-[#D4AF37]/20">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] mb-1 sm:mb-2" />
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ fontFamily }}>{translations.event.time}</p>
              <p className="text-white text-sm sm:text-lg lg:text-xl font-bold" style={{ fontFamily }}>{translations.event.timeValue}</p>
              <p className="text-gray-300 text-[10px] sm:text-xs" style={{ fontFamily }}>{translations.event.afterPrayer}</p>
            </div>

            <div className="flex flex-col items-center p-3 sm:p-4 bg-black/40 rounded-lg border border-[#D4AF37]/20">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] mb-1 sm:mb-2" />
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1" style={{ fontFamily }}>{translations.event.location}</p>
              <p className="text-white text-sm sm:text-lg lg:text-xl font-bold" style={{ fontFamily }}>{translations.event.locationValue}</p>
              <p className="text-gray-300 text-[10px] sm:text-xs" style={{ fontFamily }}>{translations.event.floor}</p>
            </div>
          </motion.div>

          {/* Event Description */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-black/30 rounded-lg p-3 sm:p-5 lg:p-6 border border-[#D4AF37]/20 mb-3 sm:mb-5"
          >
            <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed text-center" style={{ fontFamily }}>
              {translations.event.description}
            </p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full text-black font-bold text-sm sm:text-base lg:text-lg shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              style={{ fontFamily }}
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{translations.event.cta}</span>
            </motion.div>
          </motion.div>

          {/* Light rays effect */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full"
              style={{
                background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

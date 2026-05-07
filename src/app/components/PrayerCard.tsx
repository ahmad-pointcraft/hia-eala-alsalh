import {
  Moon,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Star,
} from "lucide-react";
import { Language } from "../utils/translations";

interface PrayerCardProps {
  name: string;
  time: string;
  iqamaTime: string;
  isActive?: boolean;
  language: Language;
  iqamaLabel: string;
  prayerKey: string;
}

const prayerIcons: Record<string, any> = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: CloudSun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = [
    "٠",
    "١",
    "٢",
    "٣",
    "٤",
    "٥",
    "٦",
    "٧",
    "٨",
    "٩",
  ];
  return text.replace(
    /[0-9]/g,
    (digit) => arabicNumerals[parseInt(digit)],
  );
};

export function PrayerCard({
  name,
  time,
  iqamaTime,
  isActive = false,
  language,
  iqamaLabel,
  prayerKey,
}: PrayerCardProps) {
  const Icon = prayerIcons[prayerKey] || Star;
  const fontFamily =
    language === "ar"
      ? "Noto Naskh Arabic, serif"
      : "Open Sans, sans-serif";

  const displayTime =
    language === "ar" ? toArabicNumerals(time) : time;
  const displayIqamaTime =
    language === "ar" ? toArabicNumerals(iqamaTime) : iqamaTime;

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center p-1.5 sm:p-2 lg:p-3 rounded-lg border
        transition-all duration-300
        ${
          isActive
            ? "bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.5)] scale-105 lg:scale-110"
            : "bg-black/30 border-[#D4AF37]/30"
        }
      `}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Icon
        className={`w-5 h-5 sm:w-6 lg:w-8 mb-0.5 sm:mb-1 lg:mb-2 ${isActive ? "text-[#D4AF37]" : "text-gray-500"}`}
      />

      <div
        className={`text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1 ${isActive ? "font-bold" : ""} text-[10px] sm:text-[16px]`}
        style={{ fontFamily }}
      >
        {name}
      </div>

      <div
        className={`text-white font-bold mb-0.5 sm:mb-1 ${isActive ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl lg:text-2xl"} text-[24px] sm:text-[48px]`}
        style={{ fontFamily }}
      >
        {displayTime}
      </div>

      <div
        className={`text-[#D4AF37] text-[8px] sm:text-[10px] lg:text-sm ${isActive ? "font-bold" : ""}`}
        style={{ fontFamily }}
      >
        {iqamaLabel}: {displayIqamaTime}
      </div>
    </div>
  );
}
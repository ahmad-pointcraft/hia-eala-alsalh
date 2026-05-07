import { useEffect, useState } from 'react';
import { Language } from '../utils/translations';

interface CountdownBarProps {
  nextPrayer: string;
  nextPrayerTime: string;
  language: Language;
  nextPrayerLabel: string;
}

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export function CountdownBar({ nextPrayer, nextPrayerTime, language, nextPrayerLabel }: CountdownBarProps) {
  const [countdown, setCountdown] = useState('03:45:23');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = nextPrayerTime.split(':').map(Number);
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayerTime]);

  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  const displayCountdown = language === 'ar' ? toArabicNumerals(countdown) : countdown;
  const prayerText = language === 'ar' ? `${nextPrayer} بعد` : `${nextPrayer} in`;

  return (
    <div className="w-full bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-2 sm:p-3 lg:p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Prayer Info */}
        <div className="text-white font-bold text-[14px]" style={{ fontFamily }}>
          {prayerText}
        </div>

        {/* Countdown */}
        <div className="text-[#D4AF37] font-mono font-bold tracking-wider text-[16px]">
          {displayCountdown}
        </div>
      </div>
    </div>
  );
}

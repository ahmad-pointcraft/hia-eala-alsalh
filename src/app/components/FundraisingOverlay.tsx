import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Language } from '../utils/translations';

interface FundraisingOverlayProps {
  onClose: () => void;
  language: Language;
  translations: any;
}

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export function FundraisingOverlay({ onClose, language, translations }: FundraisingOverlayProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onClose();
    }
  }, [countdown, onClose]);

  const collected = 87500;
  const goal = 120000;
  const donors = 243;
  const progress = (collected / goal) * 100;

  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  const displayCollected = language === 'ar' ? toArabicNumerals(collected.toLocaleString()) : collected.toLocaleString();
  const displayGoal = language === 'ar' ? toArabicNumerals(goal.toLocaleString()) : goal.toLocaleString();
  const displayDonors = language === 'ar' ? toArabicNumerals(donors.toString()) : donors.toString();
  const displayProgress = language === 'ar' ? toArabicNumerals(progress.toFixed(0)) : progress.toFixed(0);
  const displayCountdown = language === 'ar' ? toArabicNumerals(countdown.toString()) : countdown.toString();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-black/60 backdrop-blur-xl border border-[#D4AF37] rounded-lg p-8 sm:p-12 max-w-3xl w-full relative mx-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h2
            className="text-[#D4AF37] text-3xl sm:text-5xl mb-3 sm:mb-4"
            style={{ fontFamily }}
          >
            {translations.fundraising.title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg" style={{ fontFamily }}>
            {translations.fundraising.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-6 sm:mb-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-wider mb-2" style={{ fontFamily }}>{translations.fundraising.collected}</div>
            <div className="text-[#D4AF37] text-3xl sm:text-4xl font-bold" style={{ fontFamily }}>
              ${displayCollected}
            </div>
          </div>

          <div className="hidden sm:block w-px h-16 bg-[#D4AF37]/30"></div>

          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-wider mb-2" style={{ fontFamily }}>{translations.fundraising.goal}</div>
            <div className="text-white text-3xl sm:text-4xl font-bold" style={{ fontFamily }}>
              ${displayGoal}
            </div>
          </div>

          <div className="hidden sm:block w-px h-16 bg-[#D4AF37]/30"></div>

          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-wider mb-2" style={{ fontFamily }}>{translations.fundraising.donors}</div>
            <div className="text-white text-3xl sm:text-4xl font-bold" style={{ fontFamily }}>
              {displayDonors}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm" style={{ fontFamily }}>{translations.fundraising.progress}</span>
            <span className="text-[#D4AF37] text-sm font-bold" style={{ fontFamily }}>{displayProgress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#D4AF37]/30 gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg flex items-center justify-center shrink-0">
              <div className="text-center text-xs text-black p-2">
                <div className="font-bold mb-1">QR CODE</div>
                <div className="text-[10px]" style={{ fontFamily }}>{translations.fundraising.scanToDonate}</div>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1" style={{ fontFamily }}>{translations.fundraising.donateOnline}</div>
              <div className="text-[#D4AF37] text-base sm:text-lg font-mono">
                masjidalnoor.org/donate
              </div>
            </div>
          </div>

          <div className="text-gray-500 text-sm" style={{ fontFamily }}>
            {translations.fundraising.autoClosing} {displayCountdown}{translations.fundraising.seconds}
          </div>
        </div>
      </div>
    </div>
  );
}

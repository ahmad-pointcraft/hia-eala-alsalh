import { Cloud, Droplets } from 'lucide-react';
import { Language } from '../utils/translations';

interface InfoPanelsProps {
  language: Language;
  translations: any;
}

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export function InfoPanels({ language, translations }: InfoPanelsProps) {
  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  const temperature = language === 'ar' ? toArabicNumerals('28') : '28';
  const humidity = language === 'ar' ? toArabicNumerals('75') : '75';
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-4 sm:p-6">
        <div className="text-[#D4AF37] text-xs uppercase tracking-wider mb-3 sm:mb-4" style={{ fontFamily }}>
          {translations.hadithOfTheDay}
        </div>
        <p className="text-white text-sm sm:text-base italic leading-relaxed" style={{ fontFamily }}>
          {translations.hadithText}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3" style={{ fontFamily }}>
          {translations.hadithSource}
        </p>
      </div>

      <div className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Cloud className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            <div>
              <div className="text-white text-3xl sm:text-4xl font-bold">{temperature}°C</div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1" style={{ fontFamily }}>
                {language === 'ar' ? 'هانوي' : 'Hanoi'}
              </div>
            </div>
          </div>

          <div className={isRTL ? 'text-left' : 'text-right'}>
            <div className="text-gray-300 text-xs sm:text-sm" style={{ fontFamily }}>
              {translations.weather.partlyCloudy}
            </div>
            <div className={`flex items-center gap-1 text-gray-400 text-xs mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Droplets className="w-3 h-3" />
              <span>{humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

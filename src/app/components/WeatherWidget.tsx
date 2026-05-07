import { Cloud, Droplets } from 'lucide-react';
import { Language } from '../utils/translations';

interface WeatherWidgetProps {
  language: Language;
  translations: any;
}

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export function WeatherWidget({ language, translations }: WeatherWidgetProps) {
  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  const temperature = language === 'ar' ? toArabicNumerals('28') : '28';
  const humidity = language === 'ar' ? toArabicNumerals('75') : '75';

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg p-[5px]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Cloud className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
          <div>
            <div className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">{temperature}°C</div>
            <div className="text-gray-400 text-xs sm:text-sm lg:text-base mt-0.5" style={{ fontFamily }}>
              {language === 'ar' ? 'هانوي' : 'Hanoi'}
            </div>
          </div>
        </div>

        <div className={isRTL ? 'text-left' : 'text-right'}>
          <div className="text-gray-300 text-xs sm:text-sm lg:text-base" style={{ fontFamily }}>
            {translations.weather.partlyCloudy}
          </div>
          <div className={`flex items-center gap-1 text-gray-400 text-xs sm:text-sm mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

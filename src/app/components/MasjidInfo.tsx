import image_logo_masjid_design_1 from '@/imports/logo-masjid-design-1.png'
import { useEffect, useState } from 'react';
import { Language } from '../utils/translations';
import logoSvg from '../../imports/logo.png';

interface MasjidInfoProps {
  language: Language;
  translations: any;
}

export function MasjidInfo({ language, translations }: MasjidInfoProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getHijriDate = () => {
    return language === 'ar' ? "١٥ ذو القعدة ١٤٤٧" : "15 Dhul-Qa'dah 1447";
  };

  const getGregorianDate = () => {
    return currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  return (
    <div className="w-full px-[20px] py-[12px]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-3 lg:gap-6">
        {/* Logo - Left */}
        <div className="shrink-0">
          <img
            src={image_logo_masjid_design_1}
            alt="Masjid Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain"
          />
        </div>

        {/* Dates - Right */}
        <div className="flex items-center gap-2 sm:gap-3 text-right">
          <span className="text-white text-xs sm:text-sm lg:text-lg" style={{ fontFamily }}>
            {getHijriDate()}
          </span>
          <span className="text-gray-400 text-sm lg:text-lg">•</span>
          <span className="text-gray-400 text-xs sm:text-sm lg:text-lg">
            {getGregorianDate()}
          </span>
        </div>
      </div>
    </div>
  );
}

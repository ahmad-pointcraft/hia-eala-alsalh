import { useEffect, useState } from 'react';
import { Languages, Heart, CalendarClock } from 'lucide-react';
import { Language } from '../utils/translations';

interface HeaderProps {
  eventMode: boolean;
  onToggleEventMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onShowFundraising: () => void;
  translations: any;
}

export function Header({ eventMode, onToggleEventMode, language, onToggleLanguage, onShowFundraising, translations }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm border-b border-[#D4AF37]/30 px-[20px] py-[10px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex justify-start">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black/80 hover:bg-black text-[#D4AF37] text-xs sm:text-sm font-bold border border-[#D4AF37]/50 rounded-lg backdrop-blur-sm transition-colors shadow-lg"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        <div className="flex justify-center">
          <div className="text-white font-mono tracking-wider text-[32px] text-justify font-bold">
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex-1 flex justify-end gap-2">
          <button
            onClick={onShowFundraising}
            className="px-3 py-2 bg-black/80 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/50 rounded-lg backdrop-blur-sm transition-colors shadow-lg flex items-center gap-2"
            title={translations.donate}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden lg:inline text-xs sm:text-sm font-bold">{translations.donate}</span>
          </button>

          <button
            onClick={onToggleEventMode}
            className="px-3 sm:px-4 py-2 bg-[#D4AF37]/80 hover:bg-[#D4AF37] text-black text-xs sm:text-sm font-bold rounded-lg backdrop-blur-sm transition-colors shadow-lg flex items-center gap-2"
          >
            <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{eventMode ? translations.exitEvent : translations.comingEvent}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

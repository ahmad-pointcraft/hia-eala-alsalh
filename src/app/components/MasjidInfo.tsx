import image_logo_masjid_design_1 from '@/imports/logo-masjid-design-1.png'
import { useEffect, useState } from 'react';
import { Language } from '../utils/translations';
import { Box, Typography } from '@mui/material';

interface MasjidInfoProps {
  language: Language;
  translations: Record<string, string>;
}

const toArabicNumerals = (text: string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

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
    const dateStr = currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return language === 'ar' ? toArabicNumerals(dateStr) : dateStr;
  };

  const isRTL = language === 'ar';
  const fontFamily = language === 'ar' ? 'Noto Naskh Arabic, serif' : 'Open Sans, sans-serif';

  return (
    <Box sx={{ width: '100%', px: '20px', py: '12px' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1.5, lg: 3 } }}>
        {/* Logo - Left */}
        <Box sx={{ flexShrink: 0 }}>
          <Box
            component="img"
            src={image_logo_masjid_design_1}
            alt="Masjid Logo"
            sx={{ width: { xs: 40, sm: 48, lg: 64 }, height: { xs: 40, sm: 48, lg: 64 }, objectFit: 'contain' }}
          />
        </Box>

        {/* Dates - Right */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, textAlign: 'right' }}>
          <Typography component="span" sx={{ color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem', lg: '1.125rem' }, fontFamily }}>
            {getHijriDate()}
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', lg: '1.125rem' } }}>
            •
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem', lg: '1.125rem' } }}>
            {getGregorianDate()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

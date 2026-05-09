import { Droplets } from 'lucide-react';
import { Cloud } from '@mui/icons-material';
import { Language } from '../utils/translations';
import { Paper, Box, Typography } from '@mui/material';

interface WeatherWidgetProps {
  language: Language;
  translations: Record<string, string>;
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
    <Paper 
      sx={{ 
        bgcolor: 'background.paper', 
        backdropFilter: 'blur(4px)', 
        border: '1px solid', 
        borderColor: 'rgba(212,175,55,0.3)', 
        borderRadius: 2, 
        p: '5px' 
      }} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Cloud sx={{ width: { xs: 32, sm: 40, lg: 48 }, height: { xs: 32, sm: 40, lg: 48 }, color: 'text.secondary' }} />
          <Box>
            <Typography sx={{ color: 'text.primary', fontSize: { xs: '1.25rem', sm: '1.5rem', lg: '1.875rem' }, fontWeight: 'bold' }}>{temperature}°C</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem', lg: '1rem' }, mt: 0.5, fontFamily }}>
              {language === 'ar' ? 'هانوي' : 'Hanoi'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'end' }}>
          <Typography sx={{ color: 'grey.300', fontSize: { xs: '0.75rem', sm: '0.875rem', lg: '1rem' }, fontFamily }}>
            {translations.weather?.partlyCloudy || 'Partly Cloudy'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, mt: 0.5, justifyContent: 'flex-end' }}>
            <Droplets style={{ width: '1.25em', height: '1.25em' }} />
            <Typography component="span">{humidity}%</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

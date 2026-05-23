import type { Language } from '@/app/types/i18n';

export const toArabicNumerals = (text: string): string => {
  const arabicNumerals = [
    '\u0660',
    '\u0661',
    '\u0662',
    '\u0663',
    '\u0664',
    '\u0665',
    '\u0666',
    '\u0667',
    '\u0668',
    '\u0669',
  ];
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)] || digit);
};

export const getFontFamily = (language: Language): string => {
  return language === 'ar' ? '"Noto Naskh Arabic", serif' : '"Open Sans", sans-serif';
};

export const isRTL = (language: Language): boolean => {
  return language === 'ar';
};

export const getDirection = (language: Language): 'rtl' | 'ltr' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

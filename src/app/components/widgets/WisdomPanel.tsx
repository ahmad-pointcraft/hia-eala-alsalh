import type { Language } from '@/app/types/i18n';
import type { WisdomContent } from '@/app/types/wisdom';
import type { HadithData } from '@/app/types/hadith';
import type { QuranVerse } from '@/app/types/quran';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getFontFamily, getDirection, toArabicNumerals } from '@/app/utils/helpers';

interface WisdomPanelProps {
  language: Language;
  wisdom: WisdomContent;
  fallbackTitle: string;
}

export function WisdomPanel({ language, wisdom, fallbackTitle }: WisdomPanelProps) {
  const isHadith = wisdom.kind === 'hadith';
  const data = wisdom.data;

  const title = isHadith ? fallbackTitle : 'Quran';
  const textAr = data.text_ar;
  const textEn = data.text_en;
  const source = isHadith
    ? (language === 'ar'
        ? `صحيح البخاري · حديث رقم ${toArabicNumerals(String((data as HadithData).hadithNumber))}`
        : `Sahih Bukhari · Hadith ${(data as HadithData).hadithNumber}`)
    : (language === 'ar'
        ? `${(data as QuranVerse).surahName_ar} · آية ${toArabicNumerals(String((data as QuranVerse).ayahNumber))}`
        : `${(data as QuranVerse).surahName_en} · Ayah ${(data as QuranVerse).ayahNumber}`);

  return (
    <Box
      dir={getDirection(language)}
      sx={{
        width: '100%',
        py: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
        px: { xs: 1.5, sm: 2, md: 2.5, lg: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Box>
        <Typography
          sx={{
            color: 'text.muted',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 600,
            fontSize: { xs: '9px', sm: '10px', md: '11px', lg: '12px' },
            mb: 0.75,
            textAlign: 'start',
          }}
        >
          {title}
        </Typography>

        {language === 'ar' ? (
          <Typography
            sx={{
              color: 'text.soft',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontSize: { xs: '13px', sm: '14px', md: '18px', lg: '24px', xl: '28px' },
              fontFamily: '"Noto Naskh Arabic", serif',
              textAlign: 'center',
            }}
          >
            &ldquo;{textAr}&rdquo;
          </Typography>
        ) : (
          <Typography
            sx={{
              color: 'text.soft',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontSize: { xs: '13px', sm: '14px', md: '18px', lg: '24px', xl: '28px' },
              fontFamily: getFontFamily(language),
              textAlign: 'center',
            }}
          >
            &ldquo;{textEn}&rdquo;
          </Typography>
        )}
      </Box>

      <Typography
        sx={{
          color: 'text.muted',
          fontSize: { xs: '10px', sm: '11px', md: '12px', lg: '13px' },
          mt: 1,
          fontFamily: getFontFamily(language),
          textAlign: 'end',
        }}
      >
        {source}
      </Typography>
    </Box>
  );
}

import type { Language } from '@/app/types/i18n';
import type { WisdomContent } from '@/app/types/wisdom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getFontFamily, getDirection, toArabicNumerals } from '@/app/utils/helpers';

interface WisdomPanelProps {
  language: Language;
  wisdom: WisdomContent;
  fallbackTitle: string;
}

export function WisdomPanel({ language, wisdom, fallbackTitle }: WisdomPanelProps) {
  const title = wisdom.kind === 'hadith' ? fallbackTitle : 'Quran';
  const textAr = wisdom.data.text_ar;
  const textEn = wisdom.data.text_en;

  let source: string;
  if (wisdom.kind === 'hadith') {
    const { hadithNumber } = wisdom.data;
    source = language === 'ar'
      ? `\u0635\u062D\u064A\u062D \u0627\u0644\u0628\u062E\u0627\u0631\u064A \u00B7 \u062D\u062F\u064A\u062B \u0631\u0642\u0645 ${toArabicNumerals(String(hadithNumber))}`
      : `Sahih Bukhari \u00B7 Hadith ${hadithNumber}`;
  } else {
    const { surahName_ar, surahName_en, ayahNumber } = wisdom.data;
    source = language === 'ar'
      ? `${surahName_ar} \u00B7 \u0622\u064A\u0629 ${toArabicNumerals(String(ayahNumber))}`
      : `${surahName_en} \u00B7 Ayah ${ayahNumber}`;
  }

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

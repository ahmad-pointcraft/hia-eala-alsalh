import { Language } from "../utils/translations";
import { Paper, Typography, Box } from '@mui/material';

interface HadithPanelProps {
  language: Language;
  translations: Record<string, string>;
}

export function HadithPanel({
  language,
  translations,
}: HadithPanelProps) {
  const isRTL = language === "ar";
  const fontFamily =
    language === "ar"
      ? "Noto Naskh Arabic, serif"
      : "Open Sans, sans-serif";

  return (
    <Paper
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(4px)',
        border: '1px solid',
        borderColor: 'rgba(212,175,55,0.3)',
        borderRadius: 2,
        p: 0.75,
        px: '10px',
        py: '5px',
        mx: 0,
        mt: 0,
        mb: '10px'
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.5, lg: 1 } }}>
        {/* Title - Top Left (Top Right for Arabic) */}
        <Typography
          sx={{
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'bold',
            textAlign: 'start',
            fontSize: '10px',
            fontFamily
          }}
        >
          {translations.hadithOfTheDay}
        </Typography>

        {/* Hadith Text - Center, Full Width */}
        <Typography
          sx={{
            color: 'text.primary',
            fontStyle: 'italic',
            lineHeight: 1.375,
            textAlign: 'center',
            width: '100%',
            fontSize: '24px',
            fontFamily
          }}
        >
          {translations.hadithText}
        </Typography>

        {/* Source - Bottom Right (Bottom Left for Arabic) */}
        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'end',
            fontSize: '11px',
            fontFamily
          }}
        >
          {translations.hadithSource}
        </Typography>
      </Box>
    </Paper>
  );
}
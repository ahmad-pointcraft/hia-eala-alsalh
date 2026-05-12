import { Language } from "../utils/translations";
import type { Translations } from '../utils/translations';
import { Paper, Typography, Box } from '@mui/material';
import { getFontFamily, getDirection } from '../utils/helpers';

interface HadithPanelProps {
  language: Language;
  translations: Translations;
}

export function HadithPanel({
  language,
  translations,
}: HadithPanelProps) {
  return (
    <Paper
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(4px)',
        border: '1px solid',
        borderColor: 'border.medium',
        borderRadius: 2,
        p: 0.75,
        px: '10px',
        py: '5px',
        mx: 0,
        mt: 0,
        mb: '10px'
      }}
      dir={getDirection(language)}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.5, lg: 1 } }}>
        <Typography
          sx={{
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 'bold',
            textAlign: 'start',
            fontSize: '10px',
            fontFamily: getFontFamily(language)
          }}
        >
          {translations.hadithOfTheDay}
        </Typography>

        <Typography
          sx={{
            color: 'text.primary',
            fontStyle: 'italic',
            lineHeight: 1.375,
            textAlign: 'center',
            width: '100%',
            fontSize: '24px',
            fontFamily: getFontFamily(language)
          }}
        >
          {translations.hadithText}
        </Typography>

        <Typography
          sx={{
            color: 'text.secondary',
            textAlign: 'end',
            fontSize: '11px',
            fontFamily: getFontFamily(language)
          }}
        >
          {translations.hadithSource}
        </Typography>
      </Box>
    </Paper>
  );
}

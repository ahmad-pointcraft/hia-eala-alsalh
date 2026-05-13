import { Language } from "../utils/translations";
import type { Translations } from '../utils/translations';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
    <Box
      dir={getDirection(language)}
      sx={{
        width: "100%",
        py: 1.5,
        px: 2.5,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: "text.whiteMuted",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontWeight: 600,
          fontSize: "9px",
          mb: 0.75,
        }}
      >
        {translations.hadithOfTheDay}
      </Typography>

      <Typography
        sx={{
          color: "text.whiteSoft",
          fontStyle: "italic",
          lineHeight: 1.6,
          fontSize: { xs: "13px", sm: "14px", lg: "16px" },
          fontFamily: getFontFamily(language),
        }}
      >
        &ldquo;{translations.hadithText}&rdquo;
      </Typography>

      <Typography
        sx={{
          color: "text.whiteMuted",
          fontSize: "11px",
          mt: 0.75,
          fontFamily: getFontFamily(language),
        }}
      >
        {translations.hadithSource}
      </Typography>
    </Box>
  );
}

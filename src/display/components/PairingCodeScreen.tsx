import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLanguageStore } from '@/display/store/languageStore';

export function PairingCodeScreen({ code }: { code: string | null }) {
  const language = useLanguageStore((s) => s.language);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const instruction =
    language === 'ar'
      ? 'أدخل هذا الرمز في بوابة الإدارة'
      : 'Enter this code in the admin portal';

  const displayCode = code ?? '------';

  return (
    <Box
      dir={dir}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        gap: 4,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontSize: '1rem', letterSpacing: '0.15em' }}
        >
          {instruction}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Roboto Mono", monospace',
            fontSize: { xs: '4rem', md: '6rem', lg: '8rem' },
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '0.25em',
            lineHeight: 1,
            userSelect: 'all',
          }}
        >
          {displayCode}
        </Typography>
      </Stack>
    </Box>
  );
}

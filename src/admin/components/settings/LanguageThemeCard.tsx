import {
  Box,
  Card,
  CardContent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { PaletteOutlined as ThemeIcon } from '@mui/icons-material';
import { useDisplaySettingsForm } from '@/admin/store/useDisplaySettingsForm';
import type { LanguageOrder, ThemeMode } from '@/shared/types';

export function LanguageThemeCard() {
  const draft = useDisplaySettingsForm((s) => s.draft);
  const setField = useDisplaySettingsForm((s) => s.setField);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)',
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(46, 125, 50, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <ThemeIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
            Language & Theme
          </Typography>
        </Box>

        <Stack spacing={2.5} sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
          {/* DEFAULT DISPLAY LANGUAGE */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} component="div" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Default Display Language
            </Typography>
            <ToggleButtonGroup
              value={draft.languageOrder ?? 'en-first'}
              exclusive
              fullWidth
              size="small"
              onChange={(_, val: LanguageOrder | null) => {
                if (val) setField({ languageOrder: val });
              }}
              aria-label="Default display language selection"
              sx={{
                bgcolor: '#f1f3f5',
                p: 0.5,
                borderRadius: 2,
                border: 'none',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 1.5,
                  py: 0.75,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'text.secondary',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.25)',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                },
              }}
            >
              <ToggleButton value="en-first">English</ToggleButton>
              <ToggleButton value="ar-first">العربية</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* DISPLAY THEME */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} component="div" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Display Theme
            </Typography>
            <ToggleButtonGroup
              value={draft.themeMode ?? 'dark'}
              exclusive
              fullWidth
              size="small"
              onChange={(_, val: ThemeMode | null) => {
                if (val) setField({ themeMode: val });
              }}
              aria-label="Display theme selection"
              sx={{
                bgcolor: '#f1f3f5',
                p: 0.5,
                borderRadius: 2,
                border: 'none',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 1.5,
                  py: 0.75,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'text.secondary',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    boxShadow: '0 2px 6px rgba(46, 125, 50, 0.25)',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                },
              }}
            >
              <ToggleButton value="dark">🌙 Dark Theme</ToggleButton>
              <ToggleButton value="light">☀️ Light Theme</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

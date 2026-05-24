import { useEffect, useRef, useCallback, useMemo } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Close from '@mui/icons-material/Close';
import type { Language, Translations } from '@/app/types/i18n';
import { toArabicNumerals, getFontFamily, getDirection } from '@/app/utils/helpers';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface FundraisingOverlayProps {
  onClose: () => void;
  language: Language;
  translations: Translations;
  currentTime: Date;
}

const AUTO_CLOSE_SECONDS = 10;

export function FundraisingOverlay({ onClose, language, translations, currentTime }: FundraisingOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const openedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const id = setTimeout(() => {
      const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) {
        focusables[0]?.focus();
      }
    }, 50);
    return () => clearTimeout(id);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const activeInDialog = container.contains(document.activeElement);

      if (!activeInDialog) {
        e.preventDefault();
        if (e.shiftKey) {
          last.focus();
        } else {
          first.focus();
        }
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === first || first === last) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || first === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [handleKeyDown]);

  const countdown = useMemo(() => {
    const elapsed = Math.floor((Date.now() - openedAtRef.current) / 1000);
    return Math.max(0, AUTO_CLOSE_SECONDS - elapsed);
  }, [currentTime]);

  useEffect(() => {
    if (countdown <= 0) {
      onClose();
    }
  }, [countdown, onClose]);

  const collected = 87500;
  const goal = 120000;
  const donors = 243;
  const progress = (collected / goal) * 100;

  const fontFamily = getFontFamily(language);

  const displayCollected =
    language === 'ar' ? toArabicNumerals(collected.toLocaleString()) : collected.toLocaleString();
  const displayGoal =
    language === 'ar' ? toArabicNumerals(goal.toLocaleString()) : goal.toLocaleString();
  const displayDonors = language === 'ar' ? toArabicNumerals(donors.toString()) : donors.toString();
  const displayProgress =
    language === 'ar' ? toArabicNumerals(progress.toFixed(0)) : progress.toFixed(0);
  const displayCountdown =
    language === 'ar' ? toArabicNumerals(countdown.toString()) : countdown.toString();

  const dir = getDirection(language);

  return (
    <Backdrop
      open
      dir={dir}
      sx={{ bgcolor: 'surface.raised', backdropFilter: 'blur(8px)', zIndex: 50 }}
    >
      <Paper
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={language === 'ar' ? 'لوحة جمع التبرعات' : 'Fundraising overlay'}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'surface.heavy',
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: 'border.thin',
          borderRadius: '24px',
          p: { xs: 3, sm: 4, md: 6, lg: 6 },
          maxWidth: '768px',
          width: '100%',
          position: 'relative',
          mx: 2,
          boxShadow: (theme) => `0 16px 64px ${theme.palette.surface.medium}`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            insetInline: 0,
            height: 4,
            background: (theme) =>
              `linear-gradient(to right, transparent, ${theme.palette.gold.main}, transparent)`,
          }}
        />

        <IconButton
          onClick={onClose}
          aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          sx={{
            position: 'absolute',
            top: 16,
            insetInlineEnd: 16,
            color: 'text.muted',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 3, md: 4, lg: 4 } }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.gold.onLight,
              fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.5rem', lg: '3rem' },
              mb: { xs: 1.5, sm: 1.5, md: 2, lg: 2 },
              fontFamily: getFontFamily(language),
            }}
          >
            {translations.fundraising.title}
          </Typography>
          <Typography
            sx={{
              color: 'text.soft',
              fontSize: { xs: '1rem', sm: '1rem', md: '1.125rem', lg: '1.125rem' },
              fontFamily,
            }}
          >
            {translations.fundraising.description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, sm: 4, md: 6, lg: 6 },
            mb: { xs: 3, sm: 3, md: 4, lg: 4 },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: 'text.muted',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
                fontFamily,
              }}
            >
              {translations.fundraising.collected}
            </Typography>
            <Typography
              sx={{
                color: (theme) => theme.palette.gold.onLight,
                fontSize: { xs: '1.875rem', sm: '2rem', md: '2.25rem', lg: '2.25rem' },
                fontWeight: 'bold',
                fontFamily,
              }}
            >
              ${displayCollected}
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: '1px',
              height: 64,
              bgcolor: 'border.thin',
            }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: 'text.muted',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
                fontFamily,
              }}
            >
              {translations.fundraising.goal}
            </Typography>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { xs: '1.875rem', sm: '2rem', md: '2.25rem', lg: '2.25rem' },
                fontWeight: 'bold',
                fontFamily,
              }}
            >
              ${displayGoal}
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              width: '1px',
              height: 64,
              bgcolor: 'border.thin',
            }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                color: 'text.muted',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 1,
                fontFamily,
              }}
            >
              {translations.fundraising.donors}
            </Typography>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { xs: '1.875rem', sm: '2rem', md: '2.25rem', lg: '2.25rem' },
                fontWeight: 'bold',
                fontFamily,
              }}
            >
              {displayDonors}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography sx={{ color: 'text.muted', fontSize: '0.875rem', fontFamily }}>
              {translations.fundraising.progress}
            </Typography>
            <Typography
              sx={{
                color: (theme) => theme.palette.gold.onLight,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                fontFamily,
              }}
            >
              {displayProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: 'surface.heavy',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: (theme) =>
                  `linear-gradient(to right, ${theme.palette.gold.main}, ${theme.palette.gold.light})`,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: { xs: 3, sm: 3, md: 4, lg: 4 },
            pt: { xs: 3, sm: 3, md: 4, lg: 4 },
            borderTop: '1px solid',
            borderTopColor: 'border.thin',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 2, md: 3, lg: 3 } }}>
            <Box
              sx={{
                width: { xs: 96, sm: 96, md: 128, lg: 128 },
                height: { xs: 96, sm: 96, md: 128, lg: 128 },
                bgcolor: 'common.white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              role="img"
              aria-label={translations.fundraising.scanToDonate}
            >
              <Box sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'text.onGold', p: 1 }}>
                <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '0.75rem' }}>
                  QR CODE
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: '8px', sm: '9px', md: '10px', lg: '10px' }, fontFamily }}
                >
                  {translations.fundraising.scanToDonate}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ color: 'text.muted', fontSize: '0.875rem', mb: 0.5, fontFamily }}>
                {translations.fundraising.donateOnline}
              </Typography>
              <Typography
                sx={{
                  color: (theme) => theme.palette.gold.onLight,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.125rem', lg: '1.125rem' },
                  fontFamily: 'monospace',
                }}
              >
                masjidalnoor.org/donate
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ color: 'text.muted', fontSize: '0.875rem', fontFamily }}>
            {translations.fundraising.autoClosing} {displayCountdown}
            {translations.fundraising.seconds}
          </Typography>
        </Box>
      </Paper>
    </Backdrop>
  );
}

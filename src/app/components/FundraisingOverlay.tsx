import { useEffect, useState, useRef, useCallback } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Close from '@mui/icons-material/Close';
import { Language } from '../utils/translations';
import type { Translations } from '../utils/translations';
import { toArabicNumerals, getFontFamily, getDirection } from '../utils/helpers';

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface FundraisingOverlayProps {
  onClose: () => void;
  language: Language;
  translations: Translations;
}

export function FundraisingOverlay({ onClose, language, translations }: FundraisingOverlayProps) {
  const [countdown, setCountdown] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const id = setTimeout(() => {
      const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }, 50);
    return () => clearTimeout(id);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
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
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      onClose();
    }
  }, [countdown, onClose]);

  const collected = 87500;
  const goal = 120000;
  const donors = 243;
  const progress = (collected / goal) * 100;

  const isRTL = language === 'ar';
  const fontFamily = getFontFamily(language);

  const displayCollected = language === 'ar' ? toArabicNumerals(collected.toLocaleString()) : collected.toLocaleString();
  const displayGoal = language === 'ar' ? toArabicNumerals(goal.toLocaleString()) : goal.toLocaleString();
  const displayDonors = language === 'ar' ? toArabicNumerals(donors.toString()) : donors.toString();
  const displayProgress = language === 'ar' ? toArabicNumerals(progress.toFixed(0)) : progress.toFixed(0);
  const displayCountdown = language === 'ar' ? toArabicNumerals(countdown.toString()) : countdown.toString();

  const dir = getDirection(language);

  return (
    <Backdrop
      open
      dir={dir}
      sx={{ bgcolor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 50 }}
    >
      <Paper
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={language === 'ar' ? 'لوحة جمع التبرعات' : 'Fundraising overlay'}
        sx={{
          bgcolor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          p: { xs: 3, sm: 6 },
          maxWidth: '768px',
          width: '100%',
          position: 'relative',
          mx: 2,
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

        <IconButton
          onClick={onClose}
          aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          sx={{ position: 'absolute', top: 16, insetInlineEnd: 16, color: 'grey.400', '&:hover': { color: 'text.primary' } }}
        >
          <Close />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography
            sx={{
              color: 'primary.main',
              fontSize: { xs: '1.875rem', sm: '3rem' },
              mb: { xs: 1.5, sm: 2 },
              fontFamily: getFontFamily(language),
            }}
          >
            {translations.fundraising.title}
          </Typography>
          <Typography sx={{ color: 'grey.400', fontSize: { xs: '1rem', sm: '1.125rem' }, fontFamily }}>
            {translations.fundraising.description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: { xs: 3, sm: 6 }, mb: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'grey.400', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, fontFamily }}>
              {translations.fundraising.collected}
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold', fontFamily }}>
              ${displayCollected}
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '1px', height: 64, bgcolor: 'rgba(212,175,55,0.3)' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'grey.400', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, fontFamily }}>
              {translations.fundraising.goal}
            </Typography>
            <Typography sx={{ color: 'text.primary', fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold', fontFamily }}>
              ${displayGoal}
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '1px', height: 64, bgcolor: 'rgba(212,175,55,0.3)' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'grey.400', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, fontFamily }}>
              {translations.fundraising.donors}
            </Typography>
            <Typography sx={{ color: 'text.primary', fontSize: { xs: '1.875rem', sm: '2.25rem' }, fontWeight: 'bold', fontFamily }}>
              {displayDonors}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ color: 'grey.400', fontSize: '0.875rem', fontFamily }}>
              {translations.fundraising.progress}
            </Typography>
            <Typography sx={{ color: 'primary.main', fontSize: '0.875rem', fontWeight: 'bold', fontFamily }}>
              {displayProgress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              bgcolor: 'grey.800',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: 'linear-gradient(to right, #D4AF37, #FFD700)',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', mt: { xs: 3, sm: 4 }, pt: { xs: 3, sm: 4 }, borderTop: '1px solid rgba(212,175,55,0.3)', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
            <Box sx={{ width: { xs: 96, sm: 128 }, height: { xs: 96, sm: 128 }, bgcolor: 'white', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Box sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'black', p: 1 }}>
                <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '0.75rem' }}>QR CODE</Typography>
                <Typography sx={{ fontSize: '10px', fontFamily }}>{translations.fundraising.scanToDonate}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ color: 'grey.400', fontSize: '0.875rem', mb: 0.5, fontFamily }}>{translations.fundraising.donateOnline}</Typography>
              <Typography sx={{ color: 'primary.main', fontSize: { xs: '1rem', sm: '1.125rem' }, fontFamily: 'monospace' }}>
                masjidalnoor.org/donate
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ color: 'grey.500', fontSize: '0.875rem', fontFamily }}>
            {translations.fundraising.autoClosing} {displayCountdown}{translations.fundraising.seconds}
          </Typography>
        </Box>
      </Paper>
    </Backdrop>
  );
}

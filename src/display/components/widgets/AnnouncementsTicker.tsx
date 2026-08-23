import { useEffect, useRef } from 'react';
import type { Language } from '@/display/types';
import masjidLogo from '../../../assets/logo-masjid-design-1.png';
import pointcraftLogo from '../../../assets/logo.png';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getFontFamily, isRTL, getDirection } from '@/display/utils/helpers';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';

const SEPARATOR_GLYPH = '\u2726';

interface AnnouncementsTickerProps {
  language: Language;
  announcements: string[];
}

export function AnnouncementsTicker({ language, announcements }: AnnouncementsTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const tickerSpeed = useMosqueConfigStore((s) => s.config.tickerSpeed ?? 'normal');
  const logoUrl = useMosqueConfigStore((s) => s.config.logoUrl);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    if (prefersReducedMotion) {
      element.style.transform = 'none';
      return;
    }

    let animationId = 0;
    let cancelled = false;

    const rtl = isRTL(language);
    const speedMagnitude =
      tickerSpeed === 'slow' ? 0.2 : tickerSpeed === 'fast' ? 0.8 : 0.4;
    const speed = rtl ? speedMagnitude : -speedMagnitude;

    const runPass = () => {
      if (cancelled) return;
      const containerWidth = element.parentElement?.clientWidth ?? 0;

      const start = rtl ? -element.scrollWidth : containerWidth;
      const end = rtl ? containerWidth : -element.scrollWidth;

      let position = start;

      const animate = () => {
        if (cancelled) return;
        position += speed;
        const done = rtl ? position >= end : position <= end;

        if (done) {
          runPass();
          return;
        }

        element.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
    };

    runPass();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
    };
  }, [language, prefersReducedMotion, announcements, tickerSpeed]);


  const segments: React.ReactNode[] = [];
  announcements.forEach((text, i) => {
    segments.push(
      <Typography
        key={i}
        component="span"
        sx={{
          color: 'text.muted',
          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem' },
          fontFamily: getFontFamily(language),
        }}
      >
        {text}
      </Typography>,
    );
    if (i < announcements.length - 1) {
      segments.push(
        <Typography
          key={`sep-${i}`}
          component="span"
          aria-hidden
          sx={{
            color: (theme) => theme.palette.gold.main,
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.8rem', lg: '0.8rem' },
            px: { xs: 1.5, sm: 2 },
          }}
        >
          {SEPARATOR_GLYPH}
        </Typography>,
      );
    }
  });

  return (
    <Box
      role="status"
      aria-label={language === 'ar' ? 'إعلانات المسجد' : 'Masjid announcements'}
      dir={getDirection(language)}
      sx={{
        width: '100%',
        bgcolor: 'surface.raised',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid',
        borderColor: 'border.thin',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: { xs: 36, sm: 40, md: 42, lg: 44 },
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={logoUrl || masjidLogo}
            alt="Masjid Logo"
            sx={{ height: { xs: 22, sm: 26, md: 28, lg: 30 }, width: 'auto', objectFit: 'contain' }}
          />

        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              px: 1,
              willChange: 'transform',
            }}
          >
            {segments}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={pointcraftLogo}
            alt="PointCraft"
            sx={{
              height: { xs: 16, sm: 18, md: 19, lg: 20 },
              width: 'auto',
              objectFit: 'contain',
              opacity: 0.6,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

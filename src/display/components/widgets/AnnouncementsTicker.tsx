import { useEffect, useRef } from 'react';
import type { Language } from '@/display/types';
import masjidLogo from '../../../assets/logo-masjid-design-1.png';
import pointcraftLogo from '../../../assets/logo.png';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getFontFamily, isRTL, getDirection } from '@/display/utils/helpers';

interface AnnouncementsTickerProps {
  language: Language;
  announcements: string[];
}

export function AnnouncementsTicker({ language, announcements }: AnnouncementsTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    if (prefersReducedMotion) return;

    let animationId: number;
    let position = 0;
    const speed = isRTL(language) ? 0.4 : -0.4;

    const animate = () => {
      position += speed;

      if (isRTL(language)) {
        if (position >= element.scrollWidth / 2) {
          position = 0;
        }
      } else {
        if (position <= -element.scrollWidth / 2) {
          position = 0;
        }
      }

      element.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [language, prefersReducedMotion]);

  const separator = ' • ';
  const fullText = announcements.join(separator) + separator + announcements.join(separator);

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
            src={masjidLogo}
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
            <Typography
              component="span"
              sx={{
                color: 'text.muted',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem' },
                fontFamily: getFontFamily(language),
              }}
            >
              {fullText}
            </Typography>
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

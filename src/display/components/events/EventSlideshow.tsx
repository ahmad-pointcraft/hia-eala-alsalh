import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ImageCarousel } from './ImageCarousel';
import { SlideIndicators } from './SlideIndicators';
import type { Language, EventSlide } from '@/display/types';
import { getFontFamily, getDirection } from '@/display/utils';

export type { EventSlide };

interface EventSlideshowProps {
  events: EventSlide[];
  images: string[];
  interval?: number;
  language: Language;
}

export function EventSlideshow({ events, images, interval = 5000, language }: EventSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dir = getDirection(language);

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, interval);
    return () => clearInterval(timer);
  }, [events.length, interval]);

  if (events.length === 0) {
    return <ImageCarousel images={images} interval={interval} />;
  }

  // CLAMP FOR SHRUNK LISTS — a stale index past the last slide (e.g. events
  // deactivated in admin) must fall back to the first slide, not a blank panel
  const event = events[currentIndex] ?? events[0];
  if (!event) return null;

  const bgImage = event.imageUrl;

  return (
    <Box
      dir={dir}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '24px',
        bgcolor: 'surface.overlay',
        border: '1px solid',
        borderColor: 'border.thin',
        boxShadow: (theme) => `0 8px 32px ${theme.palette.surface.overlay}`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
          }
          style={{ width: '100%', height: '100%' }}
        >
          {bgImage && (
            <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              {/* AMBIENT BACKDROP GLOW */}
              <Box
                component="img"
                src={bgImage}
                alt=""
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(24px) brightness(0.5)',
                  transform: 'scale(1.1)',
                }}
              />
              {/* PRIMARY CRISP IMAGE */}
              <Box
                component="img"
                src={bgImage}
                alt={event.title}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center 20%',
                }}
              />
            </Box>
          )}
        </motion.div>
      </AnimatePresence>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {event.badge && (
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 10, sm: 15, md: 20, lg: 20 },
              insetInlineStart: { xs: 15, sm: 15, md: 20, lg: 20 },
              px: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
              py: { xs: 0.25, sm: 0.5, md: 0.5, lg: 0.5 },
              bgcolor: 'primary.main',
              borderRadius: '4px',
            }}
          >
            <Typography
              sx={{
                color: 'text.onGold',
                fontSize: { xs: '12px', sm: '13px', md: '13px', lg: '14px' },
                fontWeight: 700,
                fontFamily: getFontFamily(language),
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1,
              }}
            >
              {event.badge}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            px: { xs: 1.5, sm: 2, md: 2.5, lg: 2.5 },
            pb:
              events.length > 1
                ? { xs: 3, sm: 4, md: 4, lg: 5 }
                : { xs: 2, sm: 2.5, md: 2.5, lg: 2.5 },
            pt: { xs: 4, sm: 5, md: 6, lg: 6 },
            background: (theme) =>
              `linear-gradient(to top, ${theme.palette.background.default}F2 0%, ${theme.palette.background.default}B3 50%, transparent 100%)`,
          }}
        >
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: {
                xs: '30px',
                sm: '34px',
                md: '38px',
                lg: '44px',
                xl: '50px',
              },
              fontWeight: 800,
              fontFamily: getFontFamily(language),
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {event.title}
          </Typography>

          {event.speakerName && (
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: {
                  xs: '19px',
                  sm: '21px',
                  md: '24px',
                  lg: '28px',
                  xl: '32px',
                },
                fontWeight: 600,
                fontFamily: getFontFamily(language),
                mb: 0.75,
              }}
            >
              {event.speakerName}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                color: 'text.soft',
                fontSize: { xs: '16px', sm: '17px', md: '18px', lg: '20px' },
                fontWeight: 500,
                fontFamily: getFontFamily(language),
              }}
            >
              {event.dateValue} · {event.timeValue}
            </Typography>

            {event.locationValue && (
              <Box
                sx={{
                  px: { xs: 1, sm: 1.5, md: 1.5, lg: 1.5 },
                  py: { xs: 0.25, sm: 0.5, md: 0.5, lg: 0.5 },
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
                  border: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '1px solid rgba(255,255,255,0.18)'
                      : '1px solid rgba(0,0,0,0.10)',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.soft',
                    fontSize: { xs: '14px', sm: '16px', md: '17px', lg: '18px' },
                    fontWeight: 500,
                    fontFamily: getFontFamily(language),
                    lineHeight: 1,
                  }}
                >
                  {event.locationValue}
                </Typography>
              </Box>
            )}
          </Box>

          {event.cta && (
            <Box
              sx={{
                display: 'inline-flex',
                mt: 1.5,
                px: { xs: 1.5, sm: 2, md: 2, lg: 2 },
                py: { xs: 0.5, sm: 0.75, md: 0.75, lg: 0.75 },
                bgcolor: 'primary.main',
                borderRadius: '10px',
              }}
            >
              <Typography
                sx={{
                  color: 'text.onGold',
                  fontSize: { xs: '14px', sm: '16px', md: '17px', lg: '19px' },
                  fontWeight: 700,
                  fontFamily: getFontFamily(language),
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                {event.cta}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {events.length > 1 && (
        <SlideIndicators
          count={events.length}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          labelPrefix="Go to event"
        />
      )}
    </Box>
  );
}

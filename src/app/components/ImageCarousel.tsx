import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '../theme/tokens';

interface ImageCarouselProps {
  images: string[];
  interval?: number;
}

export function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: "24px",
      bgcolor: 'surface.overlay',
      border: '1px solid',
      borderColor: 'border.thin',
      boxShadow: `0 8px 32px ${colors.surface.overlay}`,
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          style={{ width: '100%', height: '100%' }}
        >
          <img
            src={images[currentIndex]}
            alt={`Mosque image ${currentIndex + 1} of ${images.length}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          insetInline: 0,
          height: 60,
          background: `linear-gradient(transparent, ${colors.surface.medium})`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pb: 2,
          gap: 1,
        }}>
          {images.map((_, index) => (
            <Box
              component="button"
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              sx={{
                width: index === currentIndex ? 28 : 10,
                height: 10,
                borderRadius: "4px",
                bgcolor: index === currentIndex ? 'primary.main' : colors.text.whiteMuted,
                border: 'none',
                cursor: 'pointer',
                transition: prefersReducedMotion ? 'none' : 'all 300ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SlideIndicators } from './SlideIndicators';

interface ImageCarouselProps {
  images: string[];
  interval?: number;
}

export function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <Box
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
          style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
        >
          {/* AMBIENT BACKDROP GLOW FOR NON-STANDARD RATIOS */}
          <Box
            component="img"
            src={images[currentIndex]}
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
            src={images[currentIndex]}
            alt={`Mosque image ${currentIndex + 1} of ${images.length}`}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center 20%',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <SlideIndicators
          count={images.length}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          labelPrefix="Go to slide"
        />
      )}
    </Box>
  );
}

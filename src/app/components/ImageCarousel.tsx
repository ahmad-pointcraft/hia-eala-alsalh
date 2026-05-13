import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Box from '@mui/material/Box';

interface ImageCarouselProps {
  images: string[];
  interval?: number;
}

export function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      borderRadius: 3,
      bgcolor: 'surface.overlay',
      border: '1px solid',
      borderColor: 'border.thin',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          style={{ width: '100%', height: '100%' }}
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
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
                borderRadius: 1,
                bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255,255,255,0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 300ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

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

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.3)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
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
        <>
          <IconButton
            onClick={goToPrevious}
            aria-label="Previous image"
            sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'text.primary', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={goToNext}
            aria-label="Next image"
            sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: 'text.primary', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          >
            <ChevronRight />
          </IconButton>

          <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
            {images.map((_, index) => (
              <Box
                component="button"
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                sx={{
                  width: index === currentIndex ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 300ms',
                  '&:hover': {
                    bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255,255,255,0.7)',
                  },
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

interface SlideIndicatorsProps {
  count: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  /** Accessible label prefix, e.g. "Go to event" → "Go to event 2". */
  labelPrefix: string;
}

/** Pill-style slide indicators shared by the event slideshow and photo carousel. */
export function SlideIndicators({ count, currentIndex, onSelect, labelPrefix }: SlideIndicatorsProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 5,
        insetInline: 0,
        height: { xs: 36, sm: 42, md: 48, lg: 48 },
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pb: 1.5,
        gap: 5,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Box
          component="button"
          key={index}
          onClick={() => onSelect(index)}
          aria-label={`${labelPrefix} ${index + 1}`}
          aria-current={index === currentIndex}
          sx={{
            width: index === currentIndex ? 28 : 10,
            height: 10,
            borderRadius: 50,
            bgcolor: index === currentIndex ? 'primary.main' : 'text.muted',
            border: 'none',
            cursor: 'pointer',
            p: 1,
            m: -1.75,
            transition: prefersReducedMotion
              ? 'none'
              : 'all 300ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
      ))}
    </Box>
  );
}

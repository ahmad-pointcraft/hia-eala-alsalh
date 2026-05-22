import { useMemo } from 'react';
import { motion } from 'motion/react';
import Box from '@mui/material/Box';
import { useTheme } from "@mui/material/styles";

export function IslamicGeometricOverlay() {
  const theme = useTheme();
  const particlePositions = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    [],
  );

  const cornerPositions = useMemo(
    () => [
      { top: 0, insetInlineStart: 0, gradientOrigin: 'top left' },
      { top: 0, insetInlineEnd: 0, gradientOrigin: 'top right' },
      { bottom: 0, insetInlineStart: 0, gradientOrigin: 'bottom left' },
      { bottom: 0, insetInlineEnd: 0, gradientOrigin: 'bottom right' },
    ],
    [],
  );

  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <motion.div
        style={{ position: 'absolute', inset: 0, opacity: 0.08 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <g fill="none" stroke={theme.palette.gold.main} strokeWidth="1.5">
                <circle cx="100" cy="100" r="40" />
                <circle cx="100" cy="100" r="60" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <line
                    key={angle}
                    x1="100"
                    y1="100"
                    x2={100 + Math.cos((angle * Math.PI) / 180) * 80}
                    y2={100 + Math.sin((angle * Math.PI) / 180) * 80}
                  />
                ))}
                <polygon points="100,20 141.4,41.4 162.8,82.8 162.8,117.2 141.4,158.6 100,180 58.6,158.6 37.2,117.2 37.2,82.8 58.6,41.4" />
                <path d="M 100,60 L 120,80 L 100,100 L 80,80 Z" />
                <path d="M 100,100 L 120,120 L 100,140 L 80,120 Z" />
                <path d="M 60,100 L 80,120 L 100,100 L 80,80 Z" />
                <path d="M 140,100 L 120,120 L 100,100 L 120,80 Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </motion.div>

      <motion.div
        style={{ position: 'absolute', inset: 0, opacity: 0.05 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern-2" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <g fill="none" stroke={theme.palette.gold.main} strokeWidth="1">
                <polygon points="150,50 200,87.5 200,162.5 150,200 100,162.5 100,87.5" />
                <polygon points="150,50 200,87.5 250,87.5 275,125 250,162.5 200,162.5" />
                <circle cx="150" cy="125" r="30" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern-2)" />
        </svg>
      </motion.div>

      <motion.div
        style={{ position: 'absolute', top: 0, insetInline: 0, height: 4, background: `linear-gradient(90deg, transparent 0%, ${theme.palette.gold.main} 50%, transparent 100%)` }}
        animate={{
          boxShadow: [
            `0 0 20px 4px ${theme.palette.glow.subtle}`,
            `0 0 40px 8px ${theme.palette.glow.medium}`,
            `0 0 20px 4px ${theme.palette.glow.subtle}`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: [0.25, 1, 0.5, 1] }}
      />

      <motion.div
        style={{ position: 'absolute', bottom: 0, insetInline: 0, height: 4, background: `linear-gradient(90deg, transparent 0%, ${theme.palette.gold.main} 50%, transparent 100%)` }}
        animate={{
          boxShadow: [
            `0 0 20px 4px ${theme.palette.glow.subtle}`,
            `0 0 40px 8px ${theme.palette.glow.medium}`,
            `0 0 20px 4px ${theme.palette.glow.subtle}`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: [0.25, 1, 0.5, 1], delay: 1.5 }}
      />

      {cornerPositions.map((pos, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', width: 128, height: 128, ...pos }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: [0.25, 1, 0.5, 1], delay: i * 0.5 }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle at ${pos.gradientOrigin}, ${theme.palette.border.medium} 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}

      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', width: 4, height: 4, insetInlineStart: pos.left, top: pos.top, backgroundColor: theme.palette.gold.main, borderRadius: '50%' }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: pos.duration, repeat: Infinity, ease: [0.25, 1, 0.5, 1], delay: pos.delay }}
        />
      ))}
    </Box>
  );
}

import { motion } from 'motion/react';

export function IslamicGeometricOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Rotating geometric pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* 8-pointed star pattern */}
              <g fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <circle cx="100" cy="100" r="40" />
                <circle cx="100" cy="100" r="60" />

                {/* 8 radiating lines */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <line
                    key={angle}
                    x1="100"
                    y1="100"
                    x2={100 + Math.cos((angle * Math.PI) / 180) * 80}
                    y2={100 + Math.sin((angle * Math.PI) / 180) * 80}
                  />
                ))}

                {/* Outer octagon */}
                <polygon
                  points="100,20 141.4,41.4 162.8,82.8 162.8,117.2 141.4,158.6 100,180 58.6,158.6 37.2,117.2 37.2,82.8 58.6,41.4"
                />

                {/* Inner interlocking pattern */}
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

      {/* Secondary counter-rotating pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        animate={{ rotate: -360 }}
        transition={{
          duration: 180,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern-2" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="#D4AF37" strokeWidth="1">
                {/* Hexagonal tessellation */}
                <polygon points="150,50 200,87.5 200,162.5 150,200 100,162.5 100,87.5" />
                <polygon points="150,50 200,87.5 250,87.5 275,125 250,162.5 200,162.5" />
                <circle cx="150" cy="125" r="30" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern-2)" />
        </svg>
      </motion.div>

      {/* Gold accent glow - top edge */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        animate={{
          boxShadow: [
            '0 0 20px 4px rgba(212, 175, 55, 0.3)',
            '0 0 40px 8px rgba(212, 175, 55, 0.5)',
            '0 0 20px 4px rgba(212, 175, 55, 0.3)',
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
        }}
      />

      {/* Gold accent glow - bottom edge */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        animate={{
          boxShadow: [
            '0 0 20px 4px rgba(212, 175, 55, 0.3)',
            '0 0 40px 8px rgba(212, 175, 55, 0.5)',
            '0 0 20px 4px rgba(212, 175, 55, 0.3)',
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
        }}
      />

      {/* Corner accent lights */}
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 }
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32"
          style={pos}
          animate={{
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at ${pos.top !== undefined ? 'top' : 'bottom'} ${pos.left !== undefined ? 'left' : 'right'}, rgba(212, 175, 55, 0.3) 0%, transparent 70%)`
            }}
          />
        </motion.div>
      ))}

      {/* Floating subtle particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#D4AF37] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
}

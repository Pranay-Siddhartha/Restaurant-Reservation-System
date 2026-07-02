import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function ChampagneParticles({ count = 30 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 4 + 2; // 2px to 6px
      return {
        id: i,
        x: Math.random() * 100, // 0 to 100vw
        initialY: Math.random() * 100 + 20, // Start slightly below/across the screen
        duration: Math.random() * 15 + 10, // 10 to 25 seconds
        delay: Math.random() * -20, // Negative delay so they are already on screen
        opacity: Math.random() * 0.5 + 0.2,
        size,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#d6a87c] shadow-[0_0_8px_2px_rgba(214,168,124,0.4)]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          initial={{ y: `${p.initialY}vh` }}
          animate={{ y: '-20vh' }} // Float up past the top
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

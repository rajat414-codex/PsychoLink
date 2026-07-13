import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium 3D AI Bubble Avatar
 * Inspired by glossy white sphere robot with dark visor and glowing eyes.
 * - Aura: Red/Crimson/Pink gradient ring
 * - Max: Green/Emerald/Teal gradient ring
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#ff3b30',
  isTyping = false,
  className = '',
  style = {}
}) {
  const sizeMap = { lg: 220, md: 130, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  const isMax = glowColor.toLowerCase() === '#34c759' || glowColor.toLowerCase() === '#22c55e' || glowColor.toLowerCase() === '#10b981';

  // Gradient rings
  const ringGradient = isMax
    ? 'linear-gradient(135deg, #34d399 0%, #10b981 25%, #06b6d4 50%, #22d3ee 75%, #a7f3d0 100%)'
    : 'linear-gradient(135deg, #ff6b6b 0%, #ef4444 25%, #dc2626 50%, #f43f5e 75%, #fb7185 100%)';

  const glowShadow = isMax
    ? '0 0 30px rgba(16,185,129,0.5), 0 0 60px rgba(16,185,129,0.2)'
    : '0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.2)';

  const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';

  // Scale factors for sub-elements
  const s = d / 220;

  return (
    <motion.div
      className={`robot-avatar-3d ${className}`}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: d,
        height: d,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {/* Floor shadow */}
      <motion.div
        animate={{ scale: [1, 0.92, 1], opacity: [0.35, 0.2, 0.35] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: -4 * s,
          width: 110 * s,
          height: 14 * s,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)',
          filter: `blur(${4 * s}px)`,
          zIndex: 0
        }}
      />

      {/* Main white sphere */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 28%, #ffffff 0%, #f8fafc 35%, #e8ecf1 60%, #c8cfd8 80%, #a0aab6 100%)',
        boxShadow: `
          0 ${20 * s}px ${40 * s}px rgba(0,0,0,0.25),
          0 ${8 * s}px ${16 * s}px rgba(0,0,0,0.15),
          inset 0 ${-10 * s}px ${25 * s}px rgba(100,116,139,0.3),
          inset 0 ${6 * s}px ${10 * s}px rgba(255,255,255,0.9)
        `,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>

        {/* Top glossy highlight crescent */}
        <div style={{
          position: 'absolute',
          top: `${8 * s}px`,
          left: `${30 * s}px`,
          width: `${100 * s}px`,
          height: `${45 * s}px`,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)',
          borderRadius: '50% 50% 40% 40% / 70% 70% 30% 30%',
          filter: `blur(${2 * s}px)`,
          pointerEvents: 'none',
          zIndex: 10
        }} />

        {/* Secondary subtle highlight */}
        <div style={{
          position: 'absolute',
          top: `${6 * s}px`,
          left: `${55 * s}px`,
          width: `${50 * s}px`,
          height: `${22 * s}px`,
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '50%',
          filter: `blur(${4 * s}px)`,
          pointerEvents: 'none',
          zIndex: 11
        }} />

        {/* Visor gradient ring bezel */}
        <motion.div
          animate={isTyping ? { boxShadow: [glowShadow, glowShadow.replace(/0\.\d/g, m => String(parseFloat(m) + 0.2)), glowShadow] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: `${148 * s}px`,
            height: `${100 * s}px`,
            borderRadius: `${50 * s}px`,
            background: ringGradient,
            padding: `${4.5 * s}px`,
            boxShadow: glowShadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5,
            transition: 'background 0.5s ease, box-shadow 0.5s ease'
          }}
        >
          {/* Inner dark visor screen */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: `${46 * s}px`,
            background: 'radial-gradient(ellipse at 50% 30%, #1a1d2e 0%, #0a0c14 50%, #050710 100%)',
            boxShadow: `
              inset 0 ${4 * s}px ${12 * s}px rgba(0,0,0,0.9),
              inset 0 ${-2 * s}px ${8 * s}px rgba(255,255,255,0.04)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${22 * s}px`,
            position: 'relative',
            overflow: 'hidden'
          }}>

            {/* Screen top reflection glare */}
            <div style={{
              position: 'absolute',
              top: `${2 * s}px`,
              left: `${12 * s}px`,
              right: `${12 * s}px`,
              height: `${20 * s}px`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
              borderRadius: `${50 * s}px ${50 * s}px ${10 * s}px ${10 * s}px`,
              pointerEvents: 'none'
            }} />

            {/* Eyes container */}
            <AnimatePresence mode="wait">
              {isHappy ? (
                /* Happy squint arch eyes ^  ^ */
                <motion.div
                  key="happy-eyes"
                  initial={{ opacity: 0, scaleY: 0.2 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.2 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}
                >
                  {[0, 1].map(i => (
                    <svg key={i} width={22 * s} height={18 * s} viewBox="0 0 24 20" fill="none">
                      <path
                        d="M3 16 C6 6, 18 6, 21 16"
                        stroke="#ffffff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        fill="none"
                        style={{ filter: `drop-shadow(0 0 ${6 * s}px rgba(255,255,255,0.9))` }}
                      />
                    </svg>
                  ))}
                </motion.div>
              ) : expression === 'sleep' ? (
                /* Sleeping flat lines —  — */
                <motion.div
                  key="sleep-eyes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}
                >
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: `${20 * s}px`,
                      height: `${4 * s}px`,
                      borderRadius: `${2 * s}px`,
                      backgroundColor: '#ffffff',
                      boxShadow: `0 0 ${8 * s}px rgba(255,255,255,0.9), 0 0 ${3 * s}px rgba(255,255,255,0.7)`
                    }} />
                  ))}
                </motion.div>
              ) : expression === 'sad' ? (
                /* Sad droopy eyes */
                <motion.div
                  key="sad-eyes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}
                >
                  {[0, 1].map(i => (
                    <svg key={i} width={22 * s} height={18 * s} viewBox="0 0 24 20" fill="none">
                      <path
                        d="M3 6 C6 18, 18 18, 21 6"
                        stroke="#ffffff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        fill="none"
                        style={{ filter: `drop-shadow(0 0 ${6 * s}px rgba(255,255,255,0.9))` }}
                      />
                    </svg>
                  ))}
                </motion.div>
              ) : expression === 'dizzy' || expression === 'error' ? (
                /* Dizzy cross eyes X  X */
                <motion.div
                  key="dizzy-eyes"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}
                >
                  {[0, 1].map(i => (
                    <svg key={i} width={20 * s} height={20 * s} viewBox="0 0 20 20" fill="none">
                      <path d="M4 4 L16 16 M16 4 L4 16" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 ${5 * s}px rgba(255,255,255,0.9))` }} />
                    </svg>
                  ))}
                </motion.div>
              ) : (
                /* Default glowing oval pill eyes */
                <motion.div
                  key="default-eyes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}
                >
                  {[0, 1].map(i => (
                    <motion.div
                      key={i}
                      animate={
                        isTyping
                          ? { scaleY: [1, 0.15, 1], scaleX: [1, 1.15, 1] }
                          : { scaleY: [1, 1, 0.08, 1, 1] }
                      }
                      transition={{
                        duration: isTyping ? 0.45 : 4.5,
                        repeat: Infinity,
                        repeatDelay: isTyping ? 0.05 : 3.2 + i * 0.2,
                        ease: 'easeInOut'
                      }}
                      style={{
                        width: `${18 * s}px`,
                        height: `${26 * s}px`,
                        borderRadius: '50% / 42%',
                        backgroundColor: '#ffffff',
                        boxShadow: `
                          0 0 ${14 * s}px rgba(255,255,255,1),
                          0 0 ${6 * s}px rgba(255,255,255,0.85),
                          0 0 ${2 * s}px rgba(255,255,255,0.6)
                        `
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

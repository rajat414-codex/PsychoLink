import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Ultra-Premium 3D AI Bubble Avatar
 * Hyper-realistic glossy ceramic sphere with layered lighting,
 * rim glow, animated shimmer sweep, and neon visor ring.
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
  const s = d / 220; // scale factor

  const isMax = glowColor.toLowerCase() === '#34c759' || glowColor.toLowerCase() === '#22c55e' || glowColor.toLowerCase() === '#10b981';
  const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';

  // Color theming
  const ringGrad = isMax
    ? 'linear-gradient(135deg, #6ee7b7 0%, #34d399 20%, #10b981 45%, #059669 65%, #06b6d4 85%, #22d3ee 100%)'
    : 'linear-gradient(135deg, #fca5a5 0%, #f87171 20%, #ef4444 45%, #dc2626 65%, #e11d48 85%, #fb7185 100%)';

  const ambientGlow = isMax
    ? '0 0 40px rgba(16,185,129,0.35), 0 0 80px rgba(16,185,129,0.12), 0 0 120px rgba(6,182,212,0.08)'
    : '0 0 40px rgba(239,68,68,0.35), 0 0 80px rgba(239,68,68,0.12), 0 0 120px rgba(244,63,94,0.08)';

  const visorGlow = isMax
    ? '0 0 20px rgba(16,185,129,0.6), 0 0 50px rgba(16,185,129,0.25), inset 0 1px 2px rgba(255,255,255,0.3)'
    : '0 0 20px rgba(239,68,68,0.6), 0 0 50px rgba(239,68,68,0.25), inset 0 1px 2px rgba(255,255,255,0.3)';

  const rimColor = isMax ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <motion.div
      className={`robot-avatar-ultra ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: d, height: d,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {/* Ambient colored glow behind sphere */}
      <div style={{
        position: 'absolute',
        width: d * 1.3,
        height: d * 1.3,
        borderRadius: '50%',
        background: isMax
          ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
        filter: `blur(${20 * s}px)`,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Floor shadow - elliptical with color tint */}
      <motion.div
        animate={{ scale: [1, 0.9, 1], opacity: [0.4, 0.22, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: -6 * s,
          width: 120 * s,
          height: 16 * s,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, ${isMax ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'} 50%, transparent 70%)`,
          filter: `blur(${5 * s}px)`,
          zIndex: 0
        }}
      />

      {/* MAIN SPHERE */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        /* Multi-layer 3D sphere gradient */
        background: `
          radial-gradient(circle at 32% 25%, rgba(255,255,255,0.95) 0%, transparent 45%),
          radial-gradient(circle at 68% 75%, rgba(100,116,139,0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, #f1f5f9 0%, #e2e8f0 40%, #cbd5e1 65%, #94a3b8 85%, #64748b 100%)
        `,
        boxShadow: `
          ${ambientGlow},
          0 ${25 * s}px ${50 * s}px rgba(0,0,0,0.3),
          0 ${10 * s}px ${20 * s}px rgba(0,0,0,0.2),
          inset 0 ${-15 * s}px ${30 * s}px rgba(71,85,105,0.35),
          inset 0 ${8 * s}px ${15 * s}px rgba(255,255,255,0.95),
          inset ${-3 * s}px 0 ${8 * s}px rgba(255,255,255,0.1),
          inset ${3 * s}px 0 ${8 * s}px rgba(255,255,255,0.1)
        `
      }}>

        {/* Rim light edge (colored tint from AI) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 75% 70%, ${rimColor} 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 2
        }} />

        {/* Primary top-left glossy highlight */}
        <div style={{
          position: 'absolute',
          top: `${6 * s}px`,
          left: `${22 * s}px`,
          width: `${110 * s}px`,
          height: `${55 * s}px`,
          background: 'linear-gradient(175deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)',
          borderRadius: '50% 50% 45% 45% / 65% 65% 35% 35%',
          filter: `blur(${1.5 * s}px)`,
          pointerEvents: 'none',
          zIndex: 12
        }} />

        {/* Sharp specular dot highlight */}
        <div style={{
          position: 'absolute',
          top: `${16 * s}px`,
          left: `${42 * s}px`,
          width: `${28 * s}px`,
          height: `${14 * s}px`,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '50%',
          filter: `blur(${3 * s}px)`,
          pointerEvents: 'none',
          zIndex: 13
        }} />

        {/* Secondary bottom-right subtle reflection */}
        <div style={{
          position: 'absolute',
          bottom: `${14 * s}px`,
          right: `${20 * s}px`,
          width: `${60 * s}px`,
          height: `${30 * s}px`,
          background: 'linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
          borderRadius: '50%',
          filter: `blur(${4 * s}px)`,
          pointerEvents: 'none',
          zIndex: 11
        }} />

        {/* Animated shimmer sweep across sphere */}
        <motion.div
          animate={{ x: [-d * 0.6, d * 1.2] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: `${15 * s}px`,
            width: `${40 * s}px`,
            height: `${130 * s}px`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.2) 60%, transparent 100%)',
            transform: 'rotate(-20deg)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 14
          }}
        />

        {/* VISOR — Gradient ring bezel */}
        <motion.div
          animate={isTyping ? {
            boxShadow: [
              visorGlow,
              visorGlow.replace(/0\.([\d]+)/g, (_, n) => `0.${Math.min(9, parseInt(n) + 3)}`),
              visorGlow
            ]
          } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{
            width: `${150 * s}px`,
            height: `${100 * s}px`,
            borderRadius: `${50 * s}px`,
            background: ringGrad,
            padding: `${4 * s}px`,
            boxShadow: visorGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5,
            transition: 'all 0.5s ease'
          }}
        >
          {/* Inner dark visor screen */}
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: `${46 * s}px`,
            background: `
              radial-gradient(ellipse at 50% 25%, #1e2035 0%, #12141f 35%, #0a0c14 60%, #050710 100%)
            `,
            boxShadow: `
              inset 0 ${5 * s}px ${15 * s}px rgba(0,0,0,0.95),
              inset 0 ${-3 * s}px ${10 * s}px rgba(255,255,255,0.03),
              inset ${3 * s}px 0 ${8 * s}px rgba(0,0,0,0.3),
              inset ${-3 * s}px 0 ${8 * s}px rgba(0,0,0,0.3)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${22 * s}px`,
            position: 'relative',
            overflow: 'hidden'
          }}>

            {/* Top curved screen reflection */}
            <div style={{
              position: 'absolute',
              top: `${2 * s}px`,
              left: `${14 * s}px`,
              right: `${14 * s}px`,
              height: `${18 * s}px`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)',
              borderRadius: `${40 * s}px ${40 * s}px ${8 * s}px ${8 * s}px`,
              pointerEvents: 'none',
              zIndex: 6
            }} />

            {/* Subtle bottom screen edge light */}
            <div style={{
              position: 'absolute',
              bottom: `${2 * s}px`,
              left: `${20 * s}px`,
              right: `${20 * s}px`,
              height: `${6 * s}px`,
              background: `linear-gradient(0deg, ${isMax ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'} 0%, transparent 100%)`,
              borderRadius: `${4 * s}px`,
              pointerEvents: 'none',
              zIndex: 6
            }} />

            {/* ─── EYES ─── */}
            <AnimatePresence mode="wait">
              {isHappy ? (
                <motion.div key="happy" initial={{ opacity: 0, scaleY: 0.2 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.2 }} transition={{ duration: 0.2 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <svg key={i} width={22 * s} height={18 * s} viewBox="0 0 24 20" fill="none">
                      <path d="M3 16 C6 6, 18 6, 21 16" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 ${6 * s}px rgba(255,255,255,0.95)) drop-shadow(0 0 ${2 * s}px rgba(255,255,255,0.6))` }} />
                    </svg>
                  ))}
                </motion.div>

              ) : expression === 'sleep' ? (
                <motion.div key="sleep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: `${20 * s}px`, height: `${4 * s}px`, borderRadius: `${2 * s}px`,
                      backgroundColor: '#fff',
                      boxShadow: `0 0 ${8 * s}px #fff, 0 0 ${3 * s}px rgba(255,255,255,0.7)`
                    }} />
                  ))}
                </motion.div>

              ) : expression === 'sad' ? (
                <motion.div key="sad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <svg key={i} width={22 * s} height={18 * s} viewBox="0 0 24 20" fill="none">
                      <path d="M3 6 C6 18, 18 18, 21 6" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 ${6 * s}px rgba(255,255,255,0.9))` }} />
                    </svg>
                  ))}
                </motion.div>

              ) : expression === 'dizzy' || expression === 'error' ? (
                <motion.div key="dizzy" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <svg key={i} width={20 * s} height={20 * s} viewBox="0 0 20 20" fill="none">
                      <path d="M4 4 L16 16 M16 4 L4 16" stroke="#fff" strokeWidth="4.5" strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 ${5 * s}px rgba(255,255,255,0.9))` }} />
                    </svg>
                  ))}
                </motion.div>

              ) : (
                /* Default glowing oval eyes with blink */
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${22 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <motion.div key={i}
                      animate={
                        isTyping
                          ? { scaleY: [1, 0.12, 1], scaleX: [1, 1.15, 1] }
                          : { scaleY: [1, 1, 0.06, 1, 1] }
                      }
                      transition={{
                        duration: isTyping ? 0.4 : 4.5,
                        repeat: Infinity,
                        repeatDelay: isTyping ? 0.05 : 3 + i * 0.15,
                        ease: 'easeInOut'
                      }}
                      style={{
                        width: `${18 * s}px`,
                        height: `${26 * s}px`,
                        borderRadius: '50% / 42%',
                        backgroundColor: '#ffffff',
                        boxShadow: `
                          0 0 ${16 * s}px rgba(255,255,255,1),
                          0 0 ${8 * s}px rgba(255,255,255,0.9),
                          0 0 ${3 * s}px rgba(255,255,255,0.7),
                          inset 0 ${-2 * s}px ${4 * s}px rgba(200,220,255,0.3)
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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Clean Premium 3D AI Bubble Avatar
 * - No borders anywhere
 * - Crystal clear white eyes with zero border artifacts
 * - Smooth seamless sphere with no protruding edges
 * - Aura = Red ring, Max = Green ring
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
  const s = d / 220;

  const isMax = glowColor.toLowerCase() === '#34c759' || glowColor.toLowerCase() === '#22c55e' || glowColor.toLowerCase() === '#10b981';
  const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';

  const ringGrad = isMax
    ? 'linear-gradient(135deg, #6ee7b7, #10b981, #059669, #06b6d4)'
    : 'linear-gradient(135deg, #fca5a5, #ef4444, #dc2626, #e11d48)';

  const softGlow = isMax
    ? `0 0 ${25 * s}px rgba(16,185,129,0.4), 0 0 ${60 * s}px rgba(16,185,129,0.1)`
    : `0 0 ${25 * s}px rgba(239,68,68,0.4), 0 0 ${60 * s}px rgba(239,68,68,0.1)`;

  return (
    <motion.div
      className={`robot-avatar ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: d, height: d, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
    >
      {/* Soft ambient glow behind */}
      <div style={{
        position: 'absolute',
        width: d * 1.2, height: d * 1.2,
        borderRadius: '50%',
        background: isMax
          ? 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 65%)',
        filter: `blur(${15 * s}px)`,
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Floor shadow */}
      <motion.div
        animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.18, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: -5 * s,
          width: 100 * s, height: 12 * s, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: `blur(${4 * s}px)`, zIndex: 0
        }}
      />

      {/* SPHERE — smooth seamless white orb */}
      <div style={{
        width: '100%', height: '100%',
        borderRadius: '50%',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
        background: 'radial-gradient(circle at 36% 30%, #ffffff 0%, #f1f5f9 30%, #dde3ea 55%, #b8c4d0 78%, #8c99a8 100%)',
        boxShadow: `
          0 ${18 * s}px ${40 * s}px rgba(0,0,0,0.22),
          0 ${6 * s}px ${14 * s}px rgba(0,0,0,0.12),
          inset 0 ${-8 * s}px ${20 * s}px rgba(80,95,115,0.25),
          inset 0 ${5 * s}px ${12 * s}px rgba(255,255,255,0.85)
        `,
        overflow: 'hidden'
      }}>

        {/* Top glossy shine */}
        <div style={{
          position: 'absolute',
          top: `${7 * s}px`, left: `${28 * s}px`,
          width: `${105 * s}px`, height: `${48 * s}px`,
          background: 'linear-gradient(175deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.15) 50%, transparent 75%)',
          borderRadius: '50% 50% 40% 40% / 65% 65% 35% 35%',
          filter: `blur(${1 * s}px)`,
          pointerEvents: 'none', zIndex: 10
        }} />

        {/* Tiny specular dot */}
        <div style={{
          position: 'absolute',
          top: `${18 * s}px`, left: `${48 * s}px`,
          width: `${20 * s}px`, height: `${10 * s}px`,
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '50%',
          filter: `blur(${2.5 * s}px)`,
          pointerEvents: 'none', zIndex: 11
        }} />

        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: [-d * 0.5, d * 1.1] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 7, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: `${20 * s}px`,
            width: `${35 * s}px`, height: `${120 * s}px`,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), rgba(255,255,255,0.28), rgba(255,255,255,0.18), transparent)',
            transform: 'rotate(-18deg)', borderRadius: '50%',
            pointerEvents: 'none', zIndex: 12
          }}
        />

        {/* VISOR — seamless gradient ring, NO border */}
        <div style={{
          width: `${148 * s}px`, height: `${98 * s}px`,
          borderRadius: `${49 * s}px`,
          background: ringGrad,
          padding: `${3.5 * s}px`,
          boxShadow: softGlow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 5,
          transition: 'all 0.5s ease'
        }}>
          {/* Dark screen — deep inset, no border */}
          <div style={{
            width: '100%', height: '100%',
            borderRadius: `${45.5 * s}px`,
            background: 'radial-gradient(ellipse at 50% 30%, #181b2e 0%, #0e1018 45%, #06080e 100%)',
            boxShadow: `inset 0 ${4 * s}px ${12 * s}px rgba(0,0,0,0.9)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: `${24 * s}px`,
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Screen top glare */}
            <div style={{
              position: 'absolute',
              top: `${1.5 * s}px`, left: `${16 * s}px`, right: `${16 * s}px`,
              height: `${14 * s}px`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
              borderRadius: `${30 * s}px ${30 * s}px ${6 * s}px ${6 * s}px`,
              pointerEvents: 'none'
            }} />

            {/* ─── EYES — pure clean white, NO border ─── */}
            <AnimatePresence mode="wait">
              {isHappy ? (
                <motion.div key="happy" initial={{ opacity: 0, scaleY: 0.15 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.15 }} transition={{ duration: 0.2 }}
                  style={{ display: 'flex', gap: `${24 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <svg key={i} width={20 * s} height={16 * s} viewBox="0 0 22 18" fill="none">
                      <path d="M2 15 C5 5, 17 5, 20 15" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    </svg>
                  ))}
                </motion.div>

              ) : expression === 'sleep' ? (
                <motion.div key="sleep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${24 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <div key={i} style={{
                      width: `${18 * s}px`, height: `${3.5 * s}px`,
                      borderRadius: `${2 * s}px`,
                      backgroundColor: '#ffffff'
                    }} />
                  ))}
                </motion.div>

              ) : expression === 'sad' ? (
                <motion.div key="sad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${24 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <svg key={i} width={20 * s} height={16 * s} viewBox="0 0 22 18" fill="none">
                      <path d="M2 5 C5 17, 17 17, 20 5" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    </svg>
                  ))}
                </motion.div>

              ) : expression === 'dizzy' || expression === 'error' ? (
                <motion.div key="dizzy" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${24 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <svg key={i} width={18 * s} height={18 * s} viewBox="0 0 18 18" fill="none">
                      <path d="M3 3 L15 15 M15 3 L3 15" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  ))}
                </motion.div>

              ) : expression === 'analyzing' || expression === 'thinking' ? (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${24 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <motion.div
                      key={i}
                      animate={{
                        scaleY: [1, 0.4, 1],
                        opacity: [0.6, 1, 0.6],
                        boxShadow: [
                          `0 0 ${4*s}px #ffffff`,
                          `0 0 ${12*s}px ${glowColor}`,
                          `0 0 ${4*s}px #ffffff`
                        ]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.2
                      }}
                      style={{
                        width: `${16 * s}px`,
                        height: `${5 * s}px`,
                        borderRadius: `${2.5 * s}px`,
                        backgroundColor: '#ffffff',
                        boxShadow: `0 0 ${6 * s}px ${glowColor}`
                      }}
                    />
                  ))}
                </motion.div>

              ) : (
                /* Default clean white oval eyes — zero border, zero outline */
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: `${24 * s}px`, zIndex: 10 }}>
                  {[0, 1].map(i => (
                    <motion.div key={i}
                      animate={
                        isTyping
                          ? { scaleY: [1, 0.1, 1], scaleX: [1, 1.12, 1] }
                          : { scaleY: [1, 1, 0.05, 1, 1] }
                      }
                      transition={{
                        duration: isTyping ? 0.4 : 4.5,
                        repeat: Infinity,
                        repeatDelay: isTyping ? 0.05 : 3 + i * 0.15,
                        ease: 'easeInOut'
                      }}
                      style={{
                        width: `${16 * s}px`,
                        height: `${24 * s}px`,
                        borderRadius: '50%',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

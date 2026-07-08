import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const LETTERS = 'PSYCHOLINK'.split('');

const ORBS = [
  { x: '18%', y: '20%', color: '#7975d4', size: 520, dur: 16 },
  { x: '78%', y: '65%', color: '#be185d', size: 440, dur: 20 },
  { x: '55%', y: '88%', color: '#0e7490', size: 360, dur: 14 },
  { x: '88%', y: '12%', color: '#4f46e5', size: 300, dur: 18 },
];

const NODES = [
  { cx: 50, cy: 50 }, { cx: 30, cy: 28 }, { cx: 70, cy: 28 }, { cx: 20, cy: 56 },
  { cx: 80, cy: 56 }, { cx: 38, cy: 76 }, { cx: 62, cy: 76 }, { cx: 50, cy: 92 },
];
const EDGES = [[0, 1], [0, 2], [1, 3], [2, 4], [0, 3], [0, 4], [3, 5], [4, 6], [5, 7], [6, 7], [1, 5], [2, 6]];

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // 0→particles, 1→logo, 2→brand, 3→tagline, 4→exit

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => { if (onComplete) onComplete(); }, 4000),
    ];
    return () => ts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, overflow: 'hidden',
            background: 'var(--bg-app)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* ── Aurora orbs ─────────────────────────── */}
          {ORBS.map((o, i) => (
            <motion.div key={i}
              animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.15, 0.92, 1] }}
              transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 2 }}
              style={{
                position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
                left: o.x, top: o.y, transform: 'translate(-50%,-50%)',
                width: o.size, height: o.size,
                background: `radial-gradient(circle, ${o.color}1c 0%, ${o.color}08 45%, transparent 70%)`,
                filter: 'blur(60px)',
              }}
            />
          ))}

          {/* ── Star dots ────────────────────────────── */}
          <motion.div
            animate={{ backgroundPosition: ['0px 0px', '50px 100px'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              opacity: 0.03, backgroundSize: '55px 55px',
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            }}
          />

          {/* ── Scanline glint ───────────────────────── */}
          <motion.div
            initial={{ y: '-100%' }} animate={{ y: '200%' }}
            transition={{ duration: 2.5, delay: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: '0 0 auto 0', height: '2px', pointerEvents: 'none',
              background: 'linear-gradient(90deg, transparent, rgba(139,135,245,0.18), rgba(139,135,245,0.08), transparent)',
              filter: 'blur(1px)',
            }}
          />

          {/* ── Main content ─────────────────────────── */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>

            {/* Neural network SVG logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.6 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ position: 'relative', width: 110, height: 110 }}
            >
              {/* Glow rings */}
              {[1.3, 1.7].map((r, i) => (
                <motion.div key={i}
                  animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5 + i, repeat: Infinity, delay: i * 0.7 }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 110 * r, height: 110 * r, borderRadius: '50%',
                    border: '1px solid rgba(139,135,245,0.35)',
                  }}
                />
              ))}

              {/* SVG neural graph */}
              <motion.svg viewBox="0 0 100 100" width={110} height={110}
                style={{ position: 'absolute', inset: 0 }}>
                <defs>
                  <radialGradient id="ng" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c4c1f0" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#7975d4" stopOpacity="0.3" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Edges */}
                {EDGES.map(([a, b], i) => (
                  <motion.line key={i}
                    x1={NODES[a].cx} y1={NODES[a].cy}
                    x2={NODES[b].cx} y2={NODES[b].cy}
                    stroke="url(#ng)" strokeWidth="0.8" strokeOpacity="0"
                    initial={{ strokeOpacity: 0, pathLength: 0 }}
                    animate={{ strokeOpacity: phase >= 1 ? 0.55 : 0, pathLength: phase >= 1 ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: phase >= 1 ? 0.1 + i * 0.04 : 0 }}
                    filter="url(#glow)"
                  />
                ))}

                {/* Nodes */}
                {NODES.map((n, i) => (
                  <motion.circle key={i} cx={n.cx} cy={n.cy} r={i === 0 ? 4 : 2.5}
                    fill={i === 0 ? '#a5a1f0' : '#7975d4'} filter="url(#glow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: phase >= 1 ? 0.05 + i * 0.06 : 0, type: 'spring', stiffness: 300 }}
                  />
                ))}
              </motion.svg>

              {/* Center pulse */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'radial-gradient(circle, #e9d5ff, #7975d4)',
                  boxShadow: 'none',
                }}
              />
            </motion.div>

            {/* Brand name — letter by letter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {LETTERS.map((l, i) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{
                    opacity: phase >= 2 ? 1 : 0,
                    y: phase >= 2 ? 0 : 18,
                    filter: phase >= 2 ? 'blur(0px)' : 'blur(8px)',
                  }}
                  transition={{ duration: 0.5, delay: phase >= 2 ? i * 0.07 : 0, ease: 'easeOut' }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic', fontWeight: 700,
                    fontSize: 'clamp(2rem,6vw,3.2rem)',
                    background: 'linear-gradient(135deg, #f5f3ff 0%, #c4c1f0 35%, #f9a8d4 70%, #e0e7ff 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: l === ' ' ? '0.5em' : '0.08em',
                    display: 'inline-block',
                  }}
                >
                  {l}
                </motion.span>
              ))}
            </div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              style={{
                width: 180, height: 1, marginTop: -16,
                background: 'linear-gradient(90deg, transparent, rgba(165,161,240,0.6), rgba(249,168,212,0.6), transparent)',
              }}
            />

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 10 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: -8 }}
            >
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.62rem', letterSpacing: '3.5px', fontWeight: 700,
                color: 'rgba(255,255,255,0.3)', margin: 0,
              }}>
                COGNITIVE SOCIAL CONSULTATION
              </p>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.88rem', color: 'rgba(255,255,255,0.35)',
                margin: 0, textAlign: 'center', maxWidth: 280, lineHeight: 1.65,
              }}>
                Your mind deserves care.<br />We're here to listen.
              </p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ width: 160, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: 4 }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, delay: 0.6, ease: 'easeInOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #7975d4, #a855f7, #8b87f5)',
                  borderRadius: 2,
                  boxShadow: 'none',
                }}
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
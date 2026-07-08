import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const PHASES = [
  { label: 'Inhale',  duration: 4, color: '#8b87f5', instruction: 'Breathe in slowly through your nose...' },
  { label: 'Hold',    duration: 7, color: '#c79552', instruction: 'Hold your breath gently...' },
  { label: 'Exhale',  duration: 8, color: '#5eb8ad', instruction: 'Exhale completely through your mouth...' },
];

export default function BreathingModal({ onClose }) {
  const [running, setRunning]     = useState(false);
  const [phaseIdx, setPhaseIdx]   = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles]       = useState(0);
  const [scale, setScale]         = useState(1);
  const timerRef = useRef(null);
  const animRef  = useRef(null);

  const phase = PHASES[phaseIdx];

  const tick = () => {
    setCountdown(prev => {
      if (prev <= 1) {
        setPhaseIdx(p => {
          const next = (p + 1) % PHASES.length;
          if (next === 0) setCycles(c => c + 1);
          setCountdown(PHASES[next].duration);
          return next;
        });
        return PHASES[(phaseIdx + 1) % PHASES.length].duration;
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running, phaseIdx]);

  // Circle scale animation based on phase
  useEffect(() => {
    if (!running) { setScale(1); return; }
    const target = phaseIdx === 0 ? 1.6 : phaseIdx === 1 ? 1.6 : 1.0;
    setScale(target);
  }, [phaseIdx, running]);

  const reset = () => {
    setRunning(false);
    setPhaseIdx(0);
    setCountdown(PHASES[0].duration);
    setCycles(0);
    setScale(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(9,10,15,0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '28px', boxShadow: 'var(--shadow-card)', maxWidth: '440px', width: '100%' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: S, fontSize: '0.68rem', letterSpacing: '2.5px', color: 'var(--text-muted)', fontWeight: 700, margin: '0 0 6px' }}>BREATHING EXERCISE</p>
          <h2 style={{ fontFamily: G, fontStyle: 'italic', fontWeight: 600, fontSize: '1.8rem', color: '#fff', margin: '0 0 4px' }}>4 · 7 · 8 Technique</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: J, margin: 0 }}>Reduces anxiety · Helps sleep · Calms the mind</p>
        </div>

        {/* Breathing circle */}
        <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer rings */}
          {[1.2, 1.4, 1.6].map((r, i) => (
            <motion.div key={i}
              animate={{ opacity: running ? [0.15, 0.35, 0.15] : 0.08 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              style={{
                position: 'absolute',
                width: 200 * r, height: 200 * r,
                borderRadius: '50%',
                border: `1px solid ${phase.color}50`,
                pointerEvents: 'none',
                scale: scale
              }}
            />
          ))}

          {/* Inner circle */}
          <motion.div
            animate={running && phaseIdx === 0 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              width: 170, height: 170, borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fff, ${phase.color} 40%, #000 95%)`,
              boxShadow: running ? `0 10px 40px ${phase.color}35` : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              zIndex: 5, cursor: 'pointer', transition: 'all 0.5s ease',
              scale: scale
            }}
          >
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: S, textShadow: '0 2px 10px rgba(0,0,0,0.4)', userSelect: 'none' }}>{countdown}</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontFamily: J, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px', userSelect: 'none' }}>{phase.label}</span>
          </motion.div>
        </div>

        {/* Phase timeline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '10px 20px' }}>
          {PHASES.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <motion.div
                animate={{ scale: running && phaseIdx === i ? [1, 1.3, 1] : 1, opacity: running && phaseIdx === i ? 1 : 0.3 }}
                transition={{ duration: 0.8, repeat: running && phaseIdx === i ? Infinity : 0 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: running && phaseIdx === i ? `0 0 8px ${p.color}` : 'none' }}
              />
              <span style={{ fontSize: '0.72rem', color: running && phaseIdx === i ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: S, fontWeight: 600 }}>{p.label} {p.duration}s</span>
              {i < PHASES.length - 1 && <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 4px' }}>·</span>}
            </div>
          ))}
        </div>

        {/* Instruction text */}
        <AnimatePresence mode="wait">
          <motion.p key={phaseIdx}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{ fontFamily: J, fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, textAlign: 'center', maxWidth: '280px', minHeight: '24px' }}
          >
            {running ? phase.instruction : 'Press Start when you\'re ready'}
          </motion.p>
        </AnimatePresence>

        {/* Cycle count */}
        {cycles > 0 && (
          <div style={{ padding: '4px 14px', borderRadius: '20px', background: 'rgba(139,135,245,0.06)', border: '1px solid rgba(139,135,245,0.15)' }}>
            <span style={{ fontFamily: S, fontSize: '0.72rem', color: '#a5a1f0', fontWeight: 700 }}>✓ {cycles} cycle{cycles > 1 ? 's' : ''} completed</span>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setRunning(r => !r)}
            style={{
              padding: '13px 32px', borderRadius: '14px', border: 'none', cursor: 'pointer',
              background: running ? 'var(--bg-input)' : phase.color,
              color: '#fff', fontSize: '0.92rem', fontWeight: 700, fontFamily: J,
              boxShadow: running ? 'none' : `0 8px 20px ${phase.color}25`,
            }}
          >
            {running ? '⏸ Pause' : cycles > 0 ? '▶ Resume' : '▶ Start'}
          </motion.button>

          {(running || cycles > 0) && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={reset}
              style={{ padding: '13px 20px', borderRadius: '14px', border: '1px solid var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-input)', color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem', fontWeight: 700, fontFamily: J }}
            >
              ↺ Reset
            </motion.button>
          )}

          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onClose}
            style={{ padding: '13px 20px', borderRadius: '14px', border: '1px solid var(--border-subtle)', cursor: 'pointer', background: 'var(--bg-input)', color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem', fontWeight: 700, fontFamily: J }}
          >
            ✕ Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

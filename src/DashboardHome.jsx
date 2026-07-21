import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaBrain, FaArrowRight, FaWind, FaRobot,
  FaBolt, FaHeart, FaFire, FaSmile, FaChartLine, FaPlay,
} from 'react-icons/fa';
import RobotAvatar from './RobotAvatar';

/* ── Font stacks ── */
const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";

/* ── Animated count-up ── */
function useCountUp(target, dur = 1200, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, t0;
    const num = parseFloat(target) || 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      setVal(num * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur, start]);
  return val;
}

/* ── Data ── */
const MOOD_TREND = [
  { d: 'Mon', mood: 62, calm: 48 }, { d: 'Tue', mood: 58, calm: 52 },
  { d: 'Wed', mood: 71, calm: 60 }, { d: 'Thu', mood: 66, calm: 64 },
  { d: 'Fri', mood: 78, calm: 70 }, { d: 'Sat', mood: 74, calm: 72 },
  { d: 'Sun', mood: 82, calm: 79 },
];
const EMOTION_SPLIT = [
  { name: 'Calm', value: 44, color: '#10b981' },
  { name: 'Anxious', value: 23, color: '#f43f5e' },
  { name: 'Focused', value: 21, color: '#6366f1' },
  { name: 'Low', value: 12, color: '#f59e0b' },
];
const ACTIVITY = [
  { d: 'M', v: 3 }, { d: 'T', v: 5 }, { d: 'W', v: 2 }, { d: 'T', v: 6 },
  { d: 'F', v: 4 }, { d: 'S', v: 7 }, { d: 'S', v: 5 },
];

/* ── Tooltip ── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
      style={{ background: 'rgba(8,10,18,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '10px 14px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
      <p style={{ margin: '0 0 3px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontFamily: S }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: p.color || p.stroke || '#fff', fontFamily: S }}>{p.name}: {typeof p.value === 'number' ? p.value + '%' : p.value}</p>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BENTO CARD — reusable container with hover lift + glow
   ══════════════════════════════════════════════════════════════ */
function BentoCard({ children, style, delay = 0, glow, onClick, span, rowSpan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? {
        y: -6,
        scale: 1.015,
        borderColor: glow ? `${glow}55` : 'rgba(255,255,255,0.16)',
        boxShadow: glow
          ? `0 28px 60px -12px ${glow}30, inset 0 1px 1px rgba(255,255,255,0.08)`
          : '0 28px 60px -12px rgba(0,0,0,0.8)',
        transition: { duration: 0.3, ease: 'easeOut' },
      } : undefined}
      onClick={onClick}
      style={{
        position: 'relative',
        background: glow
          ? `linear-gradient(145deg, ${glow}0a 0%, rgba(255,255,255,0.015) 50%, ${glow}05 100%)`
          : 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: glow ? `1px solid ${glow}22` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 28,
        padding: 24,
        boxShadow: '0 16px 40px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        gridColumn: span ? `span ${span}` : undefined,
        gridRow: rowSpan ? `span ${rowSpan}` : undefined,
        ...style,
      }}>
      {/* Shimmer top edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: glow ? `linear-gradient(90deg, transparent 5%, ${glow}40 50%, transparent 95%)` : 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.08) 50%, transparent 95%)', pointerEvents: 'none' }} />
      {children}
    </motion.div>
  );
}

/* ── Orbital Mood Ring ── */
function OrbitalMoodRing({ accent, moodScore }) {
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (moodScore / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      {/* Outer rotating ring */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px dashed ${accent}25` }} />
      {/* SVG ring */}
      <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
        <motion.circle cx="60" cy="60" r="52" fill="none" stroke={accent} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${accent}80)` }} />
      </svg>
      {/* Center content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.6 }}
          style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: S, lineHeight: 1, letterSpacing: '-1px' }}>
          {moodScore}
        </motion.span>
        <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontFamily: S, letterSpacing: '1.5px', marginTop: 2 }}>SCORE</span>
      </div>
    </div>
  );
}

/* ── Quick Insight Pill ── */
function InsightPill({ icon, label, value, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.4 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: '0.8rem' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: J, fontWeight: 500 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: S, lineHeight: 1.2 }}>{value}</p>
      </div>
    </motion.div>
  );
}

/* ── AI Command Card ── */
function AICommandCard({ name, sub, desc, color, robotExpr, delay, onClick }) {
  return (
    <BentoCard delay={delay} glow={color} onClick={onClick} style={{ padding: 20 }}>
      {/* Mesh gradient bg blob */}
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${color}40, transparent 70%)`, pointerEvents: 'none', filter: 'blur(20px)' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RobotAvatar expression={robotExpr} size="xs" glowColor={color} />
          </div>
          <motion.div whileHover={{ scale: 1.15, x: 3 }}
            style={{ width: 28, height: 28, borderRadius: '50%', background: `${color}10`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
            <FaPlay size={8} style={{ marginLeft: 1 }} />
          </motion.div>
        </div>
        <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.3px' }}>{name}</p>
        <p style={{ margin: '0 0 8px', fontSize: '0.6rem', color, fontFamily: S, letterSpacing: '2px', fontWeight: 700 }}>{sub}</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontFamily: J, lineHeight: 1.55 }}>{desc}</p>
      </div>
    </BentoCard>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EXACT REPLICA OF THE 4-CARD METRIC GRID FROM REFERENCE PHOTO
   ══════════════════════════════════════════════════════════════════ */
function MetricGraphGrid() {
  const lineData1 = [
    { d: '1', v: 45 }, { d: '2', v: 85 }, { d: '3', v: 55 }, { d: '4', v: 62 }, { d: '5', v: 40 }, { d: '6', v: 50 }
  ];
  const lineData2 = [
    { d: '1', v: 60 }, { d: '2', v: 45 }, { d: '3', v: 75 }, { d: '4', v: 65 }, { d: '5', v: 80 }, { d: '6', v: 92 }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
      
      {/* ── CARD 1: Hours worked (Line Graph + Green Triangle) ── */}
      <motion.div 
        whileHover={{ y: -4, borderColor: 'rgba(16, 185, 129, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '22px',
          padding: '22px 24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          minHeight: '210px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700', fontFamily: J }}>
          Hours worked
        </span>

        {/* Waveform Area */}
        <div style={{ width: '100%', height: '85px', margin: '8px 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData1}>
              <defs>
                <linearGradient id="gradHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke="#10b981" 
                strokeWidth={3} 
                fill="url(#gradHours)"
                dot={false}
                activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                style={{ filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.6))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: S }}>time</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: S }}>1680h</span>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#10b981', fontFamily: S }}>+4.33%</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: S, lineHeight: '1.0', letterSpacing: '-0.5px' }}>
            +269
          </div>
        </div>

        {/* GREEN TRIANGLE TAG (Bottom-Left Corner) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '18px',
          height: '18px',
          background: '#10b981',
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)'
        }} />
      </motion.div>

      {/* ── CARD 2: Facetalk Time (Line Graph + Red Triangle) ── */}
      <motion.div 
        whileHover={{ y: -4, borderColor: 'rgba(244, 63, 94, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '22px',
          padding: '22px 24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          minHeight: '210px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700', fontFamily: J }}>
          Facetalk Time
        </span>

        {/* Waveform Area */}
        <div style={{ width: '100%', height: '85px', margin: '8px 0' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData2}>
              <defs>
                <linearGradient id="gradFacetalk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                fill="url(#gradFacetalk)"
                dot={false}
                activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                style={{ filter: 'drop-shadow(0 4px 12px rgba(6, 182, 212, 0.6))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: S }}>time</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: S }}>320h</span>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f43f5e', fontFamily: S }}>-2.73%</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: S, lineHeight: '1.0', letterSpacing: '-0.5px' }}>
            76%
          </div>
        </div>

        {/* RED TRIANGLE TAG (Bottom-Left Corner) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '18px',
          height: '18px',
          background: '#f43f5e',
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
          boxShadow: '0 0 12px rgba(244, 63, 94, 0.8)'
        }} />
      </motion.div>

      {/* ── CARD 3: IBApps Website (Donut Ring + Green Triangle) ── */}
      <motion.div 
        whileHover={{ y: -4, borderColor: 'rgba(6, 182, 212, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '22px',
          padding: '22px 24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          minHeight: '210px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700', fontFamily: J }}>
          IBApps Website
        </span>

        {/* Circular Donut Area */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
          <div style={{ position: 'relative', width: '105px', height: '105px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="105" height="105" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="donutCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <circle cx="52.5" cy="52.5" r="42" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                cx="52.5" cy="52.5" r="42" 
                fill="transparent" 
                stroke="url(#donutCyan)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 42) * (1 - 0.76) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.7))' }}
              />
            </svg>
            <div style={{ position: 'absolute', fontSize: '1.6rem', fontWeight: '800', color: '#fff', fontFamily: S }}>
              76%
            </div>
          </div>
        </div>

        {/* GREEN TRIANGLE TAG (Bottom-Left Corner) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '18px',
          height: '18px',
          background: '#10b981',
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
          boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)'
        }} />
      </motion.div>

      {/* ── CARD 4: Exxon Mobile (Donut Ring + Red Triangle) ── */}
      <motion.div 
        whileHover={{ y: -4, borderColor: 'rgba(139, 92, 246, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(11, 15, 25, 0.95) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '22px',
          padding: '22px 24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          minHeight: '210px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700', fontFamily: J }}>
          Exxon Mobile
        </span>

        {/* Circular Donut Area */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px 0' }}>
          <div style={{ position: 'relative', width: '105px', height: '105px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="105" height="105" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="donutPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="52.5" cy="52.5" r="42" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                cx="52.5" cy="52.5" r="42" 
                fill="transparent" 
                stroke="url(#donutPurple)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 42) * (1 - 0.64) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.7))' }}
              />
            </svg>
            <div style={{ position: 'absolute', fontSize: '1.6rem', fontWeight: '800', color: '#fff', fontFamily: S }}>
              64%
            </div>
          </div>
        </div>

        {/* RED TRIANGLE TAG (Bottom-Left Corner) */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '18px',
          height: '18px',
          background: '#f43f5e',
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
          boxShadow: '0 0 12px rgba(244, 63, 94, 0.8)'
        }} />
      </motion.div>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD HOME — Redesigned Bento Grid
   ══════════════════════════════════════════════════════════════════ */
export default function DashboardHome({
  firstName, greeting, accent, accentB, accentBr,
  moodToday, setMoodToday, MOODS,
  setShowBreath, setTab, setActiveAI, consultants,
  journalCount = 0, sessionCount = 12,
}) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { once: true });
  const moodScore = useCountUp(82, 1600, inView);
  const streakCount = useCountUp(7, 1200, inView);
  const sessCount = useCountUp(sessionCount, 1400, inView);

  const hour = new Date().getHours();
  const timeEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : hour < 21 ? '🌆' : '🌙';

  return (
    <motion.div ref={rootRef} key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', padding: '20px 22px 40px' }}>

      {/* ── Ambient background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '5%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${accent}08, transparent 70%)`, filter: 'blur(80px)' }} />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ ROW 1: Hero Greeting + Mood Orbital ═══ */}
        <BentoCard delay={0.05} glow={accent} style={{ marginBottom: 20, padding: '28px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>

            {/* Left: Greeting + Mood check-in */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ margin: '0 0 4px', fontFamily: S, fontSize: '0.62rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                {timeEmoji} {(greeting || 'WELCOME').toUpperCase()}
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ margin: '0 0 4px', fontFamily: G, fontStyle: 'italic', fontWeight: 600, fontSize: '2.4rem', color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
                Welcome back, {firstName}
                <motion.span animate={{ rotate: [0, 18, -8, 18, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3 }}
                  style={{ display: 'inline-block', marginLeft: 10, fontSize: '1.8rem' }}>✨</motion.span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                style={{ margin: '0 0 18px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)', fontFamily: J, lineHeight: 1.5 }}>
                How are you feeling today? Let's track your emotional state.
              </motion.p>

              {/* Mood Buttons */}
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {MOODS.map((m, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.94 }}
                    onClick={() => setMoodToday(i)}
                    style={{
                      padding: '8px 16px', borderRadius: 28,
                      border: `1.5px solid ${moodToday === i ? accent : 'rgba(255,255,255,0.08)'}`,
                      background: moodToday === i ? `${accent}15` : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                      transition: 'all 0.25s', outline: 'none',
                      boxShadow: moodToday === i ? `0 6px 20px ${accent}25` : 'none',
                    }}>
                    <span style={{ fontSize: '1rem' }}>{m.e}</span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: moodToday === i ? accent : 'rgba(255,255,255,0.4)', fontFamily: J }}>{m.l}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Right: Orbital Mood Ring */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}>
              <OrbitalMoodRing accent={accent} moodScore={Math.round(moodScore)} />
            </motion.div>
          </div>
        </BentoCard>

        {/* ═══ ROW 2: Quick Insight Pills ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <InsightPill icon={<FaHeart size={13} />} label="Mood Score" value={`${Math.round(moodScore)}%`} color="#10b981" delay={0.18} />
          <InsightPill icon={<FaFire size={13} />} label="Day Streak" value={`${Math.round(streakCount)} days`} color="#f59e0b" delay={0.22} />
          <InsightPill icon={<FaSmile size={13} />} label="Sessions" value={`${Math.round(sessCount)}`} color="#6366f1" delay={0.26} />
          <InsightPill icon={<FaChartLine size={13} />} label="Journal" value={`${journalCount} logs`} color="#f43f5e" delay={0.30} />
        </div>

        {/* ═══ ROW 3: 4-CARD METRIC GRAPH GRID (EXACT DESIGN FROM USER'S PHOTO) ═══ */}
        <MetricGraphGrid />

        {/* ═══ ROW 4: AI Command Cards ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
          <AICommandCard name="Aura" sub="EMOTIONAL CORE" desc="Empathic reflections and emotional support." color="#ef4444" robotExpr="smile" delay={0.38}
            onClick={() => { setActiveAI('AURA'); setTab('chat'); }} />

          <AICommandCard name="Max" sub="COGNITIVE ENGINE" desc="Pattern analysis and structured solutions." color="#22c55e" robotExpr="neutral" delay={0.44}
            onClick={() => { setActiveAI('MAX'); setTab('chat'); }} />
        </div>

        {/* ═══ ROW 5: Activity + Emotion Mix + Brain Report CTA ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 20 }}>

          {/* Weekly Activity */}
          <BentoCard delay={0.48} glow={accent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative', zIndex: 2 }}>
              <div>
                <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>Activity</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: J }}>This week</p>
              </div>
              <motion.span whileHover={{ scale: 1.05 }} onClick={() => setShowBreath(true)}
                style={{ fontSize: '0.68rem', color: accent, fontWeight: 700, fontFamily: S, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: accentB, border: `1px solid ${accentBr}`, borderRadius: 20 }}>
                <FaWind size={10} /> Breathe
              </motion.span>
            </div>
            <div style={{ height: 150, marginLeft: -16, position: 'relative', zIndex: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ACTIVITY}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0.15} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'Space Grotesk' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }} width={18} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="v" name="Sessions" fill="url(#actGrad)" radius={[6, 6, 0, 0]} maxBarSize={24} isAnimationActive animationDuration={1400} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>

          {/* Emotion Mix Donut */}
          <BentoCard delay={0.52} glow="#6366f1">
            <p style={{ margin: '0 0 12px', fontFamily: J, fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', position: 'relative', zIndex: 2 }}>Emotion Mix</p>
            <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ width: 120, height: 120, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={EMOTION_SPLIT} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={55} paddingAngle={4} stroke="none" isAnimationActive animationDuration={1600}>
                      {EMOTION_SPLIT.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: S }}>44%</span>
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', fontFamily: J }}>Calm</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 10px', marginTop: 6, position: 'relative', zIndex: 2 }}>
              {EMOTION_SPLIT.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)', fontFamily: J }}>{e.name}</span>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.25)', fontFamily: S, marginLeft: 'auto' }}>{e.value}%</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Brain Report CTA */}
          <BentoCard delay={0.56} glow="#14b8a6" onClick={() => setTab('report')}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaBrain size={20} color="#14b8a6" />
                </div>
                <motion.div whileHover={{ x: 4 }} style={{ color: '#14b8a6', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, fontFamily: S }}>
                  Open <FaArrowRight size={10} />
                </motion.div>
              </div>
              <p style={{ margin: '0 0 4px', fontFamily: J, fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>Neural Report</p>
              <p style={{ margin: '0 0 14px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.4)', fontFamily: J, lineHeight: 1.5 }}>AI-powered brain activity analysis and emotional insights.</p>
            </div>
            {/* Mini brain visualization */}
            <div style={{ position: 'relative', zIndex: 2, height: 60, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {[35, 55, 42, 68, 50, 72, 45, 62, 38, 58, 48, 65].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                  transition={{ delay: 0.7 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ flex: 1, borderRadius: 3, background: `linear-gradient(to top, rgba(20,184,166,0.15), rgba(20,184,166,${0.3 + (h / 100) * 0.5}))` }} />
              ))}
            </div>
          </BentoCard>
        </div>

        {/* ═══ ROW 6: Experts + Recent Activity ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 18 }}>

          {/* Top Experts */}
          <BentoCard delay={0.6}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 2 }}>
              <div>
                <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>Top Experts</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: J }}>{consultants?.length || 0} available</p>
              </div>
              <motion.span whileHover={{ x: 3 }} onClick={() => setTab('consult')}
                style={{ fontSize: '0.68rem', color: accent, fontWeight: 700, fontFamily: S, cursor: 'pointer' }}>See all →</motion.span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
              {(consultants || []).slice(0, 4).map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.06 }}
                  whileHover={{ x: 4, background: 'rgba(255,255,255,0.03)' }}
                  style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', borderRadius: 14, transition: 'all 0.2s' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${c.color}40, ${c.color}15)`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: '0.72rem', color: c.color }}>
                    {(c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 1px', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: '0.64rem', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.spec}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b' }}>★{c.rating}</span>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.avail ? '#10b981' : 'rgba(255,255,255,0.12)', boxShadow: c.avail ? '0 0 8px rgba(16,185,129,0.5)' : 'none' }} />
                  </div>
                </motion.div>
              ))}
              {(!consultants || consultants.length === 0) && (
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontFamily: J, textAlign: 'center', padding: '16px 0' }}>No experts available yet</p>
              )}
            </div>
          </BentoCard>

          {/* Recent Activity */}
          <BentoCard delay={0.64}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative', zIndex: 2 }}>
              <div>
                <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>Recent Activity</p>
                <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: J }}>Your latest interactions</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', zIndex: 2 }}>
              {[
                { icon: '💬', label: 'Chat with Aura', meta: 'Emotional check-in', time: '2h ago', tag: 'Completed', tagColor: '#10b981' },
                { icon: '🧘', label: 'Calm Morning meditation', meta: '5 min session', time: '5h ago', tag: 'Completed', tagColor: '#10b981' },
                { icon: '📓', label: 'Journal entry', meta: 'Evening reflection', time: '1d ago', tag: 'Saved', tagColor: '#6366f1' },
                { icon: '🧠', label: 'Brain Report generated', meta: 'Stress down 12%', time: '2d ago', tag: 'Insight', tagColor: '#0ea5e9' },
              ].map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.06 }}
                  whileHover={{ x: 4, background: 'rgba(255,255,255,0.025)' }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 14, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'all 0.2s' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 1px', fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.88)', fontFamily: J }}>{a.label}</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontFamily: J }}>{a.meta}</p>
                  </div>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.25)', fontFamily: S, flexShrink: 0 }}>{a.time}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: a.tagColor, background: `${a.tagColor}10`, border: `1px solid ${a.tagColor}20`, padding: '3px 10px', borderRadius: 24, fontFamily: J, flexShrink: 0 }}>{a.tag}</span>
                </motion.div>
              ))}
            </div>
          </BentoCard>

        </div>
      </div>
    </motion.div>
  );
}

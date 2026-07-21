import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowUp, FaArrowDown, FaBrain, FaArrowRight, FaWind, FaRobot,
  FaBolt, FaHeart, FaFire, FaSmile, FaChartLine, FaPlay, FaSlidersH, FaSync, FaRobot as FaBot
} from 'react-icons/fa';
import RobotAvatar from './RobotAvatar';

/* ── Font stacks ── */
const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";

/* ══════════════════════════════════════════════════════════════════
   AUTOMATED SYMMETRIC RESPONSE GRAPH
   - Auto-syncs with AI Chat sentiment (stress/negativity -> downward valley, calm/positivity -> upward peak)
   - X-axis: Stimulus Intensity | Y-axis: Resonance Response
   - Mirror symmetry about Y-axis (x = 0)
   ══════════════════════════════════════════════════════════════════ */
function SymmetricResponseGraph({ chatSentimentIntensity = 0 }) {
  // Use chat sentiment intensity if available, or fallback to saved / default
  const [intensity, setIntensity] = useState(() => {
    if (chatSentimentIntensity !== 0) return chatSentimentIntensity;
    try {
      const saved = localStorage.getItem('equilibrium_chat_intensity');
      return saved ? parseFloat(saved) : 70;
    } catch {
      return 70;
    }
  });

  // Auto-update intensity when chat sentiment changes
  useEffect(() => {
    if (chatSentimentIntensity !== 0) {
      setIntensity(chatSentimentIntensity);
      try {
        localStorage.setItem('equilibrium_chat_intensity', chatSentimentIntensity.toString());
      } catch {}
    }
  }, [chatSentimentIntensity]);

  const width = 640;
  const height = 260;
  const cx = width / 2; // 320 (X=0 origin)
  const cy = height / 2; // 130 (Y=0 origin)
  const xSpan = 240; // X axis length on each side

  // Calculate SVG Path for symmetric Gaussian response curve
  // y(x) = cy - A * exp(-(x / sigma)^2)
  const amplitude = (intensity / 100) * 85; // Scale height/depth to max 85px
  const sigma = 70; // Width of the response bell

  const points = [];
  const numSteps = 120;
  for (let i = 0; i <= numSteps; i++) {
    const xRel = -xSpan + (i / numSteps) * (2 * xSpan); // x from -240 to +240
    const yRel = amplitude * Math.exp(-Math.pow(xRel / sigma, 2));
    const svgX = cx + xRel;
    const svgY = cy - yRel; // SVG Y goes downward, so subtract peak
    points.push({ x: svgX, y: svgY });
  }

  // Build line path string
  const lineD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`, '');

  // Build closed area path string for gradient fill
  const areaD = `${lineD} L ${cx + xSpan} ${cy} L ${cx - xSpan} ${cy} Z`;

  // Curve Status Labels
  const isPositive = intensity > 5;
  const isNegative = intensity < -5;
  const statusLabel = isPositive
    ? 'Constructive Amplification (+ Peak)'
    : isNegative
    ? 'Destructive Inversion (- Valley)'
    : 'Equilibrium Baseline (Flat)';

  const statusColor = isPositive ? '#00e5ff' : isNegative ? '#f43f5e' : '#a855f7';

  return (
    <div style={{
      background: '#0a0c12',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '24px 26px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 10px ${statusColor}` }} />
            <h3 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', letterSpacing: '-0.3px' }}>
              Automated Session Response Function
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: J }}>
            Horizontal Axis (X): Stimulus Intensity &nbsp;|&nbsp; Vertical Axis (Y): Resonance Response
          </p>
        </div>

        {/* Real-time AI Sentiment Sync Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {chatSentimentIntensity !== 0 && (
            <div style={{
              padding: '4px 10px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.68rem',
              fontWeight: 800,
              fontFamily: S,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <FaBot size={10} /> Live Chat Sentiment Sync
            </div>
          )}

          <div style={{
            padding: '6px 14px',
            borderRadius: '20px',
            background: `${statusColor}12`,
            border: `1px solid ${statusColor}30`,
            color: statusColor,
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: S,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {isPositive ? '▲ ' : isNegative ? '▼ ' : '● '}
            {statusLabel}
          </div>
        </div>
      </div>

      {/* SVG Canvas for Axes & Curve */}
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <defs>
            {/* Fill Gradient */}
            <linearGradient id="symmetricGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={statusColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={statusColor} stopOpacity={0.0} />
            </linearGradient>

            {/* Crisp glow filter */}
            <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dotted Grid Background */}
          <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="rgba(255, 255, 255, 0.05)" />
          </pattern>
          <rect width={width} height={height} fill="url(#dotGrid)" />

          {/* X Axis (Horizontal) */}
          <line x1={40} y1={cy} x2={width - 40} y2={cy} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          {/* X Axis Arrow Head */}
          <polygon points={`${width - 35},${cy} ${width - 43},${cy - 4} ${width - 43},${cy + 4}`} fill="rgba(255, 255, 255, 0.5)" />

          {/* Y Axis (Vertical - Mirror Symmetry Line) */}
          <line x1={cx} y1={height - 20} x2={cx} y2={20} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Y Axis Arrow Head */}
          <polygon points={`${cx},15 ${cx - 4},23 ${cx + 4},23`} fill="rgba(255, 255, 255, 0.5)" />

          {/* X Axis Dotted Ticks & Labels */}
          {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((val) => {
            const xPos = cx + val;
            return (
              <g key={`x-tick-${val}`}>
                <line x1={xPos} y1={cy - 4} x2={xPos} y2={cy + 4} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                <text x={xPos} y={cy + 16} fill="rgba(255, 255, 255, 0.35)" fontSize="9" fontFamily={S} textAnchor="middle">
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Y Axis Dotted Ticks & Labels */}
          {[-80, -40, 40, 80].map((val) => {
            const yPos = cy - val;
            return (
              <g key={`y-tick-${val}`}>
                <line x1={cx - 4} y1={yPos} x2={cx + 4} y2={yPos} stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                <text x={cx - 10} y={yPos + 3} fill="rgba(255, 255, 255, 0.35)" fontSize="9" fontFamily={S} textAnchor="end">
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Origin Label (0, 0) */}
          <text x={cx + 10} y={cy - 8} fill="rgba(255, 255, 255, 0.4)" fontSize="10" fontFamily={S} fontWeight="700">
            (0,0)
          </text>

          {/* Axis Title Labels */}
          <text x={width - 40} y={cy - 10} fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontFamily={S} fontWeight="700" textAnchor="end">
            +X Stimulus
          </text>
          <text x={40} y={cy - 10} fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontFamily={S} fontWeight="700" textAnchor="start">
            -X Stimulus
          </text>
          <text x={cx + 10} y={30} fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontFamily={S} fontWeight="700">
            +Y Amplification
          </text>
          <text x={cx + 10} y={height - 10} fill="rgba(255, 255, 255, 0.6)" fontSize="10" fontFamily={S} fontWeight="700">
            -Y Inversion
          </text>

          {/* Filled Area Under Curve */}
          <motion.path
            d={areaD}
            fill="url(#symmetricGrad)"
            initial={false}
            animate={{ d: areaD }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Main Curve Stroke */}
          <motion.path
            d={lineD}
            fill="none"
            stroke={statusColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#crispGlow)"
            initial={false}
            animate={{ d: lineD }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Center Peak Highlight Dot */}
          <motion.circle
            cx={cx}
            cy={cy - amplitude}
            r="5"
            fill="#ffffff"
            stroke={statusColor}
            strokeWidth="2.5"
            initial={false}
            animate={{ cy: cy - amplitude }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${statusColor})` }}
          />
        </svg>
      </div>

      {/* 100% Automated Readout Footer */}
      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Automated System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: S, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaBot size={12} color="#38bdf8" /> Automated Response Engine:
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: statusColor, fontFamily: S }}>
            {intensity > 0 ? `+${intensity} (Amplified Peak)` : intensity < 0 ? `${intensity} (Inverted Valley)` : '0 (Neutral Baseline)'}
          </span>
        </div>

        {/* Readout Metrics */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: S }}>
            Peak Amplitude: <b style={{ color: '#fff' }}>{Math.abs(amplitude).toFixed(1)} px</b>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: S }}>
            Mirror Symmetry: <b style={{ color: '#10b981' }}>100% Exact</b>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MINIMALIST CLEAN SAAS METRIC CARD (Clean SaaS Aesthetic from Photo 2)
   ══════════════════════════════════════════════════════════════════ */
function CleanSaaSMetricCard({ title, value, subtext, tag, tagColor, icon }) {
  return (
    <div style={{
      background: '#0a0c12',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      padding: '20px 22px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.45)', fontWeight: '600', fontFamily: J }}>
          {title}
        </span>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
          {icon}
        </div>
      </div>

      <div style={{ margin: '8px 0' }}>
        <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', fontFamily: S, lineHeight: 1 }}>
          {value}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.35)', fontFamily: J }}>
          {subtext}
        </span>
        <span style={{ fontSize: '0.68rem', fontWeight: '800', color: tagColor, background: `${tagColor}15`, padding: '3px 9px', borderRadius: '12px', fontFamily: S }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD HOME — Ultra-Clean Real SaaS Aesthetic
   ══════════════════════════════════════════════════════════════════ */
export default function DashboardHome({
  firstName, greeting, accent,
  moodToday, setMoodToday, MOODS,
  setShowBreath, setTab, setActiveAI, consultants,
  journalCount = 0, sessionCount = 12,
  chatSentimentIntensity = 0,
}) {
  const hour = new Date().getHours();
  const timeEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : hour < 21 ? '<ctrl42>' : '🌙';

  return (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', padding: '22px 26px 40px', background: '#06070a' }}>

      {/* ══ Header Row ══ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ margin: '0 0 3px', fontFamily: S, fontSize: '0.68rem', letterSpacing: '2.5px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 700 }}>
            {timeEmoji} {(greeting || 'WELCOME').toUpperCase()}
          </p>
          <h1 style={{ margin: 0, fontFamily: G, fontStyle: 'italic', fontWeight: 600, fontSize: '2.3rem', color: '#fff', letterSpacing: '-0.5px' }}>
            Welcome back, {firstName} ✨
          </h1>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowBreath(true)}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: J,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaWind size={11} color={accent} /> Breath Session
          </button>
          <button
            onClick={() => setTab('chat')}
            style={{
              padding: '9px 18px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${accent}, #8b5cf6)`,
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 800,
              fontFamily: J,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaRobot size={12} /> Talk to AI
          </button>
        </div>
      </div>

      {/* ══ FEATURED: AUTOMATED SYMMETRIC RESPONSE GRAPH ══ */}
      <SymmetricResponseGraph chatSentimentIntensity={chatSentimentIntensity} />

      {/* ══ CLEAN SAAS METRICS GRID ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <CleanSaaSMetricCard title="Emotional Resonance" value={chatSentimentIntensity !== 0 ? `${chatSentimentIntensity > 0 ? '+' : ''}${chatSentimentIntensity}` : "84%"} subtext={chatSentimentIntensity < 0 ? "Down Inversion" : "Constructive peak"} tag={chatSentimentIntensity < 0 ? "Stress Detected" : "Calm Synced"} tagColor={chatSentimentIntensity < 0 ? "#f43f5e" : "#10b981"} icon={<FaHeart color={chatSentimentIntensity < 0 ? "#f43f5e" : "#10b981"} />} />
        <CleanSaaSMetricCard title="Active Day Streak" value="7 Days" subtext="Consistent check-ins" tag="Active" tagColor="#f59e0b" icon={<FaFire color="#f59e0b" />} />
        <CleanSaaSMetricCard title="AI Therapy Sessions" value={sessionCount} subtext="Aura & Max engine" tag="Completed" tagColor="#6366f1" icon={<FaSmile color="#6366f1" />} />
        <CleanSaaSMetricCard title="Mindfulness Logs" value={journalCount} subtext="Reflections stored" tag="Saved" tagColor="#00e5ff" icon={<FaChartLine color="#00e5ff" />} />
      </div>

      {/* ══ AI ENGINE QUICK LAUNCH & EXPERTS ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '18px' }}>
        
        {/* AI Co-Pilots */}
        <div style={{ background: '#0a0c12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>AI Co-Pilots</h4>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: S }}>2 Engines Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              onClick={() => { setActiveAI('AURA'); setTab('chat'); }}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <RobotAvatar expression="smile" size="xs" glowColor="#ef4444" />
                <span style={{ fontSize: '0.62rem', color: '#ef4444', fontWeight: 800, fontFamily: S }}>EMOTIONAL CORE</span>
              </div>
              <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Aura AI</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: J }}>Empathic reflections & support</p>
            </div>

            <div
              onClick={() => { setActiveAI('MAX'); setTab('chat'); }}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(34, 197, 94, 0.04)',
                border: '1px solid rgba(34, 197, 94, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <RobotAvatar expression="neutral" size="xs" glowColor="#22c55e" />
                <span style={{ fontSize: '0.62rem', color: '#22c55e', fontWeight: 800, fontFamily: S }}>COGNITIVE ENGINE</span>
              </div>
              <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Max AI</p>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: J }}>Structured cognitive analysis</p>
            </div>
          </div>
        </div>

        {/* Recommended Experts */}
        <div style={{ background: '#0a0c12', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h4 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>Top Therapists</h4>
            <span onClick={() => setTab('consult')} style={{ fontSize: '0.7rem', color: accent, fontWeight: 700, fontFamily: S, cursor: 'pointer' }}>View All →</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(consultants || []).slice(0, 3).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${c.color}20`, border: `1px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color: c.color }}>
                  {(c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: '0.64rem', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.spec}</p>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b' }}>★{c.rating}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

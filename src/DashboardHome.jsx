import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowUp, FaArrowDown, FaBrain, FaArrowRight, FaWind, FaRobot,
  FaBolt, FaHeart, FaFire, FaSmile, FaChartLine, FaPlay, FaChevronDown, FaRobot as FaBot, FaSlidersH
} from 'react-icons/fa';
import RobotAvatar from './RobotAvatar';

/* ── Font stacks ── */
const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";

/* ══════════════════════════════════════════════════════════════════
   DYNAMIC SYMMETRIC RESPONSE GRAPH
   - Horizontal Axis (X): Stimulus / Intensity (Left: -X, Right: +X)
   - Vertical Axis (Y): Resonance Response (Up: +Y Amplification, Down: -Y Inversion)
   - Positive Values: Constructive Amplification peak _/|\_
   - Negative Values: Destructive Inversion valley _\|/_
   - Zero Baseline: Flat
   - Perfect Left-Right Mirror Symmetry about Y-axis (x = 0)
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

  const width = 720;
  const height = 280;
  const cx = width / 2; // 360 (X=0 origin)
  const cy = height / 2; // 140 (Y=0 origin)
  const xSpan = 280; // X axis length on each side

  // Calculate SVG Path for symmetric Gaussian response curve
  // y(x) = cy - A * exp(-(x / sigma)^2)
  const amplitude = (intensity / 100) * 95; // Scale height/depth proportionally to max 95px
  const sigma = 75; // Width of the response bell curve

  const points = [];
  const numSteps = 140;
  for (let i = 0; i <= numSteps; i++) {
    const xRel = -xSpan + (i / numSteps) * (2 * xSpan); // x from -280 to +280
    const yRel = amplitude * Math.exp(-Math.pow(xRel / sigma, 2));
    const svgX = cx + xRel;
    const svgY = cy - yRel; // SVG Y goes downward, so subtract peak
    points.push({ x: svgX, y: svgY });
  }

  // Build smooth curve line path string
  const lineD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`, '');

  // Build closed area path string for gradient fill
  const areaD = `${lineD} L ${cx + xSpan} ${cy} L ${cx - xSpan} ${cy} Z`;

  // Curve Status & Classification
  const isPositive = intensity > 5;
  const isNegative = intensity < -5;
  const statusLabel = isPositive
    ? 'Constructive Amplification (+ Mountain Peak)'
    : isNegative
    ? 'Destructive Inversion (- Valley Drop)'
    : 'Equilibrium Baseline (Flat)';

  const statusColor = isPositive ? '#00e5ff' : isNegative ? '#f43f5e' : '#a855f7';

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, rgba(12, 16, 26, 0.85) 0%, rgba(6, 9, 16, 0.98) 100%)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: `2px solid ${statusColor}`,
      borderRadius: '28px',
      padding: '26px 30px',
      boxShadow: `0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 15px 35px -10px ${statusColor}33, inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
      marginBottom: '26px',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 12px ${statusColor}` }} />
            <h3 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '1.2rem', color: '#f8fafc', letterSpacing: '-0.3px' }}>
              Automated Symmetric Response Function
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: J }}>
            Horizontal Axis (X): Stimulus Intensity &nbsp;|&nbsp; Vertical Axis (Y): Resonance Response &nbsp;|&nbsp; Mirror Symmetry about X = 0
          </p>
        </div>

        {/* Status Tag & Live Sync Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {chatSentimentIntensity !== 0 && (
            <div style={{
              padding: '5px 12px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.7rem',
              fontWeight: 800,
              fontFamily: S,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FaBot size={11} /> Live Sentiment Sync
            </div>
          )}

          <div style={{
            padding: '7px 16px',
            borderRadius: '24px',
            background: `${statusColor}15`,
            border: `1px solid ${statusColor}35`,
            color: statusColor,
            fontSize: '0.78rem',
            fontWeight: 800,
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

      {/* Main Vector SVG Graph Canvas */}
      <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', position: 'relative', margin: '10px 0' }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <defs>
            {/* Fill Gradient */}
            <linearGradient id="symmetricGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={statusColor} stopOpacity={0.38} />
              <stop offset="100%" stopColor={statusColor} stopOpacity={0.0} />
            </linearGradient>

            {/* Crisp glow filter */}
            <filter id="crispGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dotted Grid Background */}
          <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1" fill="rgba(255, 255, 255, 0.05)" />
          </pattern>
          <rect width={width} height={height} fill="url(#dotGrid)" />

          {/* X Axis (Horizontal Stimulus Line) */}
          <line x1={30} y1={cy} x2={width - 30} y2={cy} stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.8" />
          {/* X Axis Arrow Heads */}
          <polygon points={`${width - 25},${cy} ${width - 34},${cy - 4} ${width - 34},${cy + 4}`} fill="rgba(255, 255, 255, 0.6)" />
          <polygon points={`25,${cy} 34,${cy - 4} 34,${cy + 4}`} fill="rgba(255, 255, 255, 0.6)" />

          {/* Y Axis (Vertical - Mirror Symmetry Line at X = 0) */}
          <line x1={cx} y1={height - 15} x2={cx} y2={15} stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.8" strokeDasharray="4 3" />
          {/* Y Axis Arrow Heads */}
          <polygon points={`${cx},10 ${cx - 4},18 ${cx + 4},18`} fill="rgba(255, 255, 255, 0.6)" />
          <polygon points={`${cx},${height - 10} ${cx - 4},${height - 18} ${cx + 4},${height - 18}`} fill="rgba(255, 255, 255, 0.6)" />

          {/* X Axis Ticks & Labels */}
          {[-250, -200, -150, -100, -50, 0, 50, 100, 150, 200, 250].map((val) => {
            const xPos = cx + val;
            return (
              <g key={`x-tick-${val}`}>
                <line x1={xPos} y1={cy - 4} x2={xPos} y2={cy + 4} stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
                <text x={xPos} y={cy + 18} fill="rgba(255, 255, 255, 0.4)" fontSize="9.5" fontFamily={S} textAnchor="middle" fontWeight="600">
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Y Axis Ticks & Labels */}
          {[-80, -40, 40, 80].map((val) => {
            const yPos = cy - val;
            return (
              <g key={`y-tick-${val}`}>
                <line x1={cx - 4} y1={yPos} x2={cx + 4} y2={yPos} stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
                <text x={cx - 10} y={yPos + 3} fill="rgba(255, 255, 255, 0.4)" fontSize="9.5" fontFamily={S} textAnchor="end" fontWeight="600">
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* (0,0) Origin Marker */}
          <text x={cx + 10} y={cy - 8} fill="rgba(255, 255, 255, 0.45)" fontSize="10" fontFamily={S} fontWeight="800">
            (0,0) Baseline
          </text>

          {/* Axis Descriptive Titles */}
          <text x={width - 30} y={cy - 12} fill="rgba(255, 255, 255, 0.65)" fontSize="10.5" fontFamily={S} fontWeight="800" textAnchor="end">
            +X Stimulus
          </text>
          <text x={30} y={cy - 12} fill="rgba(255, 255, 255, 0.65)" fontSize="10.5" fontFamily={S} fontWeight="800" textAnchor="start">
            -X Stimulus
          </text>
          <text x={cx + 12} y={24} fill="#00e5ff" fontSize="10.5" fontFamily={S} fontWeight="800">
            +Y Amplification
          </text>
          <text x={cx + 12} y={height - 18} fill="#f43f5e" fontSize="10.5" fontFamily={S} fontWeight="800">
            -Y Inversion
          </text>

          {/* Filled Area Under Curve */}
          <motion.path
            d={areaD}
            fill="url(#symmetricGrad)"
            initial={false}
            animate={{ d: areaD }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />

          {/* Main Curve Line (White High Contrast) */}
          <motion.path
            d={lineD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#crispGlow)"
            initial={false}
            animate={{ d: lineD }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />

          {/* Center Peak Highlight Node Dot */}
          <motion.circle
            cx={cx}
            cy={cy - amplitude}
            r="6"
            fill="#ffffff"
            stroke={statusColor}
            strokeWidth="3"
            initial={false}
            animate={{ cy: cy - amplitude }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 10px ${statusColor})` }}
          />
        </svg>
      </div>

      {/* Interactive Controls & Automated Readout Footer */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Automated System Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: S, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaBot size={13} color="#38bdf8" /> Automated Response Engine:
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: statusColor, fontFamily: S }}>
            {intensity > 0 ? `+${intensity} (Amplified Peak)` : intensity < 0 ? `${intensity} (Inverted Valley)` : '0 (Neutral Baseline)'}
          </span>
        </div>

        {/* Metric Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: S }}>
            Peak Amplitude: <b style={{ color: '#fff' }}>{Math.abs(amplitude).toFixed(1)} px</b>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: S }}>
            Mirror Symmetry: <b style={{ color: '#10b981' }}>100% Exact</b>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MINIMALIST CLEAN SAAS METRIC CARD
   ══════════════════════════════════════════════════════════════════ */
function CleanSaaSMetricCard({ title, value, subtext, tag, tagColor, icon }) {
  return (
    <div style={{
      background: 'rgba(10, 12, 18, 0.85)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '22px',
      padding: '20px 22px',
      boxShadow: '0 14px 34px rgba(0, 0, 0, 0.45)',
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
        <div style={{ width: 34, height: 34, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
          {icon}
        </div>
      </div>

      <div style={{ margin: '8px 0' }}>
        <div style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ffffff', fontFamily: S, lineHeight: 1 }}>
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
   DASHBOARD HOME
   ══════════════════════════════════════════════════════════════════ */
export default function DashboardHome({
  firstName, greeting, accent,
  moodToday, setMoodToday, MOODS,
  setShowBreath, setTab, setActiveAI, consultants,
  journalCount = 0, sessionCount = 12,
  chatSentimentIntensity = 0,
}) {
  const hour = new Date().getHours();
  const timeEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : hour < 21 ? '🌆' : '🌙';

  const sentimentVal = chatSentimentIntensity !== 0 ? chatSentimentIntensity : 70;

  return (
    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', padding: '22px 28px 45px', background: '#05070c' }}>

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
              padding: '10px 18px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: J,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaWind size={12} color={accent} /> Breath Session
          </button>
          <button
            onClick={() => setTab('chat')}
            style={{
              padding: '10px 20px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${accent}, #8b5cf6)`,
              border: 'none',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: J,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            <FaRobot size={13} /> Talk to AI
          </button>
        </div>
      </div>

      {/* ══ FEATURED: DYNAMIC SYMMETRIC RESPONSE GRAPH ══ */}
      <SymmetricResponseGraph chatSentimentIntensity={chatSentimentIntensity} />

      {/* ══ CLEAN SAAS METRICS GRID ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '26px' }}>
        <CleanSaaSMetricCard title="Emotional Resonance" value={`${sentimentVal > 0 ? '+' : ''}${sentimentVal}`} subtext={sentimentVal < 0 ? "Destructive Inversion" : "Constructive Peak"} tag={sentimentVal < 0 ? "Valley Drop" : "Peak Synced"} tagColor={sentimentVal < 0 ? "#f43f5e" : "#00e5ff"} icon={<FaHeart color={sentimentVal < 0 ? "#f43f5e" : "#00e5ff"} />} />
        <CleanSaaSMetricCard title="Active Day Streak" value="7 Days" subtext="Consistent check-ins" tag="Active" tagColor="#f59e0b" icon={<FaFire color="#f59e0b" />} />
        <CleanSaaSMetricCard title="AI Therapy Sessions" value={sessionCount} subtext="Aura & Max engines" tag="Completed" tagColor="#6366f1" icon={<FaSmile color="#6366f1" />} />
        <CleanSaaSMetricCard title="Mindfulness Logs" value={journalCount} subtext="Reflections stored" tag="Saved" tagColor="#10b981" icon={<FaChartLine color="#10b981" />} />
      </div>

      {/* ══ AI ENGINE QUICK LAUNCH & EXPERTS ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        
        {/* AI Co-Pilots */}
        <div style={{ background: 'rgba(10, 12, 18, 0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h4 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '0.98rem', color: '#fff' }}>AI Co-Pilots</h4>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: S }}>2 Engines Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div
              onClick={() => { setActiveAI('AURA'); setTab('chat'); }}
              style={{
                padding: '18px',
                borderRadius: '18px',
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.18)',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <RobotAvatar expression="smile" size="xs" glowColor="#ef4444" />
                <span style={{ fontSize: '0.62rem', color: '#ef4444', fontWeight: 800, fontFamily: S }}>EMOTIONAL CORE</span>
              </div>
              <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>Aura AI</p>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', fontFamily: J }}>Empathic reflections & support</p>
            </div>

            <div
              onClick={() => { setActiveAI('MAX'); setTab('chat'); }}
              style={{
                padding: '18px',
                borderRadius: '18px',
                background: 'rgba(34, 197, 94, 0.04)',
                border: '1px solid rgba(34, 197, 94, 0.18)',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <RobotAvatar expression="neutral" size="xs" glowColor="#22c55e" />
                <span style={{ fontSize: '0.62rem', color: '#22c55e', fontWeight: 800, fontFamily: S }}>COGNITIVE ENGINE</span>
              </div>
              <p style={{ margin: '0 0 2px', fontFamily: J, fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>Max AI</p>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', fontFamily: J }}>Structured cognitive analysis</p>
            </div>
          </div>
        </div>

        {/* Recommended Experts */}
        <div style={{ background: 'rgba(10, 12, 18, 0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '0.98rem', color: '#fff' }}>Top Therapists</h4>
            <span onClick={() => setTab('consult')} style={{ fontSize: '0.72rem', color: accent, fontWeight: 700, fontFamily: S, cursor: 'pointer' }}>View All →</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {(consultants || []).slice(0, 3).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${c.color}20`, border: `1px solid ${c.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', color: c.color }}>
                  {(c.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: '0.66rem', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.spec}</p>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b' }}>★{c.rating}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}

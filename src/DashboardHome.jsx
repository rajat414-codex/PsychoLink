import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowUp, FaArrowDown, FaBrain, FaArrowRight, FaWind, FaRobot,
  FaBolt, FaHeart, FaFire, FaSmile, FaChartLine, FaPlay, FaChevronDown, FaRobot as FaBot
} from 'react-icons/fa';
import RobotAvatar from './RobotAvatar';

/* ── Font stacks ── */
const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";

/* ══════════════════════════════════════════════════════════════════
   LUXURY GLASSMORPHISM TRACKING GRAPH (Matching Image Aesthetic)
   - Deep dark translucent glass panel with electric bottom neon glow
   - High-contrast smooth vector curve with white glowing nodes
   - Vertical guideline drop-lines
   - Large centered metric overlay (e.g., 78%)
   - Sleek dropdown controls
   ══════════════════════════════════════════════════════════════════ */
function TrackDownGraphCard({
  title,
  subtext,
  valueText,
  valueLabel,
  description,
  accentColor = '#0088ff',
  glowColor = 'rgba(0, 140, 255, 0.4)',
  pointsData = [25, 52, 42, 78, 92],
  timeframe = 'Month',
  onTimeframeChange,
  liveSync = false
}) {
  const [selectedFrame, setSelectedFrame] = useState(timeframe);

  // Generate SVG cubic bezier path for smooth curve
  const width = 500;
  const height = 220;
  const paddingX = 30;
  const paddingY = 40;

  const minVal = Math.min(...pointsData) - 10;
  const maxVal = Math.max(...pointsData) + 10;

  const pts = pointsData.map((val, idx) => {
    const x = paddingX + (idx / (pointsData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y, val };
  });

  // Calculate smooth cubic bezier path
  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  // Area under curve
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, rgba(12, 16, 26, 0.75) 0%, rgba(6, 9, 16, 0.95) 100%)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderBottom: `2px solid ${accentColor}`,
      borderRadius: '28px',
      padding: '24px 28px',
      boxShadow: `0 24px 60px -10px rgba(0, 0, 0, 0.8), 0 15px 30px -10px ${glowColor}, inset 0 1px 1px rgba(255, 255, 255, 0.1)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: '600', fontFamily: J }}>
            {title}
          </span>
          {liveSync && (
            <span style={{ marginLeft: '10px', padding: '3px 8px', borderRadius: '10px', background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, fontSize: '0.65rem', fontWeight: 800, fontFamily: S }}>
              ● LIVE SYNC
            </span>
          )}
        </div>

        {/* Sleek Pill Dropdown */}
        <div style={{
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.74rem',
          fontFamily: J,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer'
        }}>
          {selectedFrame} <FaChevronDown size={9} color="rgba(255,255,255,0.5)" />
        </div>
      </div>

      {/* Main Vector Graph Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '220px', margin: '10px 0' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <defs>
            {/* Soft Ambient Fill Gradient under line */}
            <linearGradient id={`areaGrad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity={0.18} />
              <stop offset="100%" stopColor={accentColor} stopOpacity={0.0} />
            </linearGradient>

            {/* White Glow Filter for Nodes */}
            <filter id="whiteGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Vertical Drop-lines from points down to baseline */}
          {pts.map((pt, i) => (
            <line
              key={`drop-${i}`}
              x1={pt.x}
              y1={pt.y}
              x2={pt.x}
              y2={height - 10}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          ))}

          {/* Area Fill */}
          <path d={areaD} fill={`url(#areaGrad-${title.replace(/\s+/g, '')})`} />

          {/* Crisp White Curve Line (Matching Image) */}
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.3))' }}
          />

          {/* White Glowing Node Dots */}
          {pts.map((pt, i) => (
            <circle
              key={`node-${i}`}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="2"
              filter="url(#whiteGlow)"
            />
          ))}
        </svg>

        {/* Center Overlaid Metric Percentage Display */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 5
        }}>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.55)', fontFamily: J, fontWeight: 600, marginBottom: '2px' }}>
            {valueLabel}
          </div>
          <div style={{
            fontSize: '3.2rem',
            fontWeight: '800',
            color: '#ffffff',
            fontFamily: S,
            lineHeight: 1,
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {valueText}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: J, marginTop: '6px', maxWidth: '280px' }}>
            {description}
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
      background: 'rgba(10, 12, 18, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '22px',
      padding: '20px 22px',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
   DASHBOARD HOME — Redesigned Panel Layout
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

  const sentimentVal = chatSentimentIntensity !== 0 ? chatSentimentIntensity : 78;
  const sentimentGraphData = chatSentimentIntensity < 0
    ? [60, 45, 30, 20, Math.max(10, 50 + chatSentimentIntensity)]
    : [35, 50, 45, 68, Math.min(95, 60 + (sentimentVal * 0.35))];

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

      {/* ══ 2 TRACKING GRAPHS PANEL (Full Width Screen Ratio) ══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        marginBottom: '26px',
        width: '100%'
      }}>
        {/* Graph 1: Emotional Resonance & Live Sentiment Track */}
        <TrackDownGraphCard
          title="Emotional Resonance Track"
          valueLabel="Resonance Score"
          valueText={`${sentimentVal > 0 ? '+' : ''}${sentimentVal}%`}
          description="Real-time sentiment progression tracked via AI consultation"
          accentColor="#0088ff"
          glowColor="rgba(0, 136, 255, 0.35)"
          pointsData={sentimentGraphData}
          timeframe="Month"
          liveSync={chatSentimentIntensity !== 0}
        />

        {/* Graph 2: Cognitive Stability & Calm Index Track */}
        <TrackDownGraphCard
          title="Cognitive Calm Index"
          valueLabel="Stability Index"
          valueText="92%"
          description="Continuous neurological stability & stress reduction curve"
          accentColor="#7c3aed"
          glowColor="rgba(124, 58, 237, 0.35)"
          pointsData={[30, 48, 62, 75, 92]}
          timeframe="Weekly"
        />
      </div>

      {/* ══ CLEAN SAAS METRICS GRID ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '26px' }}>
        <CleanSaaSMetricCard title="Emotional Resonance" value={`${sentimentVal > 0 ? '+' : ''}${sentimentVal}%`} subtext={sentimentVal < 0 ? "Stress Inversion" : "Constructive Peak"} tag={sentimentVal < 0 ? "Stress Alert" : "Calm Synced"} tagColor={sentimentVal < 0 ? "#f43f5e" : "#10b981"} icon={<FaHeart color={sentimentVal < 0 ? "#f43f5e" : "#10b981"} />} />
        <CleanSaaSMetricCard title="Active Day Streak" value="7 Days" subtext="Consistent check-ins" tag="Active" tagColor="#f59e0b" icon={<FaFire color="#f59e0b" />} />
        <CleanSaaSMetricCard title="AI Therapy Sessions" value={sessionCount} subtext="Aura & Max engines" tag="Completed" tagColor="#6366f1" icon={<FaSmile color="#6366f1" />} />
        <CleanSaaSMetricCard title="Mindfulness Logs" value={journalCount} subtext="Reflections stored" tag="Saved" tagColor="#00e5ff" icon={<FaChartLine color="#00e5ff" />} />
      </div>

      {/* ══ AI ENGINE QUICK LAUNCH & EXPERTS ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        
        {/* AI Co-Pilots */}
        <div style={{ background: 'rgba(10, 12, 18, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
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
        <div style={{ background: 'rgba(10, 12, 18, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '24px' }}>
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

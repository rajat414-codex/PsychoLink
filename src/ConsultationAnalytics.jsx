import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBroadcastTower, FaChartPie } from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const INITIAL_CATEGORIES = [
  {
    id: 'aura',
    name: 'Mental Wellness & Anxiety',
    agent: 'AURA',
    color: '#ef4444',
    gradStart: '#ff6b6b',
    gradEnd: '#dc2626',
    bg: 'rgba(239, 68, 68, 0.06)',
    border: 'rgba(239, 68, 68, 0.22)',
    status: 'ACTIVE AGENT',
    active: true,
    count: 260,
    icon: '🌸',
  },
  {
    id: 'max',
    name: 'Behavioral & Strategy',
    agent: 'MAX',
    color: '#22c55e',
    gradStart: '#4ade80',
    gradEnd: '#16a34a',
    bg: 'rgba(34, 197, 94, 0.06)',
    border: 'rgba(34, 197, 94, 0.22)',
    status: 'ACTIVE AGENT',
    active: true,
    count: 130,
    icon: '⚡',
  },
  {
    id: 'synapse',
    name: 'Career & Tech Guidance',
    agent: 'SYNAPSE',
    color: '#06b6d4',
    gradStart: '#38bdf8',
    gradEnd: '#0284c7',
    bg: 'rgba(6, 182, 212, 0.06)',
    border: 'rgba(6, 182, 212, 0.22)',
    status: 'AUTO-PREVIEW 🔒',
    active: false,
    count: 80,
    icon: '💻',
  },
  {
    id: 'lex',
    name: 'Business & Legal',
    agent: 'LEX',
    color: '#a855f7',
    gradStart: '#c084fc',
    gradEnd: '#9333ea',
    bg: 'rgba(168, 85, 247, 0.06)',
    border: 'rgba(168, 85, 247, 0.22)',
    status: 'AUTO-PREVIEW 🔒',
    active: false,
    count: 50,
    icon: '⚖️',
  },
];

export default function ConsultationAnalytics() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [tickerLogs, setTickerLogs] = useState([
    { id: 1, text: 'Auto-Logged +1 Session → AURA (Mental Wellness)', time: 'Just now', color: '#ef4444' },
    { id: 2, text: 'Web Telemetry +1 Session → MAX (Behavioral & Strategy)', time: '2s ago', color: '#22c55e' },
  ]);

  // Total session count calculated on-the-fly
  const totalSessions = categories.reduce((sum, c) => sum + c.count, 0);

  // Live Auto-Stream Telemetry Interval
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      let pickedId = 'aura';
      if (rand > 0.90) pickedId = 'lex';
      else if (rand > 0.74) pickedId = 'synapse';
      else if (rand > 0.48) pickedId = 'max';
      else pickedId = 'aura';

      setCategories((prev) =>
        prev.map((cat) => (cat.id === pickedId ? { ...cat, count: cat.count + 1 } : cat))
      );

      const target = INITIAL_CATEGORIES.find((c) => c.id === pickedId);
      const isAuto = !target.active;
      const logText = isAuto
        ? `Web Telemetry +1 Session → ${target.agent} (${target.name})`
        : `Auto-Logged +1 Session → ${target.agent} (${target.name})`;

      setTickerLogs((prev) => [
        { id: Date.now(), text: logText, time: 'Just now', color: target.color },
        ...prev.slice(0, 4),
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // SVG Donut Calculations
  const radius = 90;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(13, 17, 28, 0.92) 0%, rgba(6, 9, 16, 0.98) 100%)',
        backdropFilter: 'blur(36px)',
        WebkitBackdropFilter: 'blur(36px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '2.5px solid #0088ff',
        borderRadius: '30px',
        padding: '28px 32px',
        boxShadow: '0 28px 65px -10px rgba(0, 0, 0, 0.85), 0 16px 40px -10px rgba(0, 136, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
        marginBottom: '28px',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Background Grid & Multi-Color Ambient Glows ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Blue Center Glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '25%',
            width: '50%',
            height: '140px',
            background: 'radial-gradient(ellipse, rgba(0, 136, 255, 0.22) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Purple Right Accent Glow */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '-20px',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            filter: 'blur(55px)',
          }}
        />
      </div>

      {/* ── Header Row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          marginBottom: '26px',
          flexWrap: 'wrap',
          gap: '14px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0088ff', boxShadow: '0 0 12px #0088ff' }} />
            <h3 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '1.28rem', color: '#f8fafc', letterSpacing: '-0.3px' }}>
              Cognitive Consultation Breakdown
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: J }}>
            Real-time telemetry stream & automated agent allocation circle
          </p>
        </div>

        {/* Live Auto-Sync Status Badge */}
        <div
          style={{
            padding: '7px 16px',
            borderRadius: '20px',
            background: 'rgba(0, 136, 255, 0.12)',
            border: '1px solid rgba(0, 136, 255, 0.35)',
            color: '#38bdf8',
            fontSize: '0.74rem',
            fontWeight: 800,
            fontFamily: S,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 15px rgba(0, 136, 255, 0.2)',
          }}
        >
          <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <FaBroadcastTower size={12} color="#0088ff" />
          </motion.span>
          LIVE TELEMETRY STREAM
        </div>
      </div>

      {/* ── Main Panel Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.7fr', gap: '32px', alignItems: 'center', position: 'relative', zIndex: 2, marginBottom: '24px' }}>
        
        {/* LEFT: ULTRA-STYLISH CIRCLE / DONUT CHART */}
        <div style={{ position: 'relative', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '270px', height: '270px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Outer Rotating Dashed Orbital Ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -12,
                borderRadius: '50%',
                border: '1.5px dashed rgba(255, 255, 255, 0.14)',
                pointerEvents: 'none',
              }}
            />

            {/* Inner Rotating Dashed Orbital Ring 2 (Counter-Clockwise) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                border: '1px stroke rgba(0, 136, 255, 0.25)',
                strokeDasharray: '4 8',
                pointerEvents: 'none',
              }}
            />

            {/* Dynamic Hover Ambient Halo Glow */}
            <div
              style={{
                position: 'absolute',
                inset: 12,
                borderRadius: '50%',
                background: hoveredCat
                  ? `radial-gradient(circle, ${hoveredCat.color}30 0%, transparent 70%)`
                  : 'radial-gradient(circle, rgba(0, 136, 255, 0.18) 0%, transparent 70%)',
                filter: 'blur(22px)',
                transition: 'all 0.4s ease',
                pointerEvents: 'none',
              }}
            />

            {/* SVG Donut */}
            <svg width="270" height="270" viewBox="0 0 260 260" style={{ transform: 'rotate(-90deg)', overflow: 'visible', zIndex: 2 }}>
              <defs>
                {categories.map((c) => (
                  <linearGradient key={`grad-${c.id}`} id={`grad-${c.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={c.gradStart} />
                    <stop offset="100%" stopColor={c.gradEnd} />
                  </linearGradient>
                ))}
              </defs>

              {/* Dark Track Background Circle */}
              <circle cx="130" cy="130" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth={strokeWidth} />

              {/* Segment Arcs */}
              {categories.map((cat) => {
                const percentage = (cat.count / totalSessions) * 100;
                const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle;
                accumulatedAngle += (percentage / 100) * circumference;

                const isHovered = hoveredCat?.id === cat.id;

                return (
                  <motion.circle
                    key={cat.id}
                    cx="130"
                    cy="130"
                    r={radius}
                    fill="transparent"
                    stroke={`url(#grad-${cat.id})`}
                    strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredCat(cat)}
                    onMouseLeave={() => setHoveredCat(null)}
                    style={{
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      filter: isHovered ? `drop-shadow(0 0 18px ${cat.color})` : `drop-shadow(0 0 6px ${cat.color}88)`,
                    }}
                  />
                );
              })}
            </svg>

            {/* Inner Glowing Glass Core Display */}
            <div
              style={{
                position: 'absolute',
                inset: 46,
                borderRadius: '50%',
                background: 'rgba(8, 11, 20, 0.94)',
                backdropFilter: 'blur(24px)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.85), 0 12px 30px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justify: 'center',
                pointerEvents: 'none',
                textAlign: 'center',
                zIndex: 5,
              }}
            >
              <span style={{ fontSize: '0.66rem', color: hoveredCat ? hoveredCat.color : '#38bdf8', fontFamily: S, fontWeight: 800, letterSpacing: '1.2px' }}>
                {hoveredCat ? hoveredCat.agent : 'TOTAL SESSIONS'}
              </span>
              <motion.span
                key={hoveredCat ? hoveredCat.id : totalSessions}
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontFamily: S,
                  lineHeight: 1,
                  margin: '3px 0',
                  textShadow: hoveredCat ? `0 0 18px ${hoveredCat.color}` : '0 0 18px rgba(0,136,255,0.4)',
                }}
              >
                {hoveredCat ? `${Math.round((hoveredCat.count / totalSessions) * 100)}%` : totalSessions}
              </motion.span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: J, fontWeight: 600 }}>
                {hoveredCat ? `${hoveredCat.count} Sessions` : 'Telemetry Streamed'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Agent Category Breakdown Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {categories.map((cat) => {
            const percentage = Math.round((cat.count / totalSessions) * 100);
            const isHovered = hoveredCat?.id === cat.id;

            return (
              <motion.div
                key={cat.id}
                onMouseEnter={() => setHoveredCat(cat)}
                onMouseLeave={() => setHoveredCat(null)}
                whileHover={{ y: -4, borderColor: cat.color }}
                style={{
                  background: cat.bg,
                  border: isHovered ? `1px solid ${cat.color}` : `1px solid ${cat.border}`,
                  borderRadius: '22px',
                  padding: '18px 20px',
                  transition: 'all 0.28s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: isHovered ? `0 14px 34px -5px ${cat.color}30` : 'none',
                }}
              >
                {/* Agent Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}>{cat.icon}</span>
                    <span style={{ fontSize: '0.68rem', color: cat.color, fontWeight: 800, fontFamily: S }}>
                      {cat.agent}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      color: cat.active ? '#10b981' : 'rgba(255,255,255,0.4)',
                      background: cat.active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.05)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontFamily: S,
                    }}
                  >
                    {cat.status}
                  </span>
                </div>

                {/* Percentage & Sessions */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0 8px' }}>
                  <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', fontFamily: S, lineHeight: 1, letterSpacing: '-0.5px' }}>
                    {percentage}%
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', fontFamily: S }}>
                    {cat.count} sessions
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.65)', fontFamily: J, fontWeight: 600 }}>
                  {cat.name}
                </p>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${cat.gradStart}, ${cat.gradEnd})`, borderRadius: '3px' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── LIVE ACTIVITY TICKER (Bottom Status Bar) ── */}
      <div
        style={{
          padding: '12px 20px',
          borderRadius: '18px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: S, fontWeight: 800, flexShrink: 0 }}>
            LIVE TELEMETRY:
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={tickerLogs[0]?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ fontSize: '0.76rem', color: tickerLogs[0]?.color || '#fff', fontFamily: J, fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              ● {tickerLogs[0]?.text}
            </motion.span>
          </AnimatePresence>
        </div>

        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontFamily: S, flexShrink: 0 }}>
          Auto-Accumulating Stream
        </span>
      </div>
    </div>
  );
}

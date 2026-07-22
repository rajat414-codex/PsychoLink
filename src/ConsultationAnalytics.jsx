import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartPie, FaChartLine, FaBroadcastTower, FaBolt, FaLock, FaUserShield, FaBrain } from 'react-icons/fa';

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
  const [viewMode, setViewMode] = useState('DONUT'); // 'DONUT' or 'TREND'
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
  const radius = 86;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(13, 17, 28, 0.9) 0%, rgba(6, 9, 16, 0.98) 100%)',
        backdropFilter: 'blur(36px)',
        WebkitBackdropFilter: 'blur(36px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '2px solid #0088ff',
        borderRadius: '30px',
        padding: '28px 32px',
        boxShadow: '0 28px 65px -10px rgba(0, 0, 0, 0.85), 0 16px 40px -10px rgba(0, 136, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
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
            left: '30%',
            width: '45%',
            height: '120px',
            background: 'radial-gradient(ellipse, rgba(0, 136, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />
        {/* Purple Right Accent Glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '-20px',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* ── Header Row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '14px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0088ff', boxShadow: '0 0 12px #0088ff' }} />
            <h3 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '1.25rem', color: '#f8fafc', letterSpacing: '-0.3px' }}>
              Cognitive Consultation Analytics
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.45)', fontFamily: J }}>
            Real-time telemetry stream & automated agent allocation breakdown
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Live Auto-Sync Status Badge */}
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(0, 136, 255, 0.12)',
              border: '1px solid rgba(0, 136, 255, 0.3)',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 800,
              fontFamily: S,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <FaBroadcastTower size={11} color="#0088ff" />
            </motion.span>
            LIVE AUTO-SYNC
          </div>

          {/* Toggle Button View Mode */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '3px',
              gap: '3px',
            }}
          >
            <button
              onClick={() => setViewMode('DONUT')}
              style={{
                padding: '7px 16px',
                border: 'none',
                borderRadius: '12px',
                background: viewMode === 'DONUT' ? 'linear-gradient(135deg, #0088ff, #6366f1)' : 'transparent',
                color: viewMode === 'DONUT' ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                fontSize: '0.74rem',
                fontWeight: 800,
                fontFamily: S,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.25s',
                boxShadow: viewMode === 'DONUT' ? '0 4px 14px rgba(0,136,255,0.4)' : 'none',
              }}
            >
              <FaChartPie size={11} /> Donut Circle
            </button>
            <button
              onClick={() => setViewMode('TREND')}
              style={{
                padding: '7px 16px',
                border: 'none',
                borderRadius: '12px',
                background: viewMode === 'TREND' ? 'linear-gradient(135deg, #0088ff, #6366f1)' : 'transparent',
                color: viewMode === 'TREND' ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                fontSize: '0.74rem',
                fontWeight: 800,
                fontFamily: S,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.25s',
                boxShadow: viewMode === 'TREND' ? '0 4px 14px rgba(0,136,255,0.4)' : 'none',
              }}
            >
              <FaChartLine size={11} /> Trend Wave
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Panel Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1.75fr', gap: '28px', alignItems: 'center', position: 'relative', zIndex: 2, marginBottom: '22px' }}>
        
        {/* LEFT: SVG Circle / Donut Chart with Orbital Rings & Glowing Core */}
        <div style={{ position: 'relative', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {viewMode === 'DONUT' ? (
              <motion.div
                key="donut"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {/* Outer Rotating Dashed Orbital Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: -10,
                    borderRadius: '50%',
                    border: '1.5px dashed rgba(255, 255, 255, 0.12)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Outer Glow Halo */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 10,
                    borderRadius: '50%',
                    background: hoveredCat
                      ? `radial-gradient(circle, ${hoveredCat.color}25 0%, transparent 70%)`
                      : 'radial-gradient(circle, rgba(0, 136, 255, 0.15) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    transition: 'all 0.4s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* SVG Donut */}
                <svg width="250" height="250" viewBox="0 0 240 240" style={{ transform: 'rotate(-90deg)', overflow: 'visible', zIndex: 2 }}>
                  <defs>
                    {categories.map((c) => (
                      <linearGradient key={`grad-${c.id}`} id={`grad-${c.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={c.gradStart} />
                        <stop offset="100%" stopColor={c.gradEnd} />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Dark Track Background Circle */}
                  <circle cx="120" cy="120" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth={strokeWidth} />

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
                        cx="120"
                        cy="120"
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
                          filter: isHovered ? `drop-shadow(0 0 16px ${cat.color})` : `drop-shadow(0 0 5px ${cat.color}77)`,
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Inner Glowing Center Core Display */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 42,
                    borderRadius: '50%',
                    background: 'rgba(8, 11, 20, 0.92)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8), 0 10px 25px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    zIndex: 5,
                  }}
                >
                  <span style={{ fontSize: '0.64rem', color: hoveredCat ? hoveredCat.color : 'rgba(255, 255, 255, 0.45)', fontFamily: S, fontWeight: 800, letterSpacing: '1px' }}>
                    {hoveredCat ? hoveredCat.agent : 'TOTAL SESSIONS'}
                  </span>
                  <motion.span
                    key={hoveredCat ? hoveredCat.id : totalSessions}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      fontSize: '2.3rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      fontFamily: S,
                      lineHeight: 1,
                      margin: '2px 0',
                      textShadow: '0 0 15px rgba(255,255,255,0.2)',
                    }}
                  >
                    {hoveredCat ? `${Math.round((hoveredCat.count / totalSessions) * 100)}%` : totalSessions}
                  </motion.span>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: J, fontWeight: 600 }}>
                    {hoveredCat ? `${hoveredCat.count} Sessions` : 'Telemetry Streamed'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="trend"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                {/* SVG Multi-Line Wave Trend */}
                <svg width="100%" height="240" viewBox="0 0 340 240" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="20" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="20" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="20" y1="190" x2="320" y2="190" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                  {/* Wave Line 1: Aura (Red) */}
                  <path d="M 20,160 C 80,160 130,60 190,60 C 250,60 280,110 320,80" fill="none" stroke="#ef4444" strokeWidth="3.5" filter="drop-shadow(0 0 8px #ef4444)" />
                  {/* Wave Line 2: Max (Green) */}
                  <path d="M 20,180 C 80,180 140,130 200,130 C 260,130 280,95 320,105" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="5 3" />
                  {/* Wave Line 3: Synapse (Cyan) */}
                  <path d="M 20,195 C 90,195 150,160 210,160 C 270,160 290,145 320,135" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.75" />

                  {/* Active Dots */}
                  <circle cx="190" cy="60" r="4.5" fill="#ffffff" stroke="#ef4444" strokeWidth="2.5" />
                  <circle cx="200" cy="130" r="4.5" fill="#ffffff" stroke="#22c55e" strokeWidth="2.5" />
                  <circle cx="210" cy="160" r="4" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
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
                  boxShadow: isHovered ? `0 12px 30px -5px ${cat.color}25` : 'none',
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
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: S, lineHeight: 1, letterSpacing: '-0.5px' }}>
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

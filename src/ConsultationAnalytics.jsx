import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaChartPie, FaChartLine, FaLock, FaRobot, FaCheckCircle, FaBroadcastTower } from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const INITIAL_CATEGORIES = [
  {
    id: 'aura',
    name: 'Mental Wellness & Anxiety',
    agent: 'AURA',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
    status: 'ACTIVE AGENT',
    active: true,
    count: 250,
  },
  {
    id: 'max',
    name: 'Behavioral & Strategy',
    agent: 'MAX',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.25)',
    status: 'ACTIVE AGENT',
    active: true,
    count: 125,
  },
  {
    id: 'synapse',
    name: 'Career & Tech Guidance',
    agent: 'SYNAPSE',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.08)',
    border: 'rgba(6, 182, 212, 0.25)',
    status: 'AUTO-PREVIEW 🔒',
    active: false,
    count: 75,
  },
  {
    id: 'lex',
    name: 'Business & Legal',
    agent: 'LEX',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.08)',
    border: 'rgba(168, 85, 247, 0.25)',
    status: 'AUTO-PREVIEW 🔒',
    active: false,
    count: 50,
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

  // Live Auto-Stream Telemetry Interval (Simulation of incoming background session data)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a category based on weight probabilities (50%, 25%, 15%, 10%)
      const rand = Math.random();
      let pickedId = 'aura';
      if (rand > 0.90) pickedId = 'lex';
      else if (rand > 0.75) pickedId = 'synapse';
      else if (rand > 0.50) pickedId = 'max';
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
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // SVG Donut Calculations
  const radius = 80;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(12, 16, 26, 0.85) 0%, rgba(6, 9, 16, 0.98) 100%)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '2px solid #0088ff',
        borderRadius: '28px',
        padding: '26px 30px',
        boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 15px 35px -10px rgba(0, 136, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        marginBottom: '26px',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Background Grid & Ambient Glow ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '100px',
            background: 'radial-gradient(ellipse, rgba(0, 136, 255, 0.22) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* ── Header Row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          marginBottom: '22px',
          flexWrap: 'wrap',
          gap: '14px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0088ff', boxShadow: '0 0 12px #0088ff' }} />
            <h3 style={{ margin: 0, fontFamily: J, fontWeight: 800, fontSize: '1.2rem', color: '#f8fafc', letterSpacing: '-0.3px' }}>
              Consultation Analytics
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
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
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
                padding: '6px 14px',
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
              }}
            >
              <FaChartPie size={11} /> Donut Chart
            </button>
            <button
              onClick={() => setViewMode('TREND')}
              style={{
                padding: '6px 14px',
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
              }}
            >
              <FaChartLine size={11} /> Trend Wave
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Panel Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', alignItems: 'center', position: 'relative', zIndex: 2, marginBottom: '20px' }}>
        
        {/* LEFT: SVG Chart View (Donut or Trend Wave) */}
        <div style={{ position: 'relative', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {viewMode === 'DONUT' ? (
              <motion.div
                key="donut"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'relative', width: '220px', height: '220px' }}
              >
                <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                  {categories.map((cat) => {
                    const percentage = (cat.count / totalSessions) * 100;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedAngle;
                    accumulatedAngle += (percentage / 100) * circumference;

                    const isHovered = hoveredCat?.id === cat.id;

                    return (
                      <circle
                        key={cat.id}
                        cx="110"
                        cy="110"
                        r={radius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        onMouseEnter={() => setHoveredCat(cat)}
                        onMouseLeave={() => setHoveredCat(null)}
                        style={{
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          filter: isHovered ? `drop-shadow(0 0 12px ${cat.color})` : `drop-shadow(0 0 4px ${cat.color}66)`,
                        }}
                      />
                    );
                  })}
                </svg>

                {/* Center Display: Hovered Category or Total Sessions Counter */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    pointerEvents: 'none',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.66rem', color: hoveredCat ? hoveredCat.color : 'rgba(255, 255, 255, 0.45)', fontFamily: S, fontWeight: 700, letterSpacing: '1px' }}>
                    {hoveredCat ? hoveredCat.agent : 'TOTAL TELEMETRY'}
                  </span>
                  <motion.span
                    key={hoveredCat ? hoveredCat.id : totalSessions}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', fontFamily: S, lineHeight: 1 }}
                  >
                    {hoveredCat ? `${Math.round((hoveredCat.count / totalSessions) * 100)}%` : totalSessions}
                  </motion.span>
                  <span style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: J, marginTop: '2px' }}>
                    {hoveredCat ? `${hoveredCat.count} Sessions` : 'Sessions Streamed'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="trend"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: '100%' }}
              >
                {/* SVG Multi-Line Wave Trend */}
                <svg width="100%" height="220" viewBox="0 0 320 220" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  {/* Guideline Grid */}
                  <line x1="20" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="20" y1="110" x2="300" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="20" y1="170" x2="300" y2="170" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                  {/* Wave Line 1: Aura (Red) */}
                  <path d="M 20,150 C 80,150 120,60 180,60 C 240,60 270,110 300,80" fill="none" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 6px #ef4444)" />
                  {/* Wave Line 2: Max (Green) */}
                  <path d="M 20,170 C 80,170 130,120 190,120 C 250,120 270,90 300,100" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="4 2" />
                  {/* Wave Line 3: Synapse (Cyan) */}
                  <path d="M 20,185 C 90,185 140,150 200,150 C 260,150 280,140 300,130" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.7" />

                  {/* Active Dots */}
                  <circle cx="180" cy="60" r="4" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="190" cy="120" r="4" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
                  <circle cx="200" cy="150" r="3.5" fill="#ffffff" stroke="#06b6d4" strokeWidth="1.5" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Data Categories & Telemetry Breakdown Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {categories.map((cat) => {
            const percentage = Math.round((cat.count / totalSessions) * 100);
            return (
              <motion.div
                key={cat.id}
                onMouseEnter={() => setHoveredCat(cat)}
                onMouseLeave={() => setHoveredCat(null)}
                whileHover={{ y: -3, borderColor: cat.color }}
                style={{
                  background: cat.bg,
                  border: `1px solid ${cat.border}`,
                  borderRadius: '20px',
                  padding: '16px 18px',
                  transition: 'all 0.25s',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.64rem', color: cat.color, fontWeight: 800, fontFamily: S }}>
                    AGENT: {cat.agent}
                  </span>
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

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 0 8px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: S, lineHeight: 1 }}>
                    {percentage}%
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', fontFamily: S }}>
                    {cat.count} sessions
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)', fontFamily: J, fontWeight: 600 }}>
                  {cat.name}
                </p>

                {/* Progress Mini Bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '10px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                    style={{ height: '100%', background: cat.color, borderRadius: '2px' }}
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
          padding: '12px 18px',
          borderRadius: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: S, fontWeight: 700, flexShrink: 0 }}>
            LIVE FEED:
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
          Auto-Accumulating Telemetry
        </span>
      </div>
    </div>
  );
}

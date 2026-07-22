import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConsultationAnalytics from './ConsultationAnalytics';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const ALL_TASKS = [
  { text: "Practice 4-7-8 breathing for 3 minutes to regulate your nervous system.", category: "Mental Health", color: "#10b981" },
  { text: "Active Listening: Listen to someone today without preparing your response beforehand.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Express Gratitude: Write down 3 micro-moments that brought a smile to your face today.", category: "Mental Health", color: "#10b981" },
  { text: "Clarity in Speech: Focus on speaking at a measured, calm pace in your next conversation.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Digital Detox: Disconnect from all digital screens 45 minutes before sleeping.", category: "Mental Health", color: "#10b981" },
  { text: "Constructive Feedback: Reframe a critique today using positive 'I-statements'.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Mindful Walking: Take a 10-minute walk outside observing only the sounds around you.", category: "Mental Health", color: "#10b981" },
  { text: "Assertive Boundaries: Politely decline a low-priority task to protect your mental energy.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Self-Compassion: Write down a recent mistake and answer yourself with kindness.", category: "Mental Health", color: "#10b981" },
  { text: "Body Language Check: Stand or sit with an open, relaxed posture in your next chat.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Mindful Hydration: Sip a glass of water slowly, focusing on the temperature and sensation.", category: "Mental Health", color: "#10b981" },
  { text: "Empathy Exercise: Put yourself in the shoes of someone you recently disagreed with.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Reframing Thoughts: Identify a negative self-talk statement and rephrase it constructively.", category: "Mental Health", color: "#10b981" },
  { text: "Clear Emailing: Write a concise email today, removing all fillers like 'just' or 'actually'.", category: "Soft Skill", color: "#8b5cf6" },
  { text: "Cognitive Rest: Take a 5-minute silent break mid-day with absolutely no audio or text input.", category: "Mental Health", color: "#10b981" }
];

/* ══════════════════════════════════════════════════════════════════
   PSYCHOLOGY NEON GLOW TREND CHART (Pure Mental Health & Psychology Metrics)
   - Left vertical tab strip (RECOVERY / ANXIETY / NEURAL)
   - 100% Psychology metrics (Resonance, Cortisol Drop, Vagal Tone) - No Money/Dollars
   - Hyper-glow multi-color neon line + frosted glass background wave
   - Top peak light beam & glowing threshold line
   ══════════════════════════════════════════════════════════════════ */
function GalaxyPsychologyTrendChart() {
  const [activeTab, setActiveTab] = useState('RECOVERY'); // RECOVERY, ANXIETY, or NEURAL
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Smooth Bezier Curve Path Data
  const recoveryForegroundPath = "M 40,210 C 100,210 130,150 180,150 C 230,150 260,230 310,230 C 360,230 400,60 470,60 C 530,60 580,120 640,150";
  const recoveryGlassPath = "M 40,260 C 90,260 120,270 170,270 C 230,270 270,180 320,180 C 370,180 430,120 480,120 C 540,120 590,230 640,250 L 640,300 L 40,300 Z";

  const anxietyForegroundPath = "M 40,90 C 100,90 140,220 200,220 C 260,220 300,100 360,100 C 420,100 460,240 520,240 C 580,240 610,180 640,180";
  const anxietyGlassPath = "M 40,140 C 90,140 130,110 180,110 C 240,110 280,220 340,220 C 400,220 450,160 500,160 C 550,160 590,120 640,120 L 640,300 L 40,300 Z";

  const neuralForegroundPath = "M 40,180 C 100,180 150,110 210,110 C 270,110 320,190 380,190 C 440,190 480,70 540,70 C 590,70 620,130 640,130";
  const neuralGlassPath = "M 40,220 C 90,220 140,150 200,150 C 260,150 300,220 360,220 C 420,220 470,110 520,110 C 570,110 610,170 640,170 L 640,300 L 40,300 Z";

  const mainPath = activeTab === 'RECOVERY' ? recoveryForegroundPath : activeTab === 'ANXIETY' ? anxietyForegroundPath : neuralForegroundPath;
  const glassPath = activeTab === 'RECOVERY' ? recoveryGlassPath : activeTab === 'ANXIETY' ? anxietyGlassPath : neuralGlassPath;

  // Psychology Interactive Data Points
  const points = activeTab === 'RECOVERY' ? [
    { x: 40, y: 210, label: 'Week 1 (Days 1-7)', val: '42% Calm Baseline' },
    { x: 180, y: 150, label: 'Mid-W1', val: '58% Cognitive Balance' },
    { x: 310, y: 230, label: 'Week 2 (Days 7-14)', val: '35% Mild Stress Dip' },
    { x: 470, y: 60, label: 'Week 3 Peak', val: '94% Emotional Resilience Peak' },
    { x: 640, y: 150, label: 'Week 4 (Days 21-28)', val: '78% Sustained Mindfulness' },
  ] : activeTab === 'ANXIETY' ? [
    { x: 40, y: 90, label: 'Week 1', val: '85% Initial Anxiety Level' },
    { x: 200, y: 220, label: 'Week 2', val: '38% Cortisol Reduction' },
    { x: 360, y: 100, label: 'Week 3', val: '72% Temporary Trigger Spike' },
    { x: 520, y: 240, label: 'Week 4', val: '24% Optimal Vagal Tone' },
    { x: 640, y: 180, label: 'End Month', val: '40% Balanced State' },
  ] : [
    { x: 40, y: 180, label: 'Week 1', val: '52 Focus Score' },
    { x: 210, y: 110, label: 'Week 2', val: '78 Neuroplasticity Index' },
    { x: 380, y: 190, label: 'Week 3', val: '45 Fatigue Dip' },
    { x: 540, y: 70, label: 'Week 4 Peak', val: '92 Mind Clarity Peak' },
    { x: 640, y: 130, label: 'End Month', val: '84 Cognitive Reserve' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1d0c36 0%, #100622 100%)',
      border: '1px solid rgba(168, 85, 247, 0.22)',
      borderRadius: '26px',
      boxShadow: '0 25px 60px rgba(8, 3, 20, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      display: 'flex',
      overflow: 'hidden',
      marginBottom: '26px',
      position: 'relative'
    }}>
      {/* ══ LEFT VERTICAL TAB STRIP (Matching Reference Image) ══ */}
      <div style={{
        width: '130px',
        background: 'rgba(12, 5, 26, 0.75)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '0px',
        flexShrink: 0
      }}>
        {/* Tab 1: RECOVERY */}
        <button
          onClick={() => setActiveTab('RECOVERY')}
          style={{
            width: '100%',
            padding: '22px 12px 18px',
            background: activeTab === 'RECOVERY'
              ? 'linear-gradient(180deg, #c084fc 0%, #9333ea 100%)'
              : 'transparent',
            border: 'none',
            color: activeTab === 'RECOVERY' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            transition: 'all 0.25s'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: S, letterSpacing: '1px' }}>RECOVERY</span>
          <span style={{ fontSize: '0.58rem', opacity: 0.85, fontFamily: J }}>Calm Index</span>

          {activeTab === 'RECOVERY' && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '6px solid #1d0c36'
            }} />
          )}
        </button>

        {/* Tab 2: ANXIETY */}
        <button
          onClick={() => setActiveTab('ANXIETY')}
          style={{
            width: '100%',
            padding: '20px 12px',
            background: activeTab === 'ANXIETY'
              ? 'linear-gradient(180deg, #f43f5e 0%, #be123c 100%)'
              : 'transparent',
            border: 'none',
            color: activeTab === 'ANXIETY' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            transition: 'all 0.25s'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: S, letterSpacing: '1px' }}>ANXIETY</span>
          <span style={{ fontSize: '0.58rem', opacity: 0.85, fontFamily: J }}>Cortisol Drop</span>

          {activeTab === 'ANXIETY' && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '6px solid #1d0c36'
            }} />
          )}
        </button>

        {/* Tab 3: NEURAL */}
        <button
          onClick={() => setActiveTab('NEURAL')}
          style={{
            width: '100%',
            padding: '20px 12px',
            background: activeTab === 'NEURAL'
              ? 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)'
              : 'transparent',
            border: 'none',
            color: activeTab === 'NEURAL' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            transition: 'all 0.25s'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: S, letterSpacing: '1px' }}>NEURAL</span>
          <span style={{ fontSize: '0.58rem', opacity: 0.85, fontFamily: J }}>Focus Score</span>

          {activeTab === 'NEURAL' && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '6px solid #1d0c36'
            }} />
          )}
        </button>
      </div>

      {/* ══ RIGHT MAIN GRAPH AREA ══ */}
      <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: J, fontWeight: 900, fontSize: '1.4rem', color: '#ffffff', letterSpacing: '-0.4px' }}>
              Psychological Recovery Trend
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#f97316', fontWeight: 800, fontFamily: S, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {activeTab} COGNITIVE WAVEFORM
            </p>
          </div>

          {/* Top Right Filters */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ padding: '5px 12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.72rem', fontFamily: S, cursor: 'pointer' }}>
              ALL PSYCH METRICS ▾
            </span>
            <span style={{ padding: '5px 12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.72rem', fontFamily: S, cursor: 'pointer' }}>
              MONTHLY ANALYSIS ▾
            </span>
          </div>
        </div>

        {/* High-Glow Multi-Layer Neon Canvas */}
        <div style={{ width: '100%', position: 'relative', minHeight: '300px' }}>
          <svg width="100%" height="300" viewBox="0 0 680 300" style={{ overflow: 'visible' }}>
            <defs>
              {/* Multi-Color Neon Line Gradient (Purple -> Cyan -> Hot Pink -> Fiery Gold) */}
              <linearGradient id="galaxyCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="35%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              {/* Stress Mode Line Gradient */}
              <linearGradient id="stressCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              {/* Neural Mode Line Gradient */}
              <linearGradient id="neuralCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Super Neon Glow Filter */}
              <filter id="superGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Peak Flare Gradient */}
              <radialGradient id="peakFlare" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Y-Axis Psychology Labels (Percentage % & Cognitive Level) */}
            {[
              { y: 60, val: '100% Peak' },
              { y: 110, val: '80% High' },
              { y: 160, val: '60% Moderate' },
              { y: 210, val: '40% Mild' },
              { y: 260, val: '20% Low' },
            ].map((grid, idx) => (
              <g key={`y-grid-${idx}`}>
                <line x1="60" y1={grid.y} x2="640" y2={grid.y} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                <text x="55" y={grid.y + 4} fill="rgba(255, 255, 255, 0.35)" fontSize="9" fontFamily={S} textAnchor="end">
                  {grid.val}
                </text>
              </g>
            ))}

            {/* Vertical Segment Lines */}
            {[180, 310, 470, 640].map((xPos, idx) => (
              <line key={`v-grid-${idx}`} x1={xPos} y1="40" x2={xPos} y2="270" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            ))}

            {/* 1. Translucent Frosted Secondary Background Wave */}
            <motion.path
              d={glassPath}
              fill={activeTab === 'RECOVERY' ? "rgba(147, 51, 234, 0.18)" : activeTab === 'ANXIETY' ? "rgba(244, 63, 94, 0.15)" : "rgba(56, 189, 248, 0.15)"}
              stroke={activeTab === 'RECOVERY' ? "rgba(192, 132, 252, 0.35)" : activeTab === 'ANXIETY' ? "rgba(251, 146, 60, 0.35)" : "rgba(56, 189, 248, 0.35)"}
              strokeWidth="1.5"
              initial={false}
              animate={{ d: glassPath }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 2. Horizontal Peak Threshold Glowing Line */}
            <line x1="60" y1={activeTab === 'RECOVERY' ? 60 : activeTab === 'NEURAL' ? 70 : 90} x2="640" y2={activeTab === 'RECOVERY' ? 60 : activeTab === 'NEURAL' ? 70 : 90} stroke="rgba(251, 146, 60, 0.6)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Intersection Dots along Peak Line */}
            <circle cx="470" cy={activeTab === 'RECOVERY' ? 60 : activeTab === 'NEURAL' ? 70 : 90} r="3" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 6px #ff5500)' }} />
            <circle cx="640" cy={activeTab === 'RECOVERY' ? 60 : activeTab === 'NEURAL' ? 70 : 90} r="3" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 6px #ff5500)' }} />

            {/* 3. Foreground Hyper-Glowing Neon Curve Line */}
            <motion.path
              d={mainPath}
              fill="none"
              stroke={activeTab === 'RECOVERY' ? "url(#galaxyCurveGrad)" : activeTab === 'ANXIETY' ? "url(#stressCurveGrad)" : "url(#neuralCurveGrad)"}
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#superGlow)"
              initial={false}
              animate={{ d: mainPath }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 4. Peak Flare Light Beam Burst (Top Peak Highlight) */}
            {activeTab === 'RECOVERY' && (
              <g transform="translate(470, 60)">
                {/* Vertical Light Pillar Beam */}
                <line x1="0" y1="-30" x2="0" y2="20" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" filter="drop-shadow(0 0 10px #ff7700)" />
                {/* Sparkle Particles */}
                <circle cx="0" cy="0" r="16" fill="url(#peakFlare)" />
                <circle cx="0" cy="0" r="5" fill="#ffffff" />
                <circle cx="-6" cy="-12" r="1.5" fill="#ffea00" />
                <circle cx="8" cy="-10" r="1.5" fill="#ffffff" />
                <circle cx="4" cy="12" r="1" fill="#ff7700" />
              </g>
            )}

            {/* Interactive Data Points along Curve */}
            {points.map((pt, idx) => (
              <g
                key={`point-${idx}`}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" />
                <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke={activeTab === 'RECOVERY' ? "#c084fc" : activeTab === 'ANXIETY' ? "#f43f5e" : "#38bdf8"} strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }} />
              </g>
            ))}

            {/* X-Axis Segment Labels at Bottom */}
            <text x="110" y="290" fill="rgba(255, 255, 255, 0.35)" fontSize="10" fontFamily={S} textAnchor="middle">Week 1 (1-7)</text>
            <text x="245" y="290" fill="rgba(255, 255, 255, 0.35)" fontSize="10" fontFamily={S} textAnchor="middle">Week 2 (7-14)</text>
            <text x="390" y="290" fill="rgba(255, 255, 255, 0.35)" fontSize="10" fontFamily={S} textAnchor="middle">Week 3 (14-21)</text>
            <text x="555" y="290" fill="rgba(255, 255, 255, 0.35)" fontSize="10" fontFamily={S} textAnchor="middle">Week 4 (21-28)</text>
          </svg>

          {/* Floating Hover Tooltip */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  position: 'absolute',
                  left: `${(hoveredPoint.x / 680) * 100}%`,
                  top: `${(hoveredPoint.y / 300) * 100 - 15}%`,
                  transform: 'translate(-50%, -100%)',
                  background: 'rgba(15, 7, 30, 0.95)',
                  border: '1px solid rgba(192, 132, 252, 0.4)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(192, 132, 252, 0.3)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 20
                }}
              >
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#c084fc', fontFamily: S, fontWeight: 700 }}>{hoveredPoint.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#ffffff', fontFamily: S, fontWeight: 800 }}>{hoveredPoint.val}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PROGRESS DASHBOARD PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function ProgressDashboard({ accent }) {
  const getDailyTasks = () => {
    const day = new Date().getDate();
    const i1 = (day * 7) % ALL_TASKS.length;
    const i2 = (day * 13 + 3) % ALL_TASKS.length;
    const i3 = (day * 19 + 7) % ALL_TASKS.length;
    
    let taskIndices = [i1, i2, i3];
    if (taskIndices[0] === taskIndices[1]) taskIndices[1] = (taskIndices[1] + 1) % ALL_TASKS.length;
    if (taskIndices[2] === taskIndices[0] || taskIndices[2] === taskIndices[1]) {
      taskIndices[2] = (taskIndices[2] + 2) % ALL_TASKS.length;
    }
    
    return [
      { ...ALL_TASKS[taskIndices[0]], id: 't1' },
      { ...ALL_TASKS[taskIndices[1]], id: 't2' },
      { ...ALL_TASKS[taskIndices[2]], id: 't3' },
    ];
  };

  const todayKey = `equilibrium_tasks_${new Date().toISOString().split('T')[0]}`;
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : { t1: false, t2: false, t3: false };
    } catch {
      return { t1: false, t2: false, t3: false };
    }
  });

  const toggleTask = (id) => {
    setCompleted(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(todayKey, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const tasks = React.useMemo(() => getDailyTasks(), []);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = (completedCount / 3) * 100;

  return (
    <motion.div key="progress" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
      style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 26px 40px', background: '#06070a' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.8rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Psychological Recovery Analytics</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.86rem', margin:0, fontFamily:J }}>Real-time 6-week cognitive recovery, cortisol reduction & emotional wellness tracking</p>
      </div>

      {/* ══ FEATURED: GLASSMORPHIC CONSULTATION ANALYTICS ══ */}
      <ConsultationAnalytics />

      {/* Bottom Full-Width Daily Mental Health & Soft Skills Challenges */}
      <div style={{
        background: '#0a0c12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '22px',
        padding: '24px 26px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:800, fontSize:'1.05rem', color:'#fff', letterSpacing:'-0.2px' }}>
              Daily Mind & Soft Skill Tasks
            </p>
            <p style={{ margin:0, fontSize:'0.74rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>
              3 custom tasks generated daily to build emotional resilience and soft skills
            </p>
          </div>
          <span style={{ fontSize:'0.74rem', color:accent, fontWeight:700, fontFamily:S, background: `${accent}15`, padding: '5px 12px', borderRadius: '10px', border: `1px solid ${accent}25` }}>
            📅 {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Task rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {tasks.map((task) => {
            const isDone = completed[task.id];
            return (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 14, 
                  padding: '14px 16px', 
                  background: isDone ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)', 
                  border: isDone ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Custom Checkbox circle */}
                <div style={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  border: `2px solid ${isDone ? task.color : 'rgba(255,255,255,0.2)'}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify: 'center',
                  background: isDone ? `${task.color}20` : 'transparent',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}>
                  {isDone && <span style={{ width: 8, height: 8, borderRadius: '50%', background: task.color }} />}
                </div>

                {/* Badge & Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ 
                    fontSize: '0.64rem', 
                    color: task.color, 
                    fontWeight: '800', 
                    fontFamily: S, 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {task.category}
                  </span>
                  <span style={{ 
                    fontSize: '0.86rem', 
                    color: isDone ? 'rgba(255,255,255,0.35)' : '#fff', 
                    fontFamily: J,
                    textDecoration: isDone ? 'line-through' : 'none',
                    transition: 'all 0.2s ease',
                    lineHeight: 1.4
                  }}>
                    {task.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${accent}, #8b5cf6)`, borderRadius: '3px' }}
            />
          </div>
          <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', fontFamily: S, fontWeight: '700', minWidth: '95px', textAlign: 'right' }}>
            {completedCount} of 3 completed
          </span>
        </div>

        {/* Ribbon tag */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '18px',
          height: '18px',
          background: accent,
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
          boxShadow: `0 0 10px ${accent}`
        }} />
      </div>
    </motion.div>
  );
}

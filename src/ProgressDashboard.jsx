import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaFire } from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const TREND = [
  { w:'W1', anxiety:66, stress:72 },
  { w:'W2', anxiety:62, stress:60 },
  { w:'W3', anxiety:48, stress:64 },
  { w:'W4', anxiety:52, stress:46 },
  { w:'W5', anxiety:36, stress:50 },
  { w:'W6', anxiety:34, stress:40 },
];

function Card({ children, style, delay=0, glow }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.55, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-3, borderColor: glow ? `${glow}35` : 'rgba(255,255,255,0.08)', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', transition:{ duration:0.2, ease:'easeOut' } }}
      style={{
        position:'relative', overflow:'hidden',
        background:'#111622',
        border: glow ? `1px solid ${glow}18` : '1px solid rgba(255,255,255,0.04)',
        borderRadius:24, padding:20,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.02)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        ...style
      }}>
      {children}
    </motion.div>
  );
}

function GradientRing({ value, gradientId, colors }) {
  const radius = 42;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="55" cy="55" r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <motion.circle
          cx="55" cy="55" r={radius}
          fill="transparent"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: '1.45rem', fontWeight: '800', color: '#fff', fontFamily: S }}>
        {value}%
      </div>
    </div>
  );
}

function SparkCard({ title, data, dataKey, color, stats, percentage, label, ribbonColor }) {
  return (
    <Card glow={ribbonColor} style={{ display: 'flex', flexDirection: 'column', padding: '20px 22px', minHeight: '190px' }}>
      {/* Title */}
      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontFamily: J }}>{title}</span>

      {/* Main Content Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1, marginTop: '10px' }}>
        
        {/* Sparkline Graph */}
        <div style={{ width: '60%', height: '80px', marginLeft: '-20px', marginBottom: '-10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`areaGrad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
                <filter id={`glow-${dataKey}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="w" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} filter={`url(#glow-${dataKey})`} fill={`url(#areaGrad-${dataKey})`} isAnimationActive={true} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Numeric stats */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.3)', fontFamily: S }}>{label}</span>
          <p style={{ margin: 0, fontSize: '0.74rem', color: stats.startsWith('-') ? '#10b981' : '#f43f5e', fontWeight: '800', fontFamily: S }}>{stats}</p>
          <p style={{ margin: '2px 0 0', fontSize: '2.2rem', fontWeight: '800', color: '#fff', fontFamily: S, lineHeight: '1.1' }}>{percentage}</p>
        </div>

      </div>

      {/* Accent Ribbon Tag in Bottom-Left Corner */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '12px',
        height: '12px',
        background: ribbonColor,
        clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
      }} />
    </Card>
  );
}

function ProgressCircleCard({ title, value, gradientId, colors, ribbonColor, subText }) {
  return (
    <Card glow={ribbonColor} style={{ display: 'flex', flexDirection: 'column', padding: '20px 22px', minHeight: '190px' }}>
      {/* Title */}
      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontFamily: J }}>{title}</span>

      {/* Center Circle */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: '6px' }}>
        <GradientRing value={value} gradientId={gradientId} colors={colors} />
      </div>

      {/* SubText */}
      {subText && (
        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontFamily: J, marginTop: '8px' }}>
          {subText}
        </span>
      )}

      {/* Accent Ribbon Tag in Bottom-Left Corner */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '12px',
        height: '12px',
        background: ribbonColor,
        clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
      }} />
    </Card>
  );
}

export default function ProgressDashboard({ accent, accentB, accentBr }) {
  return (
    <motion.div key="progress" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
      style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Your Progress</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.86rem', margin:0, fontFamily:J }}>6-week mental wellness journey analysis</p>
      </div>

      {/* Main 2x2 Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        
        {/* Card 1: Anxiety Levels */}
        <SparkCard
          title="Anxiety Levels"
          data={TREND}
          dataKey="anxiety"
          color="#eab308"
          stats="-48.5%"
          percentage="35%"
          label="anxiety rate"
          ribbonColor="#eab308"
        />

        {/* Card 2: Stress Levels */}
        <SparkCard
          title="Stress Tracker"
          data={TREND}
          dataKey="stress"
          color="#f43f5e"
          stats="-41.6%"
          percentage="42%"
          label="cortisol index"
          ribbonColor="#f43f5e"
        />

        {/* Card 3: Mood Resonance */}
        <ProgressCircleCard
          title="Mood Resonance"
          value={80}
          gradientId="moodGrad"
          colors={["#06b6d4", "#10b981"]}
          ribbonColor="#10b981"
          subText="Positive emotional resonance check"
        />

        {/* Card 4: Overall Wellness */}
        <ProgressCircleCard
          title="Overall Wellness"
          value={78}
          gradientId="wellnessGrad"
          colors={["#8b5cf6", "#6366f1"]}
          ribbonColor="#8b5cf6"
          subText="Overall cognitive health tracking"
        />

      </div>

      {/* Bottom Full-Width Activity Tracking Heatmap */}
      <Card glow={accent} style={{ padding: '20px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div>
            <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:700, fontSize:'0.92rem', color:'#ededef', letterSpacing:'-0.2px' }}>Activity Tracking</p>
            <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', fontFamily:J }}>Self-care streaks (last 35 days)</p>
          </div>
          <span style={{ fontSize:'0.74rem', color:'#f59e0b', fontWeight:700, fontFamily:S, display:'flex', alignItems:'center', gap:5 }}>
            <FaFire size={11}/> 7 days active
          </span>
        </div>

        {/* Heatmap grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, padding: '4px 0' }}>
          {[...Array(35)].map((_,i) => {
            const active = i > 27 || ((i*7+3)%10) > 4;
            const intensity = active ? (0.3 + ((i*13)%70)/100) : 0;
            return (
              <motion.div key={i} initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2+i*0.01 }}
                whileHover={{ scale:1.2, borderColor: active ? accent : 'rgba(255,255,255,0.1)' }}
                style={{ 
                  aspectRatio:'1', 
                  borderRadius:6, 
                  background: active ? accent : 'rgba(255,255,255,0.02)', 
                  opacity: active ? intensity : 1, 
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  transition: 'border-color 0.15s ease'
                }}/>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:16, justifyContent:'flex-end' }}>
          <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.25)', fontFamily:S }}>Less</span>
          {[0.2,0.4,0.6,0.8,1].map((o,i)=><span key={i} style={{ width:10, height:10, borderRadius:3, background:accent, opacity:o }}/>)}
          <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.25)', fontFamily:S }}>More</span>
        </div>

        {/* Ribbon tag */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '12px',
          height: '12px',
          background: accent,
          clipPath: 'polygon(0 0, 0 100%, 100% 100%)'
        }} />
      </Card>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { FaArrowUp, FaFire, FaCheckCircle } from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const TREND = [
  { w:'W1', anxiety:66, stress:72, mood:50 },
  { w:'W2', anxiety:62, stress:60, mood:60 },
  { w:'W3', anxiety:48, stress:64, mood:56 },
  { w:'W4', anxiety:52, stress:46, mood:72 },
  { w:'W5', anxiety:36, stress:50, mood:68 },
  { w:'W6', anxiety:34, stress:40, mood:80 },
];

const COMPARE = [
  { name:'Anxiety', last:68, now:35, color:'#eab308', desc:'Reduction in hyperarousal' },
  { name:'Stress',  last:72, now:42, color:'#f43f5e', desc:'Cortisol stabilization feedback' },
  { name:'Mood',    last:52, now:78, color:'#10b981', desc:'Positive emotional resonance' },
];

function Card({ children, style, delay=0, glow }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.55, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-3, borderColor: glow ? `${glow}35` : 'rgba(255,255,255,0.08)', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', transition:{ duration:0.2, ease:'easeOut' } }}
      style={{
        position:'relative', overflow:'hidden',
        background:'rgba(255,255,255,0.015)',
        backdropFilter: 'blur(20px)',
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

function Title({ title, sub, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
      <div>
        <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:700, fontSize:'0.92rem', color:'#ededef', letterSpacing:'-0.2px' }}>{title}</p>
        {sub && <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', fontFamily:J }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'rgba(10,12,22,0.92)', border:'1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(12px)', borderRadius:12, padding:'10px 14px', boxShadow:'0 12px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ margin:'0 0 6px', fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', fontFamily:S, fontWeight:'700' }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ margin:0, fontSize:'0.82rem', fontWeight:700, color:p.color||p.stroke||p.fill, fontFamily:S, display:'flex', alignItems:'center', gap:'6px' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:p.color||p.stroke||p.fill }}/>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export default function ProgressDashboard({ accent, accentB, accentBr }) {
  const radius = 55;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (78 / 100) * circumference;

  return (
    <motion.div key="progress" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
      style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Your Progress</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.86rem', margin:0, fontFamily:J }}>6-week mental wellness journey analysis</p>
      </div>

      {/* Top row: radial score + 3 metric deltas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:12, marginBottom:12 }}>
        {/* Radial wellness score */}
        <Card delay={0.05} glow={accent} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Title title="Wellness Score" sub="Overall cognitive health index"/>
          
          <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '10px 0' }}>
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="wellnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={accent} />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle
                cx="70" cy="70" r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth={strokeWidth}
              />
              <motion.circle
                cx="70" cy="70" r={radius}
                fill="transparent"
                stroke="url(#wellnessGrad)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', fontFamily: S, lineHeight: '1' }}>78</span>
              <span style={{ fontSize: '0.68rem', color: '#10b981', fontFamily: J, fontWeight: '800', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <FaArrowUp size={8}/> 17%
              </span>
            </div>
          </div>
          
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontFamily: J }}>
            Based on active sessions & journal insights
          </div>
        </Card>

        {/* 3 metric mini-cards */}
        <div style={{ display:'grid', gridTemplateRows:'1fr 1fr 1fr', gap:12 }}>
          {COMPARE.map((m,i) => {
            const improved = m.name==='Mood' ? m.now>m.last : m.now<m.last;
            const diff = Math.abs(m.last-m.now);
            return (
              <Card key={i} delay={0.1+i*0.06} style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:36, height:36, borderRadius:12, background:`${m.color}0b`, border:`1px solid ${m.color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ width:10, height:10, borderRadius:3, background:m.color }}/>
                  </div>
                  <div>
                    <p style={{ margin:'0 0 2px', fontSize:'0.84rem', fontWeight:700, color:'#fff', fontFamily:J }}>{m.name}</p>
                    <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.35)', fontFamily:J }}>{m.desc}</p>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:'1.3rem', fontWeight:800, color:m.color, fontFamily:S, lineHeight:1 }}>{m.now}%</span>
                  <p style={{ margin:'3px 0 0', fontSize:'0.68rem', fontWeight:700, color:'#10b981', display:'flex', alignItems:'center', gap:3, justifyContent:'flex-end' }}>
                    {improved ? <FaCheckCircle size={8}/> : null}{diff}% {m.name==='Mood'?'better':'lower'}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trend — clean area chart */}
      <Card delay={0.3} style={{ marginBottom: 12 }}>
        <Title title="6-Week Trend Analysis" sub="Mood progression correlating with reduced anxiety and stress metrics"
          right={<div style={{ display:'flex', gap:16 }}>
            {[['Mood','#10b981'],['Stress','#f43f5e'],['Anxiety','#eab308']].map(([l,c],i)=>(
              <span key={i} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:c }}/>{l}
              </span>
            ))}
          </div>}/>
        <div style={{ height:240, marginLeft:-18 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND}>
              <defs>
                <linearGradient id="moodArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.05}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.00}/>
                </linearGradient>
                <linearGradient id="stressArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.05}/>
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.00}/>
                </linearGradient>
                <linearGradient id="anxArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={0.05}/>
                  <stop offset="100%" stopColor="#eab308" stopOpacity={0.00}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false}/>
              <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Space Grotesk' }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} width={28}/>
              <Tooltip content={<Tip/>}/>
              
              <Area type="monotone" name="Anxiety" dataKey="anxiety" stroke="#eab308" strokeWidth={2} fill="url(#anxArea)" isAnimationActive animationDuration={1200}
                dot={{ r: 2, stroke: '#eab308', strokeWidth: 1.5, fill: '#0a0a0c' }}
                activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#eab308' }}/>
              <Area type="monotone" name="Stress" dataKey="stress" stroke="#f43f5e" strokeWidth={2} fill="url(#stressArea)" isAnimationActive animationDuration={1400}
                dot={{ r: 2, stroke: '#f43f5e', strokeWidth: 1.5, fill: '#0a0a0c' }}
                activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#f43f5e' }}/>
              <Area type="monotone" name="Mood" dataKey="mood" stroke="#10b981" strokeWidth={2.5} fill="url(#moodArea)" isAnimationActive animationDuration={1600}
                dot={{ r: 2, stroke: '#10b981', strokeWidth: 1.5, fill: '#0a0a0c' }}
                activeDot={{ r: 5, stroke: '#fff', strokeWidth: 1.5, fill: '#10b981' }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Comparison bars + streak */}
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:12 }}>
        <Card delay={0.42}>
          <Title title="Last Month vs Now" sub="Side-by-side comparative analysis"/>
          <div style={{ height:180, marginLeft:-22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARE} barGap={6}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Plus Jakarta Sans' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} width={22}/>
                <Tooltip content={<Tip/>} cursor={{ fill:'rgba(255,255,255,0.015)' }}/>
                <Bar dataKey="last" name="Last month" fill="rgba(255,255,255,0.08)" radius={[4,4,0,0]} maxBarSize={20}/>
                <Bar dataKey="now"  name="This month" radius={[4,4,0,0]} maxBarSize={20}>
                  {COMPARE.map((m,i)=><Cell key={i} fill={m.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Streak heatmap */}
        <Card delay={0.48}>
          <Title title="Activity Tracking" sub="Self-care streaks (last 35 days)"
            right={<span style={{ fontSize:'0.74rem', color:'#f59e0b', fontWeight:700, fontFamily:S, display:'flex', alignItems:'center', gap:5 }}><FaFire size={11}/> 7 days active</span>}/>
          
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, padding: '4px 0' }}>
            {[...Array(35)].map((_,i) => {
              const active = i > 27 || ((i*7+3)%10) > 4;
              const intensity = active ? (0.3 + ((i*13)%70)/100) : 0;
              return (
                <motion.div key={i} initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.5+i*0.012 }}
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
          
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:16, justifyContent:'flex-end' }}>
            <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.25)', fontFamily:S }}>Less</span>
            {[0.2,0.4,0.6,0.8,1].map((o,i)=><span key={i} style={{ width:10, height:10, borderRadius:3, background:accent, opacity:o }}/>)}
            <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.25)', fontFamily:S }}>More</span>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { FaArrowDown, FaArrowUp, FaFire, FaCheckCircle } from 'react-icons/fa';

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
  { name:'Anxiety', last:68, now:35, color:'#f59e0b' },
  { name:'Stress',  last:72, now:42, color:'#f43f5e' },
  { name:'Mood',    last:52, now:78, color:'#10b981' },
];

function Card({ children, style, delay=0, glow }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.55, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-4, borderColor: glow ? `${glow}55` : 'var(--border-hover)', boxShadow: 'var(--shadow-premium)', transition:{ duration:0.25, ease:'easeOut' } }}
      style={{
        position:'relative', overflow:'hidden',
        background:'var(--bg-card)',
        border: glow ? `1px solid ${glow}22` : '1px solid var(--border-subtle)',
        borderRadius:24, padding:20,
        boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        ...style
      }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', pointerEvents:'none' }}/>
      {children}
    </motion.div>
  );
}

function Title({ title, sub, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
      <div>
        <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:700, fontSize:'0.95rem', color:'#ededef' }}>{title}</p>
        {sub && <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.32)', fontFamily:J }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#1a1a1f', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'10px 14px', boxShadow:'0 12px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ margin:'0 0 4px', fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontFamily:S }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ margin:0, fontSize:'0.82rem', fontWeight:700, color:p.color||p.stroke||p.fill, fontFamily:S, textTransform:'capitalize' }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export default function ProgressDashboard({ accent, accentB, accentBr }) {
  const RADIAL = [{ name:'Wellness', value:78, fill:accent }];

  return (
    <motion.div key="progress" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
      style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom:18 }}>
        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Your Progress</h2>
        <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:0, fontFamily:J }}>6-week mental wellness journey</p>
      </div>

      {/* Top row: radial score + 3 metric deltas */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:12, marginBottom:14 }}>
        {/* Radial wellness score */}
        <Card delay={0.05} glow={accent}>
          <Title title="Wellness Score" sub="Overall this month"/>
          <div style={{ height:160, position:'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="72%" outerRadius="100%" data={RADIAL} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0,100]} angleAxisId={0} tick={false}/>
                <RadialBar background={{ fill:'rgba(255,255,255,0.06)' }} dataKey="value" cornerRadius={20} angleAxisId={0}/>
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
              <span style={{ fontSize:'2.2rem', fontWeight:800, color:'#fff', fontFamily:S, lineHeight:1, textShadow:`0 0 20px ${accent}66` }}>78</span>
              <span style={{ fontSize:'0.66rem', color:'#56a06f', fontFamily:S, fontWeight:700 }}>↑ 17 pts</span>
            </div>
          </div>
        </Card>

        {/* 3 metric mini-cards */}
        <div style={{ display:'grid', gridTemplateRows:'1fr 1fr 1fr', gap:12 }}>
          {COMPARE.map((m,i) => {
            const improved = m.name==='Mood' ? m.now>m.last : m.now<m.last;
            const diff = Math.abs(m.last-m.now);
            return (
              <Card key={i} delay={0.1+i*0.06} style={{ padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:`${m.color}1a`, border:`1px solid ${m.color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ width:14, height:14, borderRadius:4, background:m.color }}/>
                  </div>
                  <div>
                    <p style={{ margin:'0 0 1px', fontSize:'0.82rem', fontWeight:700, color:'#fff', fontFamily:J }}>{m.name}</p>
                    <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.32)', fontFamily:J }}>was {m.last}%</p>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:'1.4rem', fontWeight:800, color:m.color, fontFamily:S, lineHeight:1 }}>{m.now}%</span>
                  <p style={{ margin:'2px 0 0', fontSize:'0.68rem', fontWeight:700, color:'#10B981', display:'flex', alignItems:'center', gap:3, justifyContent:'flex-end' }}>
                    {improved ? <FaCheckCircle size={8}/> : null}{diff}% {m.name==='Mood'?'up':'down'}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Trend — gradient area chart (reference style) */}
      <Card delay={0.3} glow={accent} style={{ marginBottom:14 }}>
        <Title title="6-Week Trend" sub="Mood rising as stress & anxiety fall"
          right={<div style={{ display:'flex', gap:14 }}>
            {[['Mood','#10B981'],['Stress','#FF4A5A'],['Anxiety','#F59E0B']].map(([l,c],i)=>(
              <span key={i} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontFamily:J }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:c, boxShadow:`0 0 8px ${c}` }}/>{l}
              </span>
            ))}
          </div>}/>
        <div style={{ height:240, marginLeft:-18 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND}>
              <defs>
                <linearGradient id="moodArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="stressArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4A5A" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#FF4A5A" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="anxArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.01}/>
                </linearGradient>
                
                <linearGradient id="moodStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981"/>
                  <stop offset="100%" stopColor="#34D399"/>
                </linearGradient>
                <linearGradient id="stressStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF4A5A"/>
                  <stop offset="100%" stopColor="#FF9F1C"/>
                </linearGradient>
                <linearGradient id="anxStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B"/>
                  <stop offset="100%" stopColor="#fbbf24"/>
                </linearGradient>
                
                <filter id="areaGlow"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="lineGlowOnly"><feGaussianBlur stdDeviation="3" result="b"/></filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Space Grotesk' }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.25)', fontSize:10 }} width={28}/>
              <Tooltip content={<Tip/>}/>
              
              {/* Glow area fills */}
              <Area type="monotone" dataKey="anxiety" stroke="none" fill="url(#anxArea)" isAnimationActive animationDuration={1500}/>
              <Area type="monotone" dataKey="stress" stroke="none" fill="url(#stressArea)" isAnimationActive animationDuration={1700}/>
              <Area type="monotone" dataKey="mood" stroke="none" fill="url(#moodArea)" isAnimationActive animationDuration={1900}/>

              {/* Glowing thick background line strokes */}
              <Area type="monotone" dataKey="anxiety" stroke="url(#anxStroke)" strokeWidth={5.5} fill="none"  opacity={0.35} isAnimationActive animationDuration={1500}/>
              <Area type="monotone" dataKey="stress" stroke="url(#stressStroke)" strokeWidth={5.5} fill="none"  opacity={0.35} isAnimationActive animationDuration={1700}/>
              <Area type="monotone" dataKey="mood" stroke="url(#moodStroke)" strokeWidth={5.5} fill="none"  opacity={0.35} isAnimationActive animationDuration={1900}/>

              {/* Sharp foreground line strokes with points/dots */}
              <Area type="monotone" dataKey="anxiety" stroke="url(#anxStroke)" strokeWidth={2.5} fill="none" isAnimationActive animationDuration={1500}
                dot={{ r: 3.5, stroke: '#F59E0B', strokeWidth: 1.5, fill: '#0a0a0c' }}
                activeDot={{ r: 6.5, stroke: '#fff', strokeWidth: 2, fill: '#F59E0B' }}/>
              <Area type="monotone" dataKey="stress" stroke="url(#stressStroke)" strokeWidth={2.5} fill="none" isAnimationActive animationDuration={1700}
                dot={{ r: 3.5, stroke: '#FF4A5A', strokeWidth: 1.5, fill: '#0a0a0c' }}
                activeDot={{ r: 6.5, stroke: '#fff', strokeWidth: 2, fill: '#FF4A5A' }}/>
              <Area type="monotone" dataKey="mood" stroke="url(#moodStroke)" strokeWidth={3} fill="none" isAnimationActive animationDuration={1900}
                dot={{ r: 3.5, stroke: '#10B981', strokeWidth: 1.5, fill: '#0a0a0c' }}
                activeDot={{ r: 6.5, stroke: '#fff', strokeWidth: 2, fill: '#10B981' }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Comparison bars + streak */}
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:12 }}>
        <Card delay={0.42}>
          <Title title="Last Month vs Now" sub="Side-by-side comparison"/>
          <div style={{ height:180, marginLeft:-22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPARE} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Plus Jakarta Sans' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.22)', fontSize:10 }} width={22}/>
                <Tooltip content={<Tip/>} cursor={{ fill:'rgba(255,255,255,0.03)' }}/>
                <Bar dataKey="last" name="Last month" fill="rgba(255,255,255,0.14)" radius={[5,5,0,0]} maxBarSize={22}/>
                <Bar dataKey="now"  name="This month" radius={[5,5,0,0]} maxBarSize={22}>
                  {COMPARE.map((m,i)=><Cell key={i} fill={m.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Streak heatmap */}
        <Card delay={0.48}>
          <Title title="Activity Streak" sub="Last 35 days"
            right={<span style={{ fontSize:'0.74rem', color:'#c79552', fontWeight:700, fontFamily:S, display:'flex', alignItems:'center', gap:5 }}><FaFire size={11}/> 7 days</span>}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
            {[...Array(35)].map((_,i) => {
              const active = i > 27 || ((i*7+3)%10) > 4;
              const intensity = active ? (0.3 + ((i*13)%70)/100) : 0;
              return (
                <motion.div key={i} initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.5+i*0.012 }}
                  whileHover={{ scale:1.25 }}
                  style={{ aspectRatio:'1', borderRadius:6, background: active ? accent : 'rgba(255,255,255,0.05)', opacity: active ? intensity : 1, border: active ? 'none' : '1px solid rgba(255,255,255,0.04)' }}/>
              );
            })}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:14, justifyContent:'flex-end' }}>
            <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.3)', fontFamily:S }}>Less</span>
            {[0.2,0.4,0.6,0.8,1].map((o,i)=><span key={i} style={{ width:10, height:10, borderRadius:3, background:accent, opacity:o }}/>)}
            <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.3)', fontFamily:S }}>More</span>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

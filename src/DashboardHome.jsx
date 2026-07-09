import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ComposedChart, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, ReferenceLine,
} from 'recharts';
import {
  FaArrowUp, FaArrowDown, FaBrain, FaArrowRight, FaWind, FaRobot,
} from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

// ── Animated count-up hook ──
function useCountUp(target, dur = 1200, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, t0;
    const num = parseFloat(target) || 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(num * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur, start]);
  return val;
}

const MOOD_TREND = [
  { d:'Mon', mood:62, calm:48 }, { d:'Tue', mood:58, calm:52 },
  { d:'Wed', mood:71, calm:60 }, { d:'Thu', mood:66, calm:64 },
  { d:'Fri', mood:78, calm:70 }, { d:'Sat', mood:74, calm:72 },
  { d:'Sun', mood:82, calm:79 },
];
const EMOTION_SPLIT = [
  { name:'Calm', value:44, color:'#10b981' },
  { name:'Anxious', value:23, color:'#f43f5e' },
  { name:'Focused', value:21, color:'#6366f1' },
  { name:'Low', value:12, color:'#f59e0b' },
];
const ACTIVITY = [
  { d:'M', v:3 }, { d:'T', v:5 }, { d:'W', v:2 }, { d:'T', v:6 },
  { d:'F', v:4 }, { d:'S', v:7 }, { d:'S', v:5 },
];

function Card({ children, style, delay=0, glow, onClick, hover }) {
  return (
    <motion.div
      initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.55, ease:[0.22,1,0.36,1] }}
      whileHover={hover ? { y:-4, borderColor: glow ? `${glow}55` : 'var(--border-hover)', boxShadow: 'var(--shadow-premium)', transition:{ duration:0.25, ease:'easeOut' } } : undefined}
      onClick={onClick}
      style={{
        position:'relative',
        background:'var(--bg-card)',
        border: glow ? `1px solid ${glow}22` : '1px solid var(--border-subtle)',
        borderRadius:24, padding:20,
        boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.03)',
        cursor: onClick ? 'pointer' : 'default',
        overflow:'hidden',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        ...style,
      }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)', pointerEvents:'none' }}/>
      {children}
    </motion.div>
  );
}

function CardTitle({ title, sub, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, position:'relative', zIndex:2 }}>
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
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
      style={{ background:'rgba(20,20,26,0.95)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:12, padding:'10px 14px', boxShadow:'0 12px 32px rgba(0,0,0,0.6)' }}>
      <p style={{ margin:'0 0 4px', fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontFamily:S }}>{label}</p>
      {payload.map((p,i) => {
        const isVal = p.name === 'moodVal' || p.name === 'calmVal';
        let displayName = p.name === 'moodVal' ? 'Mood' : p.name === 'calmVal' ? 'Calm' : p.name;
        let displayValue = isVal ? p.value + 50 : p.value;
        let textColor = p.color || p.stroke || p.fill;

        if (p.name === 'val') {
          const isPos = p.value >= 0;
          displayName = isPos ? 'Positive State' : 'Negative State';
          displayValue = (isPos ? '+' : '') + p.value;
          textColor = isPos ? '#8b87f5' : '#FF4A5A';
        }

        if (textColor && typeof textColor === 'string' && textColor.includes('url')) {
          textColor = p.value >= 0 ? '#8b87f5' : '#FF4A5A';
        }

        return (
          <p key={i} style={{ margin:0, fontSize:'0.82rem', fontWeight:700, color:textColor, fontFamily:S, textTransform:'capitalize' }}>
            {displayName}: {displayValue}%
          </p>
        );
      })}
    </motion.div>
  );
}

function KpiCard({ k, i, inView }) {
  const animated = useCountUp(k.num, 1400, inView);
  const display = k.suffix === '%' ? `${animated.toFixed(0)}%` : Math.round(animated);
  return (
    <Card delay={0.05+i*0.08} glow={k.color} hover style={{ padding:16 }}>
      <motion.div animate={{ opacity:[0.4,0.7,0.4] }} transition={{ duration:3, repeat:Infinity, delay:i*0.3 }}
        style={{ position:'absolute', top:-30, right:-30, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle,${k.color}18,transparent 70%)`, pointerEvents:'none' }}/>
      <p style={{ margin:'0 0 8px', fontSize:'0.64rem', color:'rgba(255,255,255,0.4)', fontFamily:S, letterSpacing:'1px', fontWeight:700, textTransform:'uppercase', position:'relative', zIndex:2 }}>{k.label}</p>
      <div style={{ display:'flex', alignItems:'baseline', gap:7, position:'relative', zIndex:2 }}>
        <span style={{ fontSize:'1.75rem', fontWeight:800, color:'#fff', fontFamily:S, lineHeight:1, textShadow:'none' }}>{display}</span>
        <span style={{ fontSize:'0.7rem', fontWeight:700, color:k.color, display:'flex', alignItems:'center', gap:3 }}>
          {k.up ? <FaArrowUp size={8}/> : <FaArrowDown size={8}/>}{k.delta}
        </span>
      </div>
      <div style={{ height:36, marginTop:8, marginLeft:-4, marginRight:-4, position:'relative', zIndex:2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={k.spark.map((v,x)=>({x,v}))}>
            <defs>
              <linearGradient id={`spark${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={k.color} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={k.color} stopOpacity={0}/>
              </linearGradient>
              <filter id={`sparkGlow${i}`}><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <Area type="monotone" dataKey="v" stroke={k.color} strokeWidth={2} fill={`url(#spark${i})`} dot={false}
               isAnimationActive animationDuration={1400}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function DashboardHome({
  firstName, greeting, accent, accentB, accentBr,
  moodToday, setMoodToday, MOODS,
  setShowBreath, setTab, setActiveAI, consultants,
  journalCount = 0, sessionCount = 12,
}) {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { once:true });

  const generateWaveData = (moodIndex) => {
    const points = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const labelIndices = { 0: 'Mon', 3: 'Tue', 7: 'Wed', 10: 'Thu', 13: 'Fri', 17: 'Sat', 20: 'Sun' };
    const isPositive = moodIndex === 0 || moodIndex === 3;
    
    for (let i = 0; i <= 20; i++) {
      const dayIndex = Math.min(6, Math.floor(i / 3));
      const dayName = days[dayIndex];
      const label = labelIndices[i] || '';
      
      let val = 0;
      if (isPositive) {
        if (i <= 10) {
          val = (i / 10) * 45;
        } else {
          val = ((20 - i) / 10) * 45;
        }
      } else {
        if (i <= 10) {
          if (i <= 5) {
            val = (i / 5) * 40;
          } else {
            val = ((10 - i) / 5) * 40;
          }
        } else {
          if (i <= 15) {
            val = -((i - 10) / 5) * 40;
          } else {
            val = -((20 - i) / 5) * 40;
          }
        }
      }
      
      const baselineMood = isPositive ? 70 : 48;
      const baselineCalm = isPositive ? 65 : 44;
      
      points.push({
        name: label,
        d: dayName,
        val: val,
        mood: Math.min(100, Math.max(0, baselineMood + Math.round(val * 0.45))),
        calm: Math.min(100, Math.max(0, baselineCalm + Math.round(val * 0.35))),
      });
    }
    return points;
  };

  const waveData = generateWaveData(moodToday);

  const KPIS = [
    { label:'Mood Score', num:82, suffix:'%', delta:'+8%',  up:true, color:'#10b981', spark:[58,62,60,66,71,74,82] },
    { label:'Day Streak', num:7,  suffix:'',  delta:'days', up:true, color:'#f59e0b', spark:[1,2,3,4,5,6,7] },
    { label:'Sessions',   num:sessionCount, suffix:'', delta:'+3', up:true, color:'#6366f1', spark:[2,4,3,6,5,7,8] },
    { label:'Journal',    num:journalCount, suffix:'', delta:'logs', up:true, color:'#f43f5e', spark:[0,1,1,2,3,3,4] },
  ];

  return (
    <motion.div ref={rootRef} key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
      style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden', background:'var(--bg-app)' }}>
        {/* Central Fluent spotlight glow */}
        <div style={{
          position:'absolute',
          top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:'700px', height:'700px',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,0.015) 0%, transparent 70%)',
          filter:'blur(80px)',
        }}/>
        <motion.div animate={{ x:[0,20,0], y:[0,-20,0] }} transition={{ duration:25, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'10%', left:'20%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,0.015), transparent 70%)', filter:'blur(60px)' }}/>
        <motion.div animate={{ x:[0,-20,0], y:[0,20,0] }} transition={{ duration:28, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', bottom:'15%', right:'20%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,0.01), transparent 70%)', filter:'blur(60px)' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        {/* Row 1: Greeting + Mood Checkin (Frosted glass panel) */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:14, padding:'16px 20px', background:'rgba(255,255,255,0.015)', border:'1px solid var(--border-subtle)', borderRadius:24, backdropFilter:'blur(20px)' }}>
          <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <p style={{ margin:'0 0 2px', fontFamily:S, fontSize:'0.65rem', letterSpacing:'2.5px', color:'rgba(255,255,255,0.3)', fontWeight:700 }}>{(greeting||'WELCOME').toUpperCase()}</p>
            <h1 style={{ margin:0, fontFamily:J, fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.5px', color:'#fff' }}>
              Hi {firstName} <motion.span animate={{ rotate:[0,18,-8,18,0] }} transition={{ duration:1.6, repeat:Infinity, repeatDelay:2.5 }} style={{ display:'inline-block' }}>👋</motion.span>
            </h1>
          </motion.div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-start' }}>
            <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', fontWeight:'700', letterSpacing:'1px', fontFamily:S }}>DAILY CHECK-IN</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {MOODS.map((m,i) => (
                <motion.button key={i} whileHover={{ scale:1.06, y:-1 }} whileTap={{ scale:0.96 }} onClick={() => setMoodToday(i)}
                  style={{ 
                    padding:'6px 12px', borderRadius:20, 
                    border:`1px solid ${moodToday===i?accent:'rgba(255,255,255,0.08)'}`,
                    background: moodToday===i?accentB:'rgba(255,255,255,0.02)', 
                    cursor:'pointer', display:'flex', alignItems:'center', gap:5,
                    transition:'all 0.2s', outline:'none' 
                  }}>
                  <span style={{ fontSize:'0.85rem' }}>{m.e}</span>
                  <span style={{ fontSize:'0.72rem', fontWeight:600, color:moodToday===i?accent:'rgba(255,255,255,0.4)', fontFamily:J }}>{m.l}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: 4 KPI Cards (KPI Metrics grid) */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {KPIS.map((k,i) => <KpiCard key={i} k={k} i={i} inView={inView}/>)}
        </div>

        {/* Row 3: 2-Column Split Dashboard (65% Chart & 35% Actions/AI Cards) */}
        <div style={{ display:'grid', gridTemplateColumns:'1.75fr 1fr', gap:20, marginBottom:20 }}>
          
          {/* Left Column: Wellness Overview & Activity */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Wellness Overview card */}
            <Card delay={0.3} glow={accent} style={{ flex: 1 }}>
              <CardTitle title="Wellness Overview" sub="Mood & calm — last 7 days"
                right={
                  <div style={{ padding:'4px 10px', background:accentB, border:`1px solid ${accentBr}`, borderRadius:20 }}>
                    <span style={{ fontSize:'0.68rem', color:accent, fontWeight:700, fontFamily:S }}>↑ 12% this week</span>
                  </div>
                }/>
              <div style={{ height:280, marginLeft:-18, position:'relative', zIndex:2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={waveData}>
                    <defs>
                      <linearGradient id="posBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.15}/>
                      </linearGradient>
                      <linearGradient id="negBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.15}/>
                      </linearGradient>
                      <linearGradient id="boundaryStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1"/>
                        <stop offset="50%" stopColor="#10b981"/>
                        <stop offset="100%" stopColor="#f43f5e"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={true}/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11, fontFamily:'Space Grotesk' }}/>
                    <YAxis domain={[-50, 50]} tickFormatter={(v) => `${v + 50}%`} axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} width={42}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3" />
                    <ReferenceLine x="Thu" stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3" />
                    <Bar dataKey="val" barSize={3.5} isAnimationActive animationDuration={1400}>
                      {waveData.map((entry, index) => {
                        const isPositiveVal = entry.val >= 0;
                        return (
                          <Cell key={`cell-${index}`} fill={isPositiveVal ? 'url(#posBarGrad)' : 'url(#negBarGrad)'} />
                        );
                      })}
                    </Bar>
                    <Area type="linear" dataKey="val" stroke="url(#boundaryStroke)" strokeWidth={2} fill="none" isAnimationActive animationDuration={1600} dot={false} activeDot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', gap:18, marginTop:8, paddingLeft:18, position:'relative', zIndex:2 }}>
                <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.74rem', color:'rgba(255,255,255,0.5)', fontFamily:J }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'#6366f1' }}/> Positive State
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.74rem', color:'rgba(255,255,255,0.5)', fontFamily:J }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'#f43f5e' }}/> Negative State
                </span>
              </div>
            </Card>

            {/* Weekly Activity card */}
            <Card delay={0.54} glow={accent}>
              <CardTitle title="Weekly Activity" sub="Check-ins & sessions"
                right={<span onClick={()=>setShowBreath(true)} style={{ fontSize:'0.7rem', color:accent, fontWeight:700, fontFamily:S, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><FaWind size={11}/> Breathe</span>}/>
              <div style={{ height:170, marginLeft:-22, position:'relative', zIndex:2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ACTIVITY}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity={1}/>
                        <stop offset="100%" stopColor={accent} stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.4)', fontSize:11, fontFamily:'Space Grotesk' }}/>
                    <YAxis axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} width={20}/>
                    <Tooltip content={<Tip/>} cursor={{ fill:'rgba(255,255,255,0.02)' }}/>
                    <Bar dataKey="v" fill="url(#barGrad)" radius={[4,4,0,0]} maxBarSize={22} isAnimationActive animationDuration={1400}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Right Column: AI Core quick select, Emotion Mix */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Aura Core selector */}
            <Card delay={0.42} glow="#f43f5e" hover onClick={() => { setActiveAI('AURA'); setTab('chat'); }} style={{ padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, position:'relative', zIndex:2 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#f43f5e' }}><FaBrain size={18}/></div>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(244,63,94,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#f43f5e' }}><FaArrowRight size={8}/></div>
              </div>
              <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>Aura Core</p>
              <p style={{ margin:'0 0 6px', fontSize:'0.62rem', color:'#f43f5e', fontFamily:S, letterSpacing:'1.5px', fontWeight:700 }}>EMOTIONAL SUPPORT</p>
              <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-secondary)', fontFamily:J, lineHeight:1.4 }}>Empathic checks and reflections.</p>
            </Card>

            {/* Max Core selector */}
            <Card delay={0.48} glow="#14b8a6" hover onClick={() => { setActiveAI('MAX'); setTab('chat'); }} style={{ padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, position:'relative', zIndex:2 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(20,184,166,0.08)', border:'1px solid rgba(20,184,166,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#14b8a6' }}><FaRobot size={18}/></div>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(20,184,166,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:'#14b8a6' }}><FaArrowRight size={8}/></div>
              </div>
              <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:800, fontSize:'1.1rem', color:'#fff' }}>Max Core</p>
              <p style={{ margin:'0 0 6px', fontSize:'0.62rem', color:'#14b8a6', fontFamily:S, letterSpacing:'1.5px', fontWeight:700 }}>COGNITIVE ANALYSIS</p>
              <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-secondary)', fontFamily:J, lineHeight:1.4 }}>Identify patterns and clear solutions.</p>
            </Card>

            {/* Emotion Mix PieChart */}
            <Card delay={0.36} glow="#5eb8ad">
              <CardTitle title="Emotion Mix" sub="Weekly breakdown"/>
              <div style={{ height:140, position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:120, height:120, position:'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={EMOTION_SPLIT} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={56} paddingAngle={3} stroke="none" isAnimationActive animationDuration={1400}>
                        {EMOTION_SPLIT.map((e,i) => <Cell key={i} fill={e.color}/>)}
                      </Pie>
                      <Tooltip content={<Tip/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                    <span style={{ fontSize:'1.15rem', fontWeight:800, color:'#fff', fontFamily:S, lineHeight:1 }}>44%</span>
                    <span style={{ fontSize:'0.62rem', color:'var(--text-secondary)', fontFamily:J }}>Calm</span>
                  </div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 12px', marginTop:8, position:'relative', zIndex:2 }}>
                {EMOTION_SPLIT.map((e,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:e.color, flexShrink:0 }}/>
                    <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.55)', fontFamily:J }}>{e.name}</span>
                    <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.3)', fontFamily:S, marginLeft:'auto' }}>{e.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>

        {/* Row 4: Experts & Recent Activities side-by-side */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:20, marginBottom:14 }}>
          
          {/* Top Experts Card */}
          <Card delay={0.6}>
            <CardTitle title="Top Experts" sub={`${consultants?.length||0} available`}
              right={<span onClick={()=>setTab('consult')} style={{ fontSize:'0.7rem', color:accent, fontWeight:700, fontFamily:S, cursor:'pointer' }}>See all →</span>}/>
            <div style={{ display:'flex', flexDirection:'column', gap:12, position:'relative', zIndex:2 }}>
              {(consultants||[]).slice(0,3).map((c,i) => (
                <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.7+i*0.08 }}
                  style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${c.color}35,${c.color}12)`, border:`1px solid ${c.color}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, fontSize:'0.75rem', color:c.color }}>
                    {(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 1px', fontSize:'0.78rem', fontWeight:700, color:'rgba(255,255,255,0.82)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</p>
                    <p style={{ margin:0, fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.spec}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                    <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#f59e0b' }}>★{c.rating}</span>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:c.avail?'#10b981':'rgba(255,255,255,0.12)' }}/>
                  </div>
                </motion.div>
              ))}
              {(!consultants || consultants.length===0) && (
                <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.3)', fontFamily:J, textAlign:'center', padding:'14px 0' }}>No experts yet</p>
              )}
            </div>
          </Card>

          {/* Recent Activity Card */}
          <Card delay={0.66}>
            <CardTitle title="Recent Activity" sub="Your latest interactions"/>
            <div style={{ display:'flex', flexDirection:'column', gap:4, position:'relative', zIndex:2 }}>
              {[
                { icon:'💬', label:'Chat with Aura', meta:'Emotional check-in', time:'2h ago', tag:'Completed', tagColor:'#10b981' },
                { icon:'🧘', label:'Calm Morning meditation', meta:'5 min session', time:'5h ago', tag:'Completed', tagColor:'#10b981' },
                { icon:'📓', label:'Journal entry', meta:'Evening reflection', time:'1d ago', tag:'Saved', tagColor:'#6366f1' },
                { icon:'🧠', label:'Brain Report generated', meta:'Stress down 12%', time:'2d ago', tag:'Insight', tagColor:'#0ea5e9' },
              ].map((a,i) => (
                <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.75+i*0.07 }}
                  whileHover={{ x:4, background:'rgba(255,255,255,0.02)' }}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 8px', borderRadius:10, borderBottom: i<3 ? '1px solid rgba(255,255,255,0.03)':'none' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>{a.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 1px', fontSize:'0.82rem', fontWeight:700, color:'rgba(255,255,255,0.85)', fontFamily:J }}>{a.label}</p>
                    <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', fontFamily:J }}>{a.meta}</p>
                  </div>
                  <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', fontFamily:S, flexShrink:0 }}>{a.time}</span>
                  <span style={{ fontSize:'0.64rem', fontWeight:700, color:a.tagColor, background:`${a.tagColor}12`, padding:'3px 9px', borderRadius:20, fontFamily:J, flexShrink:0 }}>{a.tag}</span>
                </motion.div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </motion.div>
  );
}

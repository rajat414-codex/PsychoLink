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
  { name:'Calm', value:44, color:'#5eb8ad' },
  { name:'Anxious', value:23, color:'#e0524d' },
  { name:'Focused', value:21, color:'#8b87f5' },
  { name:'Low', value:12, color:'#c79552' },
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
      whileHover={hover ? { y:-4, transition:{ duration:0.25 } } : undefined}
      onClick={onClick}
      style={{
        position:'relative',
        background:'rgba(255, 255, 255, 0.015)',
        backdropFilter:'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        border:'1px solid rgba(255, 255, 255, 0.06)',
        borderRadius:24, padding:20,
        boxShadow: glow
          ? `0 12px 40px rgba(0,0,0,0.5), 0 0 50px ${glow}10, inset 0 1px 0 rgba(255,255,255,0.08)`
          : '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        overflow:'hidden',
        ...style,
      }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)', pointerEvents:'none' }}/>
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
        const displayName = p.name === 'moodVal' ? 'Mood' : p.name === 'calmVal' ? 'Calm' : p.name;
        const displayValue = isVal ? p.value + 50 : p.value;
        return (
          <p key={i} style={{ margin:0, fontSize:'0.82rem', fontWeight:700, color:p.color||p.stroke||p.fill, fontFamily:S, textTransform:'capitalize' }}>
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
        style={{ position:'absolute', top:-30, right:-30, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle,${k.color}33,transparent 70%)`, pointerEvents:'none' }}/>
      <p style={{ margin:'0 0 8px', fontSize:'0.64rem', color:'rgba(255,255,255,0.4)', fontFamily:S, letterSpacing:'1px', fontWeight:700, textTransform:'uppercase', position:'relative', zIndex:2 }}>{k.label}</p>
      <div style={{ display:'flex', alignItems:'baseline', gap:7, position:'relative', zIndex:2 }}>
        <span style={{ fontSize:'1.75rem', fontWeight:800, color:'#fff', fontFamily:S, lineHeight:1, textShadow:`0 0 20px ${k.color}55` }}>{display}</span>
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
              filter={`url(#sparkGlow${i})`} isAnimationActive animationDuration={1400}/>
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
    { label:'Mood Score', num:82, suffix:'%', delta:'+8%',  up:true, color:'#5eb8ad', spark:[58,62,60,66,71,74,82] },
    { label:'Day Streak', num:7,  suffix:'',  delta:'days', up:true, color:'#c79552', spark:[1,2,3,4,5,6,7] },
    { label:'Sessions',   num:sessionCount, suffix:'', delta:'+3', up:true, color:'#8b87f5', spark:[2,4,3,6,5,7,8] },
    { label:'Journal',    num:journalCount, suffix:'', delta:'logs', up:true, color:'#e0524d', spark:[0,1,1,2,3,3,4] },
  ];

  return (
    <motion.div ref={rootRef} key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
      style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden', background:'#070709' }}>
        {/* Central Fluent spotlight glow */}
        <div style={{
          position:'absolute',
          top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          width:'700px', height:'700px',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,255,255,0.045) 0%, transparent 60%)',
          filter:'blur(80px)',
        }}/>
        <motion.div animate={{ x:[0,20,0], y:[0,-20,0] }} transition={{ duration:25, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'10%', left:'20%', width:350, height:350, borderRadius:'50%', background:`radial-gradient(circle, ${accent}0b, transparent 70%)`, filter:'blur(60px)' }}/>
        <motion.div animate={{ x:[0,-20,0], y:[0,20,0] }} transition={{ duration:28, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', bottom:'15%', right:'20%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,135,245,0.08), transparent 70%)', filter:'blur(60px)' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:14 }}>
          <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <p style={{ margin:'0 0 4px', fontFamily:S, fontSize:'0.7rem', letterSpacing:'2px', color:'rgba(255,255,255,0.3)', fontWeight:700 }}>{(greeting||'WELCOME').toUpperCase()}</p>
            <h1 style={{ margin:0, fontFamily:J, fontWeight:800, fontSize:'1.95rem', letterSpacing:'-0.5px', color:'#fff' }}>
              Hi {firstName} <motion.span animate={{ rotate:[0,18,-8,18,0] }} transition={{ duration:1.6, repeat:Infinity, repeatDelay:2.5 }} style={{ display:'inline-block' }}>👋</motion.span>
            </h1>
          </motion.div>
          <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}
            style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
            {MOODS.map((m,i) => (
              <motion.button key={i} whileHover={{ scale:1.08, y:-2 }} whileTap={{ scale:0.94 }} onClick={() => setMoodToday(i)}
                style={{ padding:'7px 12px', borderRadius:30, border:`1px solid ${moodToday===i?accent:'rgba(255,255,255,0.1)'}`,
                  background: moodToday===i?accentB:'rgba(255,255,255,0.03)', cursor:'pointer', display:'flex', alignItems:'center', gap:5,
                  boxShadow: moodToday===i?`0 0 18px ${accent}40`:'none', transition:'box-shadow 0.3s' }}>
                <span style={{ fontSize:'0.95rem' }}>{m.e}</span>
                <span style={{ fontSize:'0.74rem', fontWeight:600, color:moodToday===i?accent:'rgba(255,255,255,0.4)', fontFamily:J }}>{m.l}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
          {KPIS.map((k,i) => <KpiCard key={i} k={k} i={i} inView={inView}/>)}
        </div>

        <div style={{ marginBottom:14 }}>
          <Card delay={0.3} glow={accent}>
            <CardTitle title="Wellness Overview" sub="Mood & calm — last 7 days"
              right={<motion.div whileHover={{ scale:1.05 }} style={{ padding:'4px 10px', background:accentB, border:`1px solid ${accentBr}`, borderRadius:20, boxShadow:`0 0 14px ${accent}25` }}>
                <span style={{ fontSize:'0.68rem', color:accent, fontWeight:700, fontFamily:S }}>↑ 12% this week</span>
              </motion.div>}/>
            <div style={{ height:280, marginLeft:-18, position:'relative', zIndex:2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={waveData}>
                  <defs>
                    <linearGradient id="posBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b87f5" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#5eb8ad" stopOpacity={0.15}/>
                    </linearGradient>
                    <linearGradient id="negBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4A5A" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.15}/>
                    </linearGradient>
                    
                    <linearGradient id="boundaryStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b87f5"/>
                      <stop offset="50%" stopColor="#5eb8ad"/>
                      <stop offset="100%" stopColor="#FF4A5A"/>
                    </linearGradient>
                    
                    <filter id="lineGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    
                    {/* Arrow markers for Cartesian axes */}
                    <marker id="arrow-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="rgba(255,255,255,0.4)" />
                    </marker>
                    <marker id="arrow-up" viewBox="0 0 10 10" refX="5" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 1.5 10 L 5 0 L 8.5 10 z" fill="rgba(255,255,255,0.4)" />
                    </marker>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
                  
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Space Grotesk' }}/>
                  <YAxis domain={[-50, 50]} tickFormatter={(v) => `${v + 50}%`} axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.25)', fontSize:10 }} width={42}/>
                  <Tooltip content={<Tip/>}/>
                  
                  {/* Central Cartesian axes crossing at center (Thursday acts as horizontal midpoint) */}
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} markerEnd="url(#arrow-right)" />
                  <ReferenceLine x="Thu" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} markerEnd="url(#arrow-up)" />
                  
                  {/* Thin vertical stems representing hand-drawn waveform lines */}
                  <Bar dataKey="val" barSize={3.5} isAnimationActive animationDuration={1400}>
                    {waveData.map((entry, index) => {
                      const isPositiveVal = entry.val >= 0;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isPositiveVal ? 'url(#posBarGrad)' : 'url(#negBarGrad)'} 
                        />
                      );
                    })}
                  </Bar>
                  
                  {/* Sharp outer triangular boundary line */}
                  <Area 
                    type="linear" 
                    dataKey="val" 
                    stroke="url(#boundaryStroke)" 
                    strokeWidth={2} 
                    fill="none" 
                    filter="url(#lineGlow)" 
                    isAnimationActive 
                    animationDuration={1600} 
                    dot={false} 
                    activeDot={false} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:'flex', gap:18, marginTop:8, paddingLeft:18, position:'relative', zIndex:2 }}>
              <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.74rem', color:'rgba(255,255,255,0.5)', fontFamily:J }}>
                <span style={{ width:9, height:9, borderRadius:'50%', background:'#8b87f5', boxShadow:'0 0 8px #8b87f5' }}/> Positive State
              </span>
              <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.74rem', color:'rgba(255,255,255,0.5)', fontFamily:J }}>
                <span style={{ width:9, height:9, borderRadius:'50%', background:'#FF4A5A', boxShadow:'0 0 8px #FF4A5A' }}/> Negative State
              </span>
            </div>
          </Card>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          {[
            { ai:'AURA', name:'Aura', sub:'EMOTIONAL SUPPORT', desc:"Feeling overwhelmed? Let's talk it through.", color:'#e0524d', icon:<FaBrain size={20}/> },
            { ai:'MAX',  name:'Max',  sub:'COGNITIVE ANALYSIS', desc:'Break patterns, build clear solutions.',  color:'#5eb8ad', icon:<FaRobot size={20}/> },
          ].map((ai,i) => (
            <Card key={i} delay={0.42+i*0.06} glow={ai.color} hover onClick={() => { setActiveAI(ai.ai); setTab('chat'); }}
              style={{ borderColor:`${ai.color}22` }}>
              <motion.div animate={{ scale:[1,1.15,1], opacity:[0.3,0.6,0.3] }} transition={{ duration:4, repeat:Infinity, delay:i*0.5 }}
                style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle,${ai.color}33,transparent 70%)`, pointerEvents:'none' }}/>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, position:'relative', zIndex:2 }}>
                <div style={{ width:42, height:42, borderRadius:13, background:`${ai.color}1a`, border:`1px solid ${ai.color}40`, display:'flex', alignItems:'center', justifyContent:'center', color:ai.color, boxShadow:`0 0 20px ${ai.color}30` }}>{ai.icon}</div>
                <motion.div whileHover={{ x:3 }} style={{ width:26, height:26, borderRadius:'50%', background:`${ai.color}1a`, display:'flex', alignItems:'center', justifyContent:'center', color:ai.color }}><FaArrowRight size={10}/></motion.div>
              </div>
              <p style={{ margin:'0 0 3px', fontFamily:J, fontWeight:800, fontSize:'1.15rem', color:'#fff', position:'relative', zIndex:2 }}>{ai.name}</p>
              <p style={{ margin:'0 0 8px', fontSize:'0.64rem', color:ai.color, fontFamily:S, letterSpacing:'1.5px', fontWeight:700, position:'relative', zIndex:2 }}>{ai.sub}</p>
              <p style={{ margin:0, fontSize:'0.8rem', color:'rgba(255,255,255,0.45)', fontFamily:J, lineHeight:1.5, position:'relative', zIndex:2 }}>{ai.desc}</p>
            </Card>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1fr', gap:12, marginBottom:14 }}>
          <Card delay={0.54} glow={accent}>
            <CardTitle title="Weekly Activity" sub="Check-ins & sessions"
              right={<motion.span whileHover={{ scale:1.05 }} onClick={()=>setShowBreath(true)} style={{ fontSize:'0.7rem', color:accent, fontWeight:700, fontFamily:S, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><FaWind size={11}/> Breathe</motion.span>}/>
            <div style={{ height:150, marginLeft:-22, position:'relative', zIndex:2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ACTIVITY}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={1}/>
                      <stop offset="100%" stopColor={accent} stopOpacity={0.2}/>
                    </linearGradient>
                    <filter id="barGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11, fontFamily:'Space Grotesk' }}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'rgba(255,255,255,0.22)', fontSize:10 }} width={20}/>
                  <Tooltip content={<Tip/>} cursor={{ fill:'rgba(255,255,255,0.03)' }}/>
                  <Bar dataKey="v" fill="url(#barGrad)" radius={[6,6,0,0]} maxBarSize={26} filter="url(#barGlow)" isAnimationActive animationDuration={1400}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card delay={0.36} glow="#5eb8ad">
            <CardTitle title="Emotion Mix" sub="This week's breakdown"/>
            <div style={{ height:150, position:'relative', zIndex:2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <Pie data={EMOTION_SPLIT} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={66} paddingAngle={3} stroke="none" filter="url(#pieGlow)" isAnimationActive animationDuration={1400}>
                    {EMOTION_SPLIT.map((e,i) => <Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip content={<Tip/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                <span style={{ fontSize:'1.3rem', fontWeight:800, color:'#fff', fontFamily:S, lineHeight:1, textShadow:'0 0 20px rgba(94,184,173,0.6)' }}>44%</span>
                <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>Calm</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:8, position:'relative', zIndex:2 }}>
              {EMOTION_SPLIT.map((e,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:7, height:7, borderRadius:2, background:e.color, flexShrink:0, boxShadow:`0 0 6px ${e.color}` }}/>
                  <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.55)', fontFamily:J }}>{e.name}</span>
                  <span style={{ fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', fontFamily:S, marginLeft:'auto' }}>{e.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card delay={0.6}>
            <CardTitle title="Top Experts" sub={`${consultants?.length||0} available`}
              right={<span onClick={()=>setTab('consult')} style={{ fontSize:'0.7rem', color:accent, fontWeight:700, fontFamily:S, cursor:'pointer' }}>See all →</span>}/>
            <div style={{ display:'flex', flexDirection:'column', gap:12, position:'relative', zIndex:2 }}>
              {(consultants||[]).slice(0,3).map((c,i) => (
                <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.7+i*0.08 }}
                  style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${c.color}55,${c.color}22)`, border:`1.5px solid ${c.color}45`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, fontSize:'0.78rem', color:c.color, boxShadow:`0 0 14px ${c.color}25` }}>
                    {(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ margin:'0 0 1px', fontSize:'0.8rem', fontWeight:700, color:'rgba(255,255,255,0.82)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</p>
                    <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.spec}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    <span style={{ fontSize:'0.74rem', fontWeight:700, color:'#c79552' }}>★{c.rating}</span>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:c.avail?'#56a06f':'rgba(255,255,255,0.15)', boxShadow:c.avail?'0 0 8px #56a06f':'none' }}/>
                  </div>
                </motion.div>
              ))}
              {(!consultants || consultants.length===0) && (
                <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.3)', fontFamily:J, textAlign:'center', padding:'14px 0' }}>No experts yet</p>
              )}
            </div>
          </Card>
        </div>

        <Card delay={0.66}>
          <CardTitle title="Recent Activity" sub="Your latest interactions"/>
          <div style={{ display:'flex', flexDirection:'column', gap:4, position:'relative', zIndex:2 }}>
            {[
              { icon:'💬', label:'Chat with Aura', meta:'Emotional check-in', time:'2h ago', tag:'Completed', tagColor:'#56a06f' },
              { icon:'🧘', label:'Calm Morning meditation', meta:'5 min session', time:'5h ago', tag:'Completed', tagColor:'#56a06f' },
              { icon:'📓', label:'Journal entry', meta:'Evening reflection', time:'1d ago', tag:'Saved', tagColor:'#8b87f5' },
              { icon:'🧠', label:'Brain Report generated', meta:'Stress down 12%', time:'2d ago', tag:'Insight', tagColor:'#5eb8ad' },
            ].map((a,i) => (
              <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.75+i*0.07 }}
                whileHover={{ x:4, background:'rgba(255,255,255,0.03)' }}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 8px', borderRadius:10, borderBottom: i<3 ? '1px solid rgba(255,255,255,0.05)':'none' }}>
                <div style={{ width:36, height:36, borderRadius:11, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:'0 0 1px', fontSize:'0.84rem', fontWeight:700, color:'rgba(255,255,255,0.85)', fontFamily:J }}>{a.label}</p>
                  <p style={{ margin:0, fontSize:'0.7rem', color:'rgba(255,255,255,0.32)', fontFamily:J }}>{a.meta}</p>
                </div>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', fontFamily:S, flexShrink:0 }}>{a.time}</span>
                <span style={{ fontSize:'0.66rem', fontWeight:700, color:a.tagColor, background:`${a.tagColor}1a`, padding:'4px 10px', borderRadius:20, fontFamily:J, flexShrink:0, boxShadow:`0 0 12px ${a.tagColor}20` }}>{a.tag}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';
import { FaBrain, FaSync, FaLightbulb, FaShieldAlt, FaArrowUp } from 'react-icons/fa';

// ── Fonts ────────────────────────────────────────────────
const J  = "'Manrope','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const SF = "'Sora','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G  = "'Fraunces','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');`;

// ── ATTITUDE Palette ─────────────────────────────────────
const BLUSH   = '#F2E6EE';
const PINK    = '#FFCCF2';
const PERI    = '#977DFF';
const ORCHID  = '#0033FF';
const PLUM    = '#0600AB';
const NIGHT   = '#00033D';
const CARD    = 'rgba(2,6,48,0.75)';
const BORDER  = '1px solid rgba(151,125,255,0.14)';

// ── Emotion configs ──────────────────────────────────────
const NEG = [
  { id:'anxiety',    label:'Anxiety',    icon:'😰', color:'#6F86FF' },
  { id:'depression', label:'Depression', icon:'🌧️', color:'#0033FF' },
  { id:'stress',     label:'Stress',     icon:'🔥', color:'#977DFF' },
  { id:'loneliness', label:'Loneliness', icon:'🌑', color:'#4D4DBF' },
  { id:'overwhelm',  label:'Overwhelm',  icon:'🌊', color:'#8899FF' },
  { id:'burnout',    label:'Burnout',    icon:'🪫', color:'#2E46D8' },
];
const POS = [
  { id:'calmness',   label:'Calmness',   icon:'🍃', color:'#F2E6EE' },
  { id:'happiness',  label:'Happiness',  icon:'😊', color:'#FFCCF2' },
  { id:'focus',      label:'Focus',      icon:'🎯', color:'#B8A6FF' },
  { id:'energy',     label:'Energy',     icon:'⚡', color:'#977DFF' },
  { id:'confidence', label:'Confidence', icon:'💪', color:'#FFAEE9' },
  { id:'peace',      label:'Inner Peace',icon:'🕊️', color:'#CDB9FF' },
];
const RECS = {
  anxiety:    { icon:'🫁', title:'Anxiety Regulation',   desc:'4-7-8 breathing. Cold water on face. 5-4-3-2-1 grounding technique.', tag:'Breathwork & Grounding' },
  depression: { icon:'🌅', title:'Mood Lifting',         desc:'Morning sunlight 15 min. Small wins daily. Talk to one person today.', tag:'Light & Connection' },
  stress:     { icon:'🏃', title:'Stress Reset',         desc:'30 min brisk walk daily. Cold morning shower. Cut caffeine.', tag:'Exercise & Cold Therapy' },
  loneliness: { icon:'💬', title:'Social Reconnection',  desc:'Message one friend today. Join a community. Volunteer weekly.', tag:'Connection Building' },
  overwhelm:  { icon:'📋', title:'Mental Decluttering',  desc:'Brain dump on paper. Pick only 3 priorities per day. Say no.', tag:'Prioritization' },
  burnout:    { icon:'🔋', title:'Energy Recovery',      desc:'Strict work boundaries. 2 full rest days. Hobby time non-negotiable.', tag:'Rest & Boundaries' },
};
const CURES = [
  { icon:'🌬️', title:'Breathwork',  desc:'Box breathing 4-4-4-4 for 5 mins when anxious',      color:'#8899FF' },
  { icon:'🚶', title:'Movement',    desc:'30 min brisk walk — lowers cortisol by 26%',           color:'#FFCCF2' },
  { icon:'💤', title:'Sleep Reset', desc:'Sleep by 10:30 PM — brain detoxes during deep sleep',  color:'#B8A6FF' },
  { icon:'📓', title:'Journaling',  desc:'Write 3 gratitude points every morning',               color:'#F2E6EE' },
  { icon:'🧘', title:'Meditation',  desc:'10 min daily — clinically shrinks the amygdala',       color:'#FFAEE9' },
  { icon:'🥗', title:'Nutrition',   desc:'Omega-3, walnuts, dark greens — direct brain fuel',   color:'#977DFF' },
];

const DEMO_NEG = { anxiety:72, depression:48, stress:68, loneliness:40, overwhelm:62, burnout:55 };
const DEMO_POS = { calmness:78, happiness:72, focus:70, energy:68, confidence:66, peace:74 };
const DEMO     = {
  overallStress:62, dominantEmotion:'anxiety', urgency:'high',
  summary:'Elevated anxiety and stress patterns detected. Emotional overwhelm is impacting your daily clarity. Consistent practice can reverse this in 4–6 weeks.',
  insights:['Anxiety is your dominant pattern — driven by future-focused worry','Stress and overwhelm are amplifying each other in a loop','Consistent daily practices can reverse this in 4–6 weeks'],
};

const urgentColor = u => ({ low:'#977DFF', moderate:'#B8A6FF', high:'#FFCCF2', critical:'#FF9EE4' }[u] || '#977DFF');
const scoreColor  = s => s < 35 ? '#6F86FF' : s < 60 ? '#977DFF' : '#FFCCF2';

// ────────────────────────────────────────────────────────
// BAR CHART
// ────────────────────────────────────────────────────────
function BarChart({ items = [], values = {} }) {
  // Bright blue palette — all visible on dark bg (light → vivid blue)
  const PALETTE = ['#BFE6FA', '#7FC9E8', '#4FB6E0', '#36A3DB', '#5B8DEF'];
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'180px', padding:'0 2px' }}>
      {items.map((em, i) => {
        const v = values[em.id] || 0;
        const h = Math.max((v / 100) * 100, 4);
        const pc = PALETTE[i % PALETTE.length];
        return (
          <div key={em.id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'flex-end' }}>
            <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6+i*0.08 }}
              style={{ fontSize:'0.68rem', fontWeight:'800', color:'rgba(255,255,255,0.9)', fontFamily:SF, marginBottom:'5px',
                filter:'none' }}>
              {v}%
            </motion.span>
            <motion.div initial={{ height:0 }} animate={{ height:`${h}%` }}
              transition={{ duration:1.1, ease:'easeOut', delay:0.15+i*0.08 }}
              style={{ width:'100%', maxWidth:'34px', borderRadius:'2px 2px 0 0', position:'relative', overflow:'hidden',
                background:`linear-gradient(180deg,${pc}55 0%,${pc}2e 50%,${pc}12 100%)`,
                border:`1px solid ${pc}77`,
                borderBottom:'none',
                boxShadow:`inset 0 1px 0 ${pc}55, 0 0 16px ${pc}1a` }}>
              {/* soft top frosted highlight */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%',
                background:`linear-gradient(180deg,${pc}33,transparent)`, pointerEvents:'none' }}/>
            </motion.div>
            <span style={{ fontSize:'0.9rem', marginTop:'4px' }}>{em.icon}</span>
            <span style={{ fontSize:'0.56rem', color:'rgba(228,228,255,0.45)', fontFamily:SF, fontWeight:'600', marginTop:'2px', textAlign:'center' }}>
              {em.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// GAUSSIAN PEAK CHART (AI-Market style)
// ────────────────────────────────────────────────────────
function PeakChart({ negScores = {}, posScores = {} }) {
  const data = [
    ...NEG.map(em => ({ name: em.label, icon: em.icon, stress: negScores[em.id]||0, wellness: 0 })),
    ...POS.map(em => ({ name: em.label, icon: em.icon, stress: 0, wellness: posScores[em.id]||0 })),
  ];

  // find peak points to pin callouts
  const sIdx = data.reduce((bi,d,i,a)=> d.stress   > a[bi].stress   ? i : bi, 0);
  const wIdx = data.reduce((bi,d,i,a)=> d.wellness > a[bi].wellness ? i : bi, 0);
  const peakStress = data[sIdx]?.stress || 0;
  const peakWell   = data[wIdx]?.wellness || 0;
  const dominant   = peakStress >= peakWell ? { label:data[sIdx]?.name, v:peakStress, c:'#A855F7' }
                                            : { label:data[wIdx]?.name, v:peakWell,  c:'#D946EF' };

  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const row = payload.filter(p => p.value > 0);
    if (!row.length) return null;
    return (
      <div style={{ background:'rgba(13,15,35,0.97)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:14, padding:'11px 16px', boxShadow:'0 16px 40px rgba(0,0,0,0.65)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2 }}>
          <span style={{ fontSize:'0.95rem' }}>{payload[0]?.payload?.icon}</span>
          <p style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#fff', fontFamily:SF }}>{row[0].value}%</p>
        </div>
        <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontFamily:SF }}>{label} · {row[0].name}</p>
      </div>
    );
  };

  // glowing pulse dot for the peak reference
  const PulseDot = (color) => (props) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r="11" fill={color} opacity="0.18">
          <animate attributeName="r" values="8;15;8" dur="2.2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={cx} cy={cy} r="5" fill={color} stroke="#fff" strokeWidth="2" style={{ filter:`drop-shadow(0 0 8px ${color})` }}/>
        <circle cx={cx} cy={cy} r="2" fill="#fff"/>
      </g>
    );
  };

  return (
    <div style={{ position:'relative', borderRadius:'18px', overflow:'hidden', padding:'16px 8px 4px',
      background:'linear-gradient(165deg,rgba(99,102,241,0.07),rgba(168,85,247,0.04))',
      border:'1px solid rgba(255,255,255,0.08)',
      boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)' }}>

      {/* animated shimmer sweep */}
      <style>{`@keyframes nrSweep{0%{transform:translateX(-120%)}100%{transform:translateX(420%)}}`}</style>
      <div style={{ position:'absolute', top:0, bottom:0, left:0, width:'18%', zIndex:2, pointerEvents:'none',
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
        animation:'nrSweep 6s ease-in-out infinite 1.5s' }}/>

      {/* ambient glow */}
      <div style={{ position:'absolute', top:-50, left:'20%', width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.22),transparent 70%)', filter:'blur(55px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-40, right:'15%', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,70,239,0.18),transparent 70%)', filter:'blur(55px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)', pointerEvents:'none' }}/>

      {/* header row: title + dominant stat */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 10px 12px', position:'relative', zIndex:3 }}>
        <div>
          <p style={{ margin:'0 0 2px', fontSize:'0.92rem', fontWeight:800, color:'#fff', fontFamily:SF }}>Intensity Curve</p>
          <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', fontFamily:SF }}>Across all 12 emotions</p>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:6, justifyContent:'flex-end' }}>
            <span style={{ fontSize:'1.4rem', fontWeight:800, color:'#fff', fontFamily:SF, lineHeight:1, textShadow:`0 0 18px ${dominant.c}77` }}>{dominant.v}%</span>
          </div>
          <p style={{ margin:'2px 0 0', fontSize:'0.66rem', color:dominant.c, fontFamily:SF, fontWeight:700 }}>Peak · {dominant.label}</p>
        </div>
      </div>

      <div style={{ height:250, width:'100%', position:'relative', zIndex:1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:24, right:18, left:-8, bottom:0 }}>
            <defs>
              <linearGradient id="strokeStress" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6"/><stop offset="55%" stopColor="#8B5CF6"/><stop offset="100%" stopColor="#A855F7"/>
              </linearGradient>
              <linearGradient id="strokeWell" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6"/><stop offset="55%" stopColor="#D946EF"/><stop offset="100%" stopColor="#EC4899"/>
              </linearGradient>
              <linearGradient id="fillStress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.5}/><stop offset="60%" stopColor="#8B5CF6" stopOpacity={0.12}/><stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="fillWell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D946EF" stopOpacity={0.42}/><stop offset="60%" stopColor="#EC4899" stopOpacity={0.1}/><stop offset="100%" stopColor="#EC4899" stopOpacity={0}/>
              </linearGradient>
              <filter id="curveGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 8" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="name" axisLine={false} tickLine={false}
              tick={{ fill:'rgba(255,255,255,0.4)', fontSize:9, fontFamily:'Sora', fontWeight:600 }}
              interval={0} angle={-30} textAnchor="end" height={52}/>
            <YAxis axisLine={false} tickLine={false} width={32}
              tick={{ fill:'rgba(255,255,255,0.26)', fontSize:10, fontFamily:'Sora' }} tickFormatter={(v)=>`${v}%`}/>
            <Tooltip content={<Tip/>} cursor={{ stroke:'rgba(255,255,255,0.2)', strokeWidth:1, strokeDasharray:'4 4' }}/>
            <Area type="monotone" dataKey="stress" name="Stress" stroke="url(#strokeStress)" strokeWidth={3.5}
              fill="url(#fillStress)" filter="url(#curveGlow)" dot={false} activeDot={{ r:6, fill:'#8B5CF6', stroke:'#fff', strokeWidth:2.5 }} isAnimationActive animationDuration={1600}/>
            <Area type="monotone" dataKey="wellness" name="Wellness" stroke="url(#strokeWell)" strokeWidth={3.5}
              fill="url(#fillWell)" filter="url(#curveGlow)" dot={false} activeDot={{ r:6, fill:'#D946EF', stroke:'#fff', strokeWidth:2.5 }} isAnimationActive animationDuration={1800}/>
            {/* pinned glowing peaks */}
            {peakStress > 0 && <ReferenceDot x={data[sIdx].name} y={peakStress} shape={PulseDot('#A855F7')} isFront/>}
            {peakWell   > 0 && <ReferenceDot x={data[wIdx].name} y={peakWell}   shape={PulseDot('#D946EF')} isFront/>}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* peak chips */}
      <div style={{ display:'flex', justifyContent:'center', gap:24, padding:'4px 12px 12px', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:9, height:9, borderRadius:'50%', background:'#8B5CF6', boxShadow:'0 0 10px #8B5CF6' }}/>
          <span style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.55)', fontFamily:SF }}>Peak stress</span>
          <span style={{ fontSize:'0.88rem', fontWeight:800, color:'#A855F7', fontFamily:SF, textShadow:'0 0 12px rgba(168,85,247,0.6)' }}>{peakStress}%</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:9, height:9, borderRadius:'50%', background:'#D946EF', boxShadow:'0 0 10px #D946EF' }}/>
          <span style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.55)', fontFamily:SF }}>Peak wellness</span>
          <span style={{ fontSize:'0.88rem', fontWeight:800, color:'#EC4899', fontFamily:SF, textShadow:'0 0 12px rgba(236,72,153,0.6)' }}>{peakWell}%</span>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────
export default function NeurologicalReport({ messages = [], userProfile, activeAI, onHighStress }) {
  const [negScores, setNegScores] = useState(DEMO_NEG);
  const [posScores, setPosScores] = useState(DEMO_POS);
  const [analysis,  setAnalysis]  = useState(DEMO);
  const [loading,   setLoading]   = useState(false);
  const [activeEm,  setActiveEm]  = useState(null);
  const [history,   setHistory]   = useState([]);
  const [streak,    setStreak]    = useState(0);
  const [showHist,  setShowHist]  = useState(false);
  const [isDemo,    setIsDemo]    = useState(true);

  const userMessages = (messages || [])
    .filter(m => m?.role === 'user')
    .map(m => m?.content || '')
    .join(' ');

  // safe localStorage
  const store = {
    get:    (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } },
    set:    (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    remove: (k) => { try { localStorage.removeItem(k); } catch {} },
  };

  // load history once
  useEffect(() => {
    try {
      const saved = store.get('eq_hist');
      setHistory(saved);
      let s = 0;
      const dates = [...new Set(saved.map(h => new Date(h.ts).toDateString()))].reverse();
      for (let i = 0; i < dates.length; i++) {
        const d = new Date(); d.setDate(d.getDate()-i);
        if (dates[i] === d.toDateString()) s++; else break;
      }
      setStreak(s);
    } catch {}
  }, []);

  // analyze on mount + when messages change
  useEffect(() => {
    analyze(); // always try — API route handles empty messages gracefully
  }, [messages?.length]);

  const analyze = async () => {
    setLoading(true);
    setIsDemo(false);
    try {
      // Calls your local API route — add ANTHROPIC_API_KEY to .env.local
      const res = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: userMessages }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const p = await res.json();

      if (p.negative && p.projected) {
        setNegScores(p.negative);
        setPosScores(p.projected);
        setAnalysis(p);
        setIsDemo(false);
        // save session
        const sess = { ts: Date.now(), stress: p.overallStress||0, dom: p.dominantEmotion||'', urg: p.urgency||'low' };
        // Trigger SOS if stress is critical
        if (onHighStress && (p.urgency==='critical' || p.urgency==='high' || (p.overallStress||0) > 78)) {
          setTimeout(() => onHighStress(), 1200);
        }
        const saved = store.get('eq_hist');
        const upd = [...saved, sess].slice(-60);
        store.set('eq_hist', upd);
        setHistory(upd);
        let sk = 0;
        const dates = [...new Set(upd.map(h => new Date(h.ts).toDateString()))].reverse();
        for (let i=0; i<dates.length; i++) { const d=new Date(); d.setDate(d.getDate()-i); if(dates[i]===d.toDateString()) sk++; else break; }
        setStreak(sk);
      }
    } catch (err) {
      console.error('Analyze failed:', err);
      setIsDemo(true); // mark as demo if API fails
    }
    setLoading(false);
  };

  const addToCalendar = (title, desc = '', days = 1) => {
    try {
      const s = new Date(); s.setDate(s.getDate()+days);
      const e = new Date(s.getTime()+60*60*1000);
      const fmt = d => d.toISOString().replace(/[-:]|\.\d{3}/g,'').slice(0,15)+'00Z';
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(s)}/${fmt(e)}&details=${encodeURIComponent(desc)}`, '_blank');
    } catch {}
  };

  const topEm = Object.entries(negScores).sort(([,a],[,b])=>b-a).slice(0,3)
    .map(([id,score]) => ({ id, score, info: NEG.find(e=>e.id===id) }));
  const avgPos = Object.values(posScores).length
    ? Math.round(Object.values(posScores).reduce((a,b)=>a+b,0)/Object.values(posScores).length) : 0;
  const urgC = urgentColor(analysis?.urgency);

  return (
    <div style={{ height:'100vh', overflowY:'auto', background:`linear-gradient(160deg,${NIGHT} 0%,#020B40 50%,#0A0E5E 100%)`, fontFamily:J, position:'relative' }}>
      <style>{FONTS}</style>

      {/* ambient glow */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 70% 50% at 5% 0%,rgba(0,51,255,0.18),transparent),
          radial-gradient(ellipse 60% 40% at 95% 20%,rgba(151,125,255,0.13),transparent)` }}/>

      {/* HEADER */}
      <div style={{ padding:'13px 18px 11px', borderBottom:'1px solid rgba(151,125,255,0.12)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(2,6,48,0.90)', backdropFilter:'blur(20px)',
        position:'sticky', top:0, zIndex:20 }}>
        <div>
          <h2 style={{ margin:'0 0 2px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800,
            letterSpacing:'-0.5px', fontSize:'1.35rem', color:'#fff' }}>
            Emotional Analysis{' '}
            <span style={{ background:`linear-gradient(90deg,${PINK},${PERI})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Report</span>
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'2px' }}>
            <p style={{ margin:0, fontSize:'0.65rem', color:'rgba(228,228,255,0.35)', fontFamily:SF }}>
              {(messages||[]).filter(m=>m?.role==='user').length} messages · AI emotion mapping
            </p>
            {isDemo && (
              <span style={{ fontSize:'0.58rem', fontWeight:700, fontFamily:SF, letterSpacing:'1px',
                padding:'2px 8px', borderRadius:'10px',
                background:'rgba(255,200,100,0.15)', border:'1px solid rgba(255,200,100,0.30)',
                color:'rgba(255,200,100,0.85)' }}>
                DEMO DATA
              </span>
            )}
            {!isDemo && !loading && (
              <span style={{ fontSize:'0.58rem', fontWeight:700, fontFamily:SF, letterSpacing:'1px',
                padding:'2px 8px', borderRadius:'10px',
                background:'rgba(0,255,100,0.12)', border:'1px solid rgba(0,255,100,0.28)',
                color:'rgba(100,255,150,0.85)' }}>
                ✓ LIVE DATA
              </span>
            )}
          </div>
        </div>
        <div style={{ display:'flex', gap:'9px', alignItems:'center' }}>
          {analysis?.urgency && (
            <div style={{ padding:'4px 11px', borderRadius:'18px',
              background:`${urgC}18`, border:`1px solid ${urgC}40` }}>
              <span style={{ fontSize:'0.65rem', fontWeight:700, color:urgC, fontFamily:SF, letterSpacing:'1px' }}>
                {analysis.urgency.toUpperCase()}
              </span>
            </div>
          )}
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={analyze} disabled={loading}
            style={{ padding:'7px 14px', background:`linear-gradient(135deg,${ORCHID},${PLUM})`,
              border:'1px solid rgba(242,230,238,0.16)', borderRadius:'10px', color:'#fff',
              fontSize:'0.72rem', fontWeight:700, cursor:'pointer', fontFamily:SF,
              display:'flex', alignItems:'center', gap:'6px',
              boxShadow:'0 4px 18px rgba(0,51,255,0.45)', opacity: loading?0.7:1 }}>
            {loading
              ? <motion.div animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
                  style={{ width:'11px', height:'11px', borderRadius:'50%',
                    border:'2px solid rgba(255,255,255,0.25)', borderTopColor:'#fff' }}/>
              : <FaSync size={10}/>}
            {loading ? 'Analyzing…' : 'Re-analyze'}
          </motion.button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding:'15px 16px 32px', position:'relative', zIndex:1 }}>

        {/* ── ROW 1: Bar charts ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'13px', marginBottom:'13px' }}>

          <motion.div initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.45 }}
            style={{ background:`radial-gradient(ellipse at 50% 0%,rgba(0,51,255,0.22) 0%,rgba(2,6,48,0.97) 100%)`,
              border:`1px solid rgba(0,51,255,0.35)`, borderRadius:'18px', padding:'16px',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'3px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                <motion.div animate={{ scale:[1,1.3,1], opacity:[0.7,1,0.7] }} transition={{ duration:1.2, repeat:Infinity }}
                  style={{ width:'7px', height:'7px', borderRadius:'50%', background:ORCHID, boxShadow:'none' }}/>
                <p style={{ margin:0, fontFamily:SF, fontSize:'0.60rem', letterSpacing:'2px', color:'rgba(0,100,255,0.95)', fontWeight:700 }}>
                  YOUR EMOTIONS NOW
                </p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px', padding:'3px 9px', borderRadius:'14px',
                background:'rgba(0,51,255,0.12)', border:'1px solid rgba(0,51,255,0.30)' }}>
                <FaArrowUp size={7} color={ORCHID}/>
                <span style={{ fontSize:'0.63rem', fontWeight:800, color:ORCHID, fontFamily:SF }}>{analysis?.overallStress||0}%</span>
              </div>
            </div>
            <p style={{ margin:'0 0 12px', fontFamily:G, fontStyle:'italic', fontSize:'0.82rem', color:'rgba(255,255,255,0.52)' }}>
              Dominant: <span style={{ color:ORCHID, fontWeight:600 }}>{analysis?.dominantEmotion||'—'}</span>
            </p>
            <BarChart items={NEG} values={negScores}/>
          </motion.div>

          <motion.div initial={{ opacity:0, x:14 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.45, delay:0.1 }}
            style={{ background:`radial-gradient(ellipse at 50% 0%,rgba(151,125,255,0.22) 0%,rgba(3,4,42,0.97) 100%)`,
              border:`1px solid rgba(151,125,255,0.35)`, borderRadius:'18px', padding:'16px',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'3px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:2, repeat:Infinity }}
                  style={{ width:'7px', height:'7px', borderRadius:'50%', background:BLUSH, boxShadow:'none' }}/>
                <p style={{ margin:0, fontFamily:SF, fontSize:'0.60rem', letterSpacing:'2px', color:BLUSH, fontWeight:700 }}>
                  AFTER POSITIVE THERAPY
                </p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px', padding:'3px 9px', borderRadius:'14px',
                background:'rgba(242,230,238,0.10)', border:'1px solid rgba(242,230,238,0.25)' }}>
                <FaArrowUp size={7} color={BLUSH}/>
                <span style={{ fontSize:'0.63rem', fontWeight:800, color:BLUSH, fontFamily:SF }}>{avgPos}%</span>
              </div>
            </div>
            <p style={{ margin:'0 0 12px', fontFamily:G, fontStyle:'italic', fontSize:'0.82rem', color:'rgba(255,255,255,0.52)' }}>
              Projected after 6 weeks of consistent practice ✨
            </p>
            <BarChart items={POS} values={posScores}/>
          </motion.div>
        </div>

        {/* ── PEAK CHART ── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'16px',
            marginBottom:'13px', backdropFilter:'blur(10px)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <div>
              <p style={{ margin:0, fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
                color:'rgba(151,125,255,0.60)', fontWeight:700 }}>
                EMOTION INTENSITY — ALL 12 METRICS
              </p>
              <p style={{ margin:'3px 0 0', fontFamily:G, fontStyle:'italic', fontSize:'0.82rem', color:'rgba(242,230,238,0.45)' }}>
                Hover peaks for details · Left = negative · Right = positive
              </p>
            </div>
            <div style={{ display:'flex', gap:'12px' }}>
              {[['#8B5CF6','Stress emotions'],['#D946EF','Wellness emotions']].map(([c,l])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <div style={{ width:'9px', height:'9px', borderRadius:'50%', background:c, boxShadow:`0 0 5px ${c}` }}/>
                  <span style={{ fontSize:'0.62rem', color:'rgba(228,228,255,0.42)', fontFamily:SF }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <PeakChart negScores={negScores} posScores={posScores}/>
        </motion.div>

        {/* ── EMOTION BREAKDOWN ── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'16px',
            marginBottom:'13px', backdropFilter:'blur(10px)' }}>
          <p style={{ margin:'0 0 12px', fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
            color:'rgba(151,125,255,0.55)', fontWeight:600 }}>
            EMOTION BREAKDOWN — tap for recommendations
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'9px' }}>
            {NEG.map((em, i) => {
              const score = negScores[em.id] || 0;
              const c = scoreColor(score);
              const isA = activeEm === em.id;
              return (
                <motion.div key={em.id} layout onClick={() => setActiveEm(isA?null:em.id)}
                  style={{ cursor:'pointer', padding:'11px 13px', borderRadius:'13px',
                    background: isA?`${c}10`:'rgba(228,228,255,0.03)',
                    border:`1px solid ${isA?c+'48':'rgba(151,125,255,0.08)'}`,
                    transition:'border 0.2s, background 0.2s' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'5px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                      <span style={{ fontSize:'0.95rem' }}>{em.icon}</span>
                      <p style={{ margin:0, fontFamily:SF, fontSize:'0.73rem', fontWeight:700, color:'rgba(255,255,255,0.84)' }}>
                        {em.label}
                      </p>
                    </div>
                    <span style={{ fontFamily:SF, fontWeight:800, fontSize:'0.92rem', color:c,
                      filter:`drop-shadow(0 0 5px ${c})` }}>{score}%</span>
                  </div>
                  <div style={{ height:'3.5px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', marginBottom: isA?'9px':0 }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${score}%` }}
                      transition={{ duration:1.1, ease:'easeOut', delay:0.18+i*0.07 }}
                      style={{ height:'100%', background:`linear-gradient(90deg,${BLUSH}cc 0%,${c} 30%,${c}aa 100%)`,
                        borderRadius:'2px', boxShadow:'none' }}/>
                  </div>
                  <AnimatePresence>
                    {isA && RECS[em.id] && (
                      <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        style={{ borderTop:`1px solid ${c}22`, paddingTop:'9px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px' }}>
                          <span style={{ fontSize:'0.85rem' }}>{RECS[em.id].icon}</span>
                          <p style={{ margin:0, fontFamily:SF, fontSize:'0.70rem', fontWeight:700, color:c }}>{RECS[em.id].title}</p>
                        </div>
                        <p style={{ margin:'0 0 6px', fontSize:'0.67rem', color:'rgba(242,230,238,0.55)', fontFamily:J, lineHeight:1.6 }}>
                          {RECS[em.id].desc}
                        </p>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'2px 8px',
                          borderRadius:'18px', background:`${c}12`, border:`1px solid ${c}30` }}>
                          <FaLightbulb size={8} color={c}/>
                          <span style={{ fontSize:'0.58rem', color:c, fontWeight:600, fontFamily:SF }}>{RECS[em.id].tag}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── CURE + ACTIVITIES + AI SUMMARY ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'13px', marginBottom:'13px' }}>
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
            style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'16px' }}>
            <p style={{ margin:'0 0 12px', fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
              color:'rgba(151,125,255,0.55)', fontWeight:600 }}>🩺 CURE TO FOLLOW</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {CURES.map((c,i) => (
                <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:0.50+i*0.06 }}
                  style={{ display:'flex', gap:'10px', alignItems:'flex-start', padding:'8px 11px',
                    borderRadius:'11px', background:'rgba(228,228,255,0.03)', border:'1px solid rgba(151,125,255,0.07)' }}>
                  <span style={{ fontSize:'1.05rem', flexShrink:0, marginTop:'1px' }}>{c.icon}</span>
                  <div>
                    <p style={{ margin:'0 0 2px', fontFamily:SF, fontSize:'0.70rem', fontWeight:700, color:c.color }}>{c.title}</p>
                    <p style={{ margin:0, fontSize:'0.65rem', color:'rgba(242,230,238,0.46)', fontFamily:J, lineHeight:1.55 }}>{c.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div style={{ display:'flex', flexDirection:'column', gap:'11px' }}>
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.50 }}
              style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'16px', flex:1 }}>
              <p style={{ margin:'0 0 11px', fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
                color:'rgba(151,125,255,0.55)', fontWeight:600 }}>⚡ TOP ACTIVITIES</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {topEm.map(({ id, score, info }) => {
                  const rec = RECS[id]; if (!rec || !info) return null;
                  const c = scoreColor(score);
                  return (
                    <div key={id} style={{ padding:'9px 11px', borderRadius:'11px',
                      background:'rgba(228,228,255,0.03)', border:`1px solid ${c}22` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
                        <span style={{ fontSize:'0.82rem' }}>{rec.icon}</span>
                        <span style={{ fontFamily:SF, fontSize:'0.70rem', fontWeight:700, color:c, flex:1 }}>
                          {info.label}: {rec.title}
                        </span>
                        <span style={{ fontFamily:SF, fontSize:'0.68rem', fontWeight:800, color:c }}>{score}%</span>
                      </div>
                      <p style={{ margin:'0 0 4px', fontSize:'0.64rem', color:'rgba(242,230,238,0.48)', fontFamily:J, lineHeight:1.55 }}>
                        {rec.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.58 }}
              style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'15px' }}>
              <p style={{ margin:'0 0 9px', fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
                color:'rgba(151,125,255,0.55)', fontWeight:600 }}>🔬 AI ANALYSIS</p>
              <p style={{ margin:'0 0 10px', fontSize:'0.77rem', color:'rgba(242,230,238,0.60)', fontFamily:J, lineHeight:1.72 }}>
                {analysis?.summary}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:'7px', padding:'8px 11px', borderRadius:'10px',
                background:`${urgC}15`, border:`1px solid ${urgC}30` }}>
                <FaShieldAlt size={11} color={urgC}/>
                <div>
                  <p style={{ margin:0, fontFamily:SF, fontSize:'0.63rem', fontWeight:700, color:urgC, letterSpacing:'0.8px' }}>
                    {(analysis?.urgency||'').toUpperCase()} PRIORITY
                  </p>
                  <p style={{ margin:0, fontSize:'0.61rem', color:'rgba(242,230,238,0.35)', fontFamily:J }}>
                    { analysis?.urgency==='critical' ? 'Seek professional help immediately'
                    : analysis?.urgency==='high'     ? 'Book a consultant session now'
                    : analysis?.urgency==='moderate' ? 'Start daily practices today'
                    : 'Maintain healthy habits' }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── PROGRESS TRACKER + CALENDAR ── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.62 }}
          style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'16px', marginBottom:'13px' }}>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'13px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'11px' }}>
              <p style={{ margin:0, fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
                color:'rgba(151,125,255,0.55)', fontWeight:600 }}>📈 PROGRESS TRACKER</p>
              <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:1.8, repeat:Infinity }}
                style={{ display:'flex', alignItems:'center', gap:'5px', padding:'3px 10px', borderRadius:'18px',
                  background:'rgba(151,125,255,0.18)', border:'1px solid rgba(151,125,255,0.32)' }}>
                <span style={{ fontSize:'0.82rem' }}>🔥</span>
                <span style={{ fontFamily:SF, fontSize:'0.70rem', fontWeight:800, color:PERI }}>{streak} day streak</span>
              </motion.div>
            </div>
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              onClick={() => setShowHist(h=>!h)}
              style={{ padding:'5px 12px', background:'rgba(151,125,255,0.12)',
                border:'1px solid rgba(151,125,255,0.28)', borderRadius:'9px',
                color:PERI, fontSize:'0.67rem', fontWeight:700, cursor:'pointer', fontFamily:SF }}>
              {showHist ? 'Hide' : 'History'}
            </motion.button>
          </div>

          {/* sparkline */}
          {history.length > 1 && (
            <div style={{ marginBottom:'13px' }}>
              <p style={{ margin:'0 0 7px', fontFamily:SF, fontSize:'0.56rem',
                color:'rgba(228,228,255,0.32)', letterSpacing:'1.5px' }}>
                STRESS TREND — LAST {Math.min(history.length,10)} SESSIONS
              </p>
              <div style={{ display:'flex', alignItems:'flex-end', gap:'5px', height:'48px' }}>
                {history.slice(-10).map((h, i, arr) => {
                  const pct = Math.max((h.stress/100)*100, 4);
                  const isLast = i===arr.length-1;
                  const c = h.stress>65?'#FFCCF2':h.stress>40?PERI:ORCHID;
                  return (
                    <motion.div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'flex-end' }}>
                      <span style={{ fontSize:'0.55rem', fontWeight:800, color:'rgba(255,255,255,0.85)', fontFamily:SF, marginBottom:'4px' }}>{h.stress}</span>
                      <motion.div initial={{ height:0 }} animate={{ height:`${pct}%` }}
                        transition={{ duration:0.7, delay:i*0.05, ease:'easeOut' }}
                        style={{ width:'100%', borderRadius:'2px 2px 0 0',
                          background:`linear-gradient(180deg,${c}33 0%,${c}1a 60%,${c}0a 100%)`,
                          boxShadow:`inset 0 1px 0 ${c}40`,
                          border:`1px solid ${c}${isLast?'66':'44'}`, borderBottom:'none' }}/>
                    </motion.div>
                  );
                })}
              </div>
              {history.length >= 2 && (() => {
                const diff = history[history.length-1].stress - history[history.length-2].stress;
                const better = diff < 0;
                return (
                  <div style={{ display:'flex', alignItems:'center', gap:'7px', marginTop:'7px',
                    padding:'7px 11px', borderRadius:'9px',
                    background: better?'rgba(0,51,255,0.10)':'rgba(255,204,242,0.10)',
                    border:`1px solid ${better?'rgba(0,51,255,0.22)':'rgba(255,204,242,0.22)'}` }}>
                    <span style={{ fontSize:'0.9rem' }}>{better?'✨':'⚠️'}</span>
                    <p style={{ margin:0, fontFamily:SF, fontSize:'0.68rem', fontWeight:700,
                      color: better?'#6F86FF':'#FFCCF2' }}>
                      {better
                        ? `Stress down ${Math.abs(diff)}% vs last session — you're improving!`
                        : `Stress up ${diff}% vs last — time to practice today`}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* history */}
          <AnimatePresence>
            {showHist && history.length > 0 && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                style={{ borderTop:'1px solid rgba(151,125,255,0.10)', paddingTop:'11px', marginBottom:'13px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'5px', maxHeight:'180px', overflowY:'auto' }}>
                  {[...history].reverse().map((h,i) => {
                    const c = h.stress>65?'#FFCCF2':h.stress>40?PERI:ORCHID;
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:'9px', padding:'7px 11px',
                        borderRadius:'9px', background:'rgba(228,228,255,0.03)', border:'1px solid rgba(151,125,255,0.07)' }}>
                        <div style={{ width:'34px', height:'34px', borderRadius:'9px', background:`${c}16`,
                          border:`1px solid ${c}32`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <span style={{ fontFamily:SF, fontWeight:800, fontSize:'0.68rem', color:c }}>{h.stress}%</span>
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ margin:0, fontFamily:SF, fontSize:'0.70rem', fontWeight:700, color:'rgba(255,255,255,0.78)', textTransform:'capitalize' }}>
                            {h.dom||'General'} · {h.urg||'low'} priority
                          </p>
                          <p style={{ margin:0, fontFamily:SF, fontSize:'0.60rem', color:'rgba(228,228,255,0.33)' }}>
                            {new Date(h.ts).toLocaleDateString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  onClick={() => { store.remove('eq_hist'); setHistory([]); setStreak(0); }}
                  style={{ marginTop:'8px', padding:'5px 13px', background:'rgba(255,100,100,0.10)',
                    border:'1px solid rgba(255,100,100,0.22)', borderRadius:'7px',
                    color:'rgba(255,150,150,0.75)', fontSize:'0.63rem', fontWeight:600,
                    cursor:'pointer', fontFamily:SF }}>
                  🗑 Clear history
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Calendar */}
          <p style={{ margin:'0 0 9px', fontFamily:SF, fontSize:'0.56rem', letterSpacing:'1.5px',
            color:'rgba(228,228,255,0.30)' }}>📅 QUICK SCHEDULE — GOOGLE CALENDAR</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'7px' }}>
            {[
              { icon:'🧘', label:'Daily Meditation', desc:'10 min mindfulness session', days:1, color:'#6F86FF' },
              { icon:'💬', label:'Therapy Session',  desc:'1 hour with your therapist',  days:3, color:PERI },
              { icon:'🏃', label:'Exercise Break',   desc:'30 min stress-relief workout', days:1, color:'#FFCCF2' },
              { icon:'📓', label:'Journal Time',     desc:'Gratitude & reflection',       days:1, color:BLUSH },
              { icon:'🌬️', label:'Breathwork',       desc:'4-7-8 breathing practice',    days:1, color:ORCHID },
              { icon:'💤', label:'Sleep Routine',    desc:'Wind down at 10:30 PM',       days:0, color:'#6667AB' },
            ].map((item,i) => (
              <motion.button key={i} whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.95 }}
                onClick={() => addToCalendar(item.label, item.desc, item.days)}
                style={{ padding:'9px', background:`${item.color}10`, border:`1px solid ${item.color}28`,
                  borderRadius:'11px', cursor:'pointer', textAlign:'left',
                  display:'flex', flexDirection:'column', gap:'3px' }}>
                <span style={{ fontSize:'1.05rem' }}>{item.icon}</span>
                <span style={{ fontFamily:SF, fontSize:'0.65rem', fontWeight:700, color:item.color, lineHeight:1.2 }}>{item.label}</span>
                <span style={{ fontFamily:SF, fontSize:'0.56rem', color:'rgba(228,228,255,0.36)', lineHeight:1.3 }}>{item.desc}</span>
                <span style={{ fontFamily:SF, fontSize:'0.55rem', color:item.color, opacity:0.65, marginTop:'2px' }}>+ Add to Calendar →</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── INSIGHTS ── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.70 }}
          style={{ background:CARD, border:BORDER, borderRadius:'18px', padding:'16px', marginBottom:'5px' }}>
          <p style={{ margin:'0 0 12px', fontFamily:SF, fontSize:'0.58rem', letterSpacing:'2px',
            color:'rgba(151,125,255,0.55)', fontWeight:600 }}>💡 KEY INSIGHTS</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'9px' }}>
            {(analysis?.insights||[]).map((ins,i) => (
              <motion.div key={i} initial={{ opacity:0, y:7 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.74+i*0.09 }}
                style={{ padding:'11px 13px', borderRadius:'12px',
                  background:'rgba(228,228,255,0.03)', border:'1px solid rgba(151,125,255,0.16)',
                  display:'flex', gap:'9px', alignItems:'flex-start' }}>
                <div style={{ width:'19px', height:'19px', borderRadius:'50%', flexShrink:0, marginTop:'1px',
                  background:'rgba(151,125,255,0.15)', border:'1px solid rgba(151,125,255,0.35)',
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:'0.60rem', fontWeight:800, color:PERI, fontFamily:SF }}>{i+1}</span>
                </div>
                <p style={{ margin:0, fontSize:'0.73rem', color:'rgba(242,230,238,0.56)', fontFamily:J, lineHeight:1.62 }}>{ins}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p style={{ textAlign:'center', fontSize:'0.60rem', color:'rgba(151,125,255,0.22)', fontFamily:J, marginTop:'12px' }}>
          ⚕️ AI-generated · Not a medical diagnosis · Consult a licensed professional
        </p>
      </div>
    </div>
  );
}

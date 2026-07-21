import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const TREND = [
  { w:'Week 1', anxiety:66, stress:72, calm:48 },
  { w:'Week 2', anxiety:62, stress:60, calm:55 },
  { w:'Week 3', anxiety:48, stress:64, calm:68 },
  { w:'Week 4', anxiety:52, stress:46, calm:74 },
  { w:'Week 5', anxiety:36, stress:50, calm:82 },
  { w:'Week 6', anxiety:34, stress:40, calm:88 },
];

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

/* ── Tooltip ── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0a0c12', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '8px 12px', boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}>
      <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: S }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', fontSize: '0.8rem', fontWeight: 700, color: p.color || p.stroke || '#fff', fontFamily: S }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ULTRA-CLEAN REAL SAAS GRAPH CARD FOR PROGRESS DASHBOARD
   ══════════════════════════════════════════════════════════════════ */
function CleanSaaSProgressGraphCard({ title, subtitle, data, dataKey, color, stats, percentage, badgeText, badgeColor }) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: `${color}40`, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
      style={{
        position: 'relative',
        background: '#0a0c12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '22px',
        padding: '22px 24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        minHeight: '220px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Bar: Title + Change Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '0.94rem', color: '#f8fafc', fontWeight: '800', fontFamily: J, letterSpacing: '-0.3px' }}>{title}</span>
          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: J }}>{subtitle}</p>
        </div>

        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: badgeColor || color, background: `${badgeColor || color}15`, border: `1px solid ${badgeColor || color}25`, padding: '4px 10px', borderRadius: '14px', fontFamily: S }}>
          {badgeText || stats}
        </span>
      </div>

      {/* Sparkline AreaChart */}
      <div style={{ width: '100%', height: '90px', margin: '8px 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`saasGrad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
              <filter id={`saasGlow-${dataKey}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="w" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={<ChartTip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              filter={`url(#saasGlow-${dataKey})`}
              fill={`url(#saasGrad-${dataKey})`}
              isAnimationActive={true}
              dot={{ r: 3, fill: color, stroke: '#0a0c12', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#fff', stroke: color, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Readout */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: S }}>
          Current Level: <b style={{ color: '#fff' }}>{percentage}</b>
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', fontFamily: S, lineHeight: '1.0', letterSpacing: '-0.5px' }}>
          {percentage}
        </div>
      </div>

      {/* Bottom-Left Corner Accent Badge */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '18px',
        height: '18px',
        background: color,
        clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
        boxShadow: `0 0 10px ${color}`
      }} />
    </motion.div>
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
  const [completed, setCompleted] = React.useState(() => {
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
        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.8rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Mental Progress Analytics</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.86rem', margin:0, fontFamily:J }}>Real-time 6-week cognitive recovery & emotional wellness tracking</p>
      </div>

      {/* ══ 2 CLEAN SAAS METRIC GRAPH CARDS ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        
        {/* Graph 1: Anxiety Levels Drop */}
        <CleanSaaSProgressGraphCard
          title="Anxiety Level Reduction"
          subtitle="6-Week Cortisol & Panic Index"
          data={TREND}
          dataKey="anxiety"
          color="#38bdf8"
          stats="-48.5%"
          percentage="34%"
          badgeText="📉 -48.5% Reduced"
          badgeColor="#10b981"
        />

        {/* Graph 2: Stress Recovery Rise */}
        <CleanSaaSProgressGraphCard
          title="Stress Recovery Curve"
          subtitle="Vagal Tone & Heart Rate Variability"
          data={TREND}
          dataKey="stress"
          color="#f43f5e"
          stats="-41.6%"
          percentage="40%"
          badgeText="🛡️ Cortisol -41%"
          badgeColor="#38bdf8"
        />

      </div>

      {/* ══ FULL-WIDTH COMPREHENSIVE 6-WEEK RECOVERY TREND CHART ══ */}
      <div style={{
        background: '#0a0c12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '22px',
        padding: '24px 26px',
        marginBottom: '24px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: '0 0 3px', fontFamily: J, fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
              6-Week Multi-Parameter Wellness Waveform
            </h3>
            <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', fontFamily: J }}>
              Comparing Calm Resilience, Stress Reduction, and Anxiety Modulation
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontFamily: S }}>
              <span style={{ width: 12, height: 3, borderRadius: 2, background: '#10b981' }} /> Calm
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontFamily: S }}>
              <span style={{ width: 12, height: 3, borderRadius: 2, background: '#38bdf8' }} /> Anxiety
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontFamily: S }}>
              <span style={{ width: 12, height: 3, borderRadius: 2, background: '#f43f5e' }} /> Stress
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TREND}>
              <defs>
                <linearGradient id="fullCalmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fullAnxietyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: S }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: S }} width={30} tickFormatter={v => `${v}%`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="calm" name="Calm" stroke="#10b981" strokeWidth={3} fill="url(#fullCalmGrad)" />
              <Area type="monotone" dataKey="anxiety" name="Anxiety" stroke="#38bdf8" strokeWidth={2.5} strokeDasharray="5 3" fill="url(#fullAnxietyGrad)" />
              <Area type="monotone" dataKey="stress" name="Stress" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

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

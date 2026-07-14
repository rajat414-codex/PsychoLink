import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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

      {/* Bottom Full-Width Daily Mental Health & Soft Skills Challenges */}
      <Card glow={accent} style={{ padding: '20px 22px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p style={{ margin:'0 0 2px', fontFamily:J, fontWeight:700, fontSize:'0.92rem', color:'#ededef', letterSpacing:'-0.2px' }}>
              Daily Mind & Skill Challenges
            </p>
            <p style={{ margin:0, fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', fontFamily:J }}>
              3 custom tasks generated daily to build emotional resilience and communication skills
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
                  padding: '12px 16px', 
                  background: isDone ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)', 
                  border: isDone ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(255,255,255,0.04)', 
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
                  justifyContent: 'center',
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
                    fontSize: '0.84rem', 
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
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: S, fontWeight: '700', minWidth: '95px', textAlign: 'right' }}>
            {completedCount} of 3 completed
          </span>
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

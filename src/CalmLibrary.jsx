import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRunning, FaLock, FaCrown, FaCheckCircle, FaHourglassHalf, FaHandPaper, FaCompressArrowsAlt } from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

export default function CalmLibrary({ accent, accentB, accentBr, isPremium, onUpgrade }) {
  const [activeActivity, setActiveActivity] = useState('neuro-stretch');
  
  // Stretch Activity States
  const [stretchStep, setStretchStep] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Shake Activity States
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeDone, setShakeDone] = useState(false);

  // Tapping States
  const [tapStep, setTapStep] = useState(0);

  // ── DETAILED PHYSICAL MOVEMENTS DATABASE WITH BOLD BULLETS ──
  const stretches = [
    { 
      title: "Shoulder Decompression Workout", 
      points: [
        { bold: "Roll your shoulders back", normal: " forcefully to open up your chest cavity completely." },
        { bold: "Pull your shoulder blades together", normal: " as tightly as possible to trap and contract upper back tension." },
        { bold: "Drop them completely down", normal: " away from your ears to instantly flush out stored stress." }
      ], 
      time: 10 
    },
    { 
      title: "Vagus Nerve Neural Neck Tilt", 
      points: [
        { bold: "Keep your chest perfectly straight", normal: " and look forward without leaning your torso sideways." },
        { bold: "Gently tilt your right ear", normal: " down towards your right shoulder until you feel the baseline pull." },
        { bold: "Feel the deep side-neck release", normal: " all along the left side to trigger your vagus nerve relaxation." }
      ], 
      time: 12 
    },
    { 
      title: "Seated Spinal Decompression Twist", 
      points: [
        { bold: "Place your left hand firmly", normal: " on top of your right knee to lock your lower body stance." },
        { bold: "Gently twist your upper body", normal: " and spine towards the right side as far as comfortably possible." },
        { bold: "Breathe directly into your lower back", normal: " to release locked posture nerve pathways." }
      ], 
      time: 15 
    }
  ];

  const tappingPoints = [
    { point: "Top of Head 💆‍♂️", instruction: "Gently tap the center of your head with 4 fingers physically while taking slow breaths." },
    { point: "Collarbone Point 🫁", instruction: "Locate the junction where your collarbone meets, and tap firmly but gently with your knuckles." },
    { point: "Side of Hand (Karate Chop Point) ✋", instruction: "Tap the fleshy outer edge of your hand rhythmically to release somatic panic." }
  ];

  // Timer Effect for Stretching
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      if (stretchStep < stretches.length - 1) {
        setStretchStep(prev => prev + 1);
        setTimer(stretches[stretchStep + 1].time);
      } else {
        setStretchStep(3); // Completed state
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handlePremiumCheck = (action) => {
    if (!isPremium) {
      onUpgrade?.(); 
      return;
    }
    action();
  };

  return (
    <div style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>
      
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Somatic Lab</h2>
        <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:0, fontFamily:J }}>Interactive neuro-somatic workouts & nervous system regulation tools</p>
      </div>

      {/* Subscription Paywall Banner */}
      {!isPremium && (
        <div style={{ marginBottom:20, padding:'14px 18px', borderRadius:16, background:accentB, border:`1px solid ${accentBr}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
          <div>
            <p style={{ margin:'0 0 3px', fontSize:'0.86rem', fontWeight:700, color:'#fff', fontFamily:J }}>
              Free Tier Movement Pass Active 🏃‍♂️
            </p>
            <p style={{ margin:0, fontSize:'0.74rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>
              Upgrade to unlock high-intensity Cortisol Release cycles and advanced EFT sensory neural tapping blocks.
            </p>
          </div>
          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={onUpgrade}
            style={{ padding:'9px 18px', borderRadius:12, border:'none', cursor:'pointer', background:accent, color:'#0a0a0c', fontSize:'0.82rem', fontWeight:800, fontFamily:J, display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
            <FaCrown size={12}/> Go Premium
          </motion.button>
        </div>
      )}

      {/* Activity Navigation Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto' }}>
        {[
          { id: 'neuro-stretch', label: 'Micro-Stretching', icon: <FaCompressArrowsAlt size={11}/> },
          { id: 'somatic-shake', label: 'Somatic Cortisol Shake', icon: <FaHandPaper size={11}/> },
          { id: 'eft-tapping', label: 'EFT Sensory Tapping', icon: <FaRunning size={11}/> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveActivity(tab.id)}
            style={{ padding:'10px 16px', borderRadius:20, cursor:'pointer', fontFamily:J, fontSize:'0.8rem', fontWeight:700, whiteSpace:'nowrap',
              border: activeActivity === tab.id ? `1px solid ${accentBr}` : '1px solid rgba(255,255,255,0.08)',
              background: activeActivity === tab.id ? accentB : 'transparent',
              color: activeActivity === tab.id ? accent : 'rgba(255,255,255,0.45)',
              display:'flex', alignItems:'center', gap:6, transition:'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:24, padding:22, boxShadow:'var(--shadow-card)' }}>
        
        {/* ACTIVITY 1: MICRO-STRETCHING */}
        {activeActivity === 'neuro-stretch' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <span style={{ fontSize:'0.65rem', color:'#5eb8ad', fontWeight:800, fontFamily:S, letterSpacing:'1px' }}>ACTIVITY 01 // NEURO-SOMATIC WORKOUT</span>
            <h3 style={{ fontFamily:J, color:'#fff', fontSize:'1.25rem', margin:'4px 0 16px' }}>Vagus Nerve Micro-Stretching</h3>

            {stretchStep < 3 ? (
              <div>
                {/* ── HIGH-END INTERACTIVE INSTRUCTION CARD ── */}
                <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-subtle)', borderRadius:16, padding:20, marginBottom:20 }}>
                  <h4 style={{ fontFamily:J, color:accent, fontSize:'1.1rem', margin:'0 0 12px', fontWeight:700 }}>
                    Current Setup: {stretches[stretchStep].title}
                  </h4>
                  
                  {/* Comma words split into clean Bold Bullets */}
                  <ul style={{ margin:'0 0 20px 0', paddingLeft:18, display:'flex', flexDirection:'column', gap:8 }}>
                    {stretches[stretchStep].points.map((pt, idx) => (
                      <li key={idx} style={{ fontSize:'0.88rem', fontFamily:J, color:'rgba(255,255,255,0.85)', lineHeight:1.4 }}>
                        <strong style={{ color: '#fff', fontWeight: 700 }}>{pt.bold}</strong>{pt.normal}
                      </li>
                    ))}
                  </ul>
                  
                  {/* ── EXACT PHYSICAL INSTRUCTIONS AT THE BOTTOM ── */}
                  <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:16 }}>
                    <span style={{ fontSize:'0.72rem', color:accent, fontFamily:S, fontWeight:800, display:'flex', alignItems:'center', gap:6, marginBottom:8, letterSpacing:'0.5px', textTransform:'uppercase' }}>
                      🔴 EXACT INSTRUCTIONS FOR YOU TO PERFORM:
                    </span>
                    <ol style={{ margin:0, paddingLeft:16, fontSize:'0.82rem', color:'rgba(255,255,255,0.45)', fontFamily:J, display:'flex', flexDirection:'column', gap:6, lineHeight:1.4 }}>
                      <li>Adjust your body stance immediately according to the <strong style={{color:'rgba(255,255,255,0.8)'}}>bold action targets</strong> listed above.</li>
                      <li>Click the white <strong style={{color:'#fff'}}>"Start Physical Hold"</strong> button right below to lock your posture.</li>
                      <li><strong style={{color:'rgba(255,255,255,0.8)'}}>Freeze your movement physically</strong> and maintain this hold. Do not release your body stance or look away until the countdown tracker finishes its full cycle.</li>
                    </ol>
                  </div>
                </div>

                {/* Live Countdown Timer UI */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
                  <FaHourglassHalf color={isTimerRunning ? accent : "rgba(255,255,255,0.2)"} size={16} style={{ transition:'color 0.3s' }}/>
                  <span style={{ fontFamily:S, fontSize:'1.9rem', fontWeight:700, color:'#fff' }}>{timer}s</span>
                </div>

                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background: isTimerRunning ? '#ef4444' : `linear-gradient(135deg, ${accent}, #8b5cf6)`, color: '#fff', fontWeight:700, fontFamily:J, cursor:'pointer', transition:'all 0.2s', boxShadow:`0 4px 18px ${accent}25` }}>
                  {isTimerRunning ? 'Pause Movement Hold' : 'Start Physical Hold'}
                </motion.button>
              </div>
            ) : (
              <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(94,184,173,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <FaCheckCircle size={22} color="#5eb8ad"/>
                </div>
                <h4 style={{ fontFamily:J, color:'#fff', margin:'0 0 6px', fontSize:'1.1rem' }}>Physical Decompression Complete</h4>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.84rem', fontFamily:J, maxWidth:360, margin:'0 auto 20px', lineHeight:1.4 }}>Your upper body skeletal muscles have released pent-up adrenaline loops. Awesome job.</p>
                <button onClick={() => { setStretchStep(0); setTimer(stretches[0].time); setIsTimerRunning(false); }}
                  style={{ padding:'10px 20px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#fff', fontSize:'0.8rem', fontWeight:600, fontFamily:J, cursor:'pointer' }}>
                  Restart Stretching Flow
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ACTIVITY 2: SOMATIC SHAKE-OFF */}
        {activeActivity === 'somatic-shake' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <span style={{ fontSize:'0.65rem', color:'#8b87f5', fontWeight:800, fontFamily:S, letterSpacing:'1px' }}>ACTIVITY 02 // NERVOUS DISCHARGE</span>
            <h3 style={{ fontFamily:J, color:'#fff', fontSize:'1.25rem', margin:'4px 0 12px' }}>Adrenaline Shake-Off Cycle</h3>
            
            {!shakeDone ? (
              <div>
                <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-subtle)', borderRadius:16, padding:16, marginBottom:20 }}>
                  <span style={{ fontSize:'0.7rem', color:'#8b87f5', fontFamily:S, fontWeight:700, display:'block', marginBottom:6, letterSpacing:'0.5px' }}>EXERCISE STEPS FOR YOU:</span>
                  <ol style={{ margin:0, paddingLeft:16, fontSize:'0.8rem', color:'rgba(255,255,255,0.45)', fontFamily:J, display:'flex', flexDirection:'column', gap:5, lineHeight:1.4 }}>
                    <li>Stand up or sit down completely straight on your chair.</li>
                    <li>Physically shake both your hands and arms rapidly in the air (like shaking off water droplets).</li>
                    <li>While shaking, use your mouse to click the circular target below <strong style={{color:'#fff'}}>20 times rhythmically</strong> to complete the kinetic discharge.</li>
                  </ol>
                </div>

                <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:22, overflow:'hidden' }}>
                  <div style={{ width: `${(shakeCount / 20) * 100}%`, height:'100%', background:'#8b87f5', transition:'width 0.1s ease-out' }}/>
                </div>

                <motion.button whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handlePremiumCheck(() => {
                      if (shakeCount < 20) {
                        setShakeCount(prev => prev + 1);
                      } else {
                        setShakeDone(true);
                      }
                    });
                  }}
                  style={{ width:120, height:120, borderRadius:'50%', border:'4px solid rgba(139,135,245,0.2)', background:'radial-gradient(circle, rgba(139,135,245,0.15), transparent)', color:'#fff', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, margin:'0 auto', outline:'none' }}>
                  <FaHandPaper size={24} color="#8b87f5"/>
                  <span style={{ fontFamily:S, fontSize:'0.75rem', fontWeight:700 }}>SHAKE & TAP</span>
                  <span style={{ fontSize:'0.64rem', color:'rgba(255,255,255,0.4)' }}>{shakeCount}/20</span>
                </motion.button>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(139,135,245,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                  <FaCheckCircle size={22} color="#8b87f5"/>
                </div>
                <h4 style={{ fontFamily:J, color:'#fff', margin:'0 0 4px', fontSize:'1.1rem' }}>Kinetic Discharge Successful</h4>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem', fontFamily:J, marginBottom:16 }}>The physical restlessness index of your central nervous system has stabilized.</p>
                <button onClick={() => { setShakeCount(0); setShakeDone(false); }}
                  style={{ padding:'8px 18px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#fff', fontSize:'0.8rem', fontWeight:600, fontFamily:J, cursor:'pointer' }}>
                  Shake Again
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ACTIVITY 3: EFT SENSORY TAPPING */}
        {activeActivity === 'eft-tapping' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <span style={{ fontSize:'0.65rem', color:'#c79552', fontWeight:800, fontFamily:S, letterSpacing:'1px' }}>ACTIVITY 03 // ACUPRESSURE REWIRING</span>
            <h3 style={{ fontFamily:J, color:'#fff', fontSize:'1.25rem', margin:'4px 0 16px' }}>Emotional Freedom Tapping Loop</h3>

            <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-subtle)', borderRadius:16, padding:18, marginBottom:20 }}>
              <span style={{ fontSize:'0.7rem', fontFamily:S, color:'#c79552', fontWeight:700, textTransform:'uppercase' }}>TARGET BODY LOCATION</span>
              <h4 style={{ fontFamily:J, color:'#fff', fontSize:'1.15rem', margin:'4px 0 14px' }}>{tappingPoints[tapStep].point}</h4>
              
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12 }}>
                <span style={{ fontSize:'0.7rem', color:'#c79552', fontFamily:S, fontWeight:700, display:'block', marginBottom:6, letterSpacing:'0.5px' }}>WHAT YOU MUST DO NOW:</span>
                <ul style={{ margin:0, paddingLeft:16, fontSize:'0.8rem', color:'rgba(255,255,255,0.45)', fontFamily:J, display:'flex', flexDirection:'column', gap:5, lineHeight:1.4 }}>
                  <li><strong>{tappingPoints[tapStep].instruction}</strong></li>
                  <li>Perform the tapping physically on your skin while taking 3 slow, deep belly breaths.</li>
                  <li>Once you feel your chest relaxation settle in, click the button below to transition to the next body zone.</li>
                </ul>
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              {tapStep < tappingPoints.length - 1 ? (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  onClick={() => {
                    handlePremiumCheck(() => {
                      setTapStep(prev => prev + 1);
                    });
                  }}
                  style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background:`linear-gradient(135deg, ${accent}, #8b5cf6)`, color:'#fff', fontWeight:800, fontFamily:J, cursor:'pointer', display:'flex', alignItems:'center', gap:6, justifyContent:'center', boxShadow:`0 4px 18px ${accent}25` }}>
                  I Feel Ready, Next Tapping Point ➔ {!isPremium && <FaLock size={10}/>}
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={() => setTapStep(0)}
                  style={{ width:'100%', padding:'13px', borderRadius:12, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.03)', color:'#fff', fontWeight:700, fontFamily:J, cursor:'pointer' }}>
                  Reset Acupressure Loop
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
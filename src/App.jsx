import { useState, useEffect } from 'react'
import AppleEmoji from './AppleEmoji';
import SplashScreen from './SplashScreen'
import { AnimatePresence, motion } from 'framer-motion'
import Auth from './Auth'
import Home from './Home'

// ── TRANSITION SCREEN ────────────────────────────────────
function TransitionScreen({ profile, activeAI = 'AURA', onDone }) {
  const [step, setStep] = useState(0);

  const accent  = activeAI === 'AURA' ? '#e0524d' : '#5eb8ad';
  const accent2 = activeAI === 'AURA' ? '#c0392b' : '#4a9488';
  const label   = activeAI === 'AURA' ? 'Feminine Core · Aura' : 'Analytic Engine · Max';
  const name    = (profile?.name || 'User').split(' ')[0];

  const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
  const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

  const steps = [
    'Initializing secure session...',
    'Loading your wellness profile...',
    'Connecting to ' + (activeAI === 'AURA' ? 'Aura' : 'Max') + '...',
    'Almost ready...',
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1300),
      setTimeout(() => setStep(3), 2000),
      setTimeout(() => setStep(4), 2700),
      setTimeout(() => onDone(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'absolute', inset: 0, background: '#0a0a0c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* BG orbs */}
      {[
        { top: '-15%', left: '-10%', color: 'rgba(139,92,246,0.18)', size: '500px' },
        { bottom: '-15%', right: '-10%', color: activeAI === 'AURA' ? 'rgba(236,72,153,0.15)' : 'rgba(45,212,191,0.15)', size: '500px' },
        { top: '40%', left: '40%', color: activeAI === 'AURA' ? 'rgba(236,72,153,0.08)' : 'rgba(45,212,191,0.08)', size: '300px' },
      ].map((o, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
          style={{ position: 'absolute', width: o.size, height: o.size, borderRadius: '50%', background: `radial-gradient(circle, ${o.color}, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none', ...o }}
        />
      ))}

      {/* Star dots */}
      <motion.div
        animate={{ backgroundPosition: ['0px 0px', '60px 120px'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`, backgroundSize: '50px 50px', pointerEvents: 'none' }}
      />

      {/* Center content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 2 }}>

        {/* Pulsing AI orb */}
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer rings */}
          {[1, 2, 3].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              style={{ position: 'absolute', width: `${100 + i * 28}px`, height: `${100 + i * 28}px`, borderRadius: '50%', border: `1px solid ${accent}40` }}
            />
          ))}
          {/* Core orb */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], boxShadow: [`0 0 30px ${accent}60`, `0 0 60px ${accent}90`, `0 0 30px ${accent}60`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '90px', height: '90px', borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${accent2}, ${accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            {/* Inner shine */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', width: '28px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', filter: 'blur(3px)' }}/>
            {/* Letter */}
            <span style={{ fontFamily: G, fontStyle: 'italic', fontWeight: '600', fontSize: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {activeAI === 'AURA' ? 'A' : 'M'}
            </span>
          </motion.div>
        </div>

        {/* Text block */}
        <div style={{ textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontFamily: J, fontStyle: 'normal', fontWeight: '800', fontSize: '2.1rem', letterSpacing: '-0.5px', color: '#fff', margin: '0 0 8px', textShadow: 'none' }}
          >
            Welcome, {name} ✨
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: S, fontSize: '0.75rem', letterSpacing: '2px', color: accent, margin: 0, fontWeight: '600' }}
          >
            {label.toUpperCase()}
          </motion.p>
        </div>

        {/* Loading steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '240px' }}>
          {steps.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: step > i ? 1 : 0.2, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {/* Check or dot */}
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: step > i ? `${accent}25` : 'rgba(255,255,255,0.05)', border: `1px solid ${step > i ? accent : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.3s' }}>
                {step > i
                  ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </motion.div>
                  : <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}/>
                }
              </div>
              <span style={{ fontFamily: J, fontSize: '0.82rem', color: step > i ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)', fontWeight: step > i ? '500' : '400', transition: 'all 0.3s' }}>{s}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: '240px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', background: `linear-gradient(90deg, ${accent}, #8b5cf6)`, borderRadius: '2px', boxShadow: `0 0 8px ${accent}80` }}
          />
        </div>

        {/* Brand */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ fontFamily: G, fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(255,255,255,0.2)', margin: 0 }}
        >
          Cognitive Social Consultation
        </motion.p>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen]         = useState('splash');
  const [userProfile, setUserProfile] = useState(null);
  const [selectedAI, setSelectedAI]  = useState('AURA');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Space+Grotesk:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(e){} }
  }, []);

  const handleAuthDone = (profile) => {
    setUserProfile(profile);
    setScreen('transition');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, background: '#0a0a0c' }}>
      <AppleEmoji/>
      <AnimatePresence mode="wait">

        {screen === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setScreen('auth')} />
        )}

        {screen === 'auth' && (
          <motion.div key="auth"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0 }}>
            <Auth onComplete={(profile) => handleAuthDone(profile)} />
          </motion.div>
        )}

        {screen === 'transition' && (
          <TransitionScreen
            key="transition"
            profile={userProfile}
            activeAI={selectedAI}
            onDone={() => setScreen('home')}
          />
        )}

        {screen === 'home' && (
          <motion.div key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}>
            <Home
              userProfile={userProfile}
              onLogout={() => { setUserProfile(null); setScreen('auth'); }}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
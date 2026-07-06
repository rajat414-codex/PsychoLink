import { useState, useEffect } from 'react'
import AppleEmoji from './AppleEmoji';
import SplashScreen from './SplashScreen'
import { AnimatePresence, motion } from 'framer-motion'
import Auth from './Auth'
import Home from './Home'

// ── TRANSITION SCREEN ────────────────────────────────────
function TransitionScreen({ profile, activeAI = 'AURA', onDone }) {
  const name = (profile?.name || 'User').split(' ')[0];

  const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
  const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0d0c0e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '50px 70px',
        overflow: 'hidden'
      }}
    >
      {/* Background noise grid and grain overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Axis crosshairs */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1.5px', background: 'rgba(255,255,255,0.025)', zIndex: 1, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1.5px', background: 'rgba(255,255,255,0.025)', zIndex: 1, pointerEvents: 'none' }}/>

      {/* Corner Bracket Framework */}
      <div style={{ position: 'absolute', top: '40px', left: '40px', width: '14px', height: '14px', borderLeft: '1px solid rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.12)', zIndex: 2 }}/>
      <div style={{ position: 'absolute', top: '40px', right: '40px', width: '14px', height: '14px', borderRight: '1px solid rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.12)', zIndex: 2 }}/>
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '14px', height: '14px', borderLeft: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)', zIndex: 2 }}/>
      <div style={{ position: 'absolute', bottom: '40px', right: '40px', width: '14px', height: '14px', borderRight: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)', zIndex: 2 }}/>

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
        <div style={{ fontFamily: S, fontWeight: '600', fontSize: '1rem', letterSpacing: '5px', color: '#fff' }}>
          | SOLVANA |
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['How It Works', 'Sessions', 'Pricing', 'Blog'].map((link, idx) => (
            <span key={idx} style={{ fontFamily: J, fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: '500', transition: 'color 0.25s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>{link}</span>
          ))}
          <button style={{
            padding: '9px 22px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '9px',
            color: '#fff',
            fontFamily: J,
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.25s'
          }}
          onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.borderColor='rgba(255,255,255,0.3)';}}
          onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.14)';}}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Centered Waving Soul */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        {/* Pulsing ambient background aura */}
        <motion.div
          animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
            filter: 'blur(45px)',
            pointerEvents: 'none'
          }}
        />

        <svg width="100%" height="100%" viewBox="0 0 300 300">
          <defs>
            <filter id="soul-glow-full" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <linearGradient id="soul-gradient-full" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#f5f5f7" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#e2e2e8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Faint Concentric rotating orbital rings */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '150px 110px' }}
          >
            <circle cx="150" cy="110" r="54" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" fill="none" strokeDasharray="3 6" />
            <circle cx="150" cy="110" r="95" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" fill="none" strokeDasharray="6 8" />
          </motion.g>

          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '150px 110px' }}
          >
            <circle cx="150" cy="110" r="140" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" fill="none" strokeDasharray="4 12" />
          </motion.g>

          {/* Stars */}
          {[
            { x: 125, y: 85, delay: 0.2 },
            { x: 175, y: 115, delay: 0.7 },
            { x: 140, y: 145, delay: 1.2 },
            { x: 160, y: 65, delay: 1.7 },
            { x: 105, y: 125, delay: 2.2 },
            { x: 195, y: 90, delay: 2.7 }
          ].map((star, idx) => (
            <motion.circle
              key={idx}
              cx={star.x}
              cy={star.y}
              r="1"
              fill="#ffffff"
              animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: star.delay }}
            />
          ))}

          {/* Waving Soul body */}
          <g filter="url(#soul-glow-full)">
            <circle cx="150" cy="60" r="13" fill="url(#soul-gradient-full)" />
            <path
              d="M 145,72 C 145,72 132,77 132,80 C 132,83 136,98 136,104 C 136,115 142,130 142,145 C 142,165 136,185 144,235 C 145,240 155,240 156,235 C 164,185 158,165 158,145 C 158,130 164,115 164,104 C 164,98 168,83 168,80 C 168,77 155,72 155,72 Z"
              fill="url(#soul-gradient-full)"
            />
            <path
              d="M 132,80 C 122,95 116,115 115,135 C 115,138 118,138 119,135 C 121,118 127,100 136,92 Z"
              fill="url(#soul-gradient-full)"
            />
            <motion.g
              animate={{ rotate: [-6, 12, -6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
              style={{ transformOrigin: '168px 80px' }}
            >
              <path
                d="M 168,80 C 178,72 186,60 192,44 C 195,40 201,37 203,40 C 205,43 199,48 195,47 C 188,62 178,76 166,86 Z"
                fill="url(#soul-gradient-full)"
              />
            </motion.g>
          </g>
        </svg>
      </div>

      {/* Bottom Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10, position: 'relative' }}>
        
        {/* Bottom Left Typography */}
        <div style={{ maxWidth: '520px', textAlign: 'left' }}>
          <h2 style={{ fontFamily: G, fontSize: '2.8rem', fontWeight: '400', color: '#fff', lineHeight: '1.2', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            Quiet the noise.<br />Let your mind wander home.
          </h2>
          <p style={{ fontFamily: J, fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', margin: 0 }}>
            Solvana helps you build a peaceful evening ritual, where your thoughts settle and your breath leads the way.
          </p>
        </div>

        {/* Bottom Right Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDone}
          style={{
            padding: '15px 32px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '12px',
            color: '#ffffff',
            fontFamily: J,
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'border 0.25s'
          }}
          onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}
          onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'}
        >
          Begin Your Journey
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
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
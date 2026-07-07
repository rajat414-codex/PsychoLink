import { useState, useEffect } from 'react'
import AppleEmoji from './AppleEmoji';
import SplashScreen from './SplashScreen'
import { AnimatePresence, motion } from 'framer-motion'
import Auth from './Auth'
import Home from './Home'
import humanAiCreation from './assets/human_ai_creation.png'


// ── TRANSITION SCREEN ────────────────────────────────────
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
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '36px 60px 48px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Background noise grid and grain overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Header Area matching qintara */}
      <div style={{ width: '1200px', maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative', marginBottom: '70px' }}>
        {/* Left Branding */}
        <div style={{ fontFamily: J, fontWeight: '800', fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.5px' }}>
          equilibrium
        </div>
        
        {/* Center Branding */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: J,
          fontWeight: '600',
          fontSize: '1.05rem',
          letterSpacing: '5px',
          color: '#fff',
          textTransform: 'uppercase',
          opacity: 0.95
        }}>
          PsychoLink
        </div>

        {/* Right spacing */}
        <div style={{ width: '100px' }} />
      </div>

      {/* Hero Content Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, position: 'relative', width: '800px', maxWidth: '100%', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: J, fontSize: '3.1rem', fontWeight: '400', color: '#fff', letterSpacing: '-1.5px', lineHeight: '1.15', margin: '0 0 16px' }}>
          Who looks outside, dreams;<br />who looks inside, awakes.
        </h1>
        <p style={{ fontFamily: J, fontSize: '0.92rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px', fontWeight: '400', margin: 0 }}>
          when human empathy and cognitive clarity move as one
        </p>
      </div>

      {/* Centered Graphic Container */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, width: '600px', maxWidth: '100%' }}>
        {/* Soft background radial color glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          filter: 'blur(35px)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Floating human-AI creation image */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '560px',
            height: '360px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1.5px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 35px 80px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.15)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2
          }}
        >
          <img src={humanAiCreation} alt="Human and AI reaching together" style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }} />
        </motion.div>

        {/* Aesthetic Continue to App Action Panel */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,255,255,0.18)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onDone}
          style={{
            marginTop: '36px',
            padding: '14px 44px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '30px',
            color: '#ffffff',
            fontFamily: J,
            fontSize: '0.9rem',
            fontWeight: '700',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 10,
            transition: 'all 0.25s'
          }}
          onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}
          onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.22)'}
        >
          Continue to App
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
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
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, background: '#070709', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.035) 0%, transparent 65%)' }}>
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
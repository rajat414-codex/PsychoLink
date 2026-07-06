import { useState, useEffect } from 'react'
import AppleEmoji from './AppleEmoji';
import SplashScreen from './SplashScreen'
import { AnimatePresence, motion } from 'framer-motion'
import Auth from './Auth'
import Home from './Home'

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
        
        {/* Center capsule menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '10px 28px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '30px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          {['Services', 'How it works', 'AI Security', 'Integrations', 'Resources'].map((link, idx) => (
            <span key={idx} style={{ fontFamily: J, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}>{link}</span>
          ))}
        </div>

        {/* Right Sign Up button */}
        <button style={{
          padding: '10px 22px',
          background: '#ffffff',
          border: 'none',
          borderRadius: '30px',
          color: '#000000',
          fontFamily: J,
          fontSize: '0.82rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(255,255,255,0.15)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e=>e.currentTarget.style.transform='scale(1.03)'}
        onMouseOut={e=>e.currentTarget.style.transform='scale(1.0)'}>
          Get started
        </button>
      </div>

      {/* Hero Content Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, position: 'relative', width: '800px', maxWidth: '100%', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: J, fontSize: '3.1rem', fontWeight: '400', color: '#fff', letterSpacing: '-1.5px', lineHeight: '1.15', margin: '0 0 16px' }}>
          Who looks outside, dreams;<br />who looks inside, awakes.
        </h1>
        <p style={{ fontFamily: J, fontSize: '0.92rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px', fontWeight: '400', margin: '0 0 32px' }}>
          when human empathy and cognitive clarity move as one
        </p>

        {/* Center Pill Button - Begin Your Journey */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          style={{
            padding: '12px 30px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            color: '#000000',
            fontFamily: J,
            fontSize: '0.88rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Begin Your Journey →
        </motion.button>
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
          <img src="/human_ai_creation.png?v=2" alt="Human and AI reaching together" style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }} />
        </motion.div>

        {/* Micro Halftone Dotted Toolbar icons below the graphic */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '24px', opacity: 0.25, zIndex: 2 }}>
          {/* SVG Halftone Toolbar Icon 1 (Download arrow) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {/* SVG Halftone Toolbar Icon 2 (Asterisk) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {/* SVG Halftone Toolbar Icon 3 (Grid) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {/* SVG Halftone Toolbar Icon 4 (Subtract Circle) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {/* SVG Halftone Toolbar Icon 5 (Checkmark) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
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
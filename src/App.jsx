import { useState, useEffect } from 'react';
import AppleEmoji from './AppleEmoji';
import SplashScreen from './SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';
import Auth from './Auth';
import Home from './Home';

// ══════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const nickname = localStorage.getItem('user_nickname');
      if (email && name) {
        return { email, name, nickname: nickname || name.split(' ')[0], initial: (name[0] || 'U').toUpperCase() };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Space+Grotesk:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(e){} }
  }, []);

  const handleAuthDone = (profile) => {
    setUserProfile(profile);
    // Direct entry to main website — NO intermediate quote screen!
    setScreen('home');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundImage: "url('/app_bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <AppleEmoji/>
      <AnimatePresence mode="wait">

        {/* 1. Splash Screen (Snappy AI Intro) */}
        {screen === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setScreen('auth')} />
        )}

        {/* 2. 3D Auth & Login / Sign-up Panel */}
        {screen === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Auth onComplete={(profile) => handleAuthDone(profile)} />
          </motion.div>
        )}

        {/* 3. Main Website (Home) — Complete Psychology Consultation Hub */}
        {screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
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
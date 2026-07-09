import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaPhoneAlt, FaChevronRight, FaHeart, FaSmileWink, FaSparkles } from 'react-icons/fa';

const userGoogleEmails = [
  { name: 'Rajat Kamal', email: 'rajatkamal20089@gmail.com', initial: 'R' },
  { name: 'Sarwesh Kumar Kamal', email: 'sarwesh.kamal@gmail.com', initial: 'S' }
];

export default function HypnoticJoyfulAIVision() {
  const [currentScreen, setCurrentScreen] = useState('landing'); 
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeAI, setActiveAI] = useState('AURA');
  const [aiDialogue, setAiDialogue] = useState('Hello beautiful soul! Your neural synchronization is complete. Let’s light up your day together!');
  const [eyeExpression, setEyeExpression] = useState('laughing'); // Default to joyful expression to set the happy tone

  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght=0,400;0,600;1,400;1,700&family=Space+Grotesk:wght@400;500;700&display=swap';
    document.head.appendChild(fontLink);
    return () => document.head.removeChild(fontLink);
  }, []);

  const triggerVoiceAndJoy = (aiCore, statement) => {
    setAiDialogue(statement);
    setEyeExpression('normal');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(statement);
      utterance.rate = 1.05; // Slightly faster for a cheerful, energetic tone
      utterance.pitch = aiCore === 'AURA' ? 1.45 : 0.85;
      window.speechSynthesis.speak(utterance);
    }

    // Instantly returns to a high-happiness state
    setTimeout(() => {
      setEyeExpression('laughing');
    }, 800);
  };

  const finalizeLoginFlow = (profile) => {
    setSelectedProfile(profile);
    setCurrentScreen('aiHub');
    setTimeout(() => {
      triggerVoiceAndJoy('AURA', "Welcome to your ultimate sanctuary! I am Aura, your source of absolute positivity. Let's melt away any stress and bring a massive smile to your face today!");
    }, 900);
  };

  const toggleAISystem = (targetCore) => {
    setActiveAI(targetCore);
    const joyfulQuote = targetCore === 'AURA' 
      ? "You look wonderful today! I am unlocking your inner peace matrix. Let's focus on beautiful thoughts and create a space of pure bliss."
      : "Max cognitive happiness grid active! Scanning for stress particles and replacing them with premium dopamine currents. You are doing fantastic!";
    triggerVoiceAndJoy(targetCore, joyfulQuote);
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw', backgroundColor: '#020308',
      color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflowX: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      
      {/* HYPNOTIC FLUID AURORA BACKGROUND CANVAS */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 0.9, 1],
            x: [0, 40, -30, 0],
            y: [0, -50, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-10%', left: '15%', width: '60%', height: '60%',
            background: 'radial-gradient(circle, rgba(139,135,245,0.18) 0%, rgba(99,102,241,0.05) 50%, transparent 80%)', filter: 'blur(90px)'
          }} 
        />
        <motion.div 
          animate={{ 
            scale: [1, 0.8, 1.1, 1],
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '-5%', right: '10%', width: '65%', height: '65%',
            background: activeAI === 'AURA' ? 'radial-gradient(circle, rgba(139,135,245,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(94,184,173,0.15) 0%, transparent 70%)',
            filter: 'blur(110px)', transition: 'all 1s ease'
          }} 
        />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.008) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.8 }} />
      </div>

      <AnimatePresence mode="wait">
        
        {/* SCREEN 1: BREATHTAKING LANDING EXPERIENCE */}
        {currentScreen === 'landing' && (
          <motion.div
            key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 100px', boxSizing: 'border-box',
              backgroundImage: "linear-gradient(to bottom, rgba(2,3,8,0.1) 0%, #020308 95%), url('https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=2500')",
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            {/* Top HUD Brand Menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaSparkles size={16} color="#fbcfe8" style={{ animation: 'spin 4s linear infinite' }} />
                <span style={{ fontSize: '0.95rem', fontWeight: '800', letterSpacing: '8px', fontFamily: "'Space Grotesk', sans-serif", background: 'linear-gradient(to right, #ffffff, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AMULET.AI</span>
              </div>
              <div style={{ display: 'flex', gap: '45px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '3px', opacity: 0.6 }}>
                <span style={{ cursor: 'pointer' }}>THE JOY PROTOCOL</span>
                <span style={{ cursor: 'pointer' }}>SEROTONIN HUD</span>
                <span style={{ cursor: 'pointer' }}>VIBE SYNCHRONIZER</span>
              </div>
            </div>

            {/* Main Visual Typography Title */}
            <div style={{ maxWidth: '1000px', textAlign: 'left' }}>
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
                <h1 style={{ fontSize: '6.5rem', fontWeight: '800', lineHeight: '0.92', letterSpacing: '-4px', marginBottom: '35px' }}>
                  A happier state <br /> of mind, <br />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: '400', background: 'linear-gradient(to right, #fbcfe8, #c7d2fe, var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    crafted just for you.
                  </span>
                </h1>
              </motion.div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '50px' }}>
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentScreen('auth')} 
                  style={{ padding: '20px 48px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.12)', background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(30px)', color: '#fff', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  BEGIN YOUR JOURNEY
                </motion.button>
                <p style={{ maxWidth: '440px', fontSize: '1rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.4)', fontWeight: '300', margin: 0 }}>
                  Why look anywhere else? Step into an immersive space designed exclusively to boost your mood, trigger genuine smiles, and align your cosmic peace.
                </p>
              </div>
            </div>

            {/* Footer Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: "'Space Grotesk', sans-serif", opacity: 0.2, letterSpacing: '3px' }}>
              <span>EMOTIONAL AMBIENCE MATRIX SYSTEM V5.2</span>
              <span>PURE POSITIVITY INC. ©2026</span>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: THE SECURE ACCESSIBILITY NODE */}
        {currentScreen === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.01)', backdropFilter: 'blur(50px)', borderRadius: '45px', border: '1px solid rgba(255, 255, 255, 0.07)', padding: '65px 55px', width: '450px', boxShadow: '0 50px 120px rgba(0,0,0,0.8)', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.06)' }}><FaSmileWink size={24} color="#fbcfe8"/></div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1.5px' }}>Access Portal</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', marginBottom: '45px', fontWeight: '300' }}>Synchronizing your personalized aesthetic vault</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: <FcGoogle size={22}/>, label: 'Initialize via Google Core' },
                  { icon: <FaApple size={22} color="#fff"/>, label: 'Initialize via Apple Vault' },
                  { icon: <FaPhoneAlt size={16} color="rgba(255,255,255,0.6)"/>, label: 'Instant Mobile Link Transmit' }
                ].map((btn, i) => (
                  <motion.button 
                    key={i} whileHover={{ background: 'rgba(255,255,255,0.07)', x: 6, borderColor: 'rgba(255,255,255,0.15)' }} onClick={() => setCurrentScreen('selection')}
                    style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '22px', color: '#fff', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    {btn.icon}
                    <span style={{ flex: 1, textAlign: 'left', fontSize: '0.95rem', fontWeight: '500', opacity: 0.85 }}>{btn.label}</span>
                    <FaChevronRight size={10} style={{ opacity: 0.3 }}/>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 3: HIGH-AESTHETIC PROFILE SELECTION */}
        {currentScreen === 'selection' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.01)', backdropFilter: 'blur(50px)', borderRadius: '45px', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '55px 50px', width: '450px' }}>
              <h3 style={{ fontSize: '1.9rem', fontWeight: '700', marginBottom: '35px', textAlign: 'center', letterSpacing: '-0.5px' }}>Select Mind Node</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {userGoogleEmails.map((profile, idx) => (
                  <motion.div 
                    key={idx} whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }} onClick={() => finalizeLoginFlow(profile)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '22px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.25s' }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.15rem', boxShadow: '0 10px 25px rgba(0,0,0,0.25)' }}>{profile.initial}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: '600', letterSpacing: '-0.2px' }}>{profile.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{profile.email}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: UNMISSABLE HYPNOTIC JOY SANCTUARY */}
        {currentScreen === 'aiHub' && (
          <motion.div
            key="ai-hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#020308', overflow: 'hidden'
            }}
          >
            {/* AMBIENT MESH GRID CONTROLLER */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
              <div style={{ 
                position: 'absolute', inset: 0, 
                background: activeAI === 'AURA' 
                  ? 'radial-gradient(circle at 50% 45%, rgba(139,135,245,0.14) 0%, rgba(99,102,241,0.04) 50%, transparent 75%)'
                  : 'radial-gradient(circle at 50% 45%, rgba(94,184,173,0.14) 0%, rgba(13,148,136,0.04) 50%, transparent 75%)',
                transition: 'all 1.2s ease', filter: 'blur(70px)'
              }} />
            </div>

            {/* FLOATING TOP HEALTH HUD STATUS BAR */}
            <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px 22px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(25px)' }}>
              <FaHeart size={12} color="#8b87f5" style={{ animation: 'pulse 1.2s infinite' }}/>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2.5px', opacity: 0.7, fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}>DOPAMINE TRACKER: OPTIMAL STABILITY</span>
            </div>

            {/* EXECUTIVE SYSTEM CONTROLLER TABS */}
            <div style={{ position: 'absolute', top: '40px', zIndex: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', backdropFilter: 'blur(30px)', boxShadow: 'var(--shadow-premium)' }}>
                <button onClick={() => toggleAISystem('AURA')} style={{ padding: '14px 34px', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2.5px', fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', background: activeAI === 'AURA' ? 'var(--accent-aura)' : 'transparent', color: activeAI === 'AURA' ? '#fff' : 'rgba(255,255,255,0.4)', boxShadow: activeAI === 'AURA' ? 'var(--shadow-premium)' : 'none' }}>ANGELIC AURA</button>
                <button onClick={() => toggleAISystem('MAX')} style={{ padding: '14px 34px', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2.5px', fontFamily: "'Space Grotesk', sans-serif", transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', background: activeAI === 'MAX' ? 'var(--accent-max)' : 'transparent', color: activeAI === 'MAX' ? '#fff' : 'rgba(255,255,255,0.4)', boxShadow: activeAI === 'MAX' ? 'var(--shadow-premium)' : 'none' }}>MAX COGNITION</button>
              </div>
            </div>

            {/* THE UNMISSABLE MATTE-VINYL 3D TOY CHARACTER */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}
            >
              {/* 1. GLOWING POSITIVITY TRANSMITTER (Antenna Orb) */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '-12px', zIndex: 6 }}>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.18, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f8fafc 45%, #cbd5e1 100%)',
                    boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.2)',
                    filter: activeAI === 'AURA' ? 'drop-shadow(0 4px 10px rgba(244,63,94,0.3))' : 'drop-shadow(0 4px 10px rgba(20,184,166,0.3))'
                  }}
                />
                <div style={{
                  width: '14px', height: '24px', marginTop: '-6px',
                  background: activeAI === 'AURA' ? 'linear-gradient(to bottom, #ffffff, var(--accent-aura-border))' : 'linear-gradient(to bottom, #ffffff, var(--accent-max-border))',
                  borderRadius: '4px 4px 0 0', opacity: 0.95, transition: 'all 0.5s'
                }} />
              </div>

              {/* 2. PREMIUM SOFT CHUBBY HELMET (Ultra Realistic Volumetric Contours) */}
              <div style={{
                width: '310px', height: '265px', borderRadius: '50% 50% 46% 46% / 56% 56% 44% 44%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 30%, #cbd5e1 75%, #94a3b8 100%)',
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 50px 90px rgba(0,0,0,0.5), inset 0 18px 26px #ffffff, inset 0 -16px 35px rgba(148,163,184,0.4)',
                zIndex: 4
              }}>
                
                {/* AMBIENT SIDE CAPSULES (Ear Translucency) */}
                <div style={{
                  position: 'absolute', left: '-18px', width: '42px', height: '72px', borderRadius: '50% 30% 30% 50% / 50% 40% 40% 50%',
                  background: activeAI === 'AURA' ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, var(--accent-aura) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, var(--accent-max) 100%)',
                  boxShadow: '-4px 4px 10px rgba(0,0,0,0.15)', transition: 'all 0.5s'
                }} />
                <div style={{
                  position: 'absolute', right: '-18px', width: '42px', height: '72px', borderRadius: '30% 50% 50% 30% / 40% 50% 50% 40%',
                  background: activeAI === 'AURA' ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, var(--accent-aura) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, var(--accent-max) 100%)',
                  boxShadow: '4px 4px 10px rgba(0,0,0,0.15)', transition: 'all 0.5s'
                }} />

                {/* THE CRYSTAL SEAMLESS VISOR ZONE WITH INTENSE BLUSH OVERLAY */}
                <div style={{
                  width: '240px', height: '165px', borderRadius: '50% 50% 45% 45% / 58% 58% 42% 42%',
                  background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '44px', position: 'relative',
                  boxShadow: 'inset 0 14px 25px rgba(148,163,184,0.45), 0 4px 8px rgba(255,255,255,0.9)'
                }}>
                  {/* Specular Mirror Light Reflection Flare */}
                  <div style={{ position: 'absolute', top: '5px', left: '22px', width: '196px', height: '44px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, transparent 100%)', borderRadius: '50% 50% 20% 20% / 80% 80% 20% 20%', opacity: 0.75 }} />

                  {/* VIBRANT CUTE CHUBBY PINK BLUSH VECTORS (Guarantees A Happy Response Look!) */}
                  <div style={{
                    position: 'absolute', left: '22px', bottom: '40px', width: '32px', height: '16px',
                    background: 'radial-gradient(circle, rgba(139,135,245,0.55) 0%, transparent 70%)', filter: 'blur(2px)'
                  }} />
                  <div style={{
                    position: 'absolute', right: '22px', bottom: '40px', width: '32px', height: '16px',
                    background: 'radial-gradient(circle, rgba(139,135,245,0.55) 0%, transparent 70%)', filter: 'blur(2px)'
                  }} />

                  {/* INTERACTIVE HIGH-AESTHETIC EMOTION EYES */}
                  <AnimatePresence mode="wait">
                    {eyeExpression === 'normal' ? (
                      <>
                        <motion.div key="norm-l" animate={{ scaleY: [1, 1, 0.05, 1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ width: '24px', height: '40px', borderRadius: '50%', backgroundColor: '#0f172a', position: 'relative', boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.2)' }} 
                        >
                          <div style={{ position: 'absolute', top: '6px', left: '6px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.95 }} />
                        </motion.div>
                        <motion.div key="norm-r" animate={{ scaleY: [1, 1, 0.05, 1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                          style={{ width: '24px', height: '40px', borderRadius: '50%', backgroundColor: '#0f172a', position: 'relative', boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.2)' }} 
                        >
                          <div style={{ position: 'absolute', top: '6px', left: '6px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#fff', opacity: 0.95 }} />
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {/* ULTRA HAPPY DYNAMIC SPLINE CURVES (Makes everyone smile back!) */}
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="34" height="24" viewBox="0 0 34 24" fill="none"><path d="M4 20C10 6 24 6 30 20" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/></svg>
                        </motion.div>
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 }} style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="34" height="24" viewBox="0 0 34 24" fill="none"><path d="M4 20C10 6 24 6 30 20" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/></svg>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 3. DESIGNER LOWER PEAR TORSO BASE */}
              <div style={{
                width: '180px', height: '150px', marginTop: '-24px', position: 'relative', zIndex: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                {/* Premium Finished Silicone Protective Jacket Outer Shell */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, #f1f5f9 0%, #cbd5e1 70%, #94a3b8 100%)',
                  borderRadius: '45% 45% 35% 35% / 30% 30% 70% 70%',
                  boxShadow: '0 30px 55px rgba(0,0,0,0.35), inset 0 12px 16px #ffffff, inset 0 -10px 20px rgba(0,0,0,0.06)'
                }} />

                {/* Weighted White Plinth Base Ring */}
                <div style={{
                  position: 'absolute', bottom: '-15px', width: '154px', height: '36px',
                  background: 'linear-gradient(to bottom, #ffffff 0%, #e2e8f0 100%)',
                  borderRadius: '0 0 40px 40px', zIndex: 1, boxShadow: '0 20px 30px rgba(0,0,0,0.25)'
                }} />

                {/* Adorable Stubby Hand Extenders */}
                <div style={{ position: 'absolute', left: '-16px', top: '50px', width: '26px', height: '56px', background: '#ffffff', borderRadius: '16px 4px 6px 18px', transform: 'rotate(15deg)', boxShadow: '-4px 6px 10px rgba(0,0,0,0.15)' }} />
                <div style={{ position: 'absolute', right: '-16px', top: '50px', width: '26px', height: '56px', background: '#ffffff', borderRadius: '4px 16px 18px 6px', transform: 'rotate(-15deg)', boxShadow: '4px 6px 10px rgba(0,0,0,0.15)' }} />

                {/* MATTE-SILVER MECHANICAL NAV CONSOLE D-PAD */}
                <div style={{
                  position: 'relative', zIndex: 3, marginTop: '28px',
                  width: '82px', height: '82px', borderRadius: '50%', background: '#edf2f7',
                  border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 6px 12px rgba(148,163,184,0.6), 0 4px 8px #ffffff'
                }}>
                  {/* Blinking Positivity Core Diode */}
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 4px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeAI === 'AURA' ? 'var(--accent-aura)' : 'var(--accent-max)', transition: 'all 0.5s' }} />
                  </div>

                  {/* Calibration Grid Nodes */}
                  <div style={{ position: 'absolute', top: '6px', width: '18px', height: '5px', background: '#cbd5e1', borderRadius: '2px' }} />
                  <div style={{ position: 'absolute', bottom: '6px', width: '18px', height: '5px', background: '#cbd5e1', borderRadius: '2px' }} />
                  <div style={{ position: 'absolute', left: '6px', width: '5px', height: '18px', background: '#cbd5e1', borderRadius: '2px' }} />
                  <div style={{ position: 'absolute', right: '6px', width: '5px', height: '18px', background: '#cbd5e1', borderRadius: '2px' }} />
                </div>
              </div>

            </motion.div>

            {/* HIGH-PRESTIGE COGNITIVE TEXT CONTAINER */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              style={{
                marginTop: '65px', textAlign: 'center', width: '700px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                padding: '35px 45px', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(35px)', boxShadow: '0 40px 80px rgba(0,0,0,0.45)', zIndex: 10
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '5px', fontFamily: "'Space Grotesk', sans-serif", color: activeAI === 'AURA' ? '#8b87f5' : '#5eb8ad', transition: 'all 0.5s' }}>
                  {activeAI} IMMERSIVE TELEMETRY
                </span>
              </div>
              <p style={{ fontSize: '1.45rem', fontWeight: '300', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', lineHeight: '1.65', color: '#ffffff', margin: 0 }}>
                "{aiDialogue}"
              </p>
            </motion.div>

            {/* Encryption Footer Pipelines */}
            <div style={{ position: 'absolute', bottom: '35px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '2px', fontFamily: "'Space Grotesk', sans-serif" }}>
              <span>ACTIVE COGNITIVE SHIELD SYNCED TO: {selectedProfile?.email}</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
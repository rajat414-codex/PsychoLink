import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { API_BASE } from './config'
import RobotAvatar from './RobotAvatar'

function AIChatEngine({ user, setUser }) {
  // Check identity to deploy specific core
  const isFemale = user.gender === 'female';
  const ai = isFemale
    ? { name: 'AURA', color: '#ff3b30', glow: 'rgba(255, 59, 48, 0.05)', welcome: `AURA core online. Welcome back, ${user.name}. Ready to analyze your psychological waves.` }
    : { name: 'MAX', color: '#34c759', glow: 'rgba(52, 199, 89, 0.05)', welcome: `MAX nexus initiated. System active for user ${user.name}. Let's process the feed.` };

  const [messages, setMessages] = useState([{ role: 'ai', text: ai.welcome }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setError(null);
    setIsTyping(true);

    try {
      // Convert {role:'ai'|'user', text} → {role:'assistant'|'user', content}
      // skip the canned welcome message for context to keep it clean
      const history = newMessages
        .filter((m, i) => !(i === 0 && m.role === 'ai'))
        .map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.text,
        }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, persona: ai.name }),
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || "Connection unstable — try again.";

      setMessages(prev => [...prev, { role: 'ai', text: replyText }]);

    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection to AI core failed. Make sure the backend server is running.');
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `[${ai.name} System Log]: ⚠️ Connection lost. Could not reach the AI core. Check that your local server is running.`,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: '#040509', minHeight: '100vh', color: '#fff',
        display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Core Top Bar */}
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,12,22,0.4)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: ai.color }}>PsychoLink // {ai.name} Core</span>
          {/* connection status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px',
            background: error ? 'rgba(255,80,80,0.10)' : 'rgba(80,255,150,0.10)',
            border: `1px solid ${error ? 'rgba(255,80,80,0.30)' : 'rgba(80,255,150,0.30)'}` }}>
            <motion.div
              animate={error ? {} : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: '6px', height: '6px', borderRadius: '50%',
                background: error ? '#ff5050' : '#50ff96',
                boxShadow:'none' }}/>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: error ? '#ff8080' : '#80ffaa', letterSpacing: '1px' }}>
              {error ? 'OFFLINE' : 'LIVE'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Node: {user.email}</span>
          <button onClick={() => setUser(null)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Disconnect</button>
        </div>
      </header>

      {/* Main UI Console splits into Feed & Persistent AI view */}
      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>

        {/* Left Side Content - Dynamic Feed Scroll */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)', paddingRight: '10px' }}>
          {[1, 2, 3].map((feed) => (
            <div key={feed} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '28px', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Consultation Stream Matrix #{feed}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
                Scroll down through this workspace feed. You will notice that the custom {ai.name} core layout panel on the right side stays completely static, locked onto your screen frame.
              </p>
            </div>
          ))}
        </div>

        {/* Right Side - STICKY FLOATING AI CORE (Won't disappear on scroll!) */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'sticky', top: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Visual AI Eye Pulse Node */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(30px)', border: `1px solid ${ai.color}30`, padding: '30px 20px', borderRadius: '28px', textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <RobotAvatar
                  expression={error ? 'dizzy' : isTyping ? 'happy' : 'smile'}
                  size="md"
                  glowColor={ai.color}
                  isTyping={isTyping}
                />
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', letterSpacing: '1px' }}>{ai.name} AVATAR LIVE</h4>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: '600' }}>SECURE COGNITIVE FEED</p>
            </div>

            {/* Translucent Chat Bubble Frame */}
            <div style={{ background: 'rgba(255, 255, 255, 0.015)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '28px', padding: '20px', height: '370px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
              <div ref={scrollRef} style={{ overflowY: 'auto', flexGrow: 1, marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {messages.map((msg, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, var(--accent-purple) 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.02)',
                      color: '#fff',
                      padding: '12px 18px', 
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', 
                      fontSize: '0.85rem', 
                      maxWidth: '85%', 
                      fontWeight: '500',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.04)',
                      borderLeft: msg.role === 'user' ? 'none' : `3px solid ${ai.color}`,
                      boxShadow: msg.role === 'user' ? '0 8px 24px rgba(99, 102, 241, 0.25)' : `0 4px 20px ${ai.glow}`,
                      whiteSpace: 'pre-wrap', 
                      lineHeight: 1.5,
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}>
                    {msg.text}
                  </motion.div>
                ))}

                {/* typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderLeft: `3px solid ${ai.color}`,
                        padding: '12px 18px', borderRadius: '4px 18px 18px 18px',
                        display: 'flex', gap: '5px', alignItems: 'center'
                      }}>
                      {[0,1,2].map(i => (
                        <motion.div key={i}
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                          transition={{ duration: 1.0, repeat: Infinity, delay: i*0.18, ease: 'easeInOut' }}
                          style={{ width: '6px', height: '6px', borderRadius: '50%', background: ai.color }}/>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* error banner */}
              {error && (
                <div style={{ marginBottom: '10px', padding: '8px 12px', borderRadius: '10px',
                  background: 'rgba(255,80,80,0.10)', border: '1px solid rgba(255,80,80,0.25)' }}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#ff9999', lineHeight: 1.4 }}>{error}</p>
                </div>
              )}

              {/* Action Box Panel Input */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                  placeholder={`Message ${ai.name}...`}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '12px 16px', color: '#fff', fontSize: '0.86rem', outline: 'none', opacity: isTyping ? 0.6 : 1, transition: 'all 0.25s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onFocus={e => { e.target.style.borderColor = ai.color; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                />
                <button onClick={handleSend} disabled={isTyping}
                  style={{ background: ai.color, color: '#000', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isTyping ? 'not-allowed' : 'pointer', opacity: isTyping ? 0.6 : 1, boxShadow: `0 4px 12px ${ai.color}35`, transition: 'all 0.25s', flexShrink: 0 }}>
                  {isTyping ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000' }}/>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default AIChatEngine

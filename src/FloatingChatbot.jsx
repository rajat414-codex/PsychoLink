import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from './config';

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeAI, setActiveAI] = useState('AURA'); // 'AURA' | 'MAX'
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessions, setSessions] = useState({
        AURA: [{ role: 'assistant', content: 'Hello! I am Aura 🌸. Your emotional support companion. Aap kaisa feel kar rahe hain? Feel free to talk in English or Hinglish.', ts: new Date() }],
        MAX: [{ role: 'assistant', content: 'Hello! I am Max ⚡. Your mental action specialist. Break down whatever is blocking you. English or Hinglish works.', ts: new Date() }]
    });

    const messages = sessions[activeAI];
    const msgsRef = useRef(null);

    // Auto-scroll on new message
    useEffect(() => {
        if (msgsRef.current) {
            msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    const SUGGESTIONS = {
        AURA: [
            "I feel anxious today",
            "Mujhe thoda stress ho raha hai",
            "Help me calm down",
            "Feel lonely"
        ],
        MAX: [
            "Analyze my habits",
            "Procrastination problem",
            "Overthinking loop",
            "Focus issue"
        ]
    };

    // Frequencies matching equilibrium app tone play
    const playTone = (type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            if (type === 'send') {
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.07, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            } else {
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.18);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            }
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {}
    };

    const handleSend = async (textToSend) => {
        const val = (textToSend || input).trim();
        if (!val || isTyping) return;

        setInput('');
        const userMsg = { role: 'user', content: val, ts: new Date() };
        const updatedMsgs = [...messages, userMsg];
        
        setSessions(prev => ({
            ...prev,
            [activeAI]: updatedMsgs
        }));
        playTone('send');
        setIsTyping(true);

        try {
            // Remove initial welcome message for backend prompt sanity
            const history = updatedMsgs
                .filter((_, idx) => idx > 0)
                .map(m => ({ role: m.role, content: m.content }));

            const auraPrompt = "You are AURA, a warm, highly empathetic AI psychological companion inside PsychoLink app. Personality: Nurturing, deeply supportive. Very important: You fully support, understand, and converse naturally in English, Hindi, and Hinglish (Hindi written in Roman script like 'Aap kaise hain?', 'Mujhe thoda tension ho raha hai'). Keep responses warm, encouraging, conversational, and concise (2-4 sentences max). Never diagnose.";
            const maxPrompt = "You are MAX, a sharp structured cognitive consultant inside PsychoLink app. Personality: Analytical, logical, CBT-focused. Very important: You fully support, understand, and converse naturally in English, Hindi, and Hinglish. Keep responses concise and structured. Always offer: 1) Identification of thoughts 2) Small actionable coping step.";

            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: history,
                    persona: activeAI,
                    systemPrompt: activeAI === 'AURA' ? auraPrompt : maxPrompt
                })
            });

            if (!res.ok) throw new Error("API responded with error");
            const data = await res.json();
            const reply = data.reply || "I am here for you 🌸";

            setSessions(prev => ({
                ...prev,
                [activeAI]: [...updatedMsgs, { role: 'assistant', content: reply, ts: new Date() }]
            }));
            playTone('receive');
        } catch (e) {
            setSessions(prev => ({
                ...prev,
                [activeAI]: [...updatedMsgs, { role: 'assistant', content: "[Core System Log]: Connection lost. Please ensure the local backend server is running on port 3001.", ts: new Date() }]
            }));
        } finally {
            setIsTyping(false);
        }
    };

    const accent = activeAI === 'AURA' ? '#ef4444' : '#22c55e';
    const bgGlow = activeAI === 'AURA' 
        ? 'radial-gradient(circle at 50% -20%, rgba(239, 68, 68, 0.08) 0%, transparent 60%)' 
        : 'radial-gradient(circle at 50% -20%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)';

    return (
        <>
            {/* 1. PULSING FLOATING TRIGGER BUTTON */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#080808',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 99999,
                    border: 'none',
                    outline: 'none'
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Spinning holograph border effect */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: isOpen ? 2 : 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        background: `conic-gradient(from 0deg, #f43f5e, #8b5cf6, #3b82f6, #14b8a6, #f43f5e)`,
                        zIndex: -1,
                        filter: 'blur(1.5px)'
                    }}
                />
                {/* Central glowing core node */}
                <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        boxShadow: `0 0 15px ${accent}, 0 0 5px ${accent}`
                    }}
                />
            </motion.button>

            {/* 2. CHAT PANEL INTERFACE */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            bottom: '105px',
                            right: '30px',
                            width: '375px',
                            height: '520px',
                            borderRadius: '24px',
                            background: 'rgba(8, 10, 16, 0.82)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(25px)',
                            WebkitBackdropFilter: 'blur(25px)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 99998,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Radial colored aura in panel background */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: bgGlow,
                            zIndex: -1,
                            pointerEvents: 'none',
                            transition: 'background 0.5s'
                        }} />

                        {/* Top Bar Header */}
                        <div style={{
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            background: 'rgba(12, 14, 23, 0.4)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <motion.div
                                    animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#10b981',
                                        boxShadow: '0 0 8px #10b981'
                                    }}
                                />
                                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>
                                    {activeAI === 'AURA' ? 'AURA Core' : 'MAX Core'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Selector toggler */}
                                <div style={{
                                    display: 'flex',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '12px',
                                    padding: '2px',
                                    gap: '2px'
                                }}>
                                    <button
                                        onClick={() => setActiveAI('AURA')}
                                        style={{
                                            border: 'none',
                                            background: activeAI === 'AURA' ? '#ef4444' : 'transparent',
                                            color: activeAI === 'AURA' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            padding: '5px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Aura
                                    </button>
                                    <button
                                        onClick={() => setActiveAI('MAX')}
                                        style={{
                                            border: 'none',
                                            background: activeAI === 'MAX' ? '#22c55e' : 'transparent',
                                            color: activeAI === 'MAX' ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            padding: '5px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Max
                                    </button>
                                </div>
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.35)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '4px',
                                        borderRadius: '6px'
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Messages Area */}
                        <div
                            ref={msgsRef}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px 20px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === 'user';
                                const initials = isUser ? 'U' : (activeAI === 'AURA' ? 'AU' : 'MX');
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignSelf: isUser ? 'flex-end' : 'flex-start',
                                            flexDirection: isUser ? 'row-reverse' : 'row',
                                            gap: '10px',
                                            maxWidth: '85%'
                                        }}
                                    >
                                        {/* Avatar */}
                                        <div style={{
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: '#161825',
                                            border: `1px solid ${isUser ? 'rgba(255,255,255,0.08)' : (activeAI === 'AURA' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(20, 184, 166, 0.3)')}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            flexShrink: 0,
                                            color: isUser ? 'rgba(255,255,255,0.5)' : accent
                                        }}>
                                            {initials}
                                        </div>
                                        {/* Message Text */}
                                        <div style={{
                                             padding: '10px 16px',
                                             fontSize: '0.84rem',
                                             lineHeight: 1.5,
                                             borderRadius: '16px',
                                             borderTopLeftRadius: isUser ? '16px' : '4px',
                                             borderTopRightRadius: isUser ? '4px' : '16px',
                                             background: isUser 
                                                 ? 'linear-gradient(135deg, var(--accent-purple) 0%, #4f46e5 100%)'
                                                 : 'rgba(255, 255, 255, 0.02)',
                                             border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                                             borderLeft: isUser ? 'none' : `3px solid ${accent}`,
                                             boxShadow: isUser ? '0 6px 18px rgba(99, 102, 241, 0.2)' : `0 4px 15px ${activeAI === 'AURA' ? 'rgba(244, 63, 94, 0.04)' : 'rgba(20, 184, 166, 0.04)'}`,
                                             color: '#fff',
                                             wordBreak: 'break-word',
                                             whiteSpace: 'pre-wrap',
                                             fontFamily: "'Plus Jakarta Sans', sans-serif"
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Bouncing typing indicator */}
                            {isTyping && (
                                <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                                    <div style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        background: '#161825',
                                        border: `1px solid ${activeAI === 'AURA' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(20, 184, 166, 0.3)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        flexShrink: 0,
                                        color: accent
                                    }}>
                                        {activeAI === 'AURA' ? 'AU' : 'MX'}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '4px',
                                        padding: '10px 14px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.04)',
                                        borderRadius: '16px',
                                        borderTopLeftRadius: '4px'
                                    }}>
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                                                style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: accent
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Suggestions Chips List */}
                        <div style={{
                            padding: '0 20px 10px',
                            display: 'flex',
                            gap: '8px',
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            {SUGGESTIONS[activeAI].map((sug, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(sug)}
                                    style={{
                                        padding: '7px 14px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                        borderRadius: '16px',
                                        color: 'rgba(255, 255, 255, 0.65)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        transition: 'all 0.25s'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = accent + '50';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                                    }}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>

                        {/* Text Input Panel */}
                        <div style={{
                            padding: '12px 20px 20px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: '18px',
                                padding: '4px 6px 4px 14px',
                                transition: 'all 0.3s'
                            }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        color: '#fff',
                                        fontSize: '0.84rem',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        padding: '8px 0'
                                    }}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: input.trim() ? accent : 'rgba(255, 255, 255, 0.03)',
                                        border: `1px solid ${input.trim() ? accent : 'rgba(255, 255, 255, 0.06)'}`,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s',
                                        color: input.trim() ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                                        boxShadow: input.trim() ? `0 4px 12px ${accent}40` : 'none'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

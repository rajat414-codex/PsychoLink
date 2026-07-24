import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from './config';
import RobotAvatar from './RobotAvatar';

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeAI, setActiveAI] = useState('AURA'); // 'AURA' | 'MAX' | 'SYNAPSE' | 'LEX'
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessions, setSessions] = useState({
        AURA: [{ role: 'assistant', content: 'Hello! I am Aura 🌸. Your emotional support companion. Aap kaisa feel kar rahe hain? Feel free to talk in English or Hinglish.', ts: new Date() }],
        MAX: [{ role: 'assistant', content: 'Hello! I am Max ⚡. Your mental action specialist. Break down whatever is blocking you. English or Hinglish works.', ts: new Date() }],
        SYNAPSE: [{ role: 'assistant', content: 'Welcome! I am Synapse 💻. Your career & tech mentor. Ready to map out your skills and professional roadmap.', ts: new Date() }],
        LEX: [{ role: 'assistant', content: 'Greetings! I am Lex ⚖️. Your business & legal advisor. Ask me anything about startup strategy, decision frameworks, and legal concepts.', ts: new Date() }]
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
        ],
        SYNAPSE: [
            "Career roadmap advice",
            "Learn tech skills fast",
            "Interview prep tips",
            "Workplace stress"
        ],
        LEX: [
            "Business risk analysis",
            "Basic contract guidelines",
            "Startup decision framework",
            "Negotiation advice"
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
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
            // Audio context muted or unsupported
        }
    };

    const handleSend = async (customText) => {
        const textToSend = customText || input;
        if (!textToSend.trim() || isTyping) return;

        const userMsg = { role: 'user', content: textToSend, ts: new Date() };

        setSessions(prev => ({
            ...prev,
            [activeAI]: [...prev[activeAI], userMsg]
        }));

        if (!customText) setInput('');
        setIsTyping(true);
        playTone('send');

        try {
            const history = [...sessions[activeAI], userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const auraPrompt = `You are AURA (Affective Understanding and Reflective AI), a warm empathetic AI therapist inside PsychoLink app. Personality: Warm, nurturing, emotionally intelligent. Specialization: anxiety, depression, stress, relationships, self-esteem, mindfulness. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish. Always respond with empathy first, then guidance. Keep responses warm and concise (2-4 sentences). Use emojis 🌸.`;

            const maxPrompt = `You are MAX (Mental Analytical eXpert), a logical structured AI therapist inside PsychoLink app. Personality: Analytical, precise, solution-focused. Specialization: CBT frameworks, habits, focus, productivity. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish. Keep responses concise and structured.`;

            const synapsePrompt = `You are SYNAPSE (Strategic Tech & Career Guidance AI), a high-performance career and tech mentor inside PsychoLink app. Specialization: tech skills, career growth, interview prep, workplace dynamics. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish. Keep responses encouraging and practical (2-4 sentences). Use emojis 💻.`;

            const lexPrompt = `You are LEX (Legal & Executive Business Advisor), a sharp strategic business and legal concept counselor inside PsychoLink app. Specialization: business model validation, startup risk, compliance principles, decision matrices. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish. Keep responses sharp and structured (2-4 sentences). Use emojis ⚖️.`;

            const selectedPrompt =
                activeAI === 'AURA' ? auraPrompt :
                activeAI === 'MAX' ? maxPrompt :
                activeAI === 'SYNAPSE' ? synapsePrompt : lexPrompt;

            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: history,
                    persona: activeAI,
                    systemPrompt: selectedPrompt
                })
            });

            if (!res.ok) throw new Error("API responded with error");
            const data = await res.json();
            const reply = data.reply || "I am here for you 🌸";

            setSessions(prev => ({
                ...prev,
                [activeAI]: [...prev[activeAI], userMsg, { role: 'assistant', content: reply, ts: new Date() }]
            }));
            playTone('receive');
        } catch (e) {
            setSessions(prev => ({
                ...prev,
                [activeAI]: [
                    ...prev[activeAI],
                    userMsg,
                    { role: 'assistant', content: "I am having trouble connecting to my cognitive neural engine right now. Please try again shortly.", ts: new Date() }
                ]
            }));
        } finally {
            setIsTyping(false);
        }
    };

    const aiColor =
        activeAI === 'AURA' ? '#ef4444' :
        activeAI === 'MAX' ? '#22c55e' :
        activeAI === 'SYNAPSE' ? '#06b6d4' : '#a855f7';

    const bgGlow =
        activeAI === 'AURA' ? 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)' :
        activeAI === 'MAX' ? 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)' :
        activeAI === 'SYNAPSE' ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)' :
        'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)';

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
            {/* Expanded Chat Widget Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        style={{
                            width: '380px',
                            height: '540px',
                            borderRadius: '28px',
                            background: 'rgba(8, 12, 22, 0.75)',
                            backdropFilter: 'blur(32px)',
                            WebkitBackdropFilter: 'blur(32px)',
                            border: `1px solid ${aiColor}35`,
                            boxShadow: `0 24px 60px -10px rgba(0, 0, 0, 0.7), 0 0 30px ${aiColor}20`,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            position: 'relative',
                            marginBottom: '16px'
                        }}
                    >
                        {/* Background Glow */}
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
                            padding: '14px 18px',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            background: 'rgba(12, 16, 26, 0.5)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <motion.div
                                    animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        width: '7px',
                                        height: '7px',
                                        borderRadius: '50%',
                                        background: aiColor,
                                        boxShadow: `0 0 8px ${aiColor}`
                                    }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {activeAI === 'AURA' ? 'AURA Core' : activeAI === 'MAX' ? 'MAX Core' : activeAI === 'SYNAPSE' ? 'SYNAPSE Core' : 'LEX Core'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {/* 4-way Selector toggler */}
                                <div style={{
                                    display: 'flex',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '12px',
                                    padding: '2px',
                                    gap: '2px'
                                }}>
                                    {[
                                        { id: 'AURA', label: 'Aura', color: '#ef4444' },
                                        { id: 'MAX', label: 'Max', color: '#22c55e' },
                                        { id: 'SYNAPSE', label: 'Synapse', color: '#06b6d4' },
                                        { id: 'LEX', label: 'Lex', color: '#a855f7' }
                                    ].map(ai => (
                                        <button
                                            key={ai.id}
                                            onClick={() => setActiveAI(ai.id)}
                                            style={{
                                                border: 'none',
                                                background: activeAI === ai.id ? ai.color : 'transparent',
                                                color: activeAI === ai.id ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                                                fontSize: '0.66rem',
                                                fontWeight: 800,
                                                padding: '4px 7px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.25s',
                                                fontFamily: "'Space Grotesk', sans-serif"
                                            }}
                                        >
                                            {ai.label}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        color: 'rgba(255, 255, 255, 0.4)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        lineHeight: 1,
                                        padding: '4px'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Message Feed Area */}
                        <div
                            ref={msgsRef}
                            style={{
                                flex: 1,
                                padding: '16px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '82%'
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '10px 14px',
                                            borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                                            background: m.role === 'user'
                                                ? `linear-gradient(135deg, ${aiColor}35, ${aiColor}15)`
                                                : 'rgba(255, 255, 255, 0.04)',
                                            border: m.role === 'user'
                                                ? `1px solid ${aiColor}50`
                                                : '1px solid rgba(255, 255, 255, 0.08)',
                                            color: '#fff',
                                            fontSize: '0.84rem',
                                            lineHeight: 1.45,
                                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                                        }}
                                    >
                                        {m.content}
                                    </div>
                                    <span style={{ fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.3)', marginTop: '4px', display: 'block', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                                        {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}
                                >
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: aiColor, animation: 'pulse 1s infinite' }} />
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: aiColor, animation: 'pulse 1s infinite 0.2s' }} />
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: aiColor, animation: 'pulse 1s infinite 0.4s' }} />
                                </motion.div>
                            )}
                        </div>

                        {/* Quick Prompts */}
                        <div style={{ padding: '0 12px 8px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                            {SUGGESTIONS[activeAI].map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(s)}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.07)',
                                        borderRadius: '16px',
                                        padding: '5px 10px',
                                        color: 'rgba(255, 255, 255, 0.65)',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Input Footer */}
                        <div style={{
                            padding: '12px 14px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            background: 'rgba(8, 10, 18, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={`Ask ${activeAI === 'AURA' ? 'Aura' : activeAI === 'MAX' ? 'Max' : activeAI === 'SYNAPSE' ? 'Synapse' : 'Lex'}...`}
                                style={{
                                    flex: 1,
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '18px',
                                    padding: '9px 14px',
                                    color: '#fff',
                                    fontSize: '0.82rem',
                                    outline: 'none',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSend()}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: aiColor,
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    boxShadow: `0 4px 12px ${aiColor}40`
                                }}
                            >
                                ➔
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Launcher Floating Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${aiColor}, #000)`,
                    border: `1.5px solid ${aiColor}`,
                    boxShadow: `0 8px 25px ${aiColor}45`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    color: '#fff',
                    position: 'relative'
                }}
            >
                <RobotAvatar expression="smile" size="xs" glowColor={aiColor} />
            </motion.button>
        </div>
    );
}

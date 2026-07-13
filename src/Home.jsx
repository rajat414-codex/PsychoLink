import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from './config';
import {
  FaBrain, FaRobot, FaHistory, FaSignOutAlt, FaPlus,
  FaPaperPlane, FaMicrophone, FaStop, FaVolumeUp,
  FaHome, FaComments, FaUserMd, FaChartLine, FaBell,
  FaHeart, FaFire, FaSmile, FaArrowRight, FaLeaf, FaBolt,
  FaBook, FaWind, FaCloudSun
} from 'react-icons/fa';
import BrainReport from './NeurologicalReport';
import BreathingModal from './BreathingModal';
import CrisisButton from './CrisisButton';
import CalmLibrary from './CalmLibrary';
import DashboardHome from './DashboardHome';
import VideoCall from './VideoCall';
import { FaVideo, FaPhone } from 'react-icons/fa';
import ProgressDashboard from './ProgressDashboard';
import { FaSpa, FaCrown } from 'react-icons/fa';
import { JoinConsultantModal, ApplicationsPanel, PaymentModal, FreeSessionToast } from './ConsultantHub';
import RobotAvatar from './RobotAvatar';


const AURA_PROMPT = `You are AURA (Affective Understanding and Reflective AI), a warm empathetic AI therapist inside PsychoLink app. Personality: Warm, nurturing, emotionally intelligent. Specialization: anxiety, depression, stress, relationships, self-esteem, mindfulness. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish (Hindi written in Roman script like 'Aap kaise hain?', 'Mujhe stress ho raha hai'). Always respond with empathy first, then guidance. Keep responses warm, encouraging, conversational, and concise (2-4 sentences). Never diagnose. Use occasional emojis 🌸.`;

const MAX_PROMPT = `You are MAX (Mental Analytical eXpert), a logical structured AI consultant inside PsychoLink app. Personality: Analytical, precise, solution-focused. Specialization: cognitive restructuring, behavioral patterns, productivity + mental health, habit formation. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish. Keep responses concise and structured. Always analyze using CBT frameworks and provide: 1) Pattern 2) Analysis 3) Action steps.`;

const SUGGESTIONS = {
  AURA: ["I've been feeling anxious lately", "Mujhe thoda stress ho raha hai", "Help me with self-esteem", "Aap kaise help kar sakte ho?"],
  MAX:  ["Analyze my thought patterns", "I procrastinate too much", "Break a bad habit", "Focus aur concentration kaise badhaye?"]
};

// Consultants loaded from backend

const MOOD_DATA = [62, 71, 55, 80, 66, 74, 82];
const DAYS      = ['M','T','W','T','F','S','S'];

function TypingDots({ color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'12px 16px', background:'rgba(255,255,255,0.05)', borderRadius:'18px 18px 18px 4px', border:`1px solid ${color}20`, width:'fit-content' }}>
      {[0,1,2].map(i=>(
        <motion.div key={i} animate={{ scale:[1,1.5,1], opacity:[0.3,1,0.3] }} transition={{ duration:0.8, repeat:Infinity, delay:i*0.2 }}
          style={{ width:'6px', height:'6px', borderRadius:'50%', background:color }}/>
      ))}
    </div>
  );
}

function MoodChart({ color, data }) {
  const max = Math.max(...data), min = Math.min(...data) - 5;
  const W = 220, H = 65;
  const pts = data.map((v,i) => `${(i/(data.length-1))*W},${H-((v-min)/(max-min))*H}`).join(' ');
  return (
    <svg width={W} height={H+10} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${H+5} ${pts} ${W},${H+5}`} fill="url(#cg)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v,i) => (
        <motion.circle key={i} cx={(i/(data.length-1))*W} cy={H-((v-min)/(max-min))*H} r="4"
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:i*0.08, type:'spring' }}
          fill={color} opacity="0.9" stroke="#0a0a0c" strokeWidth="2"/>
      ))}
    </svg>
  );
}




export default function Home({ userProfile, onLogout }) {
  const [tab,       setTab]       = useState('home');
  const [activeAI,  setActiveAI]  = useState('AURA');
  const [sessions,  setSessions]  = useState({
    AURA: [{ id:1, title:'New conversation', messages:[], active:true }],
    MAX:  [{ id:1, title:'New conversation', messages:[], active:true }],
  });
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [listening, setListening] = useState(false);
  const [sidebar,   setSidebar]   = useState(true);
  const [moodToday,      setMoodToday]      = useState(null);
  const [showBreath,     setShowBreath]     = useState(false);
  const [showSOS,        setShowSOS]        = useState(false);
  const [isRecording,    setIsRecording]    = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecRef    = useRef(null);
  const recordTimerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const durationRef    = useRef(0);
  const transcriptRef  = useRef('');
  const [journalInput,   setJournalInput]   = useState('');
  const [journalEntries, setJournalEntries] = useState(() => { try { return JSON.parse(localStorage.getItem('eq_journal')||'[]'); } catch { return []; } });
  const [journalInsight, setJournalInsight] = useState('');
  const [journalLoading, setJournalLoading] = useState(false);
  const [sessionSummary, setSessionSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryOpen,    setSummaryOpen]    = useState(false);
  const [consultants,    setConsultants]    = useState([]);
  const [applications,   setApplications]   = useState([]);
  const [showJoin,       setShowJoin]       = useState(false);
  const [showApps,       setShowApps]       = useState(false);
  const [payConsultant,  setPayConsultant]  = useState(null);
  const [freeConsultant, setFreeConsultant] = useState(null);
  const [isPremium,      setIsPremium]      = useState(() => {
    try { return localStorage.getItem('eq_premium') === 'true'; } catch { return false; }
  });
  const [showUpgrade,    setShowUpgrade]    = useState(false);
  const [call,           setCall]           = useState(null); // { consultant, audioOnly }
  const [usedFree,       setUsedFree]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('eq_used_free') || '{}'); } catch { return {}; }
  });
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const srRef       = useRef(null);

  const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";

  const accent   = activeAI === 'AURA' ? '#ef4444' : '#22c55e';
  const accentB  = activeAI === 'AURA' ? 'rgba(239,68,68,0.03)' : 'rgba(34,197,94,0.03)';
  const accentBr = activeAI === 'AURA' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)';

  const activeSession = sessions[activeAI].find(s => s.active) || sessions[activeAI][0];
  const messages      = activeSession?.messages || [];
  const firstName     = (userProfile?.name || 'User').split(' ')[0];
  const hour          = new Date().getHours();
  const greeting      = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const MOODS = [
    { e:'😊', l:'Great' }, { e:'😌', l:'Calm' }, { e:'😐', l:'Okay' },
    { e:'😟', l:'Low'   }, { e:'😔', l:'Sad'  }
  ];

  const navItems = [
    { id:'home',     icon:<FaHome size={15}/>,      label:'Home'         },
    { id:'chat',     icon:<FaComments size={15}/>,   label:'AI Chat'      },
    { id:'report',   icon:<FaBrain size={15}/>,      label:'Brain Report' },
    { id:'consult',  icon:<FaUserMd size={15}/>,     label:'Consultants'  },
    { id:'progress', icon:<FaChartLine size={15}/>,  label:'Progress'     },
    { id:'journal',  icon:<FaBook size={15}/>,       label:'Journal'      },
    { id:'calm',     icon:<FaSpa size={15}/>,        label:'Calm Studio'  },
  ];

  useEffect(() => {
    const l = document.createElement('link');
    l.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,600;1,600;1,700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap';
    document.head.appendChild(l);
    const s = document.createElement('style');
    s.innerHTML = '*{-webkit-font-smoothing:antialiased;box-sizing:border-box;}textarea,input{outline:none;}textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.2);}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}';
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(l); document.head.removeChild(s); } catch(e) {} }
  }, []);

  // Fetch consultants from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/consultants`)
      .then(r => r.json()).then(setConsultants).catch(() => setConsultants([]));
  }, []);

  const fetchApplications = () => {
    fetch(`${API_BASE}/api/admin/applications`)
      .then(r => r.json()).then(setApplications).catch(() => setApplications([]));
  };

  const removeConsultant = async (c) => {
    if (!window.confirm(`Remove ${c.name} from the platform?`)) return;
    try {
      await fetch(`${API_BASE}/api/consultants/${c.id}`, { method:'DELETE' });
      setConsultants(prev => prev.filter(x => x.id !== c.id));
    } catch (e) { alert('Could not remove — check server.'); }
  };

  const handleBookConsultant = (c) => {
    if (usedFree[c.id]) {
      setPayConsultant(c);
    } else {
      setFreeConsultant(c);
      const updated = { ...usedFree, [c.id]: true };
      setUsedFree(updated);
      localStorage.setItem('eq_used_free', JSON.stringify(updated));
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const getMsgs = () => sessions[activeAI].find(s => s.active)?.messages || [];

  const updateSession = (msgs, title) => {
    setSessions(prev => ({
      ...prev,
      [activeAI]: prev[activeAI].map(s => s.active ? { ...s, messages:msgs, title:title||s.title } : s)
    }));
  };

  // ─────────────────────────────────────────────────────────
  // sendMsg — now calls the LOCAL server (server.js) on
  // http://localhost:3001/api/chat instead of hitting
  // api.anthropic.com directly from the browser.
  // Sends AURA_PROMPT / MAX_PROMPT as a custom systemPrompt
  // so the local server uses these detailed personas.
  // ─────────────────────────────────────────────────────────
  const sendMsg = async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const cur     = getMsgs();
    const uMsg    = { role:'user', content:t, ts:new Date() };
    const newMsgs = [...cur, uMsg];
    const title   = cur.length === 0 ? t.slice(0,36) + (t.length > 36 ? '...' : '') : undefined;
    updateSession(newMsgs, title);
    setLoading(true);
    playTone('send');
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role:m.role, content:m.content })),
          persona: activeAI,
          systemPrompt: activeAI === 'AURA' ? AURA_PROMPT : MAX_PROMPT,
        })
      });
      if (!res.ok) {
        let detail = '';
        try { const ej = await res.json(); detail = ej.error || ''; } catch {}
        throw new Error(`${res.status}${detail ? ' - ' + detail : ''}`);
      }
      const data  = await res.json();
      const reply = data.reply || "I'm here for you 🌸";
      updateSession([...newMsgs, { role:'assistant', content:reply, ts:new Date() }], title);
      playTone('receive');
    } catch(e) {
      console.error('Chat error:', e);
      updateSession([...newMsgs, { role:'assistant', content:`⚠️ Connection lost (${e.message}). Please try again.`, ts:new Date() }], title);
    }
    setLoading(false);
  };

  const newChat = () => {
    const id = Date.now();
    setSessions(prev => ({
      ...prev,
      [activeAI]: [...prev[activeAI].map(s => ({ ...s, active:false })), { id, title:'New conversation', messages:[], active:true }]
    }));
  };

  const switchSession = id => {
    setSessions(prev => ({ ...prev, [activeAI]: prev[activeAI].map(s => ({ ...s, active:s.id===id })) }));
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (listening) { srRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    srRef.current = new SR();
    srRef.current.lang = 'en-IN';
    srRef.current.continuous = false;
    srRef.current.interimResults = false;
    srRef.current.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    srRef.current.onerror  = () => setListening(false);
    srRef.current.onend    = () => setListening(false);
    srRef.current.start();
    setListening(true);
  };

  const speakText = text => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u      = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const v      = activeAI === 'AURA'
      ? voices.find(v => v.name.includes('Zira') || v.name.includes('Samantha'))
      : voices.find(v => v.name.includes('David') || v.name.includes('Google UK English Male'));
    if (v) u.voice = v;
    u.rate  = 0.9;
    u.pitch = activeAI === 'AURA' ? 1.2 : 0.8;
    window.speechSynthesis.speak(u);
  };

  const fmt = d => d ? new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '';

  const playTone = (type) => {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination); osc.type='sine';
      if (type==='send') { osc.frequency.setValueAtTime(880,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(660,ctx.currentTime+0.12); gain.gain.setValueAtTime(0.07,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2); }
      else { osc.frequency.setValueAtTime(440,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(550,ctx.currentTime+0.18); gain.gain.setValueAtTime(0.05,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3); }
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.35);
    } catch {}
  };

  // ── Voice recording: MediaRecorder (audio) + SpeechRecognition (transcript → AI) ──
  const startVoiceRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      durationRef.current   = 0;
      transcriptRef.current = '';

      // 1. SpeechRecognition — use ref so transcript is always fresh in callbacks
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        srRef.current = new SR();
        srRef.current.lang           = 'en-IN';
        srRef.current.continuous     = true;
        srRef.current.interimResults = true;
        srRef.current.onresult = (e) => {
          let finalText = '';
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
          }
          if (finalText.trim()) transcriptRef.current = finalText.trim();
        };
        srRef.current.onerror = () => {}; // silently ignore SR errors
        try { srRef.current.start(); } catch {}
      }

      // 2. MediaRecorder for audio blob
      const mr = new MediaRecorder(stream);
      mediaRecRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };

      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        // Give SpeechRecognition 600ms to flush final results
        await new Promise(r => setTimeout(r, 600));
        try { srRef.current?.stop(); } catch {}
        await new Promise(r => setTimeout(r, 200));

        const blob       = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url        = URL.createObjectURL(blob);
        const dur        = durationRef.current;      // ref — always correct
        const transcript = transcriptRef.current || '🎤 Voice message';

        // Show audio bubble + transcript
        const cur      = getMsgs();
        const voiceMsg = { role:'user', content: transcript, audioUrl: url, audioDuration: dur, ts: new Date() };
        const newMsgs  = [...cur, voiceMsg];
        updateSession(newMsgs);
        setIsRecording(false);
        setRecordDuration(0);
        clearInterval(recordTimerRef.current);

        // Send to AI
        setLoading(true);
        playTone('send');
        try {
          const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
              persona: activeAI,
              systemPrompt: activeAI === 'AURA' ? AURA_PROMPT : MAX_PROMPT,
            })
          });
          if (!res.ok) throw new Error(res.status);
          const data  = await res.json();
          const reply = data.reply || "I'm here for you 🌸";
          updateSession([...newMsgs, { role:'assistant', content: reply, ts: new Date() }]);
          playTone('receive');
        } catch (e) {
          updateSession([...newMsgs, { role:'assistant', content:`⚠️ Connection lost (${e.message}).`, ts: new Date() }]);
        }
        setLoading(false);
      };

      mr.start(200);
      setIsRecording(true);
      setRecordDuration(0);
      // Update both state (for display) and ref (for callback)
      recordTimerRef.current = setInterval(() => {
        durationRef.current += 1;
        setRecordDuration(d => d + 1);
      }, 1000);

    } catch (e) {
      alert('Microphone access denied. Please allow mic in browser settings.');
    }
  };

  const stopVoiceRecord = () => {
    if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') {
      mediaRecRef.current.stop();
    }
    clearInterval(recordTimerRef.current);
  };

  const handleMicClick = () => {
    if (isRecording) { stopVoiceRecord(); }
    else { startVoiceRecord(); }
  };

  const saveJournal = () => {
    if (!journalInput.trim()) return;
    const entry = { id:Date.now(), text:journalInput.trim(), date:new Date().toISOString() };
    const updated = [entry,...journalEntries].slice(0,50);
    setJournalEntries(updated);
    localStorage.setItem('eq_journal', JSON.stringify(updated));
    setJournalInput('');
  };

  const getJournalInsight = async () => {
    if (!journalEntries.length) return;
    setJournalLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/journal/summarize`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ entries: journalEntries.slice(0,10).map(e=>e.text) }) });
      const data = await res.json();
      setJournalInsight(data.insight || 'No insight generated.');
    } catch { setJournalInsight('Could not get insight — check server.'); }
    setJournalLoading(false);
  };

  const getSessionSummary = async () => {
    if (messages.length < 2) return;
    setSummaryLoading(true); setSummaryOpen(true);
    try {
      const res = await fetch(`${API_BASE}/api/session/summary`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages: messages.map(m=>({role:m.role,content:m.content})), persona:activeAI }) });
      const data = await res.json();
      setSessionSummary(data.summary || 'Unable to generate summary.');
    } catch { setSessionSummary('Could not generate summary.'); }
    setSummaryLoading(false);
  };

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', background:'var(--bg-app)', fontFamily:J, overflow:'hidden', position:'relative' }}>

      {/* ── GLOBAL BG ──────────────────────────────────────────── */}
      <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        {/* Subtle grid pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px)', backgroundSize:'60px 60px', opacity:0.65 }}/>
        
        {/* Ambient floating blobs */}
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position:'absolute', top:'-10%', left:'15%', width:'400px', height:'400px', borderRadius:'50%', background: activeAI === 'AURA' ? 'radial-gradient(circle, rgba(239,68,68,0.035) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(34,197,94,0.035) 0%, transparent 70%)', filter:'blur(60px)', transition:'all 1s' }}
        />
        <motion.div 
          animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position:'absolute', bottom:'-10%', right:'10%', width:'450px', height:'450px', borderRadius:'50%', background: activeAI === 'AURA' ? 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(148,163,184,0.02) 0%, transparent 70%)', filter:'blur(70px)', transition:'all 1s' }}
        />
      </div>

      {/* ══ SIDEBAR ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebar && (
          <motion.aside initial={{ x:-270, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-270, opacity:0 }}
            transition={{ type:'spring', stiffness:300, damping:30 }}
            style={{ width:'255px', height:'100vh', flexShrink:0, display:'flex', flexDirection:'column', background:'var(--bg-sidebar)', backdropFilter:'blur(40px)', borderRight:'1px solid var(--border-subtle)', position:'relative', zIndex:20 }}>

            {/* Brand */}
            <div style={{ padding:'22px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'20px', userSelect:'none' }}>
                <motion.div animate={{ scale:[1,1.3,1], opacity:[0.6,1,0.6] }} transition={{ duration:2.5, repeat:Infinity }}
                  style={{ width:'8px', height:'8px', borderRadius:'50%', background:accent, transition:'background 0.5s' }}/>
                <span style={{ fontFamily: G, fontStyle: 'italic', fontWeight: '800', fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.5px' }}>equilibrium</span>
                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontFamily: S, letterSpacing: '1px', marginLeft: '2px', fontWeight:'700' }}>CORE</span>
              </div>
              {/* AI Toggle */}
              <div style={{ display:'flex', background:'rgba(255,255,255,0.02)', borderRadius:'14px', padding:'4px', gap:'4px', border:'1px solid var(--border-subtle)' }}>
                {[{ k:'AURA', g:'#f43f5e' }, { k:'MAX', g:'#14b8a6' }].map(ai => {
                  const isActive = activeAI === ai.k;
                  return (
                    <button key={ai.k} onClick={() => setActiveAI(ai.k)}
                      style={{ flex:1, padding:'10px 0', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'0.75rem', fontWeight:'700', fontFamily:S, letterSpacing:'1px', transition:'all 0.3s', background: isActive ? ai.g : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,0.3)', boxShadow: isActive ? 'var(--shadow-premium)' : 'none', userSelect:'none' }}>
                      {ai.k} Core
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav */}
            <div style={{ padding:'12px 10px 6px' }}>
              {navItems.map(item => {
                const isActive = tab === item.id;
                return (
                  <motion.button key={item.id} whileHover={{ background:'rgba(255,255,255,0.04)' }} whileTap={{ scale:0.98 }}
                    onClick={() => setTab(item.id)}
                    style={{ 
                      width:'100%', padding:'11px 14px', 
                      background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent', 
                      border: '1px solid transparent',
                      borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                      borderRadius: isActive ? '0 12px 12px 0' : '12px', 
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.45)', 
                      fontSize:'0.85rem', fontWeight: isActive ? '700' : '500', 
                      cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:'12px', 
                      transition:'all 0.2s', marginBottom:'4px' 
                    }}>
                    <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.25)', transition:'color 0.2s', display:'flex', alignItems:'center' }}>{item.icon}</span>
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Chat history */}
            {tab === 'chat' && (
              <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', padding:'6px 10px 0' }}>
                <motion.button whileHover={{ background: 'rgba(255,255,255,0.04)' }} whileTap={{ scale:0.97 }} onClick={newChat}
                  style={{ width:'100%', padding:'9px 13px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'11px', color:'rgba(255,255,255,0.6)', fontSize:'0.82rem', fontWeight:'600', cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:'9px', transition:'all 0.2s', marginBottom:'8px' }}>
                  <FaPlus size={10} color={accent}/> New conversation
                </motion.button>
                <p style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.2)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', padding:'2px 4px 6px', margin:0 }}>HISTORY</p>
                <div style={{ overflowY:'auto', flex:1 }}>
                  {[...sessions[activeAI]].reverse().map(s => (
                    <motion.div key={s.id} whileHover={{ background:'rgba(255,255,255,0.04)' }} onClick={() => switchSession(s.id)}
                      style={{ padding:'8px 11px', borderRadius:'10px', cursor:'pointer', marginBottom:'2px', background:s.active? 'rgba(255,255,255,0.03)' :'transparent', border: s.active ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent', borderLeft: s.active ? `3px solid ${accent}` : '3px solid transparent', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'8px' }}>
                      <FaHistory size={9} color={s.active?accent:'rgba(255,255,255,0.2)'}/>
                      <span style={{ fontSize:'0.79rem', color:s.active?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.35)', fontWeight:s.active?'600':'400', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{s.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {tab !== 'chat' && <div style={{ flex:1 }}/>}

            {/* User + Logout */}
            <div style={{ padding:'12px 14px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'14px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border-subtle)' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: userProfile?.picture ? 'transparent' : 'linear-gradient(135deg, #374151, #111827)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'0.8rem', flexShrink:0, color:'rgba(255,255,255,0.85)', overflow:'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {userProfile?.picture
                    ? <img src={userProfile.picture} alt="" referrerPolicy="no-referrer" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : (userProfile?.name || 'U')[0].toUpperCase()}
                </div>
                <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
                  <p style={{ margin:0, fontSize:'0.8rem', fontWeight:'600', color:'rgba(255,255,255,0.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userProfile?.name || 'User'}</p>
                  <p style={{ margin:0, fontSize:'0.64rem', color:'rgba(255,255,255,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userProfile?.email || ''}</p>
                </div>
                <motion.button whileHover={{ color:'#f43f5e', background: 'rgba(244,63,94,0.05)' }} whileTap={{ scale:0.9 }} onClick={onLogout}
                  style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer', padding:'6px', borderRadius:'8px', transition:'all 0.2s', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <FaSignOutAlt size={12}/>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══ MAIN ════════════════════════════════════════════════════ */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', position:'relative', zIndex:5 }}>

        {/* Top bar */}
        <div style={{ height:'56px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', borderBottom:'1px solid var(--border-subtle)', background:'rgba(8,10,16,0.55)', backdropFilter:'blur(30px)' }}>
          <motion.button whileHover={{ background:'rgba(255,255,255,0.05)' }} whileTap={{ scale:0.96 }} onClick={() => setSidebar(s => !s)}
            style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border-subtle)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'3.5px', flexShrink:0 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:'12px', height:'1.5px', background:'rgba(255,255,255,0.6)', borderRadius:'1px' }}/>)}
          </motion.button>
 
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {tab === 'chat' ? (
              <RobotAvatar expression="smile" size="xs" glowColor={accent} style={{ marginRight: '4px' }} />
            ) : (
              <motion.div animate={{ scale:[1,1.25,1], opacity:[0.7,1,0.7] }} transition={{ duration:2, repeat:Infinity }}
                style={{ width:'6px', height:'6px', borderRadius:'50%', background:accent, transition:'background 0.5s' }}/>
            )}
            <span style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'0.96rem', color:'#fff' }}>
              {tab==='home'    ? 'Dashboard'
              :tab==='chat'    ? (activeAI==='AURA' ? 'Aura · Emotional AI' : 'Max · Cognitive AI')
              :tab==='report'  ? 'Neural Brain Report'
              :tab==='consult' ? 'Consultants'
              :                  'My Progress'}
            </span>
          </div>
 
          <motion.button whileHover={{ background:'rgba(255,255,255,0.05)' }} whileTap={{ scale:0.96 }}
            style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border-subtle)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <FaBell size={12} color="rgba(255,255,255,0.5)"/>
            <div style={{ position:'absolute', top:'6px', right:'6px', width:'5px', height:'5px', borderRadius:'50%', background:'#f43f5e' }}/></motion.button>
        </div>

        {/* ════ TABS ═══════════════════════════════════════════════ */}
        <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
          <AnimatePresence mode="wait">

            {/* ══ HOME ═══════════════════════════════════════════════ */}
            {tab === 'home' && (
              <DashboardHome
                firstName={firstName}
                greeting={greeting}
                accent={accent}
                accentB={accentB}
                accentBr={accentBr}
                activeAI={activeAI}
                moodToday={moodToday}
                setMoodToday={setMoodToday}
                MOODS={MOODS}
                setShowBreath={setShowBreath}
                setTab={setTab}
                setActiveAI={setActiveAI}
                consultants={consultants}
                journalCount={journalEntries.length}
                sessionCount={sessions[activeAI].length}
              />
            )}

            {/* ══ CHAT ═══════════════════════════════════════════════ */}
            {tab === 'chat' && (
              <motion.div key="chat" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
                style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>

                {/* Chat background */}
                <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
                  {activeAI==='AURA' ? (
                    <>
                      <motion.div animate={{ x:['-20%','20%','-20%'], y:['0%','12%','0%'] }} transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
                        style={{ position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.07),transparent 70%)', filter:'blur(40px)' }}/>
                      <motion.div animate={{ x:['20%','-20%','20%'], y:['10%','-10%','10%'] }} transition={{ duration:18, repeat:Infinity, ease:'easeInOut' }}
                        style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'55%', height:'55%', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)', filter:'blur(40px)' }}/>
                    </>
                  ) : (
                    <>
                      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(45,212,191,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,191,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
                      <motion.div animate={{ opacity:[0.04,0.1,0.04] }} transition={{ duration:4, repeat:Infinity }}
                        style={{ position:'absolute', top:'20%', right:'15%', width:'35%', height:'35%', borderRadius:'50%', background:'radial-gradient(circle,rgba(45,212,191,0.1),transparent 70%)', filter:'blur(30px)' }}/>
                    </>
                  )}
                </div>
                {messages.length > 1 && (
                  <div style={{ flexShrink:0, display:'flex', justifyContent:'flex-end', padding:'12px 24px 0', position:'relative', zIndex:2 }}>
                    <div style={{ maxWidth:'760px', width:'100%', margin:'0 auto', display:'flex', justifyContent:'flex-end' }}>
                      <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={getSessionSummary}
                        style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${accentBr}`, background:accentB, color:accent, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:6 }}>
                        📋 Session Summary
                      </motion.button>
                    </div>
                  </div>
                )}
                <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 10px', display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>
                  <div style={{ maxWidth:'760px', width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', gap:'14px', flex:1, justifyContent:messages.length===0?'center':'flex-start' }}>
                    {messages.length === 0 && (
                      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'30px 20px' }}>

                        <RobotAvatar expression="happy" size="lg" glowColor={accent} style={{ marginBottom: '24px' }} />
                        <h2 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'2.2rem', color:'#fff', marginBottom:'8px' }}>
                          {activeAI === 'AURA' ? "Hi, I'm Aura 🌸" : "Hello, I'm Max"}
                        </h2>
                        <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.88rem', lineHeight:'1.75', maxWidth:'420px', marginBottom:'32px', fontFamily:J }}>
                          {activeAI === 'AURA'
                            ? "I'm your emotional anchor. Here to listen and support you through anything."
                            : "I'm your cognitive analyst. Ready to break down patterns and build solutions."}
                        </p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', width:'100%', maxWidth:'600px', margin:'0 auto' }}>
                          {SUGGESTIONS[activeAI].map((s,i) => (
                            <motion.button key={i} whileHover={{ background:'var(--bg-card)', borderColor:'rgba(255,255,255,0.12)', y:-2 }} whileTap={{ scale:0.98 }}
                              onClick={() => sendMsg(s)}
                              style={{ padding:'16px', background:'var(--bg-input)', border:'1px solid var(--border-subtle)', borderRadius:'16px', color:'rgba(255,255,255,0.7)', fontSize:'0.84rem', cursor:'pointer', fontFamily:J, textAlign:'left', lineHeight:1.4, transition:'all 0.2s', display:'flex', flexDirection:'column', justifyContent:'space-between', gap:8 }}>
                              <span style={{ fontWeight:'600' }}>{s}</span>
                              <span style={{ fontSize:'0.72rem', color:accent, fontWeight:'700', letterSpacing:'0.5px' }}>ASK ASSISTANT ➔</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {messages.map((msg,i) => (
                      <motion.div key={i} initial={{ opacity:0, y:8, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.25 }}
                        style={{ display:'flex', justifyContent:msg.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:'12px' }}>

                        {msg.role !== 'user' && (
                          <RobotAvatar expression="smile" size="sm" glowColor={accent} style={{ marginBottom: '18px', flexShrink: 0 }} />
                        )}
                        <div style={{ maxWidth:'72%' }}>
                          <div style={{ padding:'12px 16px', background:msg.role==='user'?`linear-gradient(135deg, ${accent}20, ${accent}0b)`:'var(--bg-card)', border:`1px solid ${msg.role==='user'?accent+'44':'var(--border-subtle)'}`, borderRadius:msg.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px', color:'rgba(255,255,255,0.9)', fontSize:'0.88rem', lineHeight:'1.65', fontFamily:J, whiteSpace:'pre-wrap', boxShadow:msg.role==='user'?`0 8px 32px ${accent}0b, inset 0 1px 0 rgba(255,255,255,0.03)`:'var(--shadow-premium), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                            {msg.audioUrl ? (
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <audio src={msg.audioUrl} controls style={{ height:32, maxWidth:200, filter:'invert(1) hue-rotate(180deg)', opacity:0.85 }}/>
                                <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontFamily:S }}>{msg.audioDuration}s</span>
                              </div>
                            ) : msg.content}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:'7px', marginTop:'3px', justifyContent:msg.role==='user'?'flex-end':'flex-start' }}>
                            <span style={{ fontSize:'0.61rem', color:'rgba(255,255,255,0.16)', fontFamily:S }}>{fmt(msg.ts)}</span>
                            {msg.role === 'assistant' && (
                              <motion.button whileHover={{ color:accent }} whileTap={{ scale:0.9 }} onClick={() => speakText(msg.content)}
                                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.16)', cursor:'pointer', padding:0, transition:'color 0.2s' }}>
                                <FaVolumeUp size={9}/>
                              </motion.button>
                            )}
                          </div>
                        </div>
                        {msg.role === 'user' && (
                          <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:`linear-gradient(135deg,${accent},var(--accent-purple))`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:'18px', fontWeight:'800', fontSize:'0.72rem', color:'#fff' }}>
                            {(userProfile?.name || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {loading && (
                      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', alignItems:'flex-end', gap:'12px' }}>
                        <RobotAvatar expression="wink" size="sm" glowColor={accent} isTyping={true} />
                        <TypingDots color={accent}/>
                      </motion.div>
                    )}
                    <div ref={bottomRef}/>
                  </div>
                </div>

                {/* Input */}
                <div style={{ padding:'16px 20px 24px', background:'transparent', flexShrink:0, position:'relative', zIndex:5 }}>
                  <div style={{ maxWidth:'760px', width:'100%', margin:'0 auto' }}>
                    <div style={{ 
                      display:'flex', 
                      alignItems:'flex-end', 
                      gap:'9px', 
                      background:'var(--bg-card)', 
                      border:`1px solid ${input.trim() ? accent : listening ? accent : 'var(--border-subtle)'}`, 
                      borderRadius:'24px', 
                      padding:'9px 12px', 
                      transition:'all 0.3s', 
                      boxShadow: input.trim() 
                        ? `0 0 16px -4px ${accent}60` 
                        : listening 
                          ? `0 0 16px -4px ${accent}60` 
                          : 'var(--shadow-card)' 
                    }}>
                      <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }} onClick={handleMicClick}
                        animate={isRecording ? { scale:[1,1.1,1] } : {}} transition={isRecording ? { duration:0.8, repeat:Infinity } : {}}
                        style={{ width:'36px', height:'36px', borderRadius:'50%', background:isRecording?'#ef4444':'var(--bg-input)', border:`1px solid ${isRecording?'#ef4444':'var(--border-subtle)'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s', boxShadow:isRecording?'0 1px 3px rgba(204,102,102,0.4)':'' }}>
                        {isRecording ? <FaStop size={11} color="#fff"/> : <FaMicrophone size={12} color="rgba(255,255,255,0.4)"/>}
                      </motion.button>
                      <textarea ref={textareaRef} value={input}
                        onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight,110) + 'px'; }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                        placeholder={isRecording ? `🔴 Recording... ${recordDuration}s (click mic to send)` : `Message ${activeAI==='AURA'?'Aura':'Max'}...`}
                        rows={1}
                        style={{ flex:1, background:'none', border:'none', color:'rgba(255,255,255,0.88)', fontSize:'0.9rem', fontFamily:J, resize:'none', lineHeight:'1.5', maxHeight:'110px', minHeight:'22px', padding:'7px 0', overflowY:'auto' }}/>
                      <motion.button whileHover={input.trim()?{scale:1.06}:{}} whileTap={input.trim()?{scale:0.94}:{}} onClick={() => sendMsg()}
                        style={{ width:'36px', height:'36px', borderRadius:'50%', background:input.trim()?accent:'rgba(255,255,255,0.03)', border:`1px solid ${input.trim()?accent:'var(--border-subtle)'}`, cursor:input.trim()?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s', boxShadow:input.trim()?'var(--shadow-premium)':'' }}>
                        <FaPaperPlane size={13} color={input.trim()?'#fff':'rgba(255,255,255,0.22)'} style={{ marginLeft:'1px' }}/>
                      </motion.button>
                    </div>
                    <p style={{ textAlign:'center', fontSize:'0.61rem', color:'rgba(255,255,255,0.14)', fontFamily:S, letterSpacing:'0.5px', margin:'7px 0 0' }}>
                      {activeAI==='AURA'?'Aura · Emotional Support AI':'Max · Cognitive Analysis AI'} — Not a substitute for professional therapy
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ BRAIN REPORT ════════════════════════════════════════ */}
            {tab === 'report' && (
              <motion.div key="report" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
                style={{ position:'absolute', inset:0 }}>
                <BrainReport
                  messages={messages}
                  userProfile={userProfile}
                  activeAI={activeAI}
                  onHighStress={() => setShowSOS(true)}
                />
              </motion.div>
            )}

            {/* ══ CONSULTANTS ═════════════════════════════════════════ */}
            {tab === 'consult' && (
              <motion.div key="consult" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                  <div>
                    <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Our Experts</h2>
                    <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:0, fontFamily:J }}>First session free · ₹199/session thereafter</p>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                      onClick={() => { setShowApps(true); fetchApplications(); }}
                      style={{ padding:'9px 16px', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.55)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                      ⚙️ Applications
                    </motion.button>
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={() => setShowJoin(true)}
                      style={{ padding:'9px 16px', borderRadius:12, border:`1px solid ${accentBr}`, background:accentB, color:accent, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                      + Join as Consultant
                    </motion.button>
                  </div>
                </div>

                {/* Empty state */}
                {consultants.length === 0 && (
                  <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.25)', fontSize:'0.88rem', fontFamily:J }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🔍</div>
                    No consultants yet. Be the first to join!
                  </div>
                )}

                {/* Consultant cards */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                  {consultants.map((c,i) => (
                    <motion.div key={c.id||i} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05+i*0.07 }}
                      whileHover={{ y:-4, borderColor:'rgba(255,255,255,0.11)', boxShadow:'var(--shadow-premium)' }}
                      style={{ background:'var(--bg-card)', border:`1px solid var(--border-subtle)`, borderRadius:22, padding:22, transition:'all 0.3s', position:'relative', overflow:'hidden', boxShadow:`var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.03)` }}>
                      <div style={{ position:'absolute', top:'-20px', right:'-20px', width:100, height:100, borderRadius:'50%', background:`radial-gradient(circle,${c.color}0a,transparent 70%)`, pointerEvents:'none' }}/>
                      {/* Remove button (admin) */}
                      <motion.button whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }} onClick={(e)=>{ e.stopPropagation(); removeConsultant(c); }}
                        title="Remove consultant"
                        style={{ position:'absolute', top:14, left:14, width:26, height:26, borderRadius:8, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', color:'#f43f5e', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, zIndex:5 }}>
                        ✕
                      </motion.button>
                      {/* Availability badge */}
                      <div style={{ position:'absolute', top:16, right:16, display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, background:c.avail?'rgba(16,185,129,0.08)':'rgba(255,255,255,0.04)', border:`1px solid ${c.avail?'rgba(16,185,129,0.15)':'rgba(255,255,255,0.06)'}` }}>
                        <div style={{ width:5, height:5, borderRadius:'50%', background:c.avail?'#10b981':'rgba(255,255,255,0.2)' }}/>
                        <span style={{ fontSize:'0.65rem', fontWeight:700, color:c.avail?'#10b981':'rgba(255,255,255,0.3)', fontFamily:S }}>{c.avail?'Online':'Busy'}</span>
                      </div>
                      {/* Info */}
                      <div style={{ display:'flex', gap:14, marginBottom:14, alignItems:'flex-start' }}>
                        <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${c.color}35,${c.color}15)`, border:`2px solid ${c.color}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, fontSize:'1.1rem', color:c.color, boxShadow:'var(--shadow-premium)' }}>
                          {(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p style={{ margin:'0 0 2px', fontSize:'0.95rem', fontWeight:700, color:'#fff' }}>{c.name}</p>
                          <p style={{ margin:'0 0 4px', fontSize:'0.76rem', color:'rgba(255,255,255,0.38)' }}>{c.spec}</p>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                            <span style={{ fontSize:'0.72rem', color:'#f59e0b', fontWeight:700 }}>★ {c.rating}</span>
                            <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.25)' }}>{c.sessions} sessions</span>
                            <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.25)' }}>{c.exp}</span>
                          </div>
                        </div>
                      </div>
                      {/* Free / paid badge */}
                      {!usedFree[c.id] && (
                        <div style={{ marginBottom:10, padding:'4px 10px', borderRadius:20, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', display:'inline-flex', alignItems:'center', gap:5 }}>
                          <span style={{ fontSize:'0.68rem', color:'#10b981', fontWeight:700 }}>🎁 First session free</span>
                        </div>
                      )}
                      {usedFree[c.id] && (
                        <div style={{ marginBottom:10, padding:'4px 10px', borderRadius:20, background:accentB, border:`1px solid ${accentBr}`, display:'inline-flex', alignItems:'center', gap:5 }}>
                          <span style={{ fontSize:'0.68rem', color:accent, fontWeight:700 }}>₹{c.price||199} / session</span>
                        </div>
                      )}
                      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => c.avail && handleBookConsultant(c)}
                        style={{ width:'100%', padding:'11px', background:c.avail?`linear-gradient(135deg,${c.color},${c.color}cc)`:'rgba(255,255,255,0.03)', border:`1px solid ${c.avail?c.color:'rgba(255,255,255,0.06)'}`, borderRadius:12, color:c.avail?'#fff':'rgba(255,255,255,0.22)', fontSize:'0.84rem', fontWeight:700, cursor:c.avail?'pointer':'not-allowed', fontFamily:J, transition:'all 0.2s', boxShadow:c.avail?'var(--shadow-premium)':'' }}>
                        {!c.avail ? 'Unavailable' : usedFree[c.id] ? `Pay ₹${c.price||199} & Book →` : 'Book Free Session →'}
                      </motion.button>
                      {/* In-app call buttons */}
                      {c.avail && (
                        <div style={{ display:'flex', gap:8, marginTop:8 }}>
                          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                            onClick={() => setCall({ consultant:c, audioOnly:false })}
                            style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:`1px solid ${c.color}44`, borderRadius:12, color:c.color, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                            <FaVideo size={12}/> Video
                          </motion.button>
                          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                            onClick={() => setCall({ consultant:c, audioOnly:true })}
                            style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'rgba(255,255,255,0.7)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                            <FaPhone size={11}/> Voice
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Join CTA banner */}
                <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
                  style={{ padding:'22px 26px', borderRadius:22, background:'linear-gradient(135deg,rgba(139,92,246,0.14),rgba(236,72,153,0.14))', border:'1px solid rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20 }}>
                  <div>
                    <p style={{ margin:'0 0 4px', fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.2rem', color:'#fff' }}>Are you a mental health professional? 🌟</p>
                    <p style={{ margin:0, fontSize:'0.82rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>Join our platform — reach thousands of people who need your help.</p>
                  </div>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={() => setShowJoin(true)}
                    style={{ padding:'13px 22px', background:'var(--accent-purple)', border:'none', borderRadius:14, color:'#0a0a0c', fontSize:'0.88rem', fontWeight:700, cursor:'pointer', fontFamily:J, flexShrink:0, boxShadow:'0 4px 12px rgba(0,0,0,0.35)', whiteSpace:'nowrap' }}>
                    Apply Now →
                  </motion.button>
                </motion.div>

              </motion.div>
            )}

            {/* ══ PROGRESS ════════════════════════════════════════════ */}
            {tab === 'progress' && (
              <ProgressDashboard accent={accent} accentB={accentB} accentBr={accentBr}/>
            )}


            {/* ══ CALM STUDIO ════════════════════════════════════════ */}
            {tab === 'calm' && (
              <motion.div key="calm" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0 }}>
                <CalmLibrary accent={accent} accentB={accentB} accentBr={accentBr} isPremium={isPremium} onUpgrade={() => setShowUpgrade(true)}/>
              </motion.div>
            )}

            {/* ══ JOURNAL ════════════════════════════════════════════ */}
            {tab === 'journal' && (
              <motion.div key="journal" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>
                <div style={{ marginBottom:20 }}>
                  <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>My Journal</h2>
                  <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:0, fontFamily:J }}>Write your thoughts freely — AI gives you weekly insights</p>
                </div>
                <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:20, padding:20, marginBottom:14, boxShadow:'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                  <textarea value={journalInput} onChange={e => setJournalInput(e.target.value)}
                    placeholder="What's on your mind today? How are you feeling? Write freely..."
                    style={{ width:'100%', minHeight:120, background:'none', border:'none', outline:'none', color:'rgba(255,255,255,0.85)', fontSize:'0.9rem', fontFamily:J, lineHeight:1.7, resize:'vertical' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.25)', fontFamily:S }}>{journalInput.length} chars</span>
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={saveJournal} disabled={!journalInput.trim()}
                      style={{ padding:'9px 20px', borderRadius:12, border:'none', cursor:journalInput.trim()?'pointer':'not-allowed', background:journalInput.trim()?`linear-gradient(135deg,${accent},#8b5cf6)`:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'0.82rem', fontWeight:700, fontFamily:J, display:'flex', alignItems:'center', gap:6, opacity:journalInput.trim()?1:0.4 }}>
                      💾 Save Entry
                    </motion.button>
                  </div>
                </div>
                {journalEntries.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={getJournalInsight} disabled={journalLoading}
                      style={{ width:'100%', padding:'13px', borderRadius:16, border:`1px solid ${accentBr}`, background:accentB, color:accent, fontSize:'0.86rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      {journalLoading ? '⏳ Analyzing...' : `✨ Get AI Insight (${Math.min(journalEntries.length,10)} entries)`}
                    </motion.button>
                    {journalInsight && (
                      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                        style={{ marginTop:12, padding:'16px 18px', borderRadius:16, background:accentB, border:`1px solid ${accentBr}` }}>
                        <p style={{ margin:'0 0 6px', fontSize:'0.68rem', color:accent, fontWeight:700, fontFamily:S, letterSpacing:'1px' }}>AI INSIGHT</p>
                        <p style={{ margin:0, fontSize:'0.85rem', color:'rgba(255,255,255,0.8)', lineHeight:1.7, fontFamily:J, whiteSpace:'pre-wrap' }}>{journalInsight}</p>
                      </motion.div>
                    )}
                  </div>
                )}
                {journalEntries.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 20px', color:'rgba(255,255,255,0.25)', fontSize:'0.85rem', fontFamily:J }}>No entries yet. Write your first journal entry above 📝</div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    <p style={{ margin:'0 0 8px', fontSize:'0.68rem', color:'rgba(255,255,255,0.25)', fontFamily:S, letterSpacing:'1.5px', fontWeight:600 }}>PAST ENTRIES ({journalEntries.length})</p>
                    {journalEntries.map((entry, i) => (
                      <motion.div key={entry.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                        whileHover={{ y:-2, transition:{ duration:0.2 } }}
                        style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:16, padding:'14px 16px', boxShadow:'var(--shadow-premium), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                        <p style={{ margin:'0 0 6px', fontSize:'0.68rem', color:'rgba(255,255,255,0.28)', fontFamily:S }}>
                          {new Date(entry.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})} · {new Date(entry.date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                        </p>
                        <p style={{ margin:0, fontSize:'0.84rem', color:'rgba(255,255,255,0.65)', lineHeight:1.65, fontFamily:J }}>
                          {entry.text.length > 200 ? entry.text.slice(0,200)+'...' : entry.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── JOIN MODAL ── */}
      <AnimatePresence>
        {showJoin && <JoinConsultantModal onClose={() => setShowJoin(false)} accent={accent}/>}
      </AnimatePresence>

      {/* ── APPLICATIONS PANEL MODAL ── */}
      <AnimatePresence>
        {showApps && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowApps(false)}
            style={{ position:'fixed', inset:0, background:'rgba(9,10,15,0.82)', backdropFilter:'blur(10px)', zIndex:150, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
            <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }}
              onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:560, background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:28, padding:28, marginTop:20, boxShadow:'var(--shadow-card)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                  <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.4rem', color:'#fff', margin:'0 0 3px' }}>Pending Applications</h3>
                  <p style={{ margin:0, fontSize:'0.78rem', color:'rgba(255,255,255,0.3)', fontFamily:J }}>Approve to add consultant to live list</p>
                </div>
                <button onClick={() => setShowApps(false)}
                  style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✕</button>
              </div>
              <ApplicationsPanel applications={applications} accent={accent}
                onRefresh={() => {
                  fetchApplications();
                  fetch(`${API_BASE}/api/consultants`).then(r=>r.json()).then(setConsultants).catch(()=>{});
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FREE SESSION TOAST ── */}
      <AnimatePresence>
        {freeConsultant && <FreeSessionToast consultant={freeConsultant} onClose={() => setFreeConsultant(null)}/>}
      </AnimatePresence>

      {/* ── PAYMENT MODAL ── */}
      <AnimatePresence>
        {payConsultant && (
          <PaymentModal consultant={payConsultant} onClose={() => setPayConsultant(null)}
            onSuccess={() => { setPayConsultant(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── IN-APP VIDEO / VOICE CALL ── */}
      <AnimatePresence>
        {call && (
          <VideoCall
            roomName={`${call.consultant.id}-${userProfile?.email||'guest'}`}
            displayName={userProfile?.name || 'User'}
            audioOnly={call.audioOnly}
            accent={accent}
            onEnd={() => setCall(null)}
          />
        )}
      </AnimatePresence>

      {/* ── PREMIUM UPGRADE MODAL ── */}
      <AnimatePresence>
        {showUpgrade && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowUpgrade(false)}
            style={{ position:'fixed', inset:0, background:'rgba(4,3,10,0.8)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
            <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }} onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:420, background:'#141417', border:'1px solid rgba(199,149,82,0.25)', borderRadius:24, padding:30, position:'relative', boxShadow:'0 24px 60px rgba(0,0,0,0.55)' }}>
              <button onClick={() => setShowUpgrade(false)} style={{ position:'absolute', top:16, right:16, width:30, height:30, borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontWeight:700 }}>✕</button>

              <div style={{ textAlign:'center', marginBottom:22 }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(199,149,82,0.12)', border:'1px solid rgba(199,149,82,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <FaCrown size={22} color="#c79552"/>
                </div>
                <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.6rem', color:'#fff', margin:'0 0 6px' }}>Go Premium</h3>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', margin:0, fontFamily:J }}>Unlock everything PsychoLink offers</p>
              </div>

              {/* Benefits */}
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
                {[
                  'Unlimited meditation & breathwork tracks',
                  'Unlimited AI chat with Aura & Max',
                  'Advanced brain reports & analytics',
                  'Priority consultant booking',
                ].map((b,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(86,160,111,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:'#56a06f', fontSize:'0.7rem', fontWeight:800 }}>✓</span>
                    </div>
                    <span style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.75)', fontFamily:J }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div style={{ textAlign:'center', marginBottom:18, padding:'16px', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:6 }}>
                  <span style={{ fontSize:'2rem', fontWeight:800, color:'#fff', fontFamily:S }}>₹199</span>
                  <span style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>/month</span>
                </div>
                <p style={{ margin:'4px 0 0', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', fontFamily:J }}>Cancel anytime · 7-day money back</p>
              </div>

              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => { setIsPremium(true); localStorage.setItem('eq_premium','true'); setShowUpgrade(false); }}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#c79552,#b8843f)', color:'#0a0a0c', fontSize:'0.95rem', fontWeight:800, fontFamily:J, marginBottom:8 }}>
                Subscribe Now →
              </motion.button>
              <p style={{ textAlign:'center', margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.25)', fontFamily:J }}>
                Secure payment via Razorpay
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONDITIONAL SOS BAR (shown when report detects high stress) ── */}
      <AnimatePresence>
        {showSOS && (
          <motion.div initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-80, opacity:0 }}
            style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:200, display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderRadius:30, background:'linear-gradient(135deg,rgba(239,68,68,0.95),rgba(185,28,28,0.95))', boxShadow:'0 8px 24px rgba(239,68,68,0.25)', backdropFilter:'blur(10px)', border:'1px solid rgba(239,68,68,0.3)' }}>
            <motion.span animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.2, repeat:Infinity }} style={{ fontSize:'1.1rem' }}>🆘</motion.span>
            <span style={{ color:'#fff', fontSize:'0.85rem', fontWeight:700, fontFamily:J }}>High stress detected — You're not alone</span>
            <motion.button whileHover={{ scale:1.05 }} onClick={() => { setShowSOS(false); setShowBreath(true); }}
              style={{ padding:'6px 14px', borderRadius:20, border:'1px solid rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
              Breathe
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} onClick={() => { setShowSOS(false); setActiveAI('AURA'); setTab('chat'); }}
              style={{ padding:'6px 14px', borderRadius:20, border:'1px solid rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
              Talk to Aura
            </motion.button>
            <button onClick={() => setShowSOS(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'1rem', padding:'0 4px' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BREATHING MODAL ── */}
      <AnimatePresence>{showBreath && <BreathingModal onClose={() => setShowBreath(false)}/>}</AnimatePresence>

      {/* ── SESSION SUMMARY ── */}
      <AnimatePresence>
        {summaryOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSummaryOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(9,10,15,0.82)', backdropFilter:'blur(10px)', zIndex:150, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.92, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:20 }} onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:460, background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:28, padding:28, maxHeight:'80vh', overflowY:'auto', boxShadow:'var(--shadow-card)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:12, background:'var(--bg-input)', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>📋</div>
                <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.3rem', color:'#fff', margin:0 }}>Session Summary</h3>
              </div>
              {summaryLoading ? (
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 0' }}>
                  <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }} style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${accent}30`, borderTopColor:accent }}/>
                  <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', fontFamily:J }}>Generating summary...</span>
                </div>
              ) : (
                <p style={{ color:'var(--text-secondary)', fontSize:'0.86rem', lineHeight:1.8, fontFamily:J, whiteSpace:'pre-wrap', margin:0 }}>{sessionSummary}</p>
              )}
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={() => setSummaryOpen(false)}
                style={{ marginTop:20, width:'100%', padding:'11px', borderRadius:14, border:'1px solid var(--border-subtle)', background:'var(--bg-input)', color:'rgba(255,255,255,0.6)', fontSize:'0.86rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
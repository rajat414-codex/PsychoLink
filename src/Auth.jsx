import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from './config';
// ── ORIGINAL GOOGLE ICON ──
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaPhoneAlt, FaLock, FaEye, FaEyeSlash, FaCheck, FaEnvelope, FaChevronRight, FaPlus } from 'react-icons/fa';
import humanAiCreation from './assets/human_ai_creation.png';


const Spinner = ({ color='#8b87f5', size=22 }) => (
  <div style={{ display:'flex', justifyContent:'center', padding:'12px' }}>
    <motion.div animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}
      style={{ width:`${size}px`, height:`${size}px`, borderRadius:'50%', border:'3px solid rgba(255,255,255,0.08)', borderTopColor:color }}/>
  </div>
);

// ── SPACE BACKGROUND (AI Hub) ────────────────────────────
function SpaceBg({ activeAI }) {
  const accent = activeAI==='AURA' ? '#e0524d' : '#5eb8ad';
  const planets = [
    {size:14,orbit:260,speed:20,color:'#e0524d'},
    {size:9, orbit:190,speed:14,color:'#a855f7'},
    {size:6, orbit:150,speed:10,color:'#3b82f6'},
    {size:18,orbit:360,speed:28,color:'#c79552'},
    {size:5, orbit:120,speed:8, color:'#56a06f'},
    {size:12,orbit:310,speed:23,color:'#e0524d'},
  ];
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:0, pointerEvents:'none' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%, #0c0c1a 0%, #050508 60%, #020203 100%)' }}/>
      <motion.div animate={{ backgroundPosition:['0% 0%','100% 100%'] }} transition={{ duration:40, repeat:Infinity, ease:'linear', repeatType:'mirror' }}
        style={{ position:'absolute', inset:0, backgroundImage:`url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=2000')`, backgroundSize:'130% 130%', opacity:0.1 }}/>
      {[{sz:'75px',op:0.5,dur:55,dir:'180px 360px'},{sz:'145px',op:0.25,dur:85,dir:'-270px 550px'},{sz:'230px',op:0.1,dur:115,dir:'140px -275px'}].map((s,i)=>(
        <motion.div key={i} animate={{ backgroundPosition:['0px 0px',s.dir] }} transition={{ duration:s.dur, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', inset:0, opacity:s.op, backgroundImage:`radial-gradient(circle, rgba(255,255,255,0.85) 1.5px, transparent 1.5px)`, backgroundSize:`${s.sz} ${s.sz}` }}/>
      ))}
      <motion.div animate={{ rotate:360 }} transition={{ duration:110, repeat:Infinity, ease:'linear' }}
        style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'860px', height:'860px', background:`conic-gradient(from 0deg,transparent 0deg,${accent}07 60deg,transparent 120deg,rgba(139,135,245,0.04) 180deg,transparent 240deg,rgba(59,130,246,0.035) 300deg,transparent 360deg)`, borderRadius:'50%', filter:'blur(40px)', transition:'background 1.5s' }}/>
      {planets.map((p,i)=>(
        <motion.div key={i} animate={{ rotate:360 }} transition={{ duration:p.speed, repeat:Infinity, ease:'linear', delay:i*0.8 }}
          style={{ position:'absolute', top:'50%', left:'50%', width:`${p.orbit*2}px`, height:`${p.orbit*2}px`, marginTop:`-${p.orbit}px`, marginLeft:`-${p.orbit}px`, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.025)' }}>
          <div style={{ position:'absolute', top:'-1px', left:'50%', marginLeft:`-${p.size/2}px`, width:`${p.size}px`, height:`${p.size}px`, borderRadius:'50%', background:`radial-gradient(circle at 35% 30%, rgba(255,255,255,0.75), ${p.color})`, boxShadow:`0 0 ${p.size*2}px ${p.color}80` }}>
            {p.size>12 && <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%) rotateX(68deg)', width:`${p.size*2.3}px`, height:`${p.size*2.3}px`, borderRadius:'50%', border:`1.5px solid ${p.color}45` }}/>}
          </div>
        </motion.div>
      ))}
      {[0,1,2].map(i=>(
        <motion.div key={i} animate={{ x:['-5vw','112vw'], opacity:[0,1,0] }} transition={{ duration:1.7, repeat:Infinity, delay:i*4.5+1.5, repeatDelay:8 }}
          style={{ position:'absolute', top:`${16+i*23}%`, left:0, width:'85px', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)' }}/>
      ))}
    </div>
  );
}

// ── OCEAN BACKGROUND ─────────────────────────────────────
function OceanBg({ opacity=0.88 }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:0 }}>
      <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', inset:0, backgroundImage:`url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1600')`, backgroundSize:'cover', backgroundPosition:'center' }}/>
      <div style={{ position:'absolute', inset:0, background:`rgba(4,3,14,${opacity})` }}/>
      {[{c:'rgba(99,102,241,0.15)',x:'10%',y:'10%',d:14},{c:'rgba(139,135,245,0.1)',x:'65%',y:'55%',d:18},{c:'rgba(139,135,245,0.12)',x:'40%',y:'25%',d:16}].map((g,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.2,1], opacity:[0.5,1,0.5], x:[0,25,-15,0], y:[0,-30,15,0] }} transition={{ duration:g.d, repeat:Infinity, ease:'easeInOut', delay:i*2 }}
          style={{ position:'absolute', left:g.x, top:g.y, width:'400px', height:'400px', borderRadius:'50%', background:`radial-gradient(circle,${g.c},transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }}/>
      ))}
      <motion.div animate={{ backgroundPosition:['0px 0px','100px 200px'] }} transition={{ duration:45, repeat:Infinity, ease:'linear' }}
        style={{ position:'absolute', inset:0, opacity:0.2, backgroundImage:`radial-gradient(circle,rgba(255,255,255,0.8) 1.5px,transparent 1.5px)`, backgroundSize:'80px 80px' }}/>
      {[...Array(10)].map((_,i)=>(
        <motion.div key={i} animate={{ y:[0,-70-i*8,0], x:[0,(i%2===0?1:-1)*25,0], opacity:[0,0.6,0] }} transition={{ duration:4+i*0.4, repeat:Infinity, delay:i*0.65 }}
          style={{ position:'absolute', left:`${6+i*9}%`, bottom:'12%', width:i%3===0?'5px':'3px', height:i%3===0?'5px':'3px', borderRadius:'50%', background:'rgba(255,255,255,0.5)' }}/>
      ))}
    </div>
  );
}

// ── OTP BOXES ────────────────────────────────────────────
function OtpBoxes({ arr, setter, refs, color, disabled }) {
  const onChange = (val,idx) => {
    if(!/^\d*$/.test(val)) return;
    const n=[...arr]; n[idx]=val.slice(-1); setter(n);
    if(val&&idx<5) refs.current[idx+1]?.focus();
  };
  const onKeyDown = (e,idx) => {
    if(e.key==='Backspace'&&!arr[idx]&&idx>0) refs.current[idx-1]?.focus();
  };
  return (
    <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
      {arr.map((d,i)=>(
        <motion.input key={i} ref={el=>refs.current[i]=el}
          type="tel" maxLength={1} value={d} disabled={disabled}
          onChange={e=>onChange(e.target.value,i)} onKeyDown={e=>onKeyDown(e,i)}
          whileFocus={{ scale:1.06 }}
          style={{ width:'42px', height:'50px', textAlign:'center', fontSize:'1.3rem', fontWeight:'800', background:d?`${color}18`:'rgba(255,255,255,0.05)', border:d?`1px solid ${color}65`:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', cursor:'text', transition:'all 0.2s', outline:'none', opacity:disabled?0.5:1 }}
          onFocus={e=>e.target.style.borderColor=`${color}90`}
          onBlur={e=>e.target.style.borderColor=d?`${color}65`:'rgba(255,255,255,0.1)'}/>
      ))}
    </div>
  );
}

// ── SUNSET BACKGROUND ────────────────────────────────────
function SunsetBg({ opacity=0.88 }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:0 }}>
      <motion.div animate={{ scale:[1,1.03,1] }} transition={{ duration:25, repeat:Infinity, ease:'easeInOut' }}
        style={{ position:'absolute', inset:0, backgroundImage:`url('/sunset_retro.png')`, backgroundSize:'cover', backgroundPosition:'center' }}/>
      <div style={{ position:'absolute', inset:0, background:`rgba(4,3,14,${1 - opacity})` }}/>
      {[{c:'rgba(224,82,77,0.15)',x:'10%',y:'10%',d:14},{c:'rgba(249,115,22,0.1)',x:'65%',y:'55%',d:18},{c:'rgba(236,72,153,0.12)',x:'40%',y:'25%',d:16}].map((g,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.2,1], opacity:[0.5,1,0.5], x:[0,25,-15,0], y:[0,-30,15,0] }} transition={{ duration:g.d, repeat:Infinity, ease:'easeInOut', delay:i*2 }}
          style={{ position:'absolute', left:g.x, top:g.y, width:'400px', height:'400px', borderRadius:'50%', background:`radial-gradient(circle,${g.c},transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }}/>
      ))}
    </div>
  );
}

// ── GLOWING SOUL COMPONENT ────────────────────────────────
function GlowingSoul() {
  const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

  return (
    <div style={{
      position: 'relative',
      width: '320px',
      height: '320px',
      background: 'radial-gradient(circle at center, #18161b 0%, #0d0c0e 100%)',
      borderRadius: '24px',
      border: '1.5px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background grain texture effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }} />

      {/* Pulsing ambient aura in background */}
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ position: 'relative', zIndex: 2 }}>
        <defs>
          <filter id="soul-glow-heavy" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="soul-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#f5f5f7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#e2e2e8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Target axis crosshairs */}
        <line x1="20" y1="110" x2="280" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

        {/* Concentric rotating orbital rings */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '150px 110px' }}
        >
          <circle cx="150" cy="110" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.75" fill="none" strokeDasharray="3 6" />
          <circle cx="150" cy="110" r="90" stroke="rgba(255,255,255,0.04)" strokeWidth="0.75" fill="none" strokeDasharray="6 8" />
        </motion.g>

        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '150px 110px' }}
        >
          <circle cx="150" cy="110" r="130" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" fill="none" strokeDasharray="4 12" />
        </motion.g>

        {/* Sparkling stars inside and around */}
        {[
          { x: 130, y: 90, delay: 0 },
          { x: 170, y: 120, delay: 0.5 },
          { x: 145, y: 150, delay: 1 },
          { x: 155, y: 70, delay: 1.5 },
          { x: 110, y: 130, delay: 2 },
          { x: 190, y: 95, delay: 2.5 }
        ].map((star, idx) => (
          <motion.circle
            key={idx}
            cx={star.x}
            cy={star.y}
            r="1"
            fill="#ffffff"
            animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, delay: star.delay }}
          />
        ))}

        {/* The Soul Figure Group */}
        <g filter="url(#soul-glow-heavy)">
          {/* Head */}
          <circle cx="150" cy="60" r="13" fill="url(#soul-gradient)" />

          {/* Torso & Legs */}
          <path
            d="M 145,72 C 145,72 132,77 132,80 C 132,83 136,98 136,104 C 136,115 142,130 142,145 C 142,165 136,185 144,235 C 145,240 155,240 156,235 C 164,185 158,165 158,145 C 158,130 164,115 164,104 C 164,98 168,83 168,80 C 168,77 155,72 155,72 Z"
            fill="url(#soul-gradient)"
          />

          {/* Left Arm (relaxed at side) */}
          <path
            d="M 132,80 C 122,95 116,115 115,135 C 115,138 118,138 119,135 C 121,118 127,100 136,92 Z"
            fill="url(#soul-gradient)"
          />

          {/* Right Arm (Waving animation group) */}
          <motion.g
            animate={{ rotate: [-6, 12, -6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            style={{ transformOrigin: '168px 80px' }}
          >
            <path
              d="M 168,80 C 178,72 186,60 192,44 C 195,40 201,37 203,40 C 205,43 199,48 195,47 C 188,62 178,76 166,86 Z"
              fill="url(#soul-gradient)"
            />
          </motion.g>
        </g>
      </svg>

      {/* Bottom info glass tag */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        right: '12px',
        background: 'rgba(19, 17, 20, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 3
      }}>
        <span style={{ fontFamily: J, fontSize: '0.72rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>Therapy Core</span>
        <span style={{ fontFamily: S, fontSize: '0.65rem', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>Solvana</span>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────
export default function Auth({ onComplete }) {
  const [screen, setScreen] = useState('landing');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeAI, setActiveAI] = useState('AURA');
  const [dialogue, setDialogue] = useState('Neural synchronization complete. Standing by for your session...');
  const [eyes, setEyes] = useState('laughing');
  const [emailInput, setEmailInput] = useState('');

  // ── NEW NOTIFICATION SYSTEM (To replace native alerts) ──
  const [notification, setNotification] = useState({ message: '', type: 'info', show: false });

  const triggerNotification = (message, type = 'info') => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Apple
  const [appleEmail, setAppleEmail]   = useState('');
  const [applePass,  setApplePass]    = useState('');
  const [showPass,   setShowPass]     = useState(false);
  const [appleStep,  setAppleStep]    = useState('email');
  const [appleLoad,  setAppleLoad]    = useState(false);

  // Phone OTP State
  const [phone,      setPhone]        = useState('');
  const [otp,        setOtp]          = useState(['','','','','','']);
  const [otpSent,    setOtpSent]      = useState(false);
  const [phoneLoad,  setPhoneLoad]    = useState(false);
  const [otpLoad,    setOtpLoad]      = useState(false);
  const [timer,      setTimer]        = useState(30);
  const [canResend,  setCanResend]    = useState(false);
  const [activePhoneCode, setActivePhoneCode] = useState(''); // Stores the real sent OTP code
  const otpRefs = useRef([]);

  // Phone Registration State (form details)
  const [regEmail,   setRegEmail]     = useState('');
  const [regName,    setRegName]      = useState('');
  const [regNickname,setRegNickname]  = useState('');
  const [regAgreed,  setRegAgreed]    = useState(false);
  const [regSubmitLoad, setRegSubmitLoad] = useState(false);

  // ── EMAIL CODE LOGIN (new glass screen) ──
  const [ecSent,     setEcSent]       = useState(false);   
  const [ecCode,     setEcCode]       = useState(['','','','','','']);
  const [ecSending,  setEcSending]    = useState(false);   
  const [ecVerifying,setEcVerifying]  = useState(false);   
  const [ecTimer,    setEcTimer]      = useState(30);
  const [ecResend,   setEcResend]     = useState(false);
  const [ecError,    setEcError]      = useState('');
  const ecRefs = useRef([]);

  // Signup
  const [su,        setSu]            = useState({ fullName:'', nickname:'', mobile:'', email:'' });
  const [suMobSent, setSuMobSent]     = useState(false);
  const [suMobOtp,  setSuMobOtp]      = useState(['','','','','','']);
  const [suMobOk,   setSuMobOk]       = useState(false);
  const [suMobSend, setSuMobSend]     = useState(false);
  const [suMobVfy,  setSuMobVfy]      = useState(false);
  const [activeSuMobCode, setActiveSuMobCode] = useState(''); // Stores the signup SMS code
  const [suEmSent,  setSuEmSent]      = useState(false);
  const [suEmCode,  setSuEmCode]      = useState(['','','','','','']);
  const [suEmOk,    setSuEmOk]        = useState(false);
  const [suEmSend,  setSuEmSend]      = useState(false);
  const [suEmVfy,   setSuEmVfy]       = useState(false);
  const mobRefs  = useRef([]);
  const emRefs   = useRef([]);

  const tokenClientRef = useRef(null);

  // ── FONTS ──
  const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
  const P = "'Playfair Display', serif";
  const L = "'Lexend', sans-serif";

  const card = {
    background:'linear-gradient(160deg,rgba(16,12,32,0.95) 0%,rgba(10,8,24,0.98) 100%)',
    backdropFilter:'blur(60px)', WebkitBackdropFilter:'blur(60px)',
    borderRadius:'28px', border:'1px solid rgba(255,255,255,0.11)',
    boxShadow:'0 50px 100px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.14)',
    position:'relative', zIndex:2, overflow:'hidden'
  };

  const glassCard = {
    background:'linear-gradient(160deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.04) 100%)',
    backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
    borderRadius:'30px', border:'1px solid rgba(255,255,255,0.18)',
    boxShadow:'0 40px 90px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.25)',
    position:'relative', zIndex:2, overflow:'hidden'
  };

  const shine = <div style={{ position:'absolute', top:0, left:'15%', right:'15%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)' }}/>;

  useEffect(()=>{
    const l = document.createElement('link');
    l.href='https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Space+Grotesk:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600;1,700&display=swap';
    document.head.appendChild(l);
    const s = document.createElement('style');
    s.innerHTML='*{-webkit-font-smoothing:antialiased;box-sizing:border-box;}input,textarea{outline:none;}input::placeholder{color:rgba(255,255,255,0.2);}';
    document.head.appendChild(s);
    return ()=>{ try{ document.head.removeChild(l); document.head.removeChild(s); }catch(e){} }
  },[]);

  useEffect(()=>{
    if(!otpSent) return;
    if(timer===0){ setCanResend(true); return; }
    const t = setTimeout(()=>setTimer(p=>p-1),1000);
    return ()=>clearTimeout(t);
  },[otpSent,timer]);

  useEffect(()=>{
    if(!ecSent) return;
    if(ecTimer===0){ setEcResend(true); return; }
    const t = setTimeout(()=>setEcTimer(p=>p-1),1000);
    return ()=>clearTimeout(t);
  },[ecSent,ecTimer]);

  // ── GOOGLE NATIVE SDK INITIALIZER ──
  useEffect(() => {
    const googleScript = document.createElement('script');
    googleScript.src = "https://accounts.google.com/gsi/client";
    googleScript.async = true;
    googleScript.defer = true;
    document.body.appendChild(googleScript);

    googleScript.onload = () => {
      if (window.google) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: "996022316929-8g0ov183hp224kg68cps575s9o507jac.apps.googleusercontent.com",
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleUserData = await res.json();
                const dynamicProfile = {
                  name: googleUserData.name || 'Google User',
                  email: googleUserData.email,
                  initial: (googleUserData.given_name ? googleUserData.given_name[0] : googleUserData.name ? googleUserData.name[0] : 'G').toUpperCase(),
                  color: '#4285F4',
                  picture: googleUserData.picture
                };
                localStorage.setItem("user_email", dynamicProfile.email);
                localStorage.setItem("user_name", dynamicProfile.name);
                localStorage.setItem("user_photo", dynamicProfile.picture || '');
                localStorage.setItem("isLoggedIn", "true");
                goAIHub(dynamicProfile);
              } catch (err) {
                console.error("Failed mapping active profile stream:", err);
              }
            }
          }
        });
      }
    };
  }, []);

  const triggerGoogleLoginPopup = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } else {
      triggerNotification("Google Identity Core loading, please tap again in 2 seconds.", "info");
    }
  };

  // ── 🌐 REAL SMS DISPATCH ENGINE ──
  const sendRealSms = async (phoneNumber, otpCode) => {
    try {
      const response = await fetch(`${API_BASE}/api/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return { success: true };
      } else {
        console.warn("Fast2SMS Backend API Response Error:", data);
        return { success: false, error: data.error || 'Server error sending SMS' };
      }
    } catch (err) {
      console.error("Fast2SMS backend fetch request failed:", err);
      return { success: false, error: "Network block/CORS limits" };
    }
  };

  // ── EMAIL CODE: open screen ──
  const openEmailCode = () => {
    if (!emailInput.includes('@')) {
      triggerNotification("Please enter a valid email address.", "error");
      return;
    }
    setEcSent(false); setEcCode(['','','','','','']); setEcError('');
    setEcTimer(30); setEcResend(false);
    setScreen('emailCode');
  };

  // ── EMAIL CODE: send code to user's email ──
  const sendEmailCode = async () => {
    if (!emailInput.includes('@') || ecSending) return;
    setEcSending(true); setEcError('');
    try {
      const r = await fetch(`${API_BASE}/api/send-email-code`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      const data = await r.json();
      if (r.ok && data.success) {
        setEcSent(true); setEcTimer(30); setEcResend(false);
        triggerNotification("Verification code sent to your email address!", "success");
        setTimeout(()=>ecRefs.current[0]?.focus(), 200);
      } else {
        setEcError(data.error || 'Could not send code. Try again.');
        triggerNotification(data.error || 'Could not send code. Try again.', "error");
      }
    } catch {
      setEcError('Server not reachable. Make sure backend is running.');
      triggerNotification("Server not reachable. Make sure backend is running.", "error");
    }
    setEcSending(false);
  };

  // ── EMAIL CODE: verify ──
  const verifyEmailCode = async () => {
    const code = ecCode.join('');
    if (code.length < 6 || ecVerifying) return;
    setEcVerifying(true); setEcError('');
    try {
      const r = await fetch(`${API_BASE}/api/verify-email-code`, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email: emailInput, code })
      });
      const data = await r.json();
      if (data.valid) {
        const nm = emailInput.split('@')[0];
        triggerNotification("Email authenticated successfully!", "success");
        goAIHub({ name: nm.charAt(0).toUpperCase()+nm.slice(1), email: emailInput, initial: (nm[0]||'U').toUpperCase() });
      } else {
        const errMsg = data.reason === 'expired' ? 'Code expired. Resend a new one.' : 'Wrong code. Check & try again.';
        setEcError(errMsg);
        triggerNotification(errMsg, "error");
      }
    } catch {
      setEcError('Server not reachable. Make sure backend is running.');
      triggerNotification("Server not reachable. Make sure backend is running.", "error");
    }
    setEcVerifying(false);
  };

  // ── VOICE SPEAK ──
  const speak = (core, text, profile) => {
    setDialogue(text); setEyes('normal');
    if('speechSynthesis' in window){
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const v = core==='AURA'
        ? voices.find(v=>v.name.includes('Zira')||v.name.includes('Samantha')||v.name.includes('Google US English'))
        : voices.find(v=>v.name.includes('David')||v.name.includes('Google UK English Male'));
      if(v) u.voice=v;
      u.rate=0.92; u.pitch=core==='AURA'?1.3:0.78; u.volume=1;
      u.onend=()=>{ setEyes('laughing'); setTimeout(()=>onComplete&&onComplete(profile||selectedProfile),1400); };
      window.speechSynthesis.speak(u);
    }
    setTimeout(()=>setEyes('laughing'),1000);
  };

  const goAIHub = (profile) => {
    setSelectedProfile(profile);
    setScreen('aiHub');
    setTimeout(()=>speak('AURA',"Welcome to your safe space. I am Aura, your emotional anchor. Let's look into your thought architectures.",profile),900);
  };

  const toggleAI = (target) => {
    setActiveAI(target);
    speak(target,
      target==='AURA'
        ? "Welcome to your safe space. I am Aura, your emotional anchor. Let's look into your thought architectures."
        : "Max cognitive grid initialized. Ready to break down behavioral loops and construct logical resolutions.",
      selectedProfile
    );
  };

  // Apple
  const handleAppleLogin = ()=>{
    setAppleLoad(true);
    setTimeout(()=>{ setAppleLoad(false); goAIHub({ name:appleEmail.split('@')[0]||'User', email:appleEmail, initial:(appleEmail[0]||'U').toUpperCase() }); },2000);
  };

  // Phone OTP - Sending Real SMS with random code generator
  const sendOtp = async () => {
    if(phone.length<10) {
      triggerNotification("Please enter a valid 10-digit phone number.", "error");
      return;
    }
    setPhoneLoad(true);
    // Generating real random 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActivePhoneCode(generatedCode);

    const result = await sendRealSms(phone, generatedCode);
    setPhoneLoad(false);
    setOtpSent(true);
    setTimer(30);
    setCanResend(false);

    if (result.success) {
      triggerNotification(`OTP sent successfully to +91 ${phone}!`, "success");
    } else {
      triggerNotification(`CORS block/Testing Mode: Code is ${generatedCode}`, "info");
    }
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if(code.length < 6) return;
    setOtpLoad(true);
    
    setTimeout(() => {
      setOtpLoad(false);
      // Validating against generated SMS code or static admin bypass
      if (code === activePhoneCode || code === '123456') {
        triggerNotification("OTP verified successfully!", "success");
        setScreen('phoneRegistration');
      } else {
        triggerNotification("Invalid Verification Code! Check and try again.", "error");
        setOtp(['','','','','','']);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    }, 1200);
  };

  // Profile save after phone verification
  const handleProfileSave = () => {
    if (!regName || !regNickname || !regEmail || !regAgreed) {
      triggerNotification("Please fill in all details and agree to terms.", "error");
      return;
    }
    if (!regEmail.includes('@')) {
      triggerNotification("Please enter a valid email address.", "error");
      return;
    }
    setRegSubmitLoad(true);
    setTimeout(() => {
      setRegSubmitLoad(false);
      localStorage.setItem("user_email", regEmail);
      localStorage.setItem("user_name", regName);
      localStorage.setItem("user_photo", "");
      localStorage.setItem("isLoggedIn", "true");
      
      triggerNotification("Profile completed successfully!", "success");
      goAIHub({ name: regName, email: regEmail, initial: regName[0].toUpperCase() });
    }, 1500);
  };

  // Signup Mobile Verification with Fast2SMS delivery
  const suSendMob = async () => {
    if(su.mobile.length<10) return;
    setSuMobSend(true);
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSuMobCode(generatedCode);

    const result = await sendRealSms(su.mobile, generatedCode);
    setSuMobSend(false);
    setSuMobSent(true);

    if (result.success) {
      triggerNotification(`Signup OTP sent to +91 ${su.mobile}!`, "success");
    } else {
      triggerNotification(`CORS block/Testing Mode: Code is ${generatedCode}`, "info");
    }
  };

  const suVfyMob = () => {
    const code = suMobOtp.join('');
    if(code.length < 6) return;
    setSuMobVfy(true);
    
    setTimeout(() => {
      setSuMobVfy(false);
      if (code === activeSuMobCode || code === '123456') {
        setSuMobOk(true);
        triggerNotification("Mobile number verified successfully!", "success");
      } else {
        triggerNotification("Incorrect Verification Code!", "error");
        setSuMobOtp(['','','','','','']);
        setTimeout(() => mobRefs.current[0]?.focus(), 100);
      }
    }, 1400);
  };

  const suSendEm   = ()=>{ if(!su.email.includes('@')) return; setSuEmSend(true); setTimeout(()=>{ setSuEmSend(false); setSuEmSent(true); triggerNotification("Testing Code '123456' generated for email verification.", "info"); },1600); };
  const suVfyEm    = ()=>{ if(suEmCode.join('').length<6) return; setSuEmVfy(true); setTimeout(()=>{ setSuEmVfy(false); if(suEmCode.join('') === '123456') { setSuEmOk(true); triggerNotification("Email verified successfully!", "success"); } else { triggerNotification("Wrong code! Use backdoor key '123456'", "error"); } },1400); };
  const suCreate   = () => {
    if(!suMobOk || !suEmOk || !su.fullName || !su.nickname) return;
    goAIHub({ name:su.fullName, email:su.email, initial:su.fullName[0].toUpperCase() });
  };

  const suDone = suMobOk && suEmOk && su.fullName && su.nickname;
  const accent = activeAI==='AURA' ? '#e0524d' : '#5eb8ad';

  return (
    <div style={{ minHeight:'100vh', width:'100vw', backgroundColor:'#020308', color:'#fff', fontFamily:J, overflow:'hidden', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      
      {/* ── HIGH FIDELITY FLOATING NOTIFICATION BANNER ── */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity:0, y:-40, filter:'blur(8px)' }}
            animate={{ opacity:1, y:0, filter:'blur(0px)' }}
            exit={{ opacity:0, y:-30, filter:'blur(6px)' }}
            transition={{ type:'spring', stiffness:180, damping:16 }}
            style={{
              position:'fixed', top:'24px', zIndex:9999,
              display:'flex', alignItems:'center', gap:'12px',
              padding:'14px 22px', borderRadius:'18px',
              background:'linear-gradient(135deg, rgba(16,12,32,0.92) 0%, rgba(10,8,24,0.95) 100%)',
              border: notification.type === 'error' ? '1px solid rgba(224,82,77,0.45)' : notification.type === 'info' ? '1px solid rgba(139,135,245,0.45)' : '1px solid rgba(94,184,173,0.45)',
              boxShadow: notification.type === 'error' ? '0 12px 35px rgba(224,82,77,0.22)' : '0 12px 35px rgba(139,135,245,0.22)',
              backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
              pointerEvents:'auto', userSelect:'none'
            }}
          >
            <div style={{
              width:'8px', height:'8px', borderRadius:'50%',
              background: notification.type === 'error' ? '#e0524d' : notification.type === 'info' ? '#8b87f5' : '#5eb8ad',
              boxShadow: `0 0 10px ${notification.type === 'error' ? '#e0524d' : notification.type === 'info' ? '#8b87f5' : '#5eb8ad'}`
            }}/>
            <span style={{ fontSize:'0.9rem', fontWeight:'600', color:'rgba(255,255,255,0.92)', letterSpacing:'0.2px', fontFamily:J }}>
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════
            LANDING — Split Ocean
        ═══════════════════════════════════════════ */}
        {screen==='landing' && (
          <motion.div key="landing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.98 }} transition={{ duration:0.9 }}
            style={{ position:'absolute', inset:0, display:'flex', width: '100vw' }}>

            {/* Left Background Area */}
            <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
              <OceanBg opacity={0}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(4,3,14,0.05) 40%,rgba(4,3,14,0.75) 100%)', zIndex:1 }}/>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(4,3,14,0.3) 0%,transparent 40%,rgba(4,3,14,0.55) 100%)', zIndex:1 }}/>
              <motion.div initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }}
                style={{ position:'absolute', top:'36px', left:'36px', zIndex:10, userSelect:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                  <motion.div animate={{ scale:[1,1.5,1], opacity:[0.6,1,0.6] }} transition={{ duration:2.5, repeat:Infinity }}
                    style={{ width:'10px', height:'10px', borderRadius:'50%', background:'linear-gradient(135deg,#8b87f5,#8b87f5)', boxShadow:'none' }}/>
                  <span style={{ fontFamily:G, fontWeight:'600', fontStyle:'italic', fontSize:'1.45rem', color:'#fff', letterSpacing:'1px' }}>Cognitive Social</span>
                </div>
                <div style={{ paddingLeft:'20px' }}>
                  <motion.span animate={{ boxShadow:['0 0 0px rgba(139,135,245,0)','0 0 20px rgba(139,135,245,0.4)','0 0 0px rgba(139,135,245,0)'] }} transition={{ duration:3, repeat:Infinity }}
                    style={{ fontFamily:S, fontWeight:'700', fontSize:'0.68rem', letterSpacing:'5px', color:'rgba(255,255,255,0.9)', background:'linear-gradient(135deg,rgba(139,135,245,0.2),rgba(139,135,245,0.2))', backdropFilter:'blur(10px)', border:'1px solid rgba(139,135,245,0.4)', borderRadius:'5px', padding:'3px 12px', display:'inline-block' }}>
                    CONSULTATION
                  </motion.span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.7 }}
                style={{ position:'absolute', bottom:'44px', left:'36px', maxWidth:'360px', zIndex:10 }}>
                <p style={{ fontFamily:P, fontStyle:'italic', fontSize:'1.05rem', color:'rgba(255,255,255,0.58)', lineHeight:'1.8', margin:'0 0 12px' }}>
                  "The ocean calms the mind the way therapy calms the soul."
                </p>
                <div style={{ width:'44px', height:'2px', background:'linear-gradient(90deg,#8b87f5,transparent)', borderRadius:'2px' }}/>
              </motion.div>
            </div>

            {/* Right — Glass Login Form */}
            <div style={{ width:'440px', flexShrink:0, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 40px' }}>
              <div style={{ position:'absolute', inset:0 }}>
                <motion.div animate={{ scale:[1,1.06,1] }} transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}
                  style={{ position:'absolute', inset:0, backgroundImage:`url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1600')`, backgroundSize:'cover', backgroundPosition:'right center' }}/>
                <div style={{ position:'absolute', inset:0, background:'rgba(4,3,14,0.88)' }}/>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to left,rgba(4,3,14,0.96),rgba(4,3,14,0.75))' }}/>
              </div>
              <div style={{ position:'absolute', top:'-20%', right:'-20%', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,135,245,0.1),transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>

              <motion.div initial={{ opacity:0,y:22 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35,duration:0.8 }}
                style={{ ...card, width:'100%', padding:'44px 38px' }}>
                {shine}
                <h1 style={{ fontFamily:G, fontWeight:'600', fontStyle:'italic', fontSize:'2.6rem', color:'#fff', marginBottom:'8px', textShadow:'none' }}>Welcome back</h1>
                <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', marginBottom:'28px' }}>Sign in to your account</p>

                {/* Email row FIXED TO RUN EMAIL SUBMIT GRID */}
                <div style={{ marginBottom:'18px' }}>
                  <p style={{ fontSize:'0.63rem', color:'rgba(255,255,255,0.32)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', margin:'0 0 6px 4px' }}>EMAIL</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <input type="email" placeholder="you@example.com" value={emailInput} onChange={e=>setEmailInput(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&openEmailCode()}
                      style={{ flex:1, height:'50px', padding:'0 16px', background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'#fff', fontSize:'0.95rem', fontFamily:J, transition:'all 0.25s' }}
                      onFocus={e=>{ e.target.style.borderColor='rgba(139,135,245,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(139,135,245,0.12)'; }}
                      onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }}/>
                    <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }} onClick={openEmailCode}
                      style={{ width:'50px', height:'50px', flexShrink:0, borderRadius:'14px', background:'linear-gradient(135deg,#8b87f5,#8b87f5)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(139,135,245,0.55)' }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </motion.button>
                  </div>
                </div>

                {/* OR */}
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'16px' }}>
                  <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1)' }}/>
                  <span style={{ color:'rgba(255,255,255,0.22)', fontSize:'0.7rem', fontFamily:S, letterSpacing:'2px' }}>OR</span>
                  <div style={{ flex:1, height:'1px', background:'linear-gradient(270deg,transparent,rgba(255,255,255,0.1)' }}/>
                </div>

                {/* ── SOCIAL BUTTONS ── */}
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'26px' }}>
                  {[
                    { icon: <FcGoogle size={20}/>, label:'Continue with Google', action:()=>triggerGoogleLoginPopup(), hb:'rgba(66,133,244,0.08)', hbr:'rgba(66,133,244,0.3)' },
                    { icon:<FaApple size={20} color="#fff"/>, label:'Sign in with Apple', action:()=>{ setAppleStep('email'); setAppleEmail(''); setApplePass(''); setScreen('apple'); }, hb:'rgba(255,255,255,0.08)', hbr:'rgba(255,255,255,0.2)' },
                    { icon:<FaPhoneAlt size={14} color="rgba(168,85,247,0.9)"/>, label:'Continue with Phone', action:()=>{ setOtpSent(false); setPhone(''); setOtp(['','','','','','']); setScreen('phone'); }, hb:'rgba(168,85,247,0.08)', hbr:'rgba(168,85,247,0.3)' },
                  ].map((btn,i)=>(
                    <motion.button key={i} whileHover={{ backgroundColor:btn.hb, borderColor:btn.hbr, x:2 }} whileTap={{ scale:0.98 }} onClick={btn.action}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', padding:'13px 16px', background:'rgba(255,255,255,0.045)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'14px', color:'rgba(255,255,255,0.82)', fontSize:'0.9rem', fontWeight:'700', cursor:'pointer', fontFamily:L, transition:'all 0.2s' }}>
                      {btn.icon} {btn.label}
                    </motion.button>
                  ))}
                </div>

                <p style={{ textAlign:'center', color:'rgba(255,255,255,0.22)', fontSize:'0.82rem', margin:0 }}>
                  Don't have an account?{' '}
                  <span onClick={()=>setScreen('signup')} style={{ color:'#8b87f5', cursor:'pointer', fontWeight:'700' }}>Sign up</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            EMAIL CODE — glass verification panel
        ═══════════════════════════════════════════ */}
        {screen==='emailCode' && (
          <motion.div key="emailCode" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <OceanBg opacity={0.9}/>
            {[{c:'rgba(99,102,241,0.16)',x:'8%',y:'10%',d:12},{c:'rgba(139,135,245,0.14)',x:'66%',y:'58%',d:15},{c:'rgba(168,85,247,0.12)',x:'42%',y:'18%',d:14}].map((g,i)=>(
              <motion.div key={i} animate={{ scale:[1,1.25,1], opacity:[0.5,1,0.5] }} transition={{ duration:g.d, repeat:Infinity, delay:i*1.4 }}
                style={{ position:'absolute', left:g.x, top:g.y, width:'380px', height:'380px', borderRadius:'50%', background:`radial-gradient(circle,${g.c},transparent 70%)`, filter:'blur(60px)', zIndex:1, pointerEvents:'none' }}/>
            ))}

            <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
              style={{ ...glassCard, width:'430px', padding:'46px 40px', zIndex:2 }}>
              {shine}

              {/* Icon */}
              <div style={{ width:'64px', height:'64px', borderRadius:'20px', background:'linear-gradient(135deg,rgba(139,135,245,0.9),rgba(99,102,241,0.85))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 12px 30px rgba(139,135,245,0.4)' }}>
                <FaEnvelope size={26} color="#fff"/>
              </div>

              <h2 style={{ fontFamily:L, fontWeight:'800', fontSize:'1.75rem', color:'#fff', textAlign:'center', margin:'0 0 6px', letterSpacing:'-0.5px' }}>Verify your email</h2>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.84rem', textAlign:'center', margin:'0 0 26px', fontFamily:J }}>
                {ecSent ? 'Enter the 6-digit code we sent you' : "We'll send a 6-digit code to your inbox"}
              </p>

              {/* Email pill + Send Code */}
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                <div style={{ flex:1, height:'52px', padding:'0 16px', display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:'14px', overflow:'hidden' }}>
                  <FaEnvelope size={13} color="rgba(255,255,255,0.45)" style={{ flexShrink:0 }}/>
                  <span style={{ color:'rgba(255,255,255,0.92)', fontSize:'0.9rem', fontWeight:'600', fontFamily:J, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emailInput}</span>
                </div>
                {!ecSent && (
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={sendEmailCode} disabled={ecSending}
                    style={{ height:'52px', padding:'0 20px', flexShrink:0, borderRadius:'14px', border:'none', cursor:ecSending?'wait':'pointer', background:'linear-gradient(135deg,#8b87f5,#7975d4)', color:'#fff', fontSize:'0.84rem', fontWeight:'800', fontFamily:L, boxShadow:'0 6px 20px rgba(139,135,245,0.45)', display:'flex', alignItems:'center', justifyContent:'center', minWidth:'108px' }}>
                    {ecSending
                      ? <motion.div animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }} style={{ width:'16px', height:'16px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.25)', borderTopColor:'#fff' }}/>
                      : 'Send Code'}
                  </motion.button>
                )}
              </div>

              <AnimatePresence>
                {ecSent && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                    {/* Code sent banner */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'18px', padding:'9px', borderRadius:'12px', background:'rgba(86,160,111,0.12)', border:'1px solid rgba(86,160,111,0.3)' }}>
                      <FaCheck size={11} color="#56a06f"/>
                      <span style={{ color:'#56a06f', fontSize:'0.8rem', fontWeight:'700', fontFamily:J }}>Code sent to your email</span>
                    </div>

                    {/* OTP boxes */}
                    <div style={{ marginBottom:'16px' }}>
                      <OtpBoxes arr={ecCode} setter={setEcCode} refs={ecRefs} color="#8b87f5" disabled={ecVerifying}/>
                    </div>

                    {/* Timer / resend */}
                    <div style={{ textAlign:'center', minHeight:'22px', marginBottom:'16px' }}>
                      {ecResend
                        ? <button onClick={sendEmailCode} disabled={ecSending} style={{ background:'none', border:'none', color:'#8b87f5', fontSize:'0.84rem', fontWeight:'700', cursor:'pointer', fontFamily:J }}>Request new code</button>
                        : <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.82rem', margin:0, fontFamily:S }}>Request new code after <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:'700' }}>{ecTimer}s</span></p>
                      }
                    </div>

                    {/* Verify button */}
                    {ecVerifying ? <Spinner color="#8b87f5"/> : (
                      <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={verifyEmailCode}
                        style={{ width:'100%', padding:'15px', borderRadius:'14px', border:'none', cursor:ecCode.join('').length===6?'pointer':'not-allowed',
                          background:ecCode.join('').length===6?'linear-gradient(135deg,#8b87f5,#7975d4)':'rgba(255,255,255,0.06)',
                          color:ecCode.join('').length===6?'#fff':'rgba(255,255,255,0.25)', fontSize:'0.95rem', fontWeight:'800', fontFamily:L, transition:'all 0.3s',
                          boxShadow:ecCode.join('').length===6?'0 8px 24px rgba(139,135,245,0.4)':'none' }}>
                        Verify & Continue ✓
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {ecError && <p style={{ color:'#e0524d', fontSize:'0.78rem', textAlign:'center', margin:'14px 0 0', fontFamily:J }}>{ecError}</p>}

              <button onClick={()=>setScreen('landing')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', cursor:'pointer', fontFamily:J, display:'block', margin:'18px auto 0' }}>← Back to sign in</button>
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            SIGN UP
        ═══════════════════════════════════════════ */}
        {screen==='signup' && (
          <motion.div key="signup" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.6 }}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', overflowY:'auto', padding:'30px 0' }}>
            <OceanBg opacity={0.88}/>
            {[{c:'rgba(139,135,245,0.1)',x:'70%',y:'5%',d:10},{c:'rgba(139,135,245,0.1)',x:'5%',y:'60%',d:13}].map((g,i)=>(
              <motion.div key={i} animate={{ scale:[1,1.2,1], opacity:[0.4,0.8,0.4] }} transition={{ duration:g.d, repeat:Infinity, delay:i*2 }}
                style={{ position:'absolute', left:g.x, top:g.y, width:'350px', height:'350px', borderRadius:'50%', background:`radial-gradient(circle,${g.c},transparent 70%)`, filter:'blur(55px)', zIndex:1, pointerEvents:'none' }}/>
            ))}

            <div style={{ ...card, width:'520px', padding:'48px 44px', zIndex:2, margin:'auto' }}>
              {shine}
              <h2 style={{ fontFamily:G, fontWeight:'600', fontStyle:'italic', fontSize:'2.4rem', color:'#fff', marginBottom:'6px', textShadow:'none' }}>Create Account</h2>
              <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:'0 0 30px' }}>Join Cognitive Social Consultation</p>

              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

                {/* Full Name */}
                <div>
                  <p style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.32)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', margin:'0 0 6px 4px' }}>FULL NAME</p>
                  <input type="text" placeholder="Enter your full name" value={su.fullName} onChange={e=>setSu(p=>({...p,fullName:e.target.value}))}
                    style={{ width:'100%', height:'50px', padding:'0 16px', background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'#fff', fontSize:'0.93rem', fontFamily:J, transition:'all 0.25s' }}
                    onFocus={e=>{ e.target.style.borderColor='rgba(139,135,245,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(139,135,245,0.1)'; }}
                    onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }}/>
                </div>

                {/* Nickname */}
                <div>
                  <p style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.32)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', margin:'0 0 6px 4px' }}>NICKNAME</p>
                  <input type="text" placeholder="What should we call you?" value={su.nickname} onChange={e=>setSu(p=>({...p,nickname:e.target.value}))}
                    style={{ width:'100%', height:'50px', padding:'0 16px', background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'#fff', fontSize:'0.93rem', fontFamily:J, transition:'all 0.25s' }}
                    onFocus={e=>{ e.target.style.borderColor='rgba(139,135,245,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(139,135,245,0.1)'; }}
                    onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }}/>
                </div>

                {/* Mobile */}
                <div>
                  <p style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.32)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', margin:'0 0 6px 4px' }}>MOBILE NUMBER</p>
                  <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'0 14px', background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', flexShrink:0, height:'50px' }}>
                      <span>🇮🇳</span>
                      <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.88rem', fontWeight:'600' }}>+91</span>
                    </div>
                    <input type="tel" placeholder="10-digit number" value={su.mobile} disabled={suMobOk}
                      onChange={e=>setSu(p=>({...p,mobile:e.target.value.replace(/\D/g,'').slice(0,10)}))}
                      style={{ flex:1, height:'50px', padding:'0 16px', background:suMobOk?'rgba(86,160,111,0.08)':'rgba(255,255,255,0.055)', border:suMobOk?'1px solid rgba(86,160,111,0.4)':'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'#fff', fontSize:'0.93rem', fontFamily:J, transition:'all 0.25s', letterSpacing:'1px' }}
                      onFocus={e=>{ if(!suMobOk){ e.target.style.borderColor='rgba(139,135,245,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(139,135,245,0.1)'; }}}
                      onBlur={e=>{ e.target.style.boxShadow='none'; if(!suMobOk) e.target.style.borderColor='rgba(255,255,255,0.1)'; }}/>
                    {!suMobOk && su.mobile.length===10 && !suMobSent && (
                      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={suSendMob} disabled={suMobSend}
                        style={{ height:'50px', padding:'0 18px', background:'linear-gradient(135deg,#7975d4,#a855f7)', border:'none', borderRadius:'14px', color:'#fff', fontSize:'0.82rem', fontWeight:'700', cursor:'pointer', fontFamily:S, flexShrink:0, boxShadow:'0 4px 16px rgba(168,85,247,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {suMobSend ? <motion.div animate={{ rotate:360 }} transition={{ duration:0.8,repeat:Infinity,ease:'linear' }} style={{ width:'15px',height:'15px',borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff' }}/> : 'Send OTP'}
                      </motion.button>
                    )}
                    {suMobOk && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring' }}
                        style={{ height:'50px', padding:'0 14px', display:'flex', alignItems:'center', gap:'6px', color:'#56a06f', fontSize:'0.82rem', fontWeight:'700', fontFamily:S, flexShrink:0, background:'rgba(86,160,111,0.1)', border:'1px solid rgba(86,160,111,0.3)', borderRadius:'14px' }}>
                        <FaCheck size={12}/> Verified
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {suMobSent && !suMobOk && (
                      <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }}
                        style={{ marginTop:'10px', background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.2)', borderRadius:'16px', padding:'16px' }}>
                        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.72rem', fontFamily:S, letterSpacing:'1px', marginBottom:'12px', textAlign:'center' }}>ENTER MOBILE VERIFICATION CODE</p>
                        <OtpBoxes arr={suMobOtp} setter={setSuMobOtp} refs={mobRefs} color="#a855f7" disabled={suMobVfy}/>
                        <div style={{ marginTop:'12px', display:'flex', justifyContent:'center' }}>
                          {suMobVfy ? <Spinner color="#a855f7" size={20}/> : (
                            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={suVfyMob}
                              style={{ padding:'10px 28px', background:suMobOtp.join('').length===6?'linear-gradient(135deg,#7975d4,#a855f7)':'rgba(255,255,255,0.06)', border:'none', borderRadius:'12px', color:suMobOtp.join('').length===6?'#fff':'rgba(255,255,255,0.3)', fontSize:'0.85rem', fontWeight:'700', cursor:suMobOtp.join('').length===6?'pointer':'not-allowed', fontFamily:J, transition:'all 0.3s', boxShadow:suMobOtp.join('').length===6?'0 6px 18px rgba(168,85,247,0.35)':'none' }}>
                              Verify Mobile ✓
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email */}
                <div>
                  <p style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.32)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', margin:'0 0 6px 4px' }}>EMAIL ADDRESS</p>
                  <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <input type="email" placeholder="your@email.com" value={su.email} disabled={suEmOk}
                      onChange={e=>setSu(p=>({...p,email:e.target.value}))}
                      style={{ flex:1, height:'50px', padding:'0 16px', background:suEmOk?'rgba(86,160,111,0.08)':'rgba(255,255,255,0.055)', border:suEmOk?'1px solid rgba(86,160,111,0.4)':'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'#fff', fontSize:'0.93rem', fontFamily:J, transition:'all 0.25s' }}
                      onFocus={e=>{ if(!suEmOk){ e.target.style.borderColor='rgba(139,135,245,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(139,135,245,0.1)'; }}}
                      onBlur={e=>{ e.target.style.boxShadow='none'; if(!suEmOk) e.target.style.borderColor='rgba(255,255,255,0.1)'; }}/>
                    {!suEmOk && su.email.includes('@') && !suEmSent && (
                      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={suSendEm} disabled={suEmSend}
                        style={{ height:'50px', padding:'0 18px', background:'linear-gradient(135deg,#8b87f5,#8b87f5)', border:'none', borderRadius:'14px', color:'#fff', fontSize:'0.82rem', fontWeight:'700', cursor:'pointer', fontFamily:S, flexShrink:0, boxShadow:'0 4px 16px rgba(139,135,245,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {suEmSend ? <motion.div animate={{ rotate:360 }} transition={{ duration:0.8,repeat:Infinity,ease:'linear' }} style={{ width:'15px',height:'15px',borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff' }}/> : 'Send Code'}
                      </motion.button>
                    )}
                    {suEmOk && (
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring' }}
                        style={{ height:'50px', padding:'0 14px', display:'flex', alignItems:'center', gap:'6px', color:'#56a06f', fontSize:'0.82rem', fontWeight:'700', fontFamily:S, flexShrink:0, background:'rgba(86,160,111,0.1)', border:'1px solid rgba(86,160,111,0.3)', borderRadius:'14px' }}>
                        <FaCheck size={12}/> Verified
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {suEmSent && !suEmOk && (
                      <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }}
                        style={{ marginTop:'10px', background:'rgba(139,135,245,0.06)', border:'1px solid rgba(139,135,245,0.2)', borderRadius:'16px', padding:'16px' }}>
                        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.72rem', fontFamily:S, letterSpacing:'1px', marginBottom:'12px', textAlign:'center' }}>ENTER EMAIL VERIFICATION CODE</p>
                        <OtpBoxes arr={suEmCode} setter={setSuEmCode} refs={emRefs} color="#8b87f5" disabled={suEmVfy}/>
                        <div style={{ marginTop:'12px', display:'flex', justifyContent:'center' }}>
                          {suEmVfy ? <Spinner color="#8b87f5" size={20}/> : (
                            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={suVfyEm}
                              style={{ padding:'10px 28px', background:suEmCode.join('').length===6?'linear-gradient(135deg,#8b87f5,#8b87f5)':'rgba(255,255,255,0.06)', border:'none', borderRadius:'12px', color:suEmCode.join('').length===6?'#fff':'rgba(255,255,255,0.3)', fontSize:'0.85rem', fontWeight:'700', cursor:suEmCode.join('').length===6?'pointer':'not-allowed', fontFamily:J, transition:'all 0.3s', boxShadow:suEmCode.join('').length===6?'0 6px 18px rgba(139,135,245,0.35)':'none' }}>
                              Verify Email ✓
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress pills */}
                <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' }}>
                  {[{l:'Full Name',d:!!su.fullName},{l:'Nickname',d:!!su.nickname},{l:'Mobile',d:suMobOk},{l:'Email',d:suEmOk}].map((item,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'20px', background:item.d?'rgba(86,160,111,0.12)':'rgba(255,255,255,0.04)', border:`1px solid ${item.d?'rgba(86,160,111,0.35)':'rgba(255,255,255,0.08)'}`, transition:'all 0.3s' }}>
                      {item.d && <FaCheck size={9} color="#56a06f"/>}
                      <span style={{ fontSize:'0.7rem', fontFamily:S, color:item.d?'#56a06f':'rgba(255,255,255,0.3)', fontWeight:'600' }}>{item.l}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={suDone ? { scale: 1.02 } : {}}
                  whileTap={suDone ? { scale: 0.98 } : {}}
                  onClick={suCreate}
                  style={{ width:'100%', padding:'16px', background:suDone?'linear-gradient(135deg,#8b87f5,#8b87f5)':'rgba(255,255,255,0.05)', border:'none', borderRadius:'16px', color:suDone?'#fff':'rgba(255,255,255,0.25)', fontSize:'1rem', fontWeight:'700', cursor:suDone?'pointer':'not-allowed', fontFamily:J, transition:'all 0.4s', boxShadow:suDone?'0 10px 30px rgba(139,135,245,0.4)':'none', letterSpacing:'0.3px' }}
                >
                  {suDone ? '✦ Create Account' : 'Complete all fields to continue'}
                </motion.button>

                <button onClick={()=>setScreen('landing')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.22)', fontSize:'0.8rem', cursor:'pointer', fontFamily:J, display:'block', margin:'0 auto' }}>
                  ← Back to Sign in
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            APPLE ID LOGIN SCREEN
        ═══════════════════════════════════════════ */}
        {screen==='apple' && (
          <motion.div key="apple" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#161618' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 40% 30%,rgba(255,255,255,0.025),transparent 55%)', pointerEvents:'none' }}/>
            <div style={{ width:'380px', background:'linear-gradient(160deg,#2a2a2e,#1c1c20)', borderRadius:'24px', padding:'52px 40px', textAlign:'center', boxShadow:'0 50px 100px rgba(0,0,0,0.95)', position:'relative', zIndex:2, border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ position:'absolute', top:'-28px', left:'28%', right:'28%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }}/>
              <FaApple size={50} color="#fff" style={{ marginBottom:'18px' }}/>
              <h2 style={{ fontSize:'1.55rem', fontWeight:'700', color:'#fff', marginBottom:'5px', letterSpacing:'-0.3px' }}>Sign in with Apple</h2>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.84rem', marginBottom:'30px' }}>Use your Apple ID to continue</p>
              <AnimatePresence mode="wait">
                {appleStep==='email' && (
                  <motion.div key="ae" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}>
                    <input type="email" placeholder="Apple ID (Email)" value={appleEmail} onChange={e=>setAppleEmail(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&appleEmail.includes('@')&&setAppleStep('password')}
                      style={{ width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'13px', color:'#fff', fontSize:'0.92rem', fontFamily:J, marginBottom:'12px', transition:'all 0.2s' }}
                      onFocus={e=>{ e.target.style.borderColor='rgba(10,132,255,0.7)'; e.target.style.boxShadow='0 0 0 3px rgba(10,132,255,0.12)'; }}
                      onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }}/>
                    <motion.button whileHover={{ opacity:0.88 }} whileTap={{ scale:0.97 }} onClick={()=>appleEmail.includes('@')&&setAppleStep('password')}
                      style={{ width:'100%', padding:'13px', background:'#0a84ff', border:'none', borderRadius:'13px', color:'#fff', fontSize:'0.92rem', fontWeight:'600', cursor:'pointer', fontFamily:J, boxShadow:'0 4px 16px rgba(10,132,255,0.4)' }}>
                      Continue
                    </motion.button>
                  </motion.div>
                )}
                {appleStep==='password' && (
                  <motion.div key="ap" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.04)', borderRadius:'11px', padding:'10px 14px', marginBottom:'10px', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ width:'30px', height:'30px', borderRadius:'50%', background:'linear-gradient(135deg,#555,#333)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.82rem', fontWeight:'700', flexShrink:0 }}>{appleEmail[0]?.toUpperCase()}</div>
                      <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.84rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{appleEmail}</span>
                    </div>
                    <div style={{ position:'relative', marginBottom:'8px' }}>
                      <input type={showPass?'text':'password'} placeholder="Password" value={applePass} onChange={e=>setApplePass(e.target.value)}
                        onKeyDown={e=>e.key==='Enter'&&applePass&&handleAppleLogin()}
                        style={{ width:'100%', padding:'13px 48px 13px 16px', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'13px', color:'#fff', fontSize:'0.92rem', fontFamily:J, transition:'all 0.25s' }}
                        onFocus={e=>{ e.target.style.borderColor='rgba(10,132,255,0.7)'; e.target.style.boxShadow='0 0 0 3px rgba(10,132,255,0.12)'; }}
                        onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }}/>
                      <button onClick={()=>setShowPass(s=>!s)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.35)', cursor:'pointer', padding:0 }}>
                        {showPass?<FaEyeSlash size={15}/>:<FaEye size={15}/>}
                      </button>
                    </div>
                    <p style={{ color:'#0a84ff', fontSize:'0.8rem', textAlign:'right', cursor:'pointer', marginBottom:'14px' }}>Forgot password?</p>
                    {appleLoad ? <Spinner color="#0a84ff"/> : (
                      <motion.button whileHover={{ opacity:0.88 }} whileTap={{ scale:0.97 }} onClick={handleAppleLogin}
                        style={{ width:'100%', padding:'13px', background:'#0a84ff', border:'none', borderRadius:'13px', color:'#fff', fontSize:'0.92rem', fontWeight:'600', cursor:'pointer', fontFamily:J, boxShadow:'0 4px 16px rgba(10,132,255,0.4)' }}>
                        Sign In
                      </motion.button>
                    )}
                    <button onClick={()=>setAppleStep('email')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', fontSize:'0.78rem', cursor:'pointer', fontFamily:J, marginTop:'12px' }}>← Back</button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ marginTop:'22px', paddingTop:'18px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.7rem', lineHeight:1.6, margin:0 }}>By signing in, you agree to Apple's Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            PHONE NUMBER SCREEN
        ═══════════════════════════════════════════ */}
        {screen==='phone' && !otpSent && (
          <motion.div key="phone" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <OceanBg opacity={0.92}/>
            <motion.div animate={{ scale:[1,1.18,1], opacity:[0.4,0.8,0.4] }} transition={{ duration:7, repeat:Infinity }}
              style={{ position:'absolute', top:'20%', right:'20%', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,0.12),transparent 70%)', filter:'blur(50px)', zIndex:1, pointerEvents:'none' }}/>
            <div style={{ ...card, padding:'52px 44px', width:'400px', textAlign:'center', zIndex:2 }}>
              {shine}
              <div style={{ width:'62px', height:'62px', borderRadius:'50%', background:'linear-gradient(135deg,#7975d4,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px', boxShadow:'0 8px 28px rgba(168,85,247,0.45)' }}>
                <FaPhoneAlt size={24} color="#fff"/>
              </div>
              <h2 style={{ fontFamily:G, fontWeight:'600', fontStyle:'italic', fontSize:'2rem', color:'#fff', marginBottom:'6px' }}>Enter Your Number</h2>
              <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.82rem', marginBottom:'32px' }}>We'll send a 6-digit verification code</p>
              <div style={{ display:'flex', gap:'10px', marginBottom:'18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'0 16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.65)', borderRadius:'14px', flexShrink:0, height:'52px' }}>
                  <span>🇮🇳</span>
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.9rem', fontWeight:'600' }}>+91</span>
                </div>
                <input type="tel" placeholder="10-digit number" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                  onKeyDown={e=>e.key==='Enter'&&sendOtp()}
                  style={{ flex:1, height:'52px', padding:'0 16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'14px', color:'#fff', fontSize:'1rem', fontFamily:J, letterSpacing:'2px', transition:'all 0.2s' }}
                  onFocus={e=>{ e.target.style.borderColor='rgba(168,85,247,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(168,85,247,0.12)'; }}
                  onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; }}/>
              </div>
              {phoneLoad ? <Spinner color="#a855f7"/> : (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={sendOtp}
                  style={{ width:'100%', padding:'15px', background:phone.length===10?'linear-gradient(135deg,#7975d4,#a855f7)':'rgba(255,255,255,0.05)', border:'none', borderRadius:'14px', color:phone.length===10?'#fff':'rgba(255,255,255,0.25)', fontSize:'0.95rem', fontWeight:'700', cursor:phone.length===10?'pointer':'not-allowed', fontFamily:J, transition:'all 0.3s', boxShadow:phone.length===10?'0 8px 24px rgba(168,85,247,0.4)':'none' }}>
                  Send OTP →
                </motion.button>
              )}
              <button onClick={()=>setScreen('landing')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.22)', fontSize:'0.78rem', cursor:'pointer', fontFamily:J, marginTop:'16px' }}>← Back</button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            OTP VERIFY
        ═══════════════════════════════════════════ */}
        {screen==='phone' && otpSent && (
          <motion.div key="otp" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <OceanBg opacity={0.92}/>
            <div style={{ ...card, padding:'52px 44px', width:'400px', textAlign:'center', zIndex:2 }}>
              {shine}
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, damping:14 }}
                style={{ width:'62px', height:'62px', borderRadius:'50%', background:'linear-gradient(135deg,#56a06f,#4a8a5f)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px', boxShadow:'0 8px 28px rgba(86,160,111,0.45)' }}>
                <FaLock size={24} color="#fff"/>
              </motion.div>
              <h2 style={{ fontFamily:G, fontWeight:'600', fontStyle:'italic', fontSize:'2rem', color:'#fff', marginBottom:'6px' }}>Verify OTP</h2>
              <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.82rem', marginBottom:'4px' }}>Code sent to</p>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.9rem', fontWeight:'700', marginBottom:'28px', letterSpacing:'2px', fontFamily:S }}>+91 {phone}</p>
              <OtpBoxes arr={otp} setter={setOtp} refs={otpRefs} color="#56a06f" disabled={otpLoad}/>
              <div style={{ margin:'16px 0', minHeight:'24px' }}>
                {canResend
                  ? <button onClick={sendOtp} style={{ background:'none', border:'none', color:'#a855f7', fontSize:'0.85rem', cursor:'pointer', fontWeight:'600', fontFamily:J }}>Resend OTP</button>
                  : <p style={{ color:'rgba(255,255,255,0.28)', fontSize:'0.82rem', margin:0, fontFamily:S }}>Resend in <span style={{ color:'rgba(255,255,255,0.6)', fontWeight:'700' }}>{timer}s</span></p>
                }
              </div>
              {otpLoad ? <Spinner color="#56a06f"/> : (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={verifyOtp}
                  style={{ width:'100%', padding:'15px', background:otp.join('').length===6?'linear-gradient(135deg,#56a06f,#4a8a5f)':'rgba(255,255,255,0.05)', border:'none', borderRadius:'14px', color:otp.join('').length===6?'#fff':'rgba(255,255,255,0.25)', fontSize:'0.95rem', fontWeight:'700', cursor:otp.join('').length===6?'pointer':'not-allowed', fontFamily:J, transition:'all 0.3s', boxShadow:otp.join('').length===6?'0 8px 24px rgba(86,160,111,0.4)':'none' }}>
                  Verify & Continue ✓
                </motion.button>
              )}
              <button onClick={()=>{ setOtpSent(false); setOtp(['','','','','','']); }} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.22)', fontSize:'0.78rem', cursor:'pointer', fontFamily:J, marginTop:'14px' }}>← Change Number</button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            PHONE REGISTRATION (Form Template like Photo)
        ═══════════════════════════════════════════ */}
        {screen==='phoneRegistration' && (
          <motion.div key="phone-registration" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:0.6 }}
            style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
            
            {/* Scenic warm sunset background */}
            <SunsetBg opacity={0.65}/>
            
            {/* The main container box split 50-50 */}
            <motion.div initial={{ y:25, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
              style={{
                width:'920px',
                height:'580px',
                display:'flex',
                borderRadius:'28px',
                border:'1px solid rgba(255,255,255,0.12)',
                boxShadow:'0 50px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)',
                overflow:'hidden',
                zIndex:2
              }}
            >
              {/* Left Side: Solid Dark Charcoal Form */}
              <div style={{
                width:'460px',
                background:'#131114',
                padding:'44px 40px',
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-between',
                position:'relative'
              }}>
                {shine}
                
                {/* Logo Top Left */}
                <div style={{ display:'flex', alignItems:'center', gap:'4px', userSelect:'none' }}>
                  <span style={{ fontFamily:S, fontWeight:'800', fontSize:'1.65rem', color:'#e0524d', letterSpacing:'1.5px' }}>EQ</span>
                  <span style={{ fontFamily:S, fontWeight:'300', fontSize:'1.65rem', color:'rgba(255,255,255,0.95)', letterSpacing:'0.5px' }}>.fi</span>
                </div>

                {/* Main Form Fields */}
                <div style={{ marginTop:'20px', flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
                  <h1 style={{ fontFamily:J, fontWeight:'700', fontSize:'2.0rem', color:'#fff', margin:'0 0 4px', letterSpacing:'-0.5px' }}>Sign up</h1>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.82rem', marginBottom:'22px', fontFamily:J }}>
                    Create your profile and start your consultation journey.
                  </p>

                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {/* Full Name */}
                    <div>
                      <input type="text" placeholder="Enter Full Name" value={regName} onChange={e=>setRegName(e.target.value)}
                        style={{ width:'100%', height:'46px', padding:'0 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', fontSize:'0.88rem', fontFamily:J, transition:'all 0.25s' }}
                        onFocus={e=>{ e.target.style.borderColor='rgba(224,82,77,0.6)'; e.target.style.background='rgba(255,255,255,0.08)'; }}
                        onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.05)'; }}/>
                    </div>

                    {/* Nickname */}
                    <div>
                      <input type="text" placeholder="Nickname" value={regNickname} onChange={e=>setRegNickname(e.target.value)}
                        style={{ width:'100%', height:'46px', padding:'0 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', fontSize:'0.88rem', fontFamily:J, transition:'all 0.25s' }}
                        onFocus={e=>{ e.target.style.borderColor='rgba(224,82,77,0.6)'; e.target.style.background='rgba(255,255,255,0.08)'; }}
                        onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.05)'; }}/>
                    </div>

                    {/* Email */}
                    <div>
                      <input type="email" placeholder="Enter Email" value={regEmail} onChange={e=>setRegEmail(e.target.value)}
                        style={{ width:'100%', height:'46px', padding:'0 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#fff', fontSize:'0.88rem', fontFamily:J, transition:'all 0.25s' }}
                        onFocus={e=>{ e.target.style.borderColor='rgba(224,82,77,0.6)'; e.target.style.background='rgba(255,255,255,0.08)'; }}
                        onBlur={e=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.05)'; }}/>
                    </div>

                    {/* Contact details (read-only prefilled phone number) */}
                    <div>
                      <input type="text" disabled value={`+91 ${phone}`}
                        style={{ width:'100%', height:'46px', padding:'0 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'12px', color:'rgba(255,255,255,0.4)', fontSize:'0.88rem', fontFamily:J, cursor:'not-allowed' }}/>
                    </div>
                  </div>

                  {/* Agree Checkbox */}
                  <label style={{ display:'flex', alignItems:'center', gap:'10px', margin:'16px 0 20px 2px', cursor:'pointer', userSelect:'none' }}>
                    <input type="checkbox" checked={regAgreed} onChange={e=>setRegAgreed(e.target.checked)}
                      style={{ accentColor:'#e0524d', width:'15px', height:'15px', cursor:'pointer' }}/>
                    <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', fontFamily:J }}>
                      I Agree To The Terms & Privacy Policy
                    </span>
                  </label>

                  {/* Submit Button */}
                  {regSubmitLoad ? <Spinner color="#e0524d"/> : (
                    <motion.button
                      whileHover={{ scale:1.01 }}
                      whileTap={{ scale:0.99 }}
                      onClick={handleProfileSave}
                      style={{
                        width:'100%',
                        height:'48px',
                        background:'#ffffff',
                        border:'none',
                        borderRadius:'24px',
                        color:'#131114',
                        fontWeight:'700',
                        fontSize:'0.9rem',
                        fontFamily:J,
                        cursor:'pointer',
                        boxShadow:'0 10px 25px rgba(255,255,255,0.15)',
                        transition:'all 0.3s'
                      }}
                    >
                      Create Account
                    </motion.button>
                  )}
                </div>

                {/* Footer text */}
                <p style={{ margin:0, textAlign:'center', color:'rgba(255,255,255,0.22)', fontSize:'0.75rem', fontFamily:J }}>
                  Already Have An Account? <span onClick={()=>setScreen('landing')} style={{ color:'#e0524d', cursor:'pointer', fontWeight:'600' }}>Login</span>
                </p>
              </div>

              {/* Right Side: Transparent Glassmorphism card overlay */}
              <div style={{
                width:'460px',
                background:'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter:'blur(24px)',
                WebkitBackdropFilter:'blur(24px)',
                padding:'44px',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center',
                borderLeft:'1px solid rgba(255,255,255,0.08)'
              }}>
                {/* Floating Human-AI Creation Artwork */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '320px',
                    height: '240px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1.5px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img src={humanAiCreation} alt="Human & AI Synthesis" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '22px'
                  }} />
                  
                  {/* Bottom glass overlay branding */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    background: 'rgba(19, 17, 20, 0.72)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 3
                  }}>
                    <span style={{ fontFamily: J, fontSize: '0.75rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>Therapy Core</span>
                    <span style={{ fontFamily: S, fontSize: '0.68rem', fontWeight: '600', color: '#e0524d' }}>EQ.fi</span>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            AI HUB (RESTORED ORIGINAL 3D AURA/MAX STRUCTURE)
        ═══════════════════════════════════════════ */}
        {screen==='aiHub' && (
          <motion.div key="ai-hub" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
            style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', overflow:'hidden', backgroundColor:'#020308', paddingTop:'20px', paddingBottom:'20px' }}>
            <SpaceBg activeAI={activeAI}/>
            <div style={{ position:'absolute', inset:0, zIndex:1, backgroundImage:'linear-gradient(rgba(255,255,255,0.004) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.004) 1px,transparent 1px)', backgroundSize:'30px 30px', pointerEvents:'none' }}/>

            {/* Toggle */}
            <div style={{ position:'relative', zIndex:20, marginTop:'16px', marginBottom:'16px' }}>
              <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(30px)', padding:'5px', borderRadius:'40px', border:'1px solid rgba(255,255,255,0.08)', display:'flex', gap:'4px', boxShadow:'0 16px 40px rgba(0,0,0,0.5)' }}>
                {[{k:'AURA',l:'Feminine Core · Aura',g:'linear-gradient(135deg,#e0524d,#c0392b)',sh:'0 4px 12px rgba(0,0,0,0.35)'},{k:'MAX',l:'Analytic Engine · Max',g:'linear-gradient(135deg,#5eb8ad,#4a9488)',sh:'0 8px 20px rgba(13,148,136,0.35)'}].map(ai=>(
                  <button key={ai.k} onClick={()=>toggleAI(ai.k)}
                    style={{ padding:'10px 26px', border:'none', borderRadius:'30px', cursor:'pointer', fontSize:'0.88rem', fontWeight:'600', fontFamily:G, fontStyle:'italic', letterSpacing:'0.5px', transition:'all 0.4s', background:activeAI===ai.k?ai.g:'transparent', color:activeAI===ai.k?'#fff':'rgba(255,255,255,0.35)', boxShadow:activeAI===ai.k?ai.sh:'none', userSelect:'none' }}>
                    {ai.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Character */}
            <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
              style={{ position:'relative', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center' }}>
              {/* Antenna */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'-10px', position:'relative', zIndex:6 }}>
                <motion.div animate={{ scale:eyes==='laughing'?[1,1.15,1]:[1,1.04,1], filter:activeAI==='AURA'?'drop-shadow(0 4px 10px rgba(224,82,77,0.5))':'drop-shadow(0 4px 10px rgba(94,184,173,0.5))' }} transition={{ duration:2, repeat:Infinity }}
                  style={{ width:'30px', height:'30px', borderRadius:'50%', background:'radial-gradient(circle at 35% 35%,#ffffff,#f1f5f9 50%,#cbd5e1)', boxShadow:'inset -2px -2px 8px rgba(0,0,0,0.15)' }}/>
                <div style={{ width:'12px', height:'18px', marginTop:'-4px', background:activeAI==='AURA'?'linear-gradient(to bottom,#ffffff,rgba(224,82,77,0.4))':'linear-gradient(to bottom,#ffffff,rgba(94,184,173,0.4))', borderRadius:'3px 3px 0 0', opacity:0.9, transition:'all 0.5s' }}/>
              </div>
              {/* Head */}
              <div style={{ width:'240px', height:'204px', borderRadius:'50% 50% 46% 46%/56% 56% 44% 44%', background:'linear-gradient(135deg,#f8fafc,#edf2f7 35%,#cbd5e1 75%,#94a3b8)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 35px 64px rgba(0,0,0,0.5),inset 0 13px 20px #ffffff,inset 0 -11px 24px rgba(148,163,184,0.35)', zIndex:4 }}>
                <div style={{ position:'absolute', left:'-13px', width:'32px', height:'54px', borderRadius:'50% 30% 30% 50%/50% 40% 40% 50%', background:activeAI==='AURA'?'linear-gradient(135deg,rgba(255,255,255,0.9),#e0524d)':'linear-gradient(135deg,rgba(255,255,255,0.9),#5eb8ad)', boxShadow:'-5px 7px 13px rgba(0,0,0,0.2)' }}/>
                <div style={{ position:'absolute', right:'-13px', width:'32px', height:'54px', borderRadius:'30% 50% 50% 30%/40% 50% 50% 40%', background:activeAI==='AURA'?'linear-gradient(135deg,rgba(255,255,255,0.9),#e0524d)':'linear-gradient(135deg,rgba(255,255,255,0.9),#5eb8ad)', boxShadow:'5px 7px 13px rgba(0,0,0,0.2)' }}/>
                <div style={{ width:'184px', height:'124px', borderRadius:'50% 50% 45% 45%/58% 58% 42% 42%', background:'radial-gradient(circle at 50% 30%,#ffffff,#f8fafc 65%,#f1f5f9)', display:'flex', alignItems:'center', justifyContent:'center', gap:'34px', position:'relative', boxShadow:'inset 0 10px 18px rgba(148,163,184,0.4)' }}>
                  <div style={{ position:'absolute', top:'4px', left:'16px', width:'152px', height:'34px', background:'linear-gradient(to bottom,rgba(255,255,255,0.9),transparent)', borderRadius:'50% 50% 20% 20%/80% 80% 20% 20%', opacity:0.7 }}/>
                  <div style={{ position:'absolute', left:'19px', bottom:'30px', width:'24px', height:'11px', background:activeAI==='AURA'?'radial-gradient(circle,rgba(224,82,77,0.55),transparent 70%)':'radial-gradient(circle,rgba(94,184,173,0.4),transparent 70%)', filter:'blur(1px)' }}/>
                  <div style={{ position:'absolute', right:'19px', bottom:'30px', width:'24px', height:'11px', background:activeAI==='AURA'?'radial-gradient(circle,rgba(224,82,77,0.55),transparent 70%)':'radial-gradient(circle,rgba(94,184,173,0.4),transparent 70%)', filter:'blur(1px)' }}/>
                  <AnimatePresence mode="wait">
                    {eyes==='normal' ? (
                      [0,1].map(i=>(
                        <motion.div key={`en${i}`} animate={{ scaleY:[1,1.05,1] }} transition={{ duration:4, repeat:Infinity, delay:i*0.16 }}
                          style={{ width:'20px', height:'30px', borderRadius:'50%', backgroundColor:'#0f172a', position:'relative', boxShadow:'inset -2px -2px 5px rgba(0,0,0,0.6)' }}>
                          <div style={{ position:'absolute', top:'5px', left:'5px', width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#fff', opacity:0.95 }}/>
                        </motion.div>
                      ))
                    ) : (
                      [0,1].map(i=>(
                        <motion.div key={`el${i}`} initial={{ opacity:0,scaleY:0.1 }} animate={{ opacity:1,scaleY:1 }} style={{ width:'32px', height:'22px' }}>
                          <svg width="32" height="22" viewBox="0 0 40 28" fill="none"><path d="M5 24C12 8 28 8 35 24" stroke="#0f172a" strokeWidth="7" strokeLinecap="round"/></svg>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {/* Body */}
              <div style={{ width:'136px', height:'116px', marginTop:'-18px', position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,#edf2f7,#cbd5e1 70%,#94a3b8)', borderRadius:'45% 45% 35% 35%/30% 30% 70% 70%', boxShadow:'0 20px 36px rgba(0,0,0,0.3),inset 0 8px 11px #ffffff' }}/>
                <div style={{ position:'absolute', bottom:'-10px', width:'117px', height:'27px', background:'linear-gradient(to bottom,#ffffff,#e2e8f0)', borderRadius:'0 0 30px 30px', zIndex:1, boxShadow:'0 12px 20px rgba(0,0,0,0.2)' }}/>
                <div style={{ position:'absolute', left:'-11px', top:'38px', width:'19px', height:'42px', background:'#ffffff', borderRadius:'11px 3px 5px 13px', transform:'rotate(12deg)', boxShadow:'-3px 4px 7px rgba(0,0,0,0.12)' }}/>
                <div style={{ position:'absolute', right:'-11px', top:'38px', width:'19px', height:'42px', background:'#ffffff', borderRadius:'3px 11px 13px 5px', transform:'rotate(-12deg)', boxShadow:'3px 4px 7px rgba(0,0,0,0.12)' }}/>
                <div style={{ position:'relative', zIndex:3, marginTop:'20px', width:'62px', height:'62px', borderRadius:'50%', background:'#edf2f7', border:'1px solid #cbd5e1', display:'flex', alignItems:'center', justifyContent: 'center', boxShadow:'inset 0 4px 8px rgba(148,163,184,0.5)' }}>
                  <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#ffffff', border:'1px solid #cbd5e1', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:'4px', height:'4px', borderRadius:'50%', backgroundColor:activeAI==='AURA'?'#e0524d':'#5eb8ad', transition:'all 0.5s' }}/>
                  </div>
                  {[['top','4px'],['bottom','4px']].map(([p,v],i)=><div key={i} style={{ position:'absolute', [p]:v, width:'13px', height:'4px', background:'#cbd5e1', borderRadius:'2px' }}/>)}
                  {[['left','4px'],['right','4px']].map(([p,v],i)=><div key={i} style={{ position:'absolute', [p]:v, width:'4px', height:'13px', background:'#cbd5e1', borderRadius:'2px' }}/>)}
                </div>
              </div>
              {/* Email pill */}
              {selectedProfile && (
                <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }}
                  style={{ marginTop:'16px', display:'flex', alignItems:'center', gap:'9px', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'50px', padding:'6px 14px 6px 7px' }}>
                  {selectedProfile.picture ? (
                    <img src={selectedProfile.picture} alt="Avatar" style={{ width:'26px', height:'26px', borderRadius:'50%', border:'1px solid #5eb8ad', flexShrink:0 }} />
                  ) : (
                    <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'linear-gradient(135deg,#4285F4,#34A853)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'0.72rem', flexShrink:0 }}>{selectedProfile.initial}</div>
                  )}
                  <div>
                    <p style={{ margin:0, fontSize:'0.73rem', fontWeight:'700', color:'rgba(255,255,255,0.88)' }}>{selectedProfile.name}</p>
                    <p style={{ margin:0, fontSize:'0.63rem', color:'rgba(255,255,255,0.38)' }}>{selectedProfile.email}</p>
                  </div>
                  <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:1.5, repeat:Infinity }}
                    style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#56a06f', boxShadow:'0 0 7px #56a06f', marginLeft:'3px' }}/>
                </motion.div>
              )}
            </motion.div>

            {/* Conversation node */}
            <motion.div key={dialogue} initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}
              style={{ marginTop:'16px', marginBottom:'10px', textAlign:'center', width:'560px', maxWidth:'90vw', background:'rgba(8,8,20,0.88)', backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)', padding:'18px 28px', borderRadius:'22px', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 44px rgba(0,0,0,0.7)', position:'relative', zIndex:20 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <motion.div animate={{ scale:[1,1.4,1], opacity:[0.6,1,0.6] }} transition={{ duration:1.5, repeat:Infinity }}
                  style={{ width:'5px', height:'5px', borderRadius:'50%', background: accent, transition:'all 0.5s' }}/>
                <span style={{ fontFamily:G, fontWeight:'600', fontStyle:'italic', fontSize:'1rem', letterSpacing:'2px', color:accent, transition:'all 0.5s' }}>Conversation Node</span>
              </div>
              <p style={{ fontSize:'0.95rem', fontFamily:P, fontStyle:'italic', lineHeight:'1.7', color:'rgba(255,255,255,0.95)', margin:0 }}>"{dialogue}"</p>
            </motion.div>

            {/* Status */}
            <div style={{ display:'flex', gap:'20px', zIndex:20, position:'relative', marginBottom:'8px' }}>
              <span style={{ fontFamily:S, fontSize:'0.7rem', fontWeight:'700', letterSpacing:'1px', color:activeAI==='AURA'?'#8b87f5':'rgba(255,255,255,0.2)', transition:'all 0.4s' }}>AURA: {activeAI==='AURA'?'ACTIVE':'STANDBY'}</span>
              <span style={{ color:'rgba(255,255,255,0.12)' }}>·</span>
              <span style={{ fontFamily:S, fontSize:'0.7rem', fontWeight:'700', letterSpacing:'1px', color:activeAI==='MAX'?'#14b8a6':'rgba(255,255,255,0.2)', transition:'all 0.4s' }}>MAX: {activeAI==='MAX'?'ACTIVE':'STANDBY'}</span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
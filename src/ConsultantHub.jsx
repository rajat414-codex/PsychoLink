import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserPlus, FaCheckCircle, FaTimesCircle, FaClock, FaLock, FaSpinner, FaArrowLeft, FaTh, FaHeart, FaComment, FaCamera, FaUserCheck, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaMusic } from 'react-icons/fa';

const J = "'Plus Jakarta Sans', sans-serif";
const G = "'Cormorant Garamond', serif";
const S = "'Space Grotesk', sans-serif";

import { API_BASE } from './config';

// ─────────────────────────────────────────────────────────────────
// Shared modal shell
// ─────────────────────────────────────────────────────────────────
function ModalShell({ onClose, accent = 'var(--accent-purple)', maxWidth = '520px', children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(9,10,15,0.8)', backdropFilter:'blur(6px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <motion.div
        initial={{ opacity:0, y:20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20, scale:0.97 }}
        transition={{ type:'spring', stiffness:300, damping:28 }}
        onClick={e => e.stopPropagation()}
        style={{ width:'100%', maxWidth, maxHeight:'88vh', overflowY:'auto', background:'var(--bg-card)', border:`1px solid var(--border-subtle)`, borderRadius:'24px', padding:'28px', boxShadow:`var(--shadow-card)`, position:'relative' }}>
        <button onClick={onClose}
          style={{ position:'absolute', top:'18px', right:'18px', width:'32px', height:'32px', borderRadius:'10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FaTimes size={13}/>
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

const fieldStyle = {
  width:'100%', padding:'11px 14px', background:'var(--bg-input)', border:'1px solid var(--border-subtle)',
  borderRadius:'12px', color:'#fff', fontSize:'0.86rem', fontFamily:J, outline:'none', marginTop:'6px', resize:'vertical',
};
const labelStyle = { fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', fontFamily:J, fontWeight:'600' };

export const VIDEO_PRESETS = [
  { id: 'v1', name: 'Zen Garden', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', icon: '🧘‍♂️' },
  { id: 'v2', name: 'Forest Stream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', icon: '🌲' },
  { id: 'v3', name: 'Ambient Chill', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', icon: '🌌' },
  { id: 'v4', name: 'Breathing Wave', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', icon: '🌊' }
];

// ─────────────────────────────────────────────────────────────────
// Avatar Presets & Helpers
// ─────────────────────────────────────────────────────────────────
export const PRESET_AVATARS = [
  { id: '1', emoji: '🧘‍♀️', name: 'Zen', grad: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)', color: '#0d9488' },
  { id: '2', emoji: '🌸', name: 'Blossom', grad: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', color: '#ec4899' },
  { id: '3', emoji: '🌊', name: 'Ocean', grad: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', color: '#2563eb' },
  { id: '4', emoji: '🌿', name: 'Nature', grad: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#059669' },
  { id: '5', emoji: '✨', name: 'Spark', grad: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', color: '#7c3aed' },
  { id: '6', emoji: '🧠', name: 'Clarity', grad: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: '#4f46e5' },
  { id: '7', emoji: '☀️', name: 'Sunset', grad: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', color: '#ea580c' },
  { id: '8', emoji: '🦉', name: 'Wisdom', grad: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', color: '#d97706' },
];

export function parsePresetAvatar(pfp) {
  if (pfp && pfp.startsWith('preset:')) {
    const parts = pfp.split(':');
    if (parts[1] === 'custom') {
      const emoji = parts[2] || '🧘‍♀️';
      const color = parts[3] || '#ec4899';
      return {
        id: 'custom',
        emoji,
        grad: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
        color
      };
    }
    const id = parts[1];
    const preset = PRESET_AVATARS.find(p => p.id === id);
    if (preset) return preset;
  }
  return null;
}

export function renderAvatar(pfp, name, color, size = 110, fontSize = '2.2rem') {
  const preset = parsePresetAvatar(pfp);
  const sizeStr = typeof size === 'number' ? `${size}px` : size;
  const style = {
    width: sizeStr,
    height: sizeStr,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: `1.5px solid ${preset ? preset.color : (color || 'rgba(255,255,255,0.12)')}`,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    position: 'relative'
  };

  if (preset) {
    return (
      <div style={{ ...style, background: preset.grad }}>
        <span style={{ fontSize: `calc(${sizeStr} * 0.52)` }}>
          {preset.emoji}
        </span>
      </div>
    );
  }

  if (pfp) {
    return (
      <div style={style}>
        <img src={pfp} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  const initialColor = color || '#ec4899';
  return (
    <div style={{ ...style, background: `linear-gradient(135deg, ${initialColor}35, ${initialColor}15)`, border: `3px solid ${initialColor}` }}>
      <span style={{ fontWeight: '800', fontSize, color: initialColor }}>
        {(name || '?').split(' ').map(w => w[0]).join('').slice(0, 2)}
      </span>
    </div>
  );
}

export function compressImage(base64Str, callback) {
  if (!base64Str) return callback('');
  if (!base64Str.startsWith('data:image/')) return callback(base64Str);
  
  const img = new Image();
  img.src = base64Str;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 600;
    const MAX_HEIGHT = 600;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL('image/jpeg', 0.7));
  };
  img.onerror = () => {
    callback(base64Str);
  };
}

const dbName = "PsychoLinkDB";
const storeName = "videos";

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export function saveVideoBlob(id, blob) {
  return initDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      store.put({ id, blob });
      transaction.oncomplete = () => resolve();
      transaction.onerror = (e) => reject(e.target.error);
    });
  });
}

export function getVideoBlob(id) {
  return initDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = (e) => resolve(e.target.result?.blob || null);
      request.onerror = (e) => reject(e.target.error);
    });
  });
}

export function useVideoUrl(url) {
  const [resolvedUrl, setResolvedUrl] = useState('');
  
  useEffect(() => {
    if (!url) return;
    if (url.startsWith('db:')) {
      const id = url.replace('db:', '');
      let objectUrl = '';
      getVideoBlob(id).then(blob => {
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setResolvedUrl(objectUrl);
        }
      }).catch(err => {
        console.error("Error retrieving video blob:", err);
      });
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    } else {
      setResolvedUrl(url);
    }
  }, [url]);

  return resolvedUrl;
}

// ─────────────────────────────────────────────────────────────────
// JoinConsultantModal — "Join as a Consultant" application form
// ─────────────────────────────────────────────────────────────────
export function JoinConsultantModal({ onClose, accent = 'var(--accent-purple)' }) {
  const [form, setForm] = useState({
    fullName: '', email: '', skills: '', therapyApproach: '', qualifications: '', multilingualAggressive: '',
    bankName: '', bankAccount: '', bankIfsc: '', bankUpi: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      setStatus('error');
      setErrorMsg('Full name and email are required.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/consultants/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setStatus('sent');
    } catch (e) {
      setStatus('error');
      setErrorMsg(`Could not submit (${e.message}). Make sure the server is running.`);
    }
  };

  if (status === 'sent') {
    return (
      <ModalShell onClose={onClose} accent={accent} maxWidth="440px">
        <div style={{ textAlign:'center', padding:'20px 6px' }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
            style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <FaCheckCircle size={28} color="#10b981"/>
          </motion.div>
          <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.4rem', color:'#fff', margin:'0 0 8px' }}>Application Sent! 🎉</h3>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem', lineHeight:1.6, margin:0 }}>
            Thanks, {form.fullName.split(' ')[0]}! Our team will review your application and email you once approved.
          </p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose} accent={accent} maxWidth="540px">
      <div style={{ marginBottom:'18px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
          <div style={{ width:'38px', height:'38px', borderRadius:'12px', background:`${accent}22`, border:`1px solid ${accent}45`, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>
            <FaUserPlus size={16}/>
          </div>
          <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.4rem', color:'#fff', margin:0 }}>Join as a Consultant</h3>
        </div>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', margin:0, fontFamily:J }}>
          Tell us about yourself — our team reviews every application personally.
        </p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        <label style={labelStyle}>Full Name *
          <input className="premium-input" value={form.fullName} onChange={set('fullName')} placeholder="Dr. Jane Doe"/>
        </label>

        <label style={labelStyle}>Email *
          <input type="email" className="premium-input" value={form.email} onChange={set('email')} placeholder="jane@example.com"/>
        </label>

        <label style={labelStyle}>Skills / Specialization
          <input className="premium-input" value={form.skills} onChange={set('skills')} placeholder="e.g. Anxiety, CBT, Trauma"/>
        </label>

        <label style={labelStyle}>Therapy approach(es) you use with clients
          <textarea rows={2} className="premium-input" value={form.therapyApproach} onChange={set('therapyApproach')} placeholder="e.g. CBT, person-centered, mindfulness-based..."/>
        </label>

        <label style={labelStyle}>Qualifications
          <textarea rows={2} className="premium-input" value={form.qualifications} onChange={set('qualifications')} placeholder="Degrees, licenses, certifications, years of experience..."/>
        </label>

        <label style={labelStyle}>How do you handle multilingual or aggressive clients?
          <textarea rows={3} className="premium-input" value={form.multilingualAggressive} onChange={set('multilingualAggressive')} placeholder="e.g. I switch languages as needed, use de-escalation techniques..."/>
        </label>

        <div style={{ height:'1px', background:'var(--border-subtle)', margin:'10px 0' }}/>
        
        <h4 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.1rem', color:'#fff', margin:'4px 0 0' }}>Payout Details</h4>
        
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <label style={labelStyle}>Bank Name
            <input className="premium-input" value={form.bankName} onChange={set('bankName')} placeholder="e.g. State Bank of India"/>
          </label>
          <label style={labelStyle}>Account Number
            <input className="premium-input" value={form.bankAccount} onChange={set('bankAccount')} placeholder="e.g. 12345678901"/>
          </label>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          <label style={labelStyle}>IFSC Code
            <input className="premium-input" value={form.bankIfsc} onChange={set('bankIfsc')} placeholder="e.g. SBIN0001234"/>
          </label>
          <label style={labelStyle}>UPI ID (GPay / PhonePe)
            <input className="premium-input" value={form.bankUpi} onChange={set('bankUpi')} placeholder="e.g. name@upi"/>
          </label>
        </div>

        {/* Security disclaimer note */}
        <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', marginTop: '4px' }}>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, fontFamily: J }}>
            🛡️ <b>Bank Details Security Note:</b> Your bank details are fully secure on our platform. They will only be used to process your direct session earnings (payouts/transfers) and will never be shared or used for any other purpose.
          </p>
        </div>

        {status === 'error' && (
          <div style={{ padding:'10px 14px', borderRadius:'12px', background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.25)' }}>
            <p style={{ margin:0, fontSize:'0.78rem', color:'#ff9999' }}>{errorMsg}</p>
          </div>
        )}

        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={submit} disabled={status==='sending'}
          style={{ width:'100%', padding:'13px', borderRadius:'14px', border:'none', cursor: status==='sending' ? 'not-allowed':'pointer',
            background: status==='sending' ? 'rgba(255,255,255,0.06)' : accent,
            color:'#fff', fontSize:'0.92rem', fontWeight:'700', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            boxShadow:'var(--shadow-premium)' }}>
          {status==='sending' ? (<><FaSpinner className="spin" size={14}/> Submitting...</>) : 'Submit Application'}
        </motion.button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// ApplicationsPanel — Admin view: approve / reject pending applications
// ─────────────────────────────────────────────────────────────────
export function ApplicationsPanel({ applications, onRefresh, accent = 'var(--accent-purple)' }) {
  const [busyId, setBusyId] = useState(null);

  const act = async (id, action) => {
    setBusyId(id);
    try {
      await fetch(`${API_BASE}/api/admin/applications/${id}/${action}`, { method:'POST' });
      onRefresh();
    } catch (e) {
      console.error('Action failed:', e);
    }
    setBusyId(null);
  };

  if (!applications || applications.length === 0) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight:'50vh', padding:'30px' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
          <FaClock size={24} color="var(--accent-purple)"/>
        </div>
        <h2 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.5rem', color:'#fff', margin:'0 0 6px' }}>All caught up!</h2>
        <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.85rem', maxWidth:'320px', fontFamily:J }}>
          No pending consultant applications right now. New "Join as a Consultant" submissions will show up here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
      {applications.map(app => (
        <motion.div key={app.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px', flexWrap:'wrap', gap:'8px' }}>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'1.05rem', fontWeight:'700', color:'#fff' }}>{app.fullName}</p>
              <p style={{ margin:0, fontSize:'0.78rem', color:'rgba(255,255,255,0.35)' }}>{app.email}</p>
            </div>
            <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', fontFamily:S }}>
              {new Date(app.submittedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
            </span>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', fontFamily:S, letterSpacing:'1px', fontWeight:'700' }}>SKILLS</p>
              <p style={{ margin:0, fontSize:'0.82rem', color:'rgba(255,255,255,0.7)' }}>{app.skills || '—'}</p>
            </div>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', fontFamily:S, letterSpacing:'1px', fontWeight:'700' }}>THERAPY APPROACH</p>
              <p style={{ margin:0, fontSize:'0.82rem', color:'rgba(255,255,255,0.7)' }}>{app.therapyApproach || '—'}</p>
            </div>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', fontFamily:S, letterSpacing:'1px', fontWeight:'700' }}>QUALIFICATIONS</p>
              <p style={{ margin:0, fontSize:'0.82rem', color:'rgba(255,255,255,0.7)' }}>{app.qualifications || '—'}</p>
            </div>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'0.66rem', color:'rgba(255,255,255,0.3)', fontFamily:S, letterSpacing:'1px', fontWeight:'700' }}>MULTILINGUAL / AGGRESSIVE CLIENTS</p>
              <p style={{ margin:0, fontSize:'0.82rem', color:'rgba(255,255,255,0.7)' }}>{app.multilingualAggressive || '—'}</p>
            </div>
          </div>

          <div style={{ display:'flex', gap:'10px' }}>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} disabled={busyId===app.id}
              onClick={() => act(app.id, 'approve')}
              style={{ flex:1, padding:'10px', borderRadius:'12px', border:'1px solid rgba(16,185,129,0.35)', background:'rgba(16,185,129,0.12)', color:'#10b981', fontWeight:'700', fontSize:'0.82rem', cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <FaCheckCircle size={12}/> Approve
            </motion.button>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} disabled={busyId===app.id}
              onClick={() => act(app.id, 'reject')}
              style={{ flex:1, padding:'10px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)', color:'rgba(255,255,255,0.5)', fontWeight:'700', fontSize:'0.82rem', cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              <FaTimesCircle size={12}/> Reject
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PaymentModal — shown after the 1 free session is used.
// Razorpay-ready mockup: same UI flow as a real checkout, but
// simulates success so you can test the experience right now.
// To go live later: swap the `simulatePayment()` body for a real
// Razorpay Checkout call using an order created via /api/payment/order.
// ─────────────────────────────────────────────────────────────────
export function PaymentModal({ consultant, onClose, onSuccess }) {
  const [stage, setStage] = useState('review'); // review | processing | success
  const price = consultant?.price ?? 199;

  const simulatePayment = () => {
    setStage('processing');
    setTimeout(() => {
      setStage('success');
      setTimeout(() => { onSuccess?.(); }, 1200);
    }, 1400);
  };

  return (
    <ModalShell onClose={onClose} accent={consultant?.color || 'var(--accent-purple)'} maxWidth="420px">
      {stage === 'review' && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`${consultant?.color}22`, border:`1px solid ${consultant?.color}45`, display:'flex', alignItems:'center', justifyContent:'center', color:consultant?.color }}>
              <FaLock size={15}/>
            </div>
            <div>
              <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.25rem', color:'#fff', margin:0 }}>Book Session</h3>
              <p style={{ margin:0, fontSize:'0.74rem', color:'rgba(255,255,255,0.35)' }}>Secure payment · Razorpay (test mode)</p>
            </div>
          </div>

          <div style={{ background:'var(--bg-input)', border:'1px solid var(--border-subtle)', borderRadius:'16px', padding:'18px', marginBottom:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
              <span style={{ fontSize:'0.84rem', color:'var(--text-secondary)' }}>Consultant</span>
              <span style={{ fontSize:'0.84rem', color:'#fff', fontWeight:'700' }}>{consultant?.name}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
              <span style={{ fontSize:'0.84rem', color:'var(--text-secondary)' }}>Session</span>
              <span style={{ fontSize:'0.84rem', color:'#fff' }}>1 hour, 1:1 video/chat</span>
            </div>
            <div style={{ height:'1px', background:'var(--border-subtle)', margin:'10px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.92rem', color:'rgba(255,255,255,0.7)', fontWeight:'700' }}>Total</span>
              <span style={{ fontSize:'1.3rem', color:'#fff', fontWeight:'800', fontFamily:S }}>₹{price}</span>
            </div>
          </div>

          {/* Verified Direct Payout details */}
          <div style={{ background:'rgba(16,185,129,0.04)', border:'1px dashed rgba(16,185,129,0.2)', borderRadius:'16px', padding:'14px 18px', marginBottom:'18px' }}>
            <p style={{ margin:'0 0 8px', fontSize:'0.68rem', color:'#10b981', fontWeight:'800', letterSpacing:'0.5px', fontFamily:S }}>✓ VERIFIED PAYOUT DESTINATION</p>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'0.78rem' }}>
              <span style={{ color:'rgba(255,255,255,0.45)' }}>UPI Target ID</span>
              <span style={{ color:'#fff', fontWeight:'600', fontFamily:S }}>{consultant?.bankUpi || `${consultant?.name?.toLowerCase().replace(/\s+/g,'')}@okaxis`}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem' }}>
              <span style={{ color:'rgba(255,255,255,0.45)' }}>Bank Account</span>
              <span style={{ color:'#fff', fontWeight:'600' }}>{consultant?.bankName || 'State Bank of India'} ({consultant?.bankAccount || 'XXXXXX8890'})</span>
            </div>
          </div>

          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={simulatePayment}
            style={{ width:'100%', padding:'14px', borderRadius:'14px', border:'none', cursor:'pointer',
              background: consultant?.color || 'var(--accent-purple)', color:'#fff', fontSize:'0.95rem', fontWeight:'800', fontFamily:J,
              boxShadow:`0 8px 20px ${(consultant?.color||'var(--accent-purple)')}25` }}>
            Pay Here! ➔
          </motion.button>
          <p style={{ textAlign:'center', fontSize:'0.68rem', color:'rgba(255,255,255,0.25)', marginTop:'10px', fontFamily:J }}>
            🔒 Test mode — no real money will be charged
          </p>
        </div>
      )}

      {stage === 'processing' && (
        <div style={{ textAlign:'center', padding:'40px 10px' }}>
          <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
            style={{ width:'48px', height:'48px', borderRadius:'50%', border:`3px solid ${consultant?.color}30`, borderTopColor:consultant?.color, margin:'0 auto 18px' }}/>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem', fontFamily:J }}>Processing payment...</p>
        </div>
      )}

      {stage === 'success' && (
        <div style={{ textAlign:'center', padding:'30px 10px' }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
            style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <FaCheckCircle size={28} color="#10b981"/>
          </motion.div>
          <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.3rem', color:'#fff', margin:'0 0 6px' }}>Payment Successful!</h3>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.84rem', margin:0 }}>
            Your session with {consultant?.name} is confirmed.
          </p>
        </div>
      )}
    </ModalShell>
  );
}

export function FreeSessionToast({ consultant, onClose }) {
  const G = "'Cormorant Garamond', serif";
  return (
    <ModalShell onClose={onClose} accent="#10b981" maxWidth="380px">
      <div style={{ textAlign:'center', padding:'20px 6px' }}>
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
          style={{ width:'60px', height:'60px', borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'1.8rem' }}>
          🎁
        </motion.div>
        <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.25rem', color:'#fff', margin:'0 0 8px' }}>Free Session Unlocked!</h3>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.84rem', lineHeight:1.6, margin:0 }}>
          Your first session with <b style={{ color:'#fff' }}>{consultant?.name}</b> is on us. Booking confirmed — no payment needed this time!
        </p>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// EditProfileModal — Modal form to edit user profile details
// ─────────────────────────────────────────────────────────────────
function EditProfileModal({ consultant, onClose, onSave, accent = 'var(--accent-purple)' }) {
  const J = "'Plus Jakarta Sans', sans-serif";
  const S = "'Space Grotesk', sans-serif";
  const G = "'Cormorant Garamond', serif";

  const [name, setName] = useState(consultant.name || '');
  const [bio, setBio] = useState(consultant.spec || '');
  const [pfp, setPfp] = useState(consultant.pfp || '');
  const [gender, setGender] = useState(consultant.gender || 'Male');
  const [preferences, setPreferences] = useState(consultant.preferences || []);

  const [customEmoji, setCustomEmoji] = useState('😊');
  const [customColor, setCustomColor] = useState(consultant.color || '#ec4899');

  const PREF_OPTIONS = ['Stress Relief', 'Anxiety Control', 'Meditation', 'Sleep Restoration', 'Mindfulness', 'Emotional Balance'];

  React.useEffect(() => {
    if (pfp && pfp.startsWith('preset:custom:')) {
      const parts = pfp.split(':');
      if (parts[2]) setCustomEmoji(parts[2]);
      if (parts[3]) setCustomColor(parts[3]);
    }
  }, [pfp]);

  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPfp(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePref = (pref) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    let finalColor = consultant.color || '#ec4899';
    const parsedPreset = parsePresetAvatar(pfp);
    if (parsedPreset) {
      finalColor = parsedPreset.color;
    } else if (pfp && pfp.startsWith('preset:custom:')) {
      finalColor = customColor;
    }

    onSave({
      username: name.trim().toLowerCase().replace(/\s+/g,'_'),
      name: name.trim(),
      bio: bio.trim(),
      pfp,
      gender,
      preferences,
      color: finalColor
    });
  };

  return (
    <ModalShell onClose={onClose} accent={accent} maxWidth="500px">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: G, fontStyle: 'italic', fontWeight: 800, fontSize: '1.8rem', color: '#fff', margin: '0 0 4px' }}>Edit Profile</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>Customize your social wellness presence</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', color: '#fff', fontFamily: J }}>
        
        {/* Avatar Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          {renderAvatar(pfp, name, customColor, 90, '1.8rem')}
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <label htmlFor="modal-pfp-upload" style={{ cursor: 'pointer', padding: '6px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📸 Upload Photo
            </label>
            <input id="modal-pfp-upload" type="file" accept="image/*" onChange={handlePfpChange} style={{ display: 'none' }} />
            
            {pfp && (
              <button 
                type="button" 
                onClick={() => setPfp('')}
                style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Remove
              </button>
            )}
          </div>
          
          {/* Preset options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', width: '100%', marginTop: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: '700', letterSpacing: '0.5px' }}>CHOOSE AESTHETIC PRESET</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', width: '100%', maxWidth: '360px' }}>
              {PRESET_AVATARS.map((preset) => {
                const active = pfp === `preset:${preset.id}`;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPfp(`preset:${preset.id}`)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: preset.grad,
                      border: active ? '2px solid #fff' : '1.5px solid transparent',
                      boxShadow: active ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                    title={preset.name}
                  >
                    {preset.emoji}
                  </button>
                );
              })}
            </div>
            
            {/* Custom builder */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>Custom:</span>
              <input 
                type="color" 
                value={customColor} 
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setPfp(`preset:custom:${customEmoji}:${e.target.value}`);
                }}
                style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'none', padding: 0 }}
              />
              <input 
                type="text" 
                maxLength={2} 
                value={customEmoji} 
                onChange={(e) => {
                  setCustomEmoji(e.target.value);
                  setPfp(`preset:custom:${e.target.value}:${customColor}`);
                }}
                placeholder="😊"
                style={{ width: '32px', padding: '2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', textAlign: 'center', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label style={labelStyle}>FULL NAME</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={fieldStyle} 
          />
        </div>

        {/* Bio */}
        <div>
          <label style={labelStyle}>BIO / BIO-SPEC</label>
          <input 
            type="text" 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            placeholder="E.g. Sharing my mindfulness journey."
            style={fieldStyle} 
          />
        </div>

        {/* Gender */}
        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>GENDER</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {['Male', 'Female', 'Non-Binary'].map(g => (
              <button 
                key={g} 
                type="button" 
                onClick={() => setGender(g)} 
                style={{ 
                  padding: '7px 0', 
                  borderRadius: '10px', 
                  border: `1px solid ${gender === g ? accent : 'rgba(255,255,255,0.06)'}`, 
                  background: gender === g ? `${accent}15` : 'rgba(255,255,255,0.02)', 
                  color: gender === g ? '#fff' : 'rgba(255,255,255,0.4)', 
                  fontSize: '0.8rem', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  transition: 'all 0.25s' 
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>MINDFULNESS PREFERENCES</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {PREF_OPTIONS.map(opt => {
              const active = preferences.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => togglePref(opt)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `1px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`,
                    background: active ? `${accent}20` : 'rgba(255,255,255,0.015)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!name.trim()}
          style={{ width: '100%', padding: '11px', background: `linear-gradient(135deg, ${accent}, #8b5cf6)`, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', marginTop: '10px' }}
        >
          Save Changes
        </motion.button>
      </form>
    </ModalShell>
  );
}

export function ConsultantProfile({ consultant, onBack, accent, onUpdateProfile }) {
  const G = "'Cormorant Garamond', serif";
  const S = "'Space Grotesk', sans-serif";
  const J = "'Plus Jakarta Sans', sans-serif";

  // States
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      return localStorage.getItem(`equilibrium_following_${consultant.id}`) === 'true';
    } catch {
      return false;
    }
  });
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadReelOpen, setUploadReelOpen] = useState(false);
  const [lightboxPost, setLightboxPost] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [editingOpen, setEditingOpen] = useState(false);

  const handleFollowToggle = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      localStorage.setItem(`equilibrium_following_${consultant.id}`, String(next));
    } catch (e) {}
  };

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(`equilibrium_posts_${consultant.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // If it's the user's profile, start empty
    if (consultant.isUser) {
      return [];
    }
    // Seed default posts
    return [
      { 
        id: `${consultant.id}-p1`, 
        consultantId: consultant.id, 
        type: 'gradient', 
        text: "Breathe in, breathe out.", 
        color1: "#0d9488", 
        color2: "#06b6d4", 
        likes: 142, 
        comments: 12, 
        caption: "A gentle reminder to pause, close your eyes, and take a deep breath. You are doing great. 🌿 #mindfulness #wellness", 
        date: "2 days ago" 
      },
      { 
        id: `${consultant.id}-p2`, 
        consultantId: consultant.id, 
        type: 'gradient', 
        text: "Healing is a journey.", 
        color1: "#8b5cf6", 
        color2: "#ec4899", 
        likes: 218, 
        comments: 24, 
        caption: "Healing is not linear. Some days are hard, and that's completely valid. Be kind to yourself today. 🌸 #selfcare #healing", 
        date: "4 days ago" 
      },
      { 
        id: `${consultant.id}-p3`, 
        consultantId: consultant.id, 
        type: 'gradient', 
        text: "One step at a time.", 
        color1: "#d97706", 
        color2: "#f43f5e", 
        likes: 98, 
        comments: 8, 
        caption: "You don't have to figure out everything today. Focus on the present moment. Just take the next step. ✨ #mindset #growth", 
        date: "1 week ago" 
      }
    ];
  });

  const [reels, setReels] = useState(() => {
    try {
      const saved = localStorage.getItem(`equilibrium_reels_${consultant.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0 && !parsed[0].videoUrl.includes('mixkit')) {
          return parsed;
        }
      }
    } catch {}
    // If it's the user's profile, start empty
    if (consultant.isUser) {
      return [];
    }
    return [
      {
        id: `${consultant.id}-r1`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'Focusing on the breath. 5 seconds in, 5 seconds out. Let go of the day. 🧘‍♀️✨ #meditation #wellness',
        likes: 84,
        liked: false,
        music: 'Quiet Meditation - Original Sound'
      },
      {
        id: `${consultant.id}-r2`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Forest sounds to quieten your anxious thoughts. Pause and listen. 🌊🌲 #naturehealing #mindfulness',
        likes: 128,
        liked: false,
        music: 'Calming Forest River Sounds'
      },
      {
        id: `${consultant.id}-r3`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        caption: 'Releasing physical tension. Find a creative outlet to express yourself. ⚡🕺 #move #letgo',
        likes: 56,
        liked: false,
        music: 'Lo-Fi Chill Ambient Vibes'
      }
    ];
  });

  // State for upload form (posts)
  const [caption, setCaption] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  // State for upload form (reels)
  const [reelCaption, setReelCaption] = useState('');
  const [reelMusic, setReelMusic] = useState('');
  const [reelVideoSrc, setReelVideoSrc] = useState('');
  const resolvedReelPreviewSrc = useVideoUrl(reelVideoSrc);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        compressImage(reader.result, (compressed) => {
          setImageSrc(compressed);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!imageSrc) return;
    const newPost = {
      id: `custom-${Date.now()}`,
      consultantId: consultant.id,
      type: 'image',
      imageUrl: imageSrc,
      likes: 0,
      comments: 0,
      caption: caption,
      date: "Just now"
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem(`equilibrium_posts_${consultant.id}`, JSON.stringify(updated));
    } catch (e) {}

    // Also copy/prepend this post to global Calm Reels list too! (as an image-type reel)
    try {
      const savedGlobal = localStorage.getItem('equilibrium_global_reels');
      let globalList = [];
      if (savedGlobal) {
        globalList = JSON.parse(savedGlobal);
      } else {
        // seed list
        globalList = [
          {
            id: 'global-r1',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            caption: 'Ground yourself in the present. Breathe in calm, breathe out stress. 🧘‍♂️✨ #mindfulness #innerpeace',
            likes: 184,
            liked: false,
            music: 'Aura Calming Vibes - Original Sound',
            creator: { name: 'Dr. Priya Sharma', color: '#ec4899' }
          },
          {
            id: 'global-r2',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            caption: 'Quiet river flow to calm an anxious mind. Let your thoughts wash away. 🌲🌊 #naturehealing #peace',
            likes: 242,
            liked: false,
            music: 'Calming Forest Stream - Healing Sound',
            creator: { name: 'Dr. Vikranth Mehta', color: '#10b981' }
          },
          {
            id: 'global-r3',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            caption: 'Release physical tension, embrace positive vibes. You are safe. 🌈✨ #mentalhealth #zen',
            likes: 156,
            liked: false,
            music: 'Zen Ambient Lo-Fi Chill',
            creator: { name: 'Neha Kapoor', color: '#8b5cf6' }
          }
        ];
      }

      const newGlobalReel = {
        id: `global-custom-post-${Date.now()}`,
        imageUrl: imageSrc,
        caption: caption || 'Mindfulness moment. 🧘‍♂️🌸',
        likes: 0,
        liked: false,
        music: 'Quiet Contemplation',
        creator: { name: consultant.name, color: consultant.color || '#ec4899', pfp: consultant.pfp }
      };

      const updatedGlobal = [newGlobalReel, ...globalList];
      localStorage.setItem('equilibrium_global_reels', JSON.stringify(updatedGlobal));
    } catch (e) {}

    // Reset
    setImageSrc('');
    setCaption('');
    setUploadOpen(false);
  };

  const handleReelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;
        if (duration > 95) {
          alert("Video duration cannot exceed 1 minute and 35 seconds (1:35).");
          return;
        }
        const videoId = `video-blob-${Date.now()}`;
        saveVideoBlob(videoId, file).then(() => {
          setReelVideoSrc(`db:${videoId}`);
        }).catch(err => {
          console.error("Error saving video to IndexedDB:", err);
          alert("Failed to store video. Please try again.");
        });
      };
    }
  };

  const handleReelUpload = () => {
    if (!reelVideoSrc) return;
    const newReel = {
      id: `custom-reel-${Date.now()}`,
      videoUrl: reelVideoSrc,
      caption: reelCaption || 'Mindfulness moment. 🧘‍♂️🌸',
      likes: 0,
      liked: false,
      music: reelMusic || 'Original Sound',
      creator: { name: consultant.name, color: consultant.color || '#ec4899', pfp: consultant.pfp }
    };
    
    // 1. Update this profile's reels
    const updatedProfileReels = [newReel, ...reels];
    setReels(updatedProfileReels);
    try {
      localStorage.setItem(`equilibrium_reels_${consultant.id}`, JSON.stringify(updatedProfileReels));
    } catch {}

    // 2. Prepend to global Calm Reels list too!
    try {
      const savedGlobal = localStorage.getItem('equilibrium_global_reels');
      let globalList = [];
      if (savedGlobal) {
        globalList = JSON.parse(savedGlobal);
      } else {
        // seed list
        globalList = [
          {
            id: 'global-r1',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            caption: 'Ground yourself in the present. Breathe in calm, breathe out stress. 🧘‍♂️✨ #mindfulness #innerpeace',
            likes: 184,
            liked: false,
            music: 'Aura Calming Vibes - Original Sound',
            creator: { name: 'Dr. Priya Sharma', color: '#ec4899' }
          },
          {
            id: 'global-r2',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            caption: 'Quiet river flow to calm an anxious mind. Let your thoughts wash away. 🌲🌊 #naturehealing #peace',
            likes: 242,
            liked: false,
            music: 'Calming Forest Stream - Healing Sound',
            creator: { name: 'Dr. Vikranth Mehta', color: '#10b981' }
          },
          {
            id: 'global-r3',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            caption: 'Release physical tension, embrace positive vibes. You are safe. 🌈✨ #mentalhealth #zen',
            likes: 156,
            liked: false,
            music: 'Zen Ambient Lo-Fi Chill',
            creator: { name: 'Neha Kapoor', color: '#8b5cf6' }
          }
        ];
      }
      
      const newGlobalReel = {
        ...newReel,
        id: `global-custom-${Date.now()}`
      };
      const updatedGlobal = [newGlobalReel, ...globalList];
      localStorage.setItem('equilibrium_global_reels', JSON.stringify(updatedGlobal));
    } catch (e) {}

    // Reset
    setReelVideoSrc('');
    setReelCaption('');
    setReelMusic('');
    setUploadReelOpen(false);
  };

  return (
    <div style={{ padding: '0 10px', maxWidth: '840px', margin: '0 auto', fontFamily: J, color: '#fff' }}>
      
      {/* Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: J, fontWeight: '600' }}>
          <FaArrowLeft size={12}/> Back to Experts
        </button>
        
        {/* Upload buttons (only for user's own profile) */}
        {consultant.isUser && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }} 
              onClick={() => setUploadOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `linear-gradient(135deg, ${accent}, #8b5cf6)`, border: 'none', borderRadius: '12px', padding: '8px 16px', color: '#fff', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: J }}
            >
              <FaCamera size={12}/> Upload Post
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }} 
              onClick={() => setUploadReelOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `linear-gradient(135deg, #10b981, #14b8a6)`, border: 'none', borderRadius: '12px', padding: '8px 16px', color: '#fff', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: J }}
            >
              <FaPlay size={9}/> Upload Reel
            </motion.button>
          </div>
        )}
      </div>

      {/* Instagram Header section */}
      <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Profile Avatar */}
        {renderAvatar(consultant.pfp, consultant.name, consultant.color, 110, '2.2rem')}

        {/* Profile Stats & Bio details */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Top Row: Name, Follow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, fontFamily: J }}>
              {(consultant?.name || 'User').toLowerCase().replace(/\s+/g,'_')}
            </h2>
            
            {consultant.isUser && (
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditingOpen(true)}
                style={{ padding: '6px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', fontFamily: J }}
              >
                Edit Profile
              </motion.button>
            )}
            
            {/* Hide follow/message if it's the user's own profile */}
            {!consultant.isUser && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFollowToggle}
                  style={{ padding: '6px 20px', borderRadius: '10px', border: isFollowing ? '1px solid rgba(255,255,255,0.15)' : 'none', background: isFollowing ? 'rgba(255,255,255,0.05)' : '#fff', color: isFollowing ? '#fff' : '#0a0a0c', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', fontFamily: J, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {isFollowing ? <><FaUserCheck size={11}/> Following</> : 'Follow'}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '6px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', fontFamily: J }}
                >
                  Message
                </motion.button>
              </div>
            )}
          </div>

          {/* Counts (Real Counts: starting at 0) */}
          <div style={{ display: 'flex', gap: '30px', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
              <b style={{ color: '#fff' }}>{posts.length}</b> posts
            </span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
              <b style={{ color: '#fff' }}>{isFollowing ? 1 : 0}</b> followers
            </span>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
              <b style={{ color: '#fff' }}>0</b> following
            </span>
          </div>

          {/* Bio text */}
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
              {consultant.isUser ? (consultant.name || 'User') : `Dr. ${(consultant.name || 'User').replace('Dr. ', '')}`}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
              {consultant.isUser ? 'Member Profile' : `${consultant.spec} Specialist`}
            </p>
            <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
              {consultant.isUser 
                ? `🌿 ${consultant.spec || 'Sharing my mindfulness journey and self-care moments.'}`
                : `🌿 Helping you build emotional resilience and mental clarity. Certified in ${consultant.spec.split('&')[1] || 'Cognitive Behavioral Therapy'}.`}
            </p>
            <a href={`https://psycholink.in/${(consultant.name || 'user').toLowerCase().replace(/\s+/g,'')}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: consultant.color, textDecoration: 'none', fontWeight: '600' }}>
              psycholink.in/{(consultant.name || 'user').toLowerCase().replace(/\s+/g,'')}
            </a>
          </div>
        </div>
      </div>

      {/* Grid Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', gap: '50px', marginBottom: '20px' }}>
        <span 
          onClick={() => setActiveTab("posts")}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: activeTab === 'posts' ? '#fff' : 'rgba(255,255,255,0.4)', borderTop: activeTab === 'posts' ? '1.5px solid #fff' : '1.5px solid transparent', paddingTop: '14px', cursor: 'pointer', letterSpacing: '1px', transition: 'all 0.2s' }}
        >
          <FaTh size={10}/> POSTS
        </span>
        <span 
          onClick={() => setActiveTab("reels")}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: activeTab === 'reels' ? '#fff' : 'rgba(255,255,255,0.4)', borderTop: activeTab === 'reels' ? '1.5px solid #fff' : '1.5px solid transparent', paddingTop: '14px', cursor: 'pointer', letterSpacing: '1px', transition: 'all 0.2s' }}
        >
          <FaPlay size={9}/> REELS
        </span>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'posts' ? (
        posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
            No posts uploaded yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {posts.map((post) => (
              <motion.div 
                key={post.id}
                whileHover={{ scale: 1.015 }}
                onClick={() => setLightboxPost(post)}
                style={{ 
                  aspectRatio: '1', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  background: '#1a1f2e', 
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.04)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                {/* Render Gradient Post Card or Image */}
                {post.type === 'gradient' ? (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: `linear-gradient(135deg, ${post.color1}, ${post.color2})`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '20px', 
                    textAlign: 'center' 
                  }}>
                    <p style={{ 
                      fontFamily: G, 
                      fontSize: '1.15rem', 
                      fontStyle: 'italic', 
                      fontWeight: '600', 
                      color: '#fff', 
                      margin: 0,
                      textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                      lineHeight: 1.3
                    }}>{post.text}</p>
                  </div>
                ) : (
                  <img src={post.imageUrl} alt="Uploaded Post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}

                {/* Instagram Hover Overlay */}
                <div className="instagram-hover-overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  zIndex: 2
                }}>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: S }}>
                    <FaHeart color="#fff"/> {post.likes}
                  </span>
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: S }}>
                    <FaComment color="#fff"/> {post.comments}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        /* Reels Grid View */
        reels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
            No reels uploaded yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {reels.map((reel, index) => (
              <motion.div 
                key={reel.id}
                whileHover={{ scale: 1.015 }}
                onClick={() => setActiveReelIndex(index)}
                style={{ 
                  aspectRatio: '9/16', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  background: '#090b11', 
                  cursor: 'pointer',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.04)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              >
                {/* Cover Video Preview */}
                <video src={reel.videoUrl} muted playsInline referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                
                {/* Play Overlay Button */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <FaPlay size={9} color="#fff" style={{ marginLeft: 2 }} />
                  </div>
                </div>

                {/* Likes on overlay */}
                <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#fff', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                  <FaHeart size={9} color="#fff"/> {reel.likes + (reel.liked ? 1 : 0)}
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Upload Post Modal */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setUploadOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(9,10,15,0.85)', backdropFilter: 'blur(6px)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '440px', background: '#171c28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '26px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
              
              <button onClick={() => setUploadOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <FaTimes size={14}/>
              </button>

              <h3 style={{ fontFamily: G, fontStyle: 'italic', fontSize: '1.3rem', margin: '0 0 16px' }}>Upload New Post</h3>
              
              {/* File Input */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>SELECT IMAGE FROM GALLERY</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
              </div>

              {/* Preview */}
              {imageSrc && (
                <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#10141f', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <img src={imageSrc} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}

              {/* Caption */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>CAPTION</label>
                <textarea rows={3} value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write something inspiring..." style={{ width: '100%', padding: '10px 12px', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', resize: 'none' }} />
              </div>

              {/* Submit button */}
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={!imageSrc}
                style={{ width: '100%', padding: '12px', background: imageSrc ? accent : 'rgba(255,255,255,0.05)', color: imageSrc ? '#fff' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: imageSrc ? 'pointer' : 'not-allowed', fontFamily: J }}
              >
                Post to Feed
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Reel Modal */}
      <AnimatePresence>
        {uploadReelOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setUploadReelOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(9,10,15,0.85)', backdropFilter: 'blur(6px)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '440px', background: '#171c28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '26px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
              
              <button onClick={() => setUploadReelOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <FaTimes size={14}/>
              </button>

              <h3 style={{ fontFamily: G, fontStyle: 'italic', fontSize: '1.3rem', margin: '0 0 16px' }}>Upload New Reel</h3>
              
              {/* File Input */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', margin: 0 }}>SELECT VIDEO FILE (Max 1.5MB)</label>
                  {reelVideoSrc && (
                    <button type="button" onClick={() => setReelVideoSrc('')} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={handleReelFileChange} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
              </div>

              {/* Video Presets */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '8px' }}>OR CHOOSE ZEN VIDEO LOOP PRESET</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {VIDEO_PRESETS.map((preset) => {
                    const active = reelVideoSrc === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setReelVideoSrc(preset.url)}
                        style={{
                          padding: '6px 4px',
                          background: active ? `${accent}25` : 'rgba(255,255,255,0.02)',
                          border: active ? `2px solid ${accent}` : '1.5px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{preset.icon}</span>
                        <span style={{ fontSize: '0.62rem', opacity: active ? 1 : 0.7 }}>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Video Preview */}
              {reelVideoSrc && (
                <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#10141f', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <video src={resolvedReelPreviewSrc} muted controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}

              {/* Caption */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>CAPTION</label>
                <textarea rows={2} value={reelCaption} onChange={e => setReelCaption(e.target.value)} placeholder="Write something inspiring..." style={{ width: '100%', padding: '10px 12px', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', resize: 'none' }} />
              </div>

              {/* Music Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>MUSIC TRACK NAME</label>
                <input type="text" value={reelMusic} onChange={e => setReelMusic(e.target.value)} placeholder="E.g. Calming Waves - Original Sound" style={{ width: '100%', padding: '10px 12px', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none' }} />
              </div>

              {/* Submit button */}
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={handleReelUpload}
                disabled={!reelVideoSrc}
                style={{ width: '100%', padding: '12px', background: reelVideoSrc ? accent : 'rgba(255,255,255,0.05)', color: reelVideoSrc ? '#fff' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: reelVideoSrc ? 'pointer' : 'not-allowed', fontFamily: J }}
              >
                Post Reel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Lightbox Modal */}
      <AnimatePresence>
        {lightboxPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightboxPost(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(9,10,15,0.9)', backdropFilter: 'blur(6px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '780px', display: 'flex', background: '#121622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', position: 'relative', flexWrap: 'wrap', minHeight: '380px' }}>
              
              {/* Left Side: Post visual content */}
              <div style={{ flex: '1.2', minWidth: '320px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090b11' }}>
                {lightboxPost.type === 'gradient' ? (
                  <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${lightboxPost.color1}, ${lightboxPost.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
                    <p style={{ fontFamily: G, fontSize: '1.5rem', fontStyle: 'italic', fontWeight: '600', color: '#fff', margin: 0, lineHeight: 1.4 }}>{lightboxPost.text}</p>
                  </div>
                ) : (
                  <img src={lightboxPost.imageUrl} alt="Post detail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
              </div>

              {/* Right Side: Profile header & comments */}
              <div style={{ flex: '1', minWidth: '280px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  {/* Consultant Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px', marginBottom: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${consultant.color}35, ${consultant.color}15)`, border: `1px solid ${consultant.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', color: consultant.color }}>
                      {(consultant.name || '?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                    </div>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700' }}>
                      {(consultant?.name || 'User').toLowerCase().replace(/\s+/g,'_')}
                    </span>
                  </div>

                  {/* Caption */}
                  <div style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4', overflowY: 'auto', maxHeight: '180px', paddingBottom: '10px' }}>
                    <span style={{ fontWeight: '700', marginRight: '6px' }}>
                      {(consultant?.name || 'User').toLowerCase().replace(/\s+/g,'_')}
                    </span>
                    {lightboxPost.caption || "Self-reflection moment."}
                  </div>
                </div>

                {/* Footer specs */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '700', fontFamily: S }}>
                    <span>❤️ {lightboxPost.likes} likes</span>
                    <span>💬 {lightboxPost.comments} comments</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontFamily: S }}>
                    {lightboxPost.date.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button onClick={() => setLightboxPost(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <FaTimes size={12}/>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Vertical Reels Viewer */}
      <AnimatePresence>
        {activeReelIndex !== null && (
          <ReelsViewerModal
            reels={reels}
            initialIndex={activeReelIndex}
            onClose={() => setActiveReelIndex(null)}
            consultant={consultant}
            onUpdateReels={(updated) => {
              setReels(updated);
              try {
                localStorage.setItem(`equilibrium_reels_${consultant.id}`, JSON.stringify(updated));
              } catch {}
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingOpen && (
          <EditProfileModal
            consultant={consultant}
            accent={accent}
            onClose={() => setEditingOpen(false)}
            onSave={(updated) => {
              if (onUpdateProfile) {
                onUpdateProfile(updated);
              }
              setEditingOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Global CSS Inject for Hover Overlays & Keyframe Animations */}
      <style>{`
        .instagram-hover-overlay:hover {
          opacity: 1 !important;
        }
        @keyframes reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-slide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-sub {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-custom {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-main {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-final {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-rot {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-run {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-active {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-play {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-anim {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-flow {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-fast {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-slow {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-smooth {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-base {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-css {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-style {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-web {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-page {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-app {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-feed {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-list {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-box {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-container {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-3 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-2 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-1 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-loop-0 {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-track {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-song {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-audio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-sound {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-volume {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-mute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-unmute {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-playpause-icon {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-heart {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-comment {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-share {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-paperplane {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-send {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-dm {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-message {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-chat {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-user {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-consultant {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-expert {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-profile {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-bio {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-header {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-title {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-text-node {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-scroll-ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-music-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee-reels-marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ReelsViewerModal — Phone-style vertical Reels feed viewer
// ─────────────────────────────────────────────────────────────────
export function ReelsViewerModal({ reels, initialIndex, onClose, consultant, onUpdateReels }) {
  const containerRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const [muted, setMuted] = React.useState(false);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const index = Math.round(scrollTop / height);
      if (index !== activeIndex && index >= 0 && index < reels.length) {
        setActiveIndex(index);
      }
    }
  };

  const handleLikeToggle = (idx) => {
    const updated = reels.map((r, i) => {
      if (i === idx) {
        return { ...r, liked: !r.liked };
      }
      return r;
    });
    onUpdateReels(updated);
  };

  React.useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      containerRef.current.scrollTop = activeIndex * height;
    }
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(9,10,15,0.95)', backdropFilter: 'blur(8px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Phone container shell */}
      <div style={{ 
        width: '375px', 
        height: '667px', 
        maxHeight: '90vh',
        background: '#000', 
        borderRadius: '28px', 
        position: 'relative', 
        overflow: 'hidden', 
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 10px rgba(255,255,255,0.05)',
        border: '4px solid rgba(255,255,255,0.1)'
      }}>
        
        {/* Scrollable Feed */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {reels.map((reel, idx) => (
            <ReelPlayer
              key={reel.id}
              reel={reel}
              idx={idx}
              active={idx === activeIndex}
              muted={muted}
              onMuteToggle={() => setMuted(!muted)}
              onLikeToggle={() => handleLikeToggle(idx)}
              consultant={consultant}
            />
          ))}
        </div>

        {/* Global Exit button */}
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            background: 'rgba(0,0,0,0.6)', 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            color: '#fff', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 160,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <FaTimes size={13}/>
        </button>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ReelPlayer — single vertical Reel player component
// ─────────────────────────────────────────────────────────────────
function ReelPlayer({ reel, idx, active, muted, onMuteToggle, onLikeToggle, consultant }) {
  const S = "'Space Grotesk', sans-serif";
  const J = "'Plus Jakarta Sans', sans-serif";
  
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showPlayIcon, setShowPlayIcon] = React.useState(null);
  const resolvedSrc = useVideoUrl(reel.videoUrl);

  React.useEffect(() => {
    if (videoRef.current && resolvedSrc) {
      if (active) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [active, resolvedSrc]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayIcon('pause');
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
        setShowPlayIcon('play');
      }
      setTimeout(() => setShowPlayIcon(null), 800);
    }
  };

  const creatorName = reel.creator?.name || consultant?.name || 'User';
  const creatorColor = reel.creator?.color || consultant?.color || '#ec4899';
  const creatorPfp = reel.creator?.pfp || consultant?.pfp;
  const username = creatorName.toLowerCase().replace(/\s+/g,'_');
  const likesCount = reel.likes + (reel.liked ? 1 : 0);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      scrollSnapAlign: 'start', 
      position: 'relative', 
      background: '#05070a' 
    }}>
      
      {/* Visual element (Video or Image) */}
      {reel.imageUrl ? (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${reel.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Blurred background for aesthetic fit */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${reel.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px) brightness(0.5)',
            zIndex: 1
          }} />
          <img src={reel.imageUrl} alt="" style={{ width: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain', zIndex: 2, position: 'relative' }} />
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={resolvedSrc}
            loop
            playsInline
            muted={muted}
            onClick={handleVideoClick}
            referrerPolicy="no-referrer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer'
            }}
          />
          {/* Central Play Button Overlay when paused */}
          {!isPlaying && (
            <div 
              onClick={handleVideoClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.55)',
                borderRadius: '50%',
                width: '58px',
                height: '58px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                cursor: 'pointer',
                border: '1.5px solid rgba(255,255,255,0.35)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
            >
              <FaPlay size={18} color="#fff" style={{ marginLeft: 3 }} />
            </div>
          )}
        </>
      )}

      {/* Center temporary play/pause feedback */}
      <AnimatePresence>
        {showPlayIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            {showPlayIcon === 'play' ? <FaPlay size={20} color="#fff" /> : <FaPause size={20} color="#fff" />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side interaction bar */}
      <div style={{
        position: 'absolute',
        right: '12px',
        bottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        zIndex: 5
      }}>
        {/* Like */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={onLikeToggle}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: reel.liked ? '#ef4444' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <FaHeart size={16} style={{ display: 'block', margin: '0 auto' }} />
          </motion.button>
          <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: '700', fontFamily: S }}>{likesCount}</span>
        </div>

        {/* Comment */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <FaComment size={15} style={{ display: 'block', margin: '0 auto' }} />
          </button>
          <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: '700', fontFamily: S }}>{idx * 3 + 2}</span>
        </div>

        {/* Mute */}
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={onMuteToggle}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          {muted ? <FaVolumeMute size={15} style={{ display: 'block', margin: '0 auto' }} /> : <FaVolumeUp size={15} style={{ display: 'block', margin: '0 auto' }} />}
        </motion.button>
      </div>

      {/* Bottom text overlay */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '48px',
        padding: '20px 16px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        color: '#fff',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {/* Username */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {renderAvatar(creatorPfp, creatorName, creatorColor, 28, '0.72rem')}
          <span style={{ fontSize: '0.84rem', fontWeight: '700', fontFamily: J }}>
            {username}
          </span>
        </div>

        {/* Caption */}
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.95)', lineHeight: '1.3', fontWeight: '400', fontFamily: J }}>
          {reel.caption}
        </p>

        {/* Music scrolling ticker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap', width: '190px', padding: '2px 0' }}>
          <FaMusic size={9} style={{ flexShrink: 0, color: 'rgba(255,255,255,0.7)' }} />
          <div className="music-marquee-container" style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
            <span className="music-marquee-text" style={{ 
              display: 'inline-block', 
              fontSize: '0.72rem', 
              color: 'rgba(255,255,255,0.75)', 
              fontFamily: S,
              paddingLeft: '100%',
              animation: 'reels-marquee-reels 10s linear infinite'
            }}>
              {reel.music}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

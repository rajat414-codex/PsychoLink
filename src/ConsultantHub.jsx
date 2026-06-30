import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserPlus, FaCheckCircle, FaTimesCircle, FaClock, FaLock, FaSpinner } from 'react-icons/fa';

const J = "'Plus Jakarta Sans', sans-serif";
const G = "'Cormorant Garamond', serif";
const S = "'Space Grotesk', sans-serif";

const API_BASE = 'http://localhost:3001';

// ─────────────────────────────────────────────────────────────────
// Shared modal shell
// ─────────────────────────────────────────────────────────────────
function ModalShell({ onClose, accent = '#8b5cf6', maxWidth = '520px', children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(4,3,10,0.7)', backdropFilter:'blur(6px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <motion.div
        initial={{ opacity:0, y:20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20, scale:0.97 }}
        transition={{ type:'spring', stiffness:300, damping:28 }}
        onClick={e => e.stopPropagation()}
        style={{ width:'100%', maxWidth, maxHeight:'88vh', overflowY:'auto', background:'rgba(10,8,20,0.97)', border:`1px solid ${accent}33`, borderRadius:'24px', padding:'28px', boxShadow:`0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${accent}1a`, position:'relative' }}>
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
  width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
  borderRadius:'12px', color:'#fff', fontSize:'0.86rem', fontFamily:J, outline:'none', marginTop:'6px', resize:'vertical',
};
const labelStyle = { fontSize:'0.78rem', color:'rgba(255,255,255,0.55)', fontFamily:J, fontWeight:'600' };

// ─────────────────────────────────────────────────────────────────
// JoinConsultantModal — "Join as a Consultant" application form
// ─────────────────────────────────────────────────────────────────
export function JoinConsultantModal({ onClose, accent = '#8b5cf6' }) {
  const [form, setForm] = useState({
    fullName: '', email: '', skills: '', therapyApproach: '', qualifications: '', multilingualAggressive: '',
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
          <input style={fieldStyle} value={form.fullName} onChange={set('fullName')} placeholder="Dr. Jane Doe"/>
        </label>

        <label style={labelStyle}>Email *
          <input type="email" style={fieldStyle} value={form.email} onChange={set('email')} placeholder="jane@example.com"/>
        </label>

        <label style={labelStyle}>Skills / Specialization
          <input style={fieldStyle} value={form.skills} onChange={set('skills')} placeholder="e.g. Anxiety, CBT, Trauma"/>
        </label>

        <label style={labelStyle}>Therapy approach(es) you use with clients
          <textarea rows={2} style={fieldStyle} value={form.therapyApproach} onChange={set('therapyApproach')} placeholder="e.g. CBT, person-centered, mindfulness-based..."/>
        </label>

        <label style={labelStyle}>Qualifications
          <textarea rows={2} style={fieldStyle} value={form.qualifications} onChange={set('qualifications')} placeholder="Degrees, licenses, certifications, years of experience..."/>
        </label>

        <label style={labelStyle}>How do you handle multilingual or aggressive clients?
          <textarea rows={3} style={fieldStyle} value={form.multilingualAggressive} onChange={set('multilingualAggressive')} placeholder="e.g. I switch languages as needed, use de-escalation techniques..."/>
        </label>

        {status === 'error' && (
          <div style={{ padding:'10px 14px', borderRadius:'12px', background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.25)' }}>
            <p style={{ margin:0, fontSize:'0.78rem', color:'#ff9999' }}>{errorMsg}</p>
          </div>
        )}

        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={submit} disabled={status==='sending'}
          style={{ width:'100%', padding:'13px', borderRadius:'14px', border:'none', cursor: status==='sending' ? 'not-allowed':'pointer',
            background: status==='sending' ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg,${accent},#ec4899)`,
            color:'#fff', fontSize:'0.92rem', fontWeight:'700', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            boxShadow: status==='sending' ? 'none' : `0 8px 24px ${accent}40` }}>
          {status==='sending' ? (<><FaSpinner className="spin" size={14}/> Submitting...</>) : 'Submit Application'}
        </motion.button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────
// ApplicationsPanel — Admin view: approve / reject pending applications
// ─────────────────────────────────────────────────────────────────
export function ApplicationsPanel({ applications, onRefresh, accent = '#8b5cf6' }) {
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
          <FaClock size={24} color="#8b5cf6"/>
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
    <ModalShell onClose={onClose} accent={consultant?.color || '#8b5cf6'} maxWidth="420px">
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

          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'18px', marginBottom:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
              <span style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.5)' }}>Consultant</span>
              <span style={{ fontSize:'0.84rem', color:'#fff', fontWeight:'700' }}>{consultant?.name}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
              <span style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.5)' }}>Session</span>
              <span style={{ fontSize:'0.84rem', color:'#fff' }}>1 hour, 1:1 video/chat</span>
            </div>
            <div style={{ height:'1px', background:'rgba(255,255,255,0.08)', margin:'10px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.92rem', color:'rgba(255,255,255,0.7)', fontWeight:'700' }}>Total</span>
              <span style={{ fontSize:'1.3rem', color:'#fff', fontWeight:'800', fontFamily:S }}>₹{price}</span>
            </div>
          </div>

          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={simulatePayment}
            style={{ width:'100%', padding:'14px', borderRadius:'14px', border:'none', cursor:'pointer',
              background:`linear-gradient(135deg,${consultant?.color||'#8b5cf6'},#8b5cf6)`, color:'#fff', fontSize:'0.95rem', fontWeight:'800', fontFamily:J,
              boxShadow:`0 10px 28px ${consultant?.color||'#8b5cf6'}45` }}>
            Pay ₹{price}
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

// ─────────────────────────────────────────────────────────────────
// FreeSessionToast — small confirmation when the free session is used
// ─────────────────────────────────────────────────────────────────
export function FreeSessionToast({ consultant, onClose }) {
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

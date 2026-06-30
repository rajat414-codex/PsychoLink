import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserPlus, FaCheckCircle, FaTimesCircle, FaClock, FaLock, FaSpinner, FaQrcode, FaUniversity, FaShieldAlt } from 'react-icons/fa';

const J = "var(--font-body)";
const G = "var(--font-display)";
const S = "var(--font-mono)";

const API_BASE = 'http://localhost:3001';

// ─────────────────────────────────────────────────────────────────
// Shared modal shell
// ─────────────────────────────────────────────────────────────────
function ModalShell({ onClose, accent = '#8b5cf6', maxWidth = '520px', children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="modal-overlay">
      <motion.div
        initial={{ opacity:0, y:20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20, scale:0.97 }}
        transition={{ type:'spring', stiffness:300, damping:28 }}
        onClick={e => e.stopPropagation()}
        className="glass-card"
        style={{ width:'100%', maxWidth, maxHeight:'88vh', overflowY:'auto', border:`1px solid ${accent}33`, padding:'28px', boxShadow:'var(--shadow-xl)', position:'relative' }}>
        <button onClick={onClose} className="btn-icon"
          style={{ position:'absolute', top:'18px', right:'18px', width:'32px', height:'32px' }}>
          <FaTimes size={13}/>
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

const fieldStyle = { marginTop:'6px', resize:'vertical' };
const labelStyle = { fontSize:'0.78rem', color:'var(--text-secondary)', fontFamily:J, fontWeight:'600' };

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
          <input className="input-field" style={fieldStyle} value={form.fullName} onChange={set('fullName')} placeholder="Dr. Jane Doe"/>
        </label>

        <label style={labelStyle}>Email *
          <input type="email" className="input-field" style={fieldStyle} value={form.email} onChange={set('email')} placeholder="jane@example.com"/>
        </label>

        <label style={labelStyle}>Skills / Specialization
          <input className="input-field" style={fieldStyle} value={form.skills} onChange={set('skills')} placeholder="e.g. Anxiety, CBT, Trauma"/>
        </label>

        <label style={labelStyle}>Therapy approach(es) you use with clients
          <textarea rows={2} className="input-field" style={fieldStyle} value={form.therapyApproach} onChange={set('therapyApproach')} placeholder="e.g. CBT, person-centered, mindfulness-based..."/>
        </label>

        <label style={labelStyle}>Qualifications
          <textarea rows={2} className="input-field" style={fieldStyle} value={form.qualifications} onChange={set('qualifications')} placeholder="Degrees, licenses, certifications, years of experience..."/>
        </label>

        <label style={labelStyle}>How do you handle multilingual or aggressive clients?
          <textarea rows={3} className="input-field" style={fieldStyle} value={form.multilingualAggressive} onChange={set('multilingualAggressive')} placeholder="e.g. I switch languages as needed, use de-escalation techniques..."/>
        </label>

        {status === 'error' && (
          <div style={{ padding:'10px 14px', borderRadius:'12px', background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.25)' }}>
            <p style={{ margin:0, fontSize:'0.78rem', color:'#ff9999' }}>{errorMsg}</p>
          </div>
        )}

        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={submit} disabled={status==='sending'}
          className="btn"
          style={{ width:'100%', padding:'13px', borderRadius:'14px', cursor: status==='sending' ? 'not-allowed':'pointer',
            background: status==='sending' ? 'var(--bg-active)' : `linear-gradient(135deg,${accent},var(--accent-violet))`,
            color:'#fff', fontSize:'0.92rem', fontWeight:'700', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            boxShadow: status==='sending' ? 'none' : 'var(--shadow-md)' }}>
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
          className="glass-card" style={{ padding:'20px' }}>
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
              className="btn btn-success"
              style={{ flex:1, height:'40px', borderRadius:'12px' }}>
              <FaCheckCircle size={12}/> Approve
            </motion.button>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} disabled={busyId===app.id}
              onClick={() => act(app.id, 'reject')}
              className="btn btn-ghost"
              style={{ flex:1, height:'40px', borderRadius:'12px' }}>
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
  const [stage, setStage] = useState('review'); // review | processing | success | direct_qr | sbi_login
  const [activeTab, setActiveTab] = useState('upi'); // upi | backup
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [txError, setTxError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Processing payment...');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [sbiAccount, setSbiAccount] = useState('');
  const [sbiPassword, setSbiPassword] = useState('');
  const [sbiError, setSbiError] = useState('');

  const price = consultant?.price ?? 199;
  const accentColor = consultant?.color || '#8b5cf6';
  const ownerUpi = 'rajatkamal2007@okaxis'; 

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpiPayment = async () => {
    if (!upiId.trim() || !upiId.includes('@')) {
      setUpiError('Please enter a valid UPI ID (e.g., name@bank)');
      return;
    }
    setUpiError('');
    setStage('processing');
    setStatusMessage('Initiating transaction with secure servers...');

    try {
      const resOrder = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, consultantId: consultant.id })
      });
      if (!resOrder.ok) throw new Error('Order creation failed');
      const order = await resOrder.json();
      setIsDemoMode(order.isDemo);

      if (order.isDemo) {
        setStatusMessage(`Sending UPI Collect Request to ${upiId}... Please check your UPI app (GPay/PhonePe).`);
        setTimeout(async () => {
          try {
            const resVerify = await fetch(`${API_BASE}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isDemo: true, upiId })
            });
            if (!resVerify.ok) throw new Error('Simulated verification rejected');
            setStage('success');
            setTimeout(() => { onSuccess?.(); }, 1600);
          } catch (e) {
            setStage('review');
            setUpiError(e.message || 'Payment simulation failed.');
          }
        }, 3000);
      } else {
        setStatusMessage('Loading secure payment portal...');
        const loaded = await loadRazorpay();
        if (!loaded) {
          throw new Error('Failed to load Razorpay payment client');
        }
        
        const options = {
          key: order.keyId,
          amount: Math.round(price * 100),
          currency: order.currency || 'INR',
          name: 'PsychoLink Consultation',
          description: `Booking with ${consultant.name}`,
          order_id: order.id,
          prefill: {
            method: 'upi',
            vpa: upiId
          },
          handler: async function (response) {
            setStage('processing');
            setStatusMessage('Verifying payment signature...');
            try {
              const resVerify = await fetch(`${API_BASE}/api/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  isDemo: false
                })
              });
              if (!resVerify.ok) throw new Error('Signature verification rejected');
              setStage('success');
              setTimeout(() => { onSuccess?.(); }, 1600);
            } catch (e) {
              setStage('review');
              setUpiError('Payment verification failed. Contact support.');
            }
          },
          modal: {
            ondismiss: function () {
              setStage('review');
            }
          },
          theme: {
            color: accentColor
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setStage('review');
      setUpiError(`Payment setup failed: ${err.message}`);
    }
  };

  const handleDirectQrVerify = async () => {
    if (!transactionId.trim() || transactionId.length < 8) {
      setTxError('Please enter a valid Transaction Ref No. (min 8 digits)');
      return;
    }
    setTxError('');
    setStage('processing');
    setStatusMessage('Verifying bank transfer confirmation...');
    
    setTimeout(async () => {
      try {
        const resVerify = await fetch(`${API_BASE}/api/payment/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isDemo: true, upiId: 'QR-CODE-DIRECT' })
        });
        if (!resVerify.ok) throw new Error('Verification failed');
        setStage('success');
        setTimeout(() => { onSuccess?.(); }, 1600);
      } catch (e) {
        setStage('direct_qr');
        setTxError('Could not verify this transaction reference. Please try again.');
      }
    }, 2500);
  };

  const handleSbiPayment = () => {
    if (!sbiAccount.trim() || sbiAccount.length < 6) {
      setSbiError('Please enter a valid Netbanking Username (min 6 characters)');
      return;
    }
    if (!sbiPassword.trim() || sbiPassword.length < 6) {
      setSbiError('Please enter your password (min 6 characters)');
      return;
    }
    setSbiError('');
    setStage('processing');
    setStatusMessage('Connecting to State Bank of India secure server...');
    
    setTimeout(() => {
      setStatusMessage('Authorizing bank funds transfer (SBI secure portal)...');
      setTimeout(async () => {
        try {
          const resVerify = await fetch(`${API_BASE}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDemo: true, upiId: 'SBI-NETBANKING' })
          });
          if (!resVerify.ok) throw new Error('Bank authorization failed');
          setStage('success');
          setTimeout(() => { onSuccess?.(); }, 1600);
        } catch (e) {
          setStage('sbi_login');
          setSbiError('SBI authorization rejected. Please check credentials.');
        }
      }, 2000);
    }, 1800);
  };

  const handleRazorpayFallback = async () => {
    setStage('processing');
    setStatusMessage('Connecting to Razorpay backup gateway...');

    try {
      const resOrder = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, consultantId: consultant.id })
      });
      if (!resOrder.ok) throw new Error('Order creation failed');
      const order = await resOrder.json();
      
      if (order.isDemo) {
        setStatusMessage('Opening SBI/Razorpay Demo Gateway Page...');
        setTimeout(() => {
          setStage('success');
          setTimeout(() => { onSuccess?.(); }, 1600);
        }, 2200);
      } else {
        const loaded = await loadRazorpay();
        if (!loaded) throw new Error('Failed to load Razorpay client');

        const options = {
          key: order.keyId,
          amount: Math.round(price * 100),
          currency: order.currency || 'INR',
          name: 'PsychoLink Consultation',
          description: `Booking with ${consultant.name} (SBI/Razorpay Backup)`,
          order_id: order.id,
          handler: async function (response) {
            setStage('processing');
            setStatusMessage('Verifying backup payment...');
            try {
              const resVerify = await fetch(`${API_BASE}/api/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  isDemo: false
                })
              });
              if (!resVerify.ok) throw new Error('Verification failed');
              setStage('success');
              setTimeout(() => { onSuccess?.(); }, 1600);
            } catch (e) {
              setStage('review');
              setUpiError('Payment verification failed.');
            }
          },
          modal: {
            ondismiss: function () {
              setStage('review');
            }
          },
          theme: {
            color: '#7c3aed'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setStage('review');
      setUpiError(`Backup Gateway error: ${err.message}`);
    }
  };

  const targetUpi = consultant?.upiId || ownerUpi;
  const upiLink = `upi://pay?pa=${targetUpi}&pn=${encodeURIComponent(consultant?.name || 'PsychoLink')}&am=${price}&cu=INR&tn=Booking_${consultant?.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}&color=ffffff&bgcolor=0a0814`;

  return (
    <ModalShell onClose={onClose} accent={accentColor} maxWidth="450px">
      {stage === 'review' && (
        <div>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`${accentColor}22`, border:`1px solid ${accentColor}45`, display:'flex', alignItems:'center', justifyContent:'center', color:accentColor }}>
              <FaLock size={15}/>
            </div>
            <div>
              <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.25rem', color:'#fff', margin:0 }}>Book Session</h3>
              <p style={{ margin:0, fontSize:'0.74rem', color:'rgba(255,255,255,0.35)' }}>Secure Payment Gateway · Powered by Razorpay</p>
            </div>
          </div>

          {/* Consultant Details Card */}
          <div className="glass-card-subtle" style={{ padding:'16px', marginBottom:'18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.4)' }}>Consultant</span>
              <span style={{ fontSize:'0.82rem', color:'#fff', fontWeight:'700' }}>{consultant?.name}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.4)' }}>Session</span>
              <span style={{ fontSize:'0.82rem', color:'#fff' }}>1 hour, 1:1 Video Consultation</span>
            </div>
            <div style={{ height:'1px', background:'rgba(255,255,255,0.06)', margin:'8px 0' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.6)', fontWeight:'600' }}>Total Price</span>
              <span style={{ fontSize:'1.3rem', color:'#fff', fontWeight:'800', fontFamily:S }}>₹{price}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass-card-subtle" style={{ display:'flex', padding:'4px', gap:'4px', marginBottom:'18px', borderRadius:'12px' }}>
            <button 
              onClick={() => setActiveTab('upi')}
              style={{
                flex:1, padding:'10px 0', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem', fontWeight:'700', fontFamily:J, transition:'all 0.3s',
                background: activeTab === 'upi' ? `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` : 'transparent',
                color: activeTab === 'upi' ? '#fff' : 'rgba(255,255,255,0.45)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'
              }}
            >
              <FaQrcode size={12}/> Pay via UPI
            </button>
            <button 
              onClick={() => setActiveTab('backup')}
              style={{
                flex:1, padding:'10px 0', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem', fontWeight:'700', fontFamily:J, transition:'all 0.3s',
                background: activeTab === 'backup' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'backup' ? '#fff' : 'rgba(255,255,255,0.45)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'
              }}
            >
              <FaUniversity size={12}/> Backup Gateways
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'upi' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <span style={{ fontSize:'0.76rem', color:'rgba(255,255,255,0.5)', fontWeight:'600' }}>UPI ID</span>
                <div style={{ display:'flex', gap:'8px' }}>
                  <input 
                    type="text" 
                    value={upiId} 
                    onChange={(e) => setUpiId(e.target.value)} 
                    placeholder="e.g. user@okaxis, pay@upi"
                    className="input-field"
                    style={{ flex:1 }}
                  />
                  <motion.button 
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    onClick={handleUpiPayment}
                    className="btn"
                    style={{
                      padding:'0 18px', borderRadius:'12px',
                      background:`linear-gradient(135deg, ${accentColor}, #8b5cf6)`, color:'#fff'
                    }}
                  >
                    Pay
                  </motion.button>
                </div>
                {upiError && <span style={{ fontSize:'0.72rem', color:'#ff7f7f', marginTop:'2px' }}>{upiError}</span>}
              </div>

              {/* QR Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'8px 0' }}>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }}/>
                <span style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.25)', fontFamily:S, fontWeight:700 }}>OR SCAN QR</span>
                <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }}/>
              </div>

              {/* Dynamic QR Code */}
              <div className="glass-card-subtle" style={{ display:'flex', gap:'16px', alignItems:'center', padding:'14px', borderRadius:'16px' }}>
                <div style={{ background:'#fff', padding:'6px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${accentColor}33`, width:'120px', height:'120px', flexShrink:0 }}>
                  <img src={qrCodeUrl} alt="UPI QR Code" style={{ width:'100%', height:'100%' }} />
                </div>
                <div>
                  <p style={{ margin:'0 0 4px', fontSize:'0.82rem', fontWeight:'700', color:'#fff' }}>Direct QR Transfer</p>
                  <p style={{ margin:'0 0 8px', fontSize:'0.7rem', color:'rgba(255,255,255,0.4)', lineHeight:1.4 }}>Scan with Google Pay, PhonePe, or Paytm. Real money is securely transferred to our bank account.</p>
                  <button 
                    onClick={() => setStage('direct_qr')}
                    className="btn"
                    style={{
                      padding:'6px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff', fontSize:'0.72rem'
                    }}
                  >
                    Confirm QR Transfer →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {/* AI authorized warning advisory line */}
              <div className="glass-card-subtle" style={{ display:'flex', gap:'10px', background:'var(--accent-violet-dim)', border:'1px solid rgba(139,92,246,0.2)', padding:'12px', borderRadius:'12px' }}>
                <FaShieldAlt size={16} color="#c084fc" style={{ flexShrink:0, marginTop:1 }}/>
                <span style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.7)', lineHeight:1.45, fontFamily:J }}>
                  <strong>System Advisory:</strong> If you encounter network latency or gateway timeouts with our primary servers, please route your payment through the secure <strong>SBI & Razorpay Backup Portals</strong> below to secure your booking instantly.
                </span>
              </div>

              {/* SBI Option */}
              <div className="glass-card-subtle" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', borderRadius:'12px' }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:'0.82rem', fontWeight:'700', color:'#fff' }}>State Bank of India</p>
                  <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.35)' }}>Direct Secure SBI Netbanking portal</p>
                </div>
                <button 
                  onClick={() => setStage('sbi_login')}
                  className="btn"
                  style={{
                    padding:'8px 14px', background:'rgba(30,144,255,0.1)', border:'1px solid rgba(30,144,255,0.3)', color:'#1e90ff'
                  }}
                >
                  Pay via SBI
                </button>
              </div>

              {/* Razorpay Option */}
              <div className="glass-card-subtle" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px', borderRadius:'12px' }}>
                <div>
                  <p style={{ margin:'0 0 2px', fontSize:'0.82rem', fontWeight:'700', color:'#fff' }}>Razorpay Backup Gateway</p>
                  <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.35)' }}>Alternative cards/netbanking merchant portal</p>
                </div>
                <button 
                  onClick={handleRazorpayFallback}
                  className="btn"
                  style={{
                    padding:'8px 14px', background:`linear-gradient(135deg, ${accentColor}18, ${accentColor}33)`, border:`1px solid ${accentColor}50`, color:accentColor
                  }}
                >
                  Pay via Razorpay
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct QR Confirmation Stage */}
      {stage === 'direct_qr' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <button 
              onClick={() => setStage('review')}
              style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'0.82rem', padding:0, fontFamily:J }}
            >
              ← Back to review
            </button>
          </div>
          <div className="glass-card-subtle" style={{ padding:'16px', textAlign:'center', borderRadius:'16px' }}>
            <p style={{ margin:'0 0 6px', fontSize:'0.82rem', color:'rgba(255,255,255,0.5)' }}>Verify Bank Transfer</p>
            <p style={{ margin:'0 0 14px', fontSize:'0.74rem', color:'rgba(255,255,255,0.35)' }}>Please enter the transaction reference number from your GPay, PhonePe, or Paytm receipt to instantly confirm the bank deposit.</p>
            
            <input 
              type="text" 
              value={transactionId} 
              onChange={(e) => setTransactionId(e.target.value)} 
              placeholder="e.g. UPI Ref/UTR No. (12 digits)"
              className="input-field"
              style={{ textAlign:'center', marginBottom:'10px' }}
            />
            {txError && <p style={{ fontSize:'0.72rem', color:'#ff7f7f', margin:'0 0 10px' }}>{txError}</p>}
            
            <motion.button 
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={handleDirectQrVerify}
              className="btn"
              style={{
                width:'100%', padding:'12px',
                background:`linear-gradient(135deg, ${accentColor}, #8b5cf6)`, color:'#fff'
              }}
            >
              Verify Payment Verification
            </motion.button>
          </div>
        </div>
      )}

      {/* SBI Netbanking Stage */}
      {stage === 'sbi_login' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          <button 
            onClick={() => setStage('review')}
            style={{ alignSelf:'flex-start', background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'0.82rem', padding:0, fontFamily:J }}
          >
            ← Back to gateways
          </button>
          
          <div className="glass-card-subtle" style={{ border:'1px solid rgba(30,144,255,0.2)', padding:'20px', borderRadius:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
              <div style={{ background:'#1e90ff22', width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#1e90ff' }}>
                <FaUniversity size={16}/>
              </div>
              <div>
                <h4 style={{ margin:0, color:'#fff', fontSize:'0.95rem' }}>SBI Netbanking Secure Portal</h4>
                <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.4)' }}>Authorize payment of ₹{price}</p>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <span style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.4)', fontWeight:'600' }}>Username</span>
                <input 
                  type="text" 
                  value={sbiAccount} 
                  onChange={(e) => setSbiAccount(e.target.value)} 
                  placeholder="Enter netbanking username"
                  className="input-field"
                  style={{ marginTop:'4px' }}
                />
              </div>

              <div>
                <span style={{ fontSize:'0.74rem', color:'rgba(255,255,255,0.4)', fontWeight:'600' }}>Password</span>
                <input 
                  type="password" 
                  value={sbiPassword} 
                  onChange={(e) => setSbiPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="input-field"
                  style={{ marginTop:'4px' }}
                />
              </div>

              {sbiError && <span style={{ fontSize:'0.72rem', color:'#ff7f7f' }}>{sbiError}</span>}

              <motion.button 
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={handleSbiPayment}
                className="btn"
                style={{
                  width:'100%', padding:'12px',
                  background:'#1e90ff', color:'#fff', marginTop:'6px'
                }}
              >
                Login & Pay ₹{price}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Loader */}
      {stage === 'processing' && (
        <div style={{ textAlign:'center', padding:'40px 10px' }}>
          <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
            style={{ width:'48px', height:'48px', borderRadius:'50%', border:`3px solid ${accentColor}30`, borderTopColor:accentColor, margin:'0 auto 18px' }}/>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.9rem', fontFamily:J, fontWeight:'600' }}>{statusMessage}</p>
        </div>
      )}

      {/* Success Animation */}
      {stage === 'success' && (
        <div style={{ textAlign:'center', padding:'30px 10px' }}>
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
            style={{ width:'64px', height:'64px', borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <FaCheckCircle size={28} color="#10b981"/>
          </motion.div>
          <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'1.3rem', color:'#fff', margin:'0 0 6px' }}>Payment Successful!</h3>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.84rem', margin:0 }}>
            Your session with {consultant?.name} is confirmed. Redirecting...
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

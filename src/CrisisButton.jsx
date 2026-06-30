import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaTimes, FaPhone, FaHeart, FaLeaf } from 'react-icons/fa';

const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";
const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";

const LINES = [
  { name: 'iCall',                  number: '9152987821',    hours: 'Mon–Sat, 8am–10pm', color: '#8b87f5' },
  { name: 'Vandrevala Foundation',  number: '1860-2662-345', hours: '24/7 Free',          color: '#8b87f5' },
  { name: 'NIMHANS',                number: '080-46110007',  hours: 'Mon–Sat, 9am–5pm',  color: '#5eb8ad' },
  { name: 'Snehi NGO',              number: '044-24640050',  hours: '8am–10pm daily',     color: '#c79552' },
];

export default function CrisisButton({ onBreathing, onChatAura }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.div
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 90 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <motion.button
          animate={{ boxShadow: ['0 0 0 0 rgba(204,102,102,0)', '0 0 0 10px rgba(204,102,102,0.15)', '0 0 0 0 rgba(204,102,102,0)'] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          onClick={() => setOpen(true)}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #cc6666, #b91c1c)',
            border: 'none', cursor: 'pointer', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(204,102,102,0.5)',
            fontSize: '1.2rem',
          }}
          title="I need help"
        >
          🆘
        </motion.button>
      </motion.div>

      {/* Crisis modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(4,3,14,0.88)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 480,
                background: 'rgba(10,8,20,0.98)',
                border: '1px solid rgba(204,102,102,0.2)',
                borderRadius: '28px', padding: '28px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(204,102,102,0.1)',
              }}
            >
              {/* Close */}
              <button onClick={() => setOpen(false)}
                style={{ position: 'absolute', top: '18px', right: '18px', width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTimes size={13}/>
              </button>

              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(204,102,102,0.12)', border: '1px solid rgba(204,102,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🆘</div>
                  <h3 style={{ fontFamily: G, fontStyle: 'italic', fontWeight: 600, fontSize: '1.4rem', color: '#fff', margin: 0 }}>You're Not Alone</h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.84rem', fontFamily: J, margin: 0, lineHeight: 1.6 }}>
                  Whatever you're going through right now — it matters. Please reach out to a crisis counselor.
                </p>
              </div>

              {/* Helplines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {LINES.map((l, i) => (
                  <motion.a key={i} href={`tel:${l.number.replace(/-/g,'')}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', borderRadius: '16px',
                      background: `${l.color}0d`, border: `1px solid ${l.color}30`,
                      textDecoration: 'none', gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${l.color}20`, border: `1px solid ${l.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: l.color, flexShrink: 0 }}>
                        <FaPhone size={12}/>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 700, color: '#fff', fontFamily: J }}>{l.name}</p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', fontFamily: S }}>{l.hours}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: l.color, fontFamily: S, flexShrink: 0 }}>{l.number}</span>
                  </motion.a>
                ))}
              </div>

              {/* Quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setOpen(false); onBreathing?.(); }}
                  style={{ padding: '12px', borderRadius: '14px', border: '1px solid rgba(94,184,173,0.3)', background: 'rgba(94,184,173,0.08)', color: '#5eb8ad', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: J, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FaLeaf size={12}/> Breathing Exercise
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setOpen(false); onChatAura?.(); }}
                  style={{ padding: '12px', borderRadius: '14px', border: '1px solid rgba(139,135,245,0.3)', background: 'rgba(139,135,245,0.08)', color: '#8b87f5', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: J, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FaHeart size={12}/> Talk to Aura
                </motion.button>
              </div>

              <p style={{ textAlign: 'center', margin: '16px 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: J }}>
                If you're in immediate danger, please call 112 (Emergency Services)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

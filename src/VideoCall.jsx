import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneSlash, FaSpinner } from 'react-icons/fa';

// ════════════════════════════════════════════════════════════
// VideoCall — in-app video / audio calling via Jitsi Meet.
// Free, no signup, no API key, no backend. Each consultation
// gets a unique private room. audioOnly=true → normal voice call.
// ════════════════════════════════════════════════════════════

const JITSI_DOMAIN = 'meet.jit.si';

function loadJitsiScript() {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) return resolve();
    const existing = document.getElementById('jitsi-api-script');
    if (existing) { existing.addEventListener('load', resolve); return; }
    const s = document.createElement('script');
    s.id = 'jitsi-api-script';
    s.src = `https://${JITSI_DOMAIN}/external_api.js`;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

export default function VideoCall({ roomName, displayName = 'User', audioOnly = false, accent = '#e0524d', onEnd }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadJitsiScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        // sanitise room name (Jitsi rooms: no spaces/special chars)
        const safeRoom = `PsychoLink-${(roomName || 'session').replace(/[^a-zA-Z0-9]/g, '')}`;

        const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
          roomName: safeRoom,
          parentNode: containerRef.current,
          width: '100%',
          height: '100%',
          userInfo: { displayName },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: audioOnly,   // audio-only = camera off
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            toolbarButtons: audioOnly
              ? ['microphone', 'hangup', 'chat', 'tileview', 'settings']
              : ['microphone', 'camera', 'hangup', 'chat', 'tileview', 'desktop', 'settings', 'raisehand'],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#0a0a0c',
            DISABLE_VIDEO_BACKGROUND: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            MOBILE_APP_PROMO: false,
          },
        });

        apiRef.current = api;
        api.addEventListener('videoConferenceJoined', () => { if (!cancelled) setLoading(false); });
        api.addEventListener('readyToClose', () => { onEnd?.(); });
        api.addEventListener('videoConferenceLeft', () => { onEnd?.(); });
      })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });

    return () => {
      cancelled = true;
      try { apiRef.current?.dispose(); } catch {}
    };
  }, [roomName, displayName, audioOnly, onEnd]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0c', display: 'flex', flexDirection: 'column' }}>

      {/* Loading / error overlay */}
      {(loading || error) && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#0a0a0c' }}>
          {!error ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <FaSpinner size={32} color={accent} />
              </motion.div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.9rem' }}>
                {audioOnly ? 'Connecting voice call…' : 'Connecting video call…'}
              </p>
            </>
          ) : (
            <>
              <p style={{ color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1rem', fontWeight: 700 }}>Could not start the call</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '0.82rem' }}>Check your internet & camera/mic permissions.</p>
              <button onClick={onEnd} style={{ marginTop: 8, padding: '10px 22px', borderRadius: 12, border: 'none', background: accent, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Close</button>
            </>
          )}
        </div>
      )}

      {/* Jitsi mounts here */}
      <div ref={containerRef} style={{ flex: 1, width: '100%', height: '100%' }} />

      {/* Fallback end-call button (in case toolbar hidden) */}
      {!loading && !error && (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { try { apiRef.current?.executeCommand('hangup'); } catch {}; onEnd?.(); }}
          style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 3, width: 56, height: 56, borderRadius: '50%', border: 'none', background: '#e0524d', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(224,82,77,0.5)' }}>
          <FaPhoneSlash size={22} />
        </motion.button>
      )}
    </motion.div>
  );
}

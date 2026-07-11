import React from 'react';

/**
 * Premium 3D CSS Robot Avatar — Chunky Solid Design
 * 
 * Built entirely with CSS divs for maximum 3D depth via box-shadows,
 * gradients, and real visual weight. No thin SVG paths.
 * 
 * Aura = pink glow | Max = cyan glow
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#f43f5e',
  isTyping = false,
  className = '',
  style = {}
}) {
  const isAura =
    glowColor.toLowerCase() === '#f43f5e' ||
    glowColor.toLowerCase() === '#fda4af' ||
    glowColor.toLowerCase() === '#e0524d' ||
    glowColor.toLowerCase().includes('rose') ||
    glowColor.toLowerCase().includes('pink');

  // Scale factor for each size
  const scales = { lg: 1, md: 0.72, sm: 0.42, xs: 0.26 };
  const s = scales[size] || scales.md;
  const showBody = size === 'lg' || size === 'md';

  const accent = isAura ? '#f43f5e' : '#38bdf8';
  const glow = isAura ? '#f43f5e' : '#0ea5e9';
  const glowSoft = isAura ? 'rgba(244,63,94,0.3)' : 'rgba(56,189,248,0.3)';
  const glowMed = isAura ? 'rgba(244,63,94,0.5)' : 'rgba(56,189,248,0.5)';

  const u = (v) => `${v * s}px`;

  /* ─── Eye expressions as SVG ─── */
  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <path d="M 18 32 Q 28 18 38 32" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 62 32 Q 72 18 82 32" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sleep':
        return (
          <>
            <line x1="18" y1="28" x2="38" y2="28" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
            <line x1="62" y1="28" x2="82" y2="28" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M 20 20 L 36 36 M 36 20 L 20 36" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 64 20 L 80 36 M 80 20 L 64 36" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            <circle cx="28" cy="28" r="7" fill={accent} />
            <circle cx="72" cy="28" r="7" fill={accent} />
          </>
        );
      case 'wink':
        return (
          <>
            <circle cx="28" cy="28" r="7" fill={accent} />
            <path d="M 62 28 Q 72 18 82 28" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'wink-smile':
        return (
          <>
            <rect x="24" y="16" width="8" height="24" rx="4" fill={accent} />
            <path d="M 82 18 L 64 28 L 82 38" stroke={accent} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            <circle cx="28" cy="26" r="7" fill={accent} />
            <circle cx="72" cy="26" r="7" fill={accent} />
            <line x1="28" y1="35" x2="28" y2="48" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="72" y1="35" x2="72" y2="48" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </>
        );
      case 'neutral':
        return (
          <>
            <rect x="24" y="18" width="8" height="22" rx="4" fill={accent} />
            <rect x="68" y="18" width="8" height="22" rx="4" fill={accent} />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            {/* Signature |< eyes */}
            <rect x="24" y="16" width="8" height="24" rx="4" fill={accent} />
            <path d="M 82 18 L 64 28 L 82 38" stroke={accent} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'neutral':
      case 'sleep':
        return <line x1="42" y1="46" x2="58" y2="46" stroke={accent} strokeWidth="3" strokeLinecap="round" />;
      case 'sad':
      case 'cry':
        return <path d="M 42 50 Q 50 42 58 50" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'dizzy':
        return <circle cx="50" cy="46" r="4" fill={accent} />;
      default:
        return <path d="M 42 44 Q 50 52 58 44" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" />;
    }
  };

  // Common glossy white style
  const glossy = {
    background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 35%, #e2e8f0 65%, #cbd5e1 100%)',
  };

  const waveAnim = expression === 'wink-smile' || expression === 'happy';

  return (
    <div className={`robot-wrap ${className}`} style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      ...style,
    }}>
      <style>{`
        @keyframes rv-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes rv-shake{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-2px) rotate(-1.5deg)}75%{transform:translateY(2px) rotate(1.5deg)}}
        @keyframes rv-wave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-25deg)}}
        @keyframes rv-pulse{0%,100%{opacity:.6;transform:scaleX(1)}50%{opacity:1;transform:scaleX(1.05)}}
      `}</style>

      {/* ═══ HEAD ═══ */}
      <div style={{
        width: u(130), height: u(100),
        borderRadius: `${38*s}px`,
        ...glossy,
        boxShadow: `
          inset ${3*s}px ${3*s}px ${8*s}px rgba(255,255,255,0.95),
          inset ${-4*s}px ${-4*s}px ${10*s}px rgba(0,0,0,0.1),
          0 ${6*s}px ${16*s}px rgba(0,0,0,0.15),
          0 ${2*s}px ${4*s}px rgba(0,0,0,0.08)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        animation: isTyping ? 'rv-shake .45s ease-in-out infinite' : 'rv-bob 3.8s ease-in-out infinite',
      }}>
        {/* Head 3D shine highlight */}
        <div style={{
          position: 'absolute',
          top: u(10), left: u(18),
          width: u(55), height: u(12),
          borderRadius: u(20),
          background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }} />

        {/* ─── Dark Glass Screen ─── */}
        <div style={{
          width: u(108), height: u(78),
          borderRadius: `${28*s}px`,
          background: 'radial-gradient(ellipse at 40% 30%, #1e293b 0%, #0f172a 50%, #020617 100%)',
          boxShadow: `
            inset ${2*s}px ${2*s}px ${6*s}px rgba(0,0,0,0.9),
            inset ${-1*s}px ${-1*s}px ${3*s}px rgba(255,255,255,0.03),
            0 0 ${2*s}px rgba(0,0,0,0.3)
          `,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Screen glass reflection */}
          <div style={{
            position: 'absolute',
            top: u(6), left: u(14),
            width: u(50), height: u(8),
            borderRadius: u(10),
            background: 'linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0))',
            pointerEvents: 'none',
          }} />

          {/* Eyes + Mouth SVG */}
          <svg viewBox="0 0 100 56" style={{
            width: '82%', height: '72%',
            filter: `drop-shadow(0 0 ${4*s}px ${glow}) drop-shadow(0 0 ${10*s}px ${glowSoft})`,
          }}>
            {renderEyes()}
            {renderMouth()}
          </svg>
        </div>
      </div>

      {/* ═══ BODY (lg/md only) ═══ */}
      {showBody && (
        <>
          {/* ─── Neck ─── */}
          <div style={{
            width: u(36), height: u(16),
            marginTop: u(-6),
            borderRadius: `0 0 ${10*s}px ${10*s}px`,
            ...glossy,
            boxShadow: `inset ${1*s}px ${1*s}px ${3*s}px rgba(255,255,255,0.9), 0 ${2*s}px ${4*s}px rgba(0,0,0,0.06)`,
            zIndex: 8,
            position: 'relative',
          }} />

          {/* ─── Torso with Arms ─── */}
          <div style={{
            width: u(110), height: u(95),
            marginTop: u(-6),
            borderRadius: `${30*s}px ${30*s}px ${45*s}px ${45*s}px`,
            ...glossy,
            boxShadow: `
              inset ${4*s}px ${4*s}px ${10*s}px rgba(255,255,255,0.95),
              inset ${-5*s}px ${-5*s}px ${12*s}px rgba(0,0,0,0.1),
              0 ${8*s}px ${20*s}px rgba(0,0,0,0.12),
              0 ${3*s}px ${6*s}px rgba(0,0,0,0.06)
            `,
            position: 'relative',
            zIndex: 7,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: u(14),
          }}>
            {/* Body 3D shine */}
            <div style={{
              position: 'absolute',
              top: u(12), left: u(14),
              width: u(40), height: u(10),
              borderRadius: u(15),
              background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0))',
              pointerEvents: 'none',
            }} />

            {/* ── Chest Display Panel ── */}
            <div style={{
              width: u(46), height: u(22),
              borderRadius: `${5*s}px`,
              background: 'linear-gradient(145deg, #0c0f18 0%, #060810 100%)',
              boxShadow: `
                inset ${1*s}px ${1*s}px ${3*s}px rgba(0,0,0,0.8),
                0 0 ${1*s}px rgba(255,255,255,0.05)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: u(4),
              padding: `0 ${6*s}px`,
            }}>
              {[0.7, 0.4, 0.8, 0.5, 0.6].map((op, i) => (
                <div key={i} style={{
                  width: u(3),
                  height: u(8 + (i % 2) * 5),
                  borderRadius: u(2),
                  background: accent,
                  opacity: op,
                  boxShadow: `0 0 ${3*s}px ${glowSoft}`,
                }} />
              ))}
            </div>

            {/* ── Chest dots ── */}
            <div style={{ display: 'flex', gap: u(5), marginTop: u(10) }}>
              {[0.4, 0.5, 0.4].map((op, i) => (
                <div key={i} style={{
                  width: u(4), height: u(4),
                  borderRadius: '50%',
                  background: '#94a3b8',
                  opacity: op,
                }} />
              ))}
            </div>

            {/* ── Left Arm ── */}
            <div style={{
              position: 'absolute',
              left: u(-18), top: u(12),
              width: u(22), height: u(55),
              borderRadius: `${12*s}px`,
              ...glossy,
              boxShadow: `
                inset ${2*s}px ${2*s}px ${5*s}px rgba(255,255,255,0.9),
                inset ${-2*s}px ${-2*s}px ${5*s}px rgba(0,0,0,0.08),
                ${-2*s}px ${3*s}px ${8*s}px rgba(0,0,0,0.1)
              `,
              transform: 'rotate(8deg)',
              transformOrigin: 'top center',
            }} />

            {/* ── Right Arm ── */}
            <div style={{
              position: 'absolute',
              right: u(-18), top: u(12),
              width: u(22), height: u(55),
              borderRadius: `${12*s}px`,
              ...glossy,
              boxShadow: `
                inset ${2*s}px ${2*s}px ${5*s}px rgba(255,255,255,0.9),
                inset ${-2*s}px ${-2*s}px ${5*s}px rgba(0,0,0,0.08),
                ${2*s}px ${3*s}px ${8*s}px rgba(0,0,0,0.1)
              `,
              transform: waveAnim ? 'rotate(-45deg)' : 'rotate(-8deg)',
              transformOrigin: 'top center',
              animation: waveAnim ? 'rv-wave 1.4s ease-in-out infinite' : 'none',
              transition: 'transform 0.4s ease',
            }} />
          </div>

          {/* ─── Base Platform ─── */}
          <div style={{
            width: u(90), height: u(12),
            marginTop: u(-2),
            borderRadius: `${6*s}px`,
            background: 'linear-gradient(180deg, #e2e8f0, #cbd5e1)',
            boxShadow: `
              inset ${1*s}px ${1*s}px ${3*s}px rgba(255,255,255,0.6),
              0 ${2*s}px ${4*s}px rgba(0,0,0,0.08)
            `,
            position: 'relative',
            zIndex: 6,
          }}>
            {/* ── Ambient Glow Under Base ── */}
            <div style={{
              position: 'absolute',
              bottom: u(-6),
              left: '50%',
              transform: 'translateX(-50%)',
              width: u(70),
              height: u(10),
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${glowMed} 0%, ${glowSoft} 40%, transparent 70%)`,
              animation: 'rv-pulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
          </div>
        </>
      )}
    </div>
  );
}

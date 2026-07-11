import React from 'react';

/**
 * Premium 3D AI Robot Avatar — "Faw" IP Design Style
 * 
 * Large astronaut-helmet head with dark visor, glowing teardrop eyes,
 * small curved smile, glossy white body, stubby rounded arms & legs.
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

  const sizes = {
    lg: { w: 150, h: 160, vb: '0 0 200 220', showBody: true },
    md: { w: 110, h: 118, vb: '0 0 200 220', showBody: true },
    sm: { w: 60,  h: 56,  vb: '15 5 170 110', showBody: false },
    xs: { w: 34,  h: 32,  vb: '15 5 170 110', showBody: false },
  };
  const d = sizes[size] || sizes.md;

  // Theme
  const accent = isAura ? '#f43f5e' : '#38bdf8';
  const accentLight = isAura ? '#fb7185' : '#7dd3fc';
  const glow = isAura ? '#f43f5e' : '#0ea5e9';

  /* ── helpers ─────────────────────────────────────── */

  const Eyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <path d="M 68 62 Q 78 48 88 62" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" className="rv-glow" />
            <path d="M 112 62 Q 122 48 132 62" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" className="rv-glow" />
          </>
        );
      case 'sleep':
        return (
          <>
            <line x1="68" y1="58" x2="88" y2="58" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rv-glow" />
            <line x1="112" y1="58" x2="132" y2="58" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rv-glow" />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M 70 50 L 86 66 M 86 50 L 70 66" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rv-glow" />
            <path d="M 114 50 L 130 66 M 130 50 L 114 66" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rv-glow" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Droopy teardrop eyes */}
            <path d="M 78 48 C 78 48, 68 56, 74 66 C 78 72, 84 68, 82 60 C 81 54, 78 48, 78 48 Z" fill={accent} className="rv-glow" />
            <path d="M 122 48 C 122 48, 112 56, 118 66 C 122 72, 128 68, 126 60 C 125 54, 122 48, 122 48 Z" fill={accent} className="rv-glow" />
          </>
        );
      case 'wink':
      case 'wink-smile':
        return (
          <>
            {/* Left: full teardrop eye */}
            <path d="M 78 46 C 78 46, 66 56, 72 68 C 76 74, 84 70, 84 62 C 84 54, 78 46, 78 46 Z" fill={accent} className="rv-glow" />
            {/* Right: happy arch wink */}
            <path d="M 112 62 Q 122 50 132 62" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" className="rv-glow" />
          </>
        );
      case 'cry':
        return (
          <>
            <path d="M 78 46 C 78 46, 66 56, 72 68 C 76 74, 84 70, 84 62 C 84 54, 78 46, 78 46 Z" fill={accent} className="rv-glow" />
            <path d="M 122 46 C 122 46, 110 56, 116 68 C 120 74, 128 70, 128 62 C 128 54, 122 46, 122 46 Z" fill={accent} className="rv-glow" />
            {/* Tear drops */}
            <path d="M 75 74 Q 76 82 75 90" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 125 74 Q 126 82 125 90" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
          </>
        );
      case 'neutral':
      case 'smile':
      default:
        return (
          <>
            {/* Teardrop-shaped eyes (signature Faw look) */}
            <path d="M 78 46 C 78 46, 66 56, 72 68 C 76 74, 84 70, 84 62 C 84 54, 78 46, 78 46 Z" fill={accent} className="rv-glow" />
            <path d="M 122 46 C 122 46, 110 56, 116 68 C 120 74, 128 70, 128 62 C 128 54, 122 46, 122 46 Z" fill={accent} className="rv-glow" />
          </>
        );
    }
  };

  const Mouth = () => {
    switch (expression) {
      case 'neutral':
      case 'sleep':
        return <line x1="93" y1="82" x2="107" y2="82" stroke={accent} strokeWidth="3.5" strokeLinecap="round" className="rv-glow" />;
      case 'sad':
      case 'cry':
        return <path d="M 92 86 Q 100 78 108 86" stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" className="rv-glow" />;
      case 'dizzy':
        return <circle cx="100" cy="84" r="5" fill={accent} className="rv-glow" />;
      default:
        return <path d="M 92 80 Q 100 90 108 80" stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" className="rv-glow" />;
    }
  };

  return (
    <div
      className={`robot-avatar ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: d.w,
        height: d.h,
        position: 'relative',
        ...style,
      }}
    >
      <style>{`
        @keyframes rv-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes rv-shake{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-1.5px) rotate(-1.2deg)}75%{transform:translateY(1.5px) rotate(1.2deg)}}
        @keyframes rv-wave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-18deg)}}
        .rv-bob{animation:${isTyping ? 'rv-shake .45s ease-in-out infinite' : 'rv-bob 3.8s ease-in-out infinite'}}
        .rv-wave{transform-origin:148px 142px;animation:rv-wave 1.4s ease-in-out infinite}
        .rv-glow{filter:drop-shadow(0 0 3px ${glow}) drop-shadow(0 0 8px ${glow}aa)}
      `}</style>

      <svg viewBox={d.vb} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          {/* Glossy white body gradient */}
          <radialGradient id="rvBody" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Helmet gradient */}
          <radialGradient id="rvHelmet" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#c8cdd5" />
          </radialGradient>

          {/* Visor dark gradient */}
          <radialGradient id="rvVisor" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#070a10" />
          </radialGradient>

          {/* Subtle arm highlight */}
          <linearGradient id="rvArm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>

        {/* ── Body & Limbs (lg / md only) ── */}
        {d.showBody && (
          <g>
            {/* ── Base glow ── */}
            <ellipse cx="100" cy="212" rx="30" ry="4" fill={glow} opacity="0.18" className="rv-glow" />

            {/* ── Left leg ── */}
            <ellipse cx="84" cy="200" rx="12" ry="18" fill="url(#rvBody)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />

            {/* ── Right leg ── */}
            <ellipse cx="116" cy="200" rx="12" ry="18" fill="url(#rvBody)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />

            {/* ── Torso (rounded pear) ── */}
            <path
              d="M 68 130 C 58 140, 54 170, 60 195 C 64 206, 80 210, 100 210 C 120 210, 136 206, 140 195 C 146 170, 142 140, 132 130 Z"
              fill="url(#rvBody)"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="0.5"
            />

            {/* Body 3D shine */}
            <path d="M 72 145 C 72 145, 78 138, 94 136" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />

            {/* ── Left arm ── */}
            <path
              d="M 66 138 C 50 142, 40 158, 44 176 C 48 176, 54 160, 60 148 Z"
              fill="url(#rvArm)"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.5"
            />
            {/* Left hand bulb */}
            <circle cx="43" cy="176" r="7" fill="url(#rvArm)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />

            {/* ── Right arm (waving when wink-smile/happy) ── */}
            {expression === 'wink-smile' || expression === 'happy' ? (
              <g className="rv-wave">
                <path
                  d="M 134 138 C 150 130, 164 116, 168 100 C 164 98, 156 112, 146 130 Z"
                  fill="url(#rvArm)"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="0.5"
                />
                <circle cx="168" cy="100" r="7" fill="url(#rvArm)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </g>
            ) : (
              <>
                <path
                  d="M 134 138 C 150 142, 160 158, 156 176 C 152 176, 146 160, 140 148 Z"
                  fill="url(#rvArm)"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="0.5"
                />
                <circle cx="157" cy="176" r="7" fill="url(#rvArm)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </>
            )}
          </g>
        )}

        {/* ── Head group (bobbing) ── */}
        <g className="rv-bob">
          {/* ── Helmet shell ── */}
          <ellipse
            cx="100" cy="62"
            rx="66" ry="56"
            fill="url(#rvHelmet)"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1"
          />

          {/* Helmet 3D shine highlight */}
          <path
            d="M 52 38 C 60 24, 82 18, 108 20"
            stroke="#ffffff"
            strokeWidth="4"
            fill="none"
            opacity="0.55"
            strokeLinecap="round"
          />

          {/* ── Visor (large dark face screen) ── */}
          <ellipse
            cx="100" cy="64"
            rx="52" ry="44"
            fill="url(#rvVisor)"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="1.5"
          />

          {/* Visor subtle inner edge highlight */}
          <ellipse
            cx="100" cy="64"
            rx="49" ry="41"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />

          {/* ── Eyes ── */}
          <Eyes />

          {/* ── Mouth ── */}
          <Mouth />
        </g>
      </svg>
    </div>
  );
}

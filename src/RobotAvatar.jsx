import React from 'react';

/**
 * Premium 3D Glossy AI Robot Avatar — Baidu Xiaodu Style
 *
 * Glossy rounded-rect head with dark glass screen, |< neon eyes,
 * pear-shaped white ceramic body, streamlined arms, chest display,
 * and glowing neon ambient base light.
 *
 * Aura = pink glow (#f43f5e) | Max = cyan glow (#38bdf8)
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
    lg: { w: 160, h: 200, vb: '0 0 200 260', showBody: true },
    md: { w: 115, h: 144, vb: '0 0 200 260', showBody: true },
    sm: { w: 56,  h: 50,  vb: '25 10 150 100', showBody: false },
    xs: { w: 32,  h: 28,  vb: '25 10 150 100', showBody: false },
  };
  const d = sizes[size] || sizes.md;

  const accent = isAura ? '#f43f5e' : '#38bdf8';
  const accentBright = isAura ? '#fb7185' : '#7dd3fc';
  const glow = isAura ? '#f43f5e' : '#0ea5e9';

  /* ─── Expression Renderers ─── */
  const Eyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <path d="M 72 56 Q 82 42 92 56" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 108 56 Q 118 42 128 56" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sleep':
        return (
          <>
            <line x1="72" y1="52" x2="90" y2="52" stroke={accent} strokeWidth="5" strokeLinecap="round" />
            <line x1="110" y1="52" x2="128" y2="52" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M 74 44 L 88 58 M 88 44 L 74 58" stroke={accent} strokeWidth="5" strokeLinecap="round" />
            <path d="M 112 44 L 126 58 M 126 44 L 112 58" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            <rect x="78" y="42" width="7" height="20" rx="3.5" fill={accent} />
            <rect x="116" y="42" width="7" height="20" rx="3.5" fill={accent} />
          </>
        );
      case 'wink':
        return (
          <>
            <rect x="78" y="40" width="7" height="22" rx="3.5" fill={accent} />
            <path d="M 108 54 Q 118 44 128 54" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        );
      case 'wink-smile':
        return (
          <>
            {/* Signature |< but with wink on right */}
            <rect x="78" y="40" width="7" height="22" rx="3.5" fill={accent} />
            <path d="M 128 42 L 112 52 L 128 62" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            <rect x="78" y="42" width="7" height="20" rx="3.5" fill={accent} />
            <rect x="116" y="42" width="7" height="20" rx="3.5" fill={accent} />
            <line x1="81" y1="64" x2="81" y2="78" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="119" y1="64" x2="119" y2="78" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </>
        );
      case 'neutral':
        return (
          <>
            <rect x="78" y="42" width="7" height="20" rx="3.5" fill={accent} />
            <rect x="116" y="42" width="7" height="20" rx="3.5" fill={accent} />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            {/* Signature eyes: left = vertical bar | , right = arrowhead < */}
            <rect x="78" y="40" width="7" height="22" rx="3.5" fill={accent} />
            <path d="M 128 42 L 112 52 L 128 62" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
    }
  };

  const Mouth = () => {
    switch (expression) {
      case 'neutral':
      case 'sleep':
        return <line x1="93" y1="74" x2="107" y2="74" stroke={accent} strokeWidth="3" strokeLinecap="round" />;
      case 'sad':
      case 'cry':
        return <path d="M 93 78 Q 100 72 107 78" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" />;
      case 'dizzy':
        return <circle cx="100" cy="76" r="4" fill={accent} />;
      default:
        return <path d="M 93 72 Q 100 80 107 72" stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none" />;
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
        ...style,
      }}
    >
      <style>{`
        @keyframes rv-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes rv-shake{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-1.5px) rotate(-1.2deg)}75%{transform:translateY(1.5px) rotate(1.2deg)}}
        @keyframes rv-wave{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-15deg)}}
        @keyframes rv-glow-pulse{0%,100%{opacity:.85}50%{opacity:1}}
        .rv-bob{animation:${isTyping ? 'rv-shake .45s ease-in-out infinite' : 'rv-bob 3.8s ease-in-out infinite'}}
        .rv-wave{transform-origin:155px 150px;animation:rv-wave 1.4s ease-in-out infinite}
        .rv-eye{filter:drop-shadow(0 0 4px ${glow}) drop-shadow(0 0 10px ${glow}aa)}
        .rv-glow-base{animation:rv-glow-pulse 2.5s ease-in-out infinite}
      `}</style>

      <svg viewBox={d.vb} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          {/* ── Glossy white ceramic gradient ── */}
          <linearGradient id="rvCeramic" x1="0" y1="0" x2=".3" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="75%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* ── Head shell gradient ── */}
          <linearGradient id="rvHead" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#f1f5f9" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* ── Dark glass screen gradient ── */}
          <radialGradient id="rvScreen" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* ── Arm gradient ── */}
          <linearGradient id="rvArm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* ── Chrome/metal accent ── */}
          <linearGradient id="rvMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* ── Soft shadow filter ── */}
          <filter id="rvShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.18" />
          </filter>

          {/* ── Glow filter for base ── */}
          <filter id="rvBaseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {/* ═══════════════ BODY (lg/md only) ═══════════════ */}
        {d.showBody && (
          <g filter="url(#rvShadow)">
            {/* ── Ambient base glow ── */}
            <ellipse cx="100" cy="248" rx="38" ry="6" fill={glow} opacity="0.35" filter="url(#rvBaseGlow)" className="rv-glow-base" />
            <ellipse cx="100" cy="248" rx="26" ry="3" fill={glow} opacity="0.55" filter="url(#rvBaseGlow)" className="rv-glow-base" />

            {/* ── Base disc ── */}
            <ellipse cx="100" cy="244" rx="36" ry="8" fill="url(#rvCeramic)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />

            {/* ── Pear-shaped body ── */}
            <path
              d="M 68 135 C 56 148, 52 180, 56 220 C 58 236, 72 244, 100 244 C 128 244, 142 236, 144 220 C 148 180, 144 148, 132 135 Z"
              fill="url(#rvCeramic)"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.5"
            />

            {/* Body 3D shine — left highlight */}
            <path d="M 64 165 C 64 165, 68 148, 88 140" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.7" strokeLinecap="round" />

            {/* Body 3D shine — right subtle */}
            <path d="M 136 165 C 136 165, 132 150, 116 142" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.25" strokeLinecap="round" />

            {/* ── Left arm ── */}
            <path
              d="M 62 148 C 48 154, 40 174, 42 200 C 44 210, 50 212, 52 206 C 54 194, 52 168, 58 156 Z"
              fill="url(#rvArm)"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.5"
            />
            {/* Left arm shine */}
            <path d="M 50 168 C 50 168, 52 160, 56 155" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />

            {/* ── Right arm (waving on wink-smile/happy) ── */}
            {expression === 'wink-smile' || expression === 'happy' ? (
              <g className="rv-wave">
                <path
                  d="M 138 148 C 152 142, 162 124, 164 106 C 162 98, 156 100, 154 108 C 150 126, 144 140, 140 148 Z"
                  fill="url(#rvArm)"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="0.5"
                />
                <path d="M 156 112 C 156 112, 152 118, 148 130" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
              </g>
            ) : (
              <>
                <path
                  d="M 138 148 C 152 154, 160 174, 158 200 C 156 210, 150 212, 148 206 C 146 194, 148 168, 142 156 Z"
                  fill="url(#rvArm)"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="0.5"
                />
                <path d="M 150 168 C 150 168, 148 160, 144 155" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
              </>
            )}

            {/* ── Chest display panel ── */}
            <rect x="82" y="160" width="36" height="22" rx="5" fill="#0c0f18" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            {/* Indicator bars inside chest display */}
            <line x1="90" y1="168" x2="90" y2="176" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <line x1="97" y1="170" x2="97" y2="176" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <line x1="104" y1="168" x2="104" y2="176" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <line x1="111" y1="171" x2="111" y2="176" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

            {/* ── Chest dots below panel ── */}
            <circle cx="94" cy="192" r="2" fill="#94a3b8" opacity="0.5" />
            <circle cx="100" cy="192" r="2" fill="#94a3b8" opacity="0.5" />
            <circle cx="106" cy="192" r="2" fill="#94a3b8" opacity="0.5" />

            {/* ── EQ branding ── */}
            <text x="100" y="218" fontSize="6" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#94a3b8" textAnchor="middle" letterSpacing="1" opacity="0.5">EQ</text>

            {/* ── Neck connector ── */}
            <path d="M 82 130 C 82 136, 88 140, 100 140 C 112 140, 118 136, 118 130" fill="url(#rvCeramic)" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
            {/* Neck ring */}
            <ellipse cx="100" cy="132" rx="18" ry="4" fill="url(#rvMetal)" opacity="0.6" />
          </g>
        )}

        {/* ═══════════════ HEAD (bobbing group) ═══════════════ */}
        <g className="rv-bob" filter={d.showBody ? 'url(#rvShadow)' : 'none'}>
          {/* ── Head shell (rounded rectangle) ── */}
          <rect
            x="32" y="12"
            width="136" height="108"
            rx="40"
            fill="url(#rvHead)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />

          {/* Head 3D highlight — top left shine */}
          <path
            d="M 54 30 C 62 20, 84 16, 112 18"
            stroke="#ffffff"
            strokeWidth="5"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />

          {/* Head 3D highlight — smaller secondary */}
          <path
            d="M 50 50 C 54 42, 64 38, 72 36"
            stroke="#ffffff"
            strokeWidth="2.5"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />

          {/* ── Dark glass screen ── */}
          <rect
            x="40" y="20"
            width="120" height="90"
            rx="32"
            fill="url(#rvScreen)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1.5"
          />

          {/* Screen subtle glass reflection */}
          <path
            d="M 56 34 C 64 28, 88 26, 108 28"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* ── Eyes (with glow) ── */}
          <g className="rv-eye">
            <Eyes />
          </g>

          {/* ── Mouth ── */}
          <g className="rv-eye">
            <Mouth />
          </g>

          {/* ── Bottom bezel / chin highlight ── */}
          <path
            d="M 60 108 C 72 116, 128 116, 140 108"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

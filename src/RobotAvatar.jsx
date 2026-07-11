import React from 'react';

/**
 * Sleek AI Robot Avatar — Baidu Xiaodu Style
 * 
 * Mechanical robotic design: horizontal oval head with dark visor,
 * thin cylindrical neck, glossy white pear-shaped body, flipper arms,
 * chest indicator panel, glowing base ring.
 * 
 * Aura = pink glow screen | Max = cyan glow screen
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
    lg: { w: 150, h: 170, vb: '0 0 200 240', body: true },
    md: { w: 110, h: 125, vb: '0 0 200 240', body: true },
    sm: { w: 60,  h: 52,  vb: '20 8 160 80', body: false },
    xs: { w: 34,  h: 30,  vb: '20 8 160 80', body: false },
  };
  const d = sizes[size] || sizes.md;

  const accent = isAura ? '#f43f5e' : '#38bdf8';
  const glow = isAura ? '#f43f5e' : '#0ea5e9';

  /* ── Eye expressions ── */
  const Eyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <path d="M 70 42 Q 80 30 90 42" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" className="rg" />
            <path d="M 110 42 Q 120 30 130 42" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" className="rg" />
          </>
        );
      case 'sleep':
        return (
          <>
            <line x1="70" y1="38" x2="90" y2="38" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rg" />
            <line x1="110" y1="38" x2="130" y2="38" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rg" />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M 72 30 L 88 46 M 88 30 L 72 46" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rg" />
            <path d="M 112 30 L 128 46 M 128 30 L 112 46" stroke={accent} strokeWidth="5" strokeLinecap="round" className="rg" />
          </>
        );
      case 'sad':
        return (
          <>
            <rect x="76" y="28" width="8" height="20" rx="4" fill={accent} className="rg" />
            <rect x="116" y="28" width="8" height="20" rx="4" fill={accent} className="rg" />
          </>
        );
      case 'wink':
      case 'wink-smile':
        return (
          <>
            {/* Left: vertical bar | */}
            <rect x="76" y="26" width="8" height="22" rx="4" fill={accent} className="rg" />
            {/* Right: arrow < (chevron) */}
            <path d="M 128 28 L 114 40 L 128 52" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" className="rg" />
          </>
        );
      case 'cry':
        return (
          <>
            <rect x="76" y="28" width="8" height="20" rx="4" fill={accent} className="rg" />
            <rect x="116" y="28" width="8" height="20" rx="4" fill={accent} className="rg" />
            <line x1="80" y1="50" x2="80" y2="62" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="120" y1="50" x2="120" y2="62" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </>
        );
      case 'neutral':
      case 'smile':
      default:
        return (
          <>
            {/* Signature digital bar eyes */}
            <rect x="76" y="28" width="8" height="20" rx="4" fill={accent} className="rg" />
            <rect x="116" y="28" width="8" height="20" rx="4" fill={accent} className="rg" />
          </>
        );
    }
  };

  const Mouth = () => {
    switch (expression) {
      case 'neutral':
      case 'sleep':
        return <line x1="92" y1="58" x2="108" y2="58" stroke={accent} strokeWidth="3.5" strokeLinecap="round" className="rg" />;
      case 'sad':
      case 'cry':
        return <path d="M 92 62 Q 100 55 108 62" stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" className="rg" />;
      case 'dizzy':
        return <circle cx="100" cy="60" r="4" fill={accent} className="rg" />;
      default:
        return <path d="M 92 56 Q 100 64 108 56" stroke={accent} strokeWidth="3.5" strokeLinecap="round" fill="none" className="rg" />;
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
        @keyframes rb{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes rs{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-1px) rotate(-.8deg)}75%{transform:translateY(1px) rotate(.8deg)}}
        @keyframes rw{0%,100%{transform:rotate(0)}50%{transform:rotate(-15deg)}}
        .rh{animation:${isTyping ? 'rs .4s ease-in-out infinite' : 'rb 3.6s ease-in-out infinite'}}
        .ra{transform-origin:155px 130px;animation:rw 1.3s ease-in-out infinite}
        .rg{filter:drop-shadow(0 0 3px ${glow}) drop-shadow(0 0 8px ${glow}aa)}
      `}</style>

      <svg viewBox={d.vb} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          {/* Glossy white gradient */}
          <radialGradient id="gw" cx="38%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#b8c0cc" />
          </radialGradient>

          {/* Dark visor */}
          <radialGradient id="dv" cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1a1f2e" />
            <stop offset="100%" stopColor="#060810" />
          </radialGradient>

          {/* Arm gradient */}
          <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c4cad4" />
          </linearGradient>

          {/* Neck metallic */}
          <linearGradient id="nk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#f9fafb" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
        </defs>

        {/* ═══ BODY (lg/md only) ═══ */}
        {d.body && (
          <g>
            {/* Glowing base ring */}
            <ellipse cx="100" cy="228" rx="34" ry="6" fill={glow} opacity="0.15" className="rg" />
            <ellipse cx="100" cy="228" rx="28" ry="4" fill={glow} opacity="0.25" className="rg" />

            {/* Pear-shaped torso */}
            <path
              d="M 72 120 C 56 128, 50 155, 52 195 C 54 215, 68 228, 100 228 C 132 228, 146 215, 148 195 C 150 155, 144 128, 128 120 Z"
              fill="url(#gw)"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="0.6"
            />

            {/* Body 3D highlight */}
            <path d="M 64 140 C 68 132, 82 126, 98 124" stroke="#fff" strokeWidth="3.5" fill="none" opacity="0.5" strokeLinecap="round" />

            {/* Chest indicator panel */}
            <rect x="82" y="148" width="36" height="22" rx="5" fill="#0c0e14" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            {/* Three horizontal bars inside chest panel */}
            <line x1="88" y1="155" x2="112" y2="155" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" className="rg" />
            <line x1="88" y1="160" x2="106" y2="160" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" className="rg" />
            <line x1="88" y1="165" x2="100" y2="165" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" className="rg" />

            {/* EQ brand text */}
            <text x="100" y="190" fontSize="7" fontWeight="700" fontFamily="sans-serif" fill="#94a3b8" textAnchor="middle" opacity="0.5">EQ</text>

            {/* Two small dots below panel */}
            <circle cx="94" cy="200" r="2" fill="#9ca3af" opacity="0.5" />
            <circle cx="106" cy="200" r="2" fill="#9ca3af" opacity="0.5" />

            {/* Left flipper arm */}
            <path
              d="M 62 128 C 48 134, 40 152, 42 178 C 46 182, 52 164, 56 142 Z"
              fill="url(#ag)"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.5"
            />
            <ellipse cx="42" cy="180" rx="7" ry="6" fill="url(#ag)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />

            {/* Right flipper arm */}
            {expression === 'wink-smile' || expression === 'happy' ? (
              <g className="ra">
                <path
                  d="M 138 128 C 152 122, 164 108, 166 90 C 162 88, 154 104, 146 124 Z"
                  fill="url(#ag)"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="0.5"
                />
                <ellipse cx="166" cy="89" rx="7" ry="6" fill="url(#ag)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </g>
            ) : (
              <>
                <path
                  d="M 138 128 C 152 134, 160 152, 158 178 C 154 182, 148 164, 144 142 Z"
                  fill="url(#ag)"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="0.5"
                />
                <ellipse cx="158" cy="180" rx="7" ry="6" fill="url(#ag)" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
              </>
            )}
          </g>
        )}

        {/* ═══ NECK ═══ */}
        {d.body && (
          <g>
            {/* Cylindrical neck */}
            <rect x="88" y="82" width="24" height="40" rx="8" fill="url(#nk)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            {/* Neck ring detail */}
            <rect x="84" y="84" width="32" height="6" rx="3" fill="url(#nk)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          </g>
        )}

        {/* ═══ HEAD (bobbing) ═══ */}
        <g className="rh">
          {/* Head shell — horizontal oval, wider than tall, flat bottom */}
          <path
            d="M 30 44 C 30 14, 52 4, 100 4 C 148 4, 170 14, 170 44 C 170 62, 156 82, 130 86 L 70 86 C 44 82, 30 62, 30 44 Z"
            fill="url(#gw)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="0.8"
          />

          {/* Head 3D shine */}
          <path d="M 50 24 C 58 14, 78 8, 110 8" stroke="#fff" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round" />

          {/* Bottom chin ridge */}
          <path d="M 70 84 Q 100 90 130 84" stroke="rgba(0,0,0,0.06)" strokeWidth="1" fill="none" />

          {/* Dark visor screen */}
          <path
            d="M 40 42 C 40 18, 58 10, 100 10 C 142 10, 160 18, 160 42 C 160 58, 148 74, 126 78 L 74 78 C 52 74, 40 58, 40 42 Z"
            fill="url(#dv)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1.2"
          />

          {/* Visor subtle inner edge */}
          <path
            d="M 44 42 C 44 22, 60 14, 100 14 C 140 14, 156 22, 156 42 C 156 56, 146 70, 124 74 L 76 74 C 54 70, 44 56, 44 42 Z"
            fill="none"
            stroke="rgba(255,255,255,0.03)"
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

import React from 'react';

/**
 * 3D Claymorphism AI Robot Avatar (Sleek Baidu Xiaodu Robot Style)
 * Glossy white/grey pear-shaped body, CRT rounded bezel head, flipper arms,
 * glowing underglow base, and digital yellow/pink/blue screen expressions.
 */
export default function RobotAvatar({
  expression = 'smile', // neutral, wink, smile, wink-smile, happy, sleep, dizzy, sad, cry
  size = 'md',          // lg, md, sm, xs
  glowColor = '#f43f5e', // Aura (pink) or Max (teal) or custom
  isTyping = false,
  className = '',
  style = {}
}) {
  // Determine if Aura character (pink theme) or Max character (cyan/blue theme)
  const isAura = 
    glowColor.toLowerCase() === '#f43f5e' || 
    glowColor.toLowerCase() === '#fda4af' || 
    glowColor.toLowerCase() === '#e0524d' ||
    glowColor.toLowerCase().includes('rose') ||
    glowColor.toLowerCase().includes('pink');

  // Dimension mapping for the responsive container
  const sizes = {
    lg: { width: 140, height: 140, showBody: true, viewBox: '10 5 100 115' },
    md: { width: 100, height: 100, showBody: true, viewBox: '10 5 100 115' },
    sm: { width: 64,  height: 64,  showBody: false, viewBox: '20 8 80 58' },
    xs: { width: 36,  height: 36,  showBody: false, viewBox: '20 8 80 58' }
  };

  const dim = sizes[size] || sizes.md;

  // Theme colors based on Aura/Max profile
  const accentColor = isAura ? '#f43f5e' : '#00d2ff';
  const glowHex = isAura ? '#f43f5e' : '#06b6d4';

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy arch eyes ^ ^ */}
            <path d="M 38 34 Q 45 25 52 34" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
            <path d="M 68 34 Q 75 25 82 34" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Sleeping flat line eyes */}
            <line x1="38" y1="32" x2="48" y2="32" stroke={accentColor} strokeWidth="5" strokeLinecap="round" className="mascot-screen-glow" />
            <line x1="72" y1="32" x2="82" y2="32" stroke={accentColor} strokeWidth="5" strokeLinecap="round" className="mascot-screen-glow" />
          </>
        );
      case 'dizzy':
        return (
          <>
            {/* X X eyes */}
            <path d="M 39 26 L 49 38 M 49 26 L 39 38" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" className="mascot-screen-glow" />
            <path d="M 71 26 L 81 38 M 81 26 L 71 38" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" className="mascot-screen-glow" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downward arch eyes */}
            <path d="M 38 34 Q 45 26 52 34" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
            <path d="M 68 34 Q 75 26 82 34" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
          </>
        );
      case 'wink':
      case 'wink-smile':
        return (
          <>
            {/* Signature Xiaodu Wink: left eye is vertical bar |, right eye is arrowhead < */}
            <rect x="42" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
            <path d="M 78 26 L 68 33 L 78 40" stroke={accentColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" className="mascot-screen-glow" />
          </>
        );
      case 'cry':
        return (
          <>
            {/* Crying eyes (circles + drops) */}
            <rect x="42" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
            <rect x="72" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
            <path d="M 45 42 L 45 52" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            <path d="M 75 42 L 75 52" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'neutral':
        return (
          <>
            {/* Double vertical bars */}
            <rect x="42" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
            <rect x="72" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            {/* Double vertical bars with a smile mouth */}
            <rect x="42" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
            <rect x="72" y="24" width="6" height="18" rx="3" fill={accentColor} className="mascot-screen-glow" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'neutral':
      case 'sleep':
        return (
          // Tiny neutral horizontal line
          <line x1="56" y1="46" x2="64" y2="46" stroke={accentColor} strokeWidth="3" strokeLinecap="round" className="mascot-screen-glow" />
        );
      case 'sad':
      case 'cry':
        return (
          // Tiny sad downward curve
          <path d="M 56 48 Q 60 44 64 48" stroke={accentColor} strokeWidth="3" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
        );
      case 'happy':
      case 'smile':
      case 'wink':
      case 'wink-smile':
      default:
        return (
          // Tiny happy upward smile
          <path d="M 56 45 Q 60 49 64 45" stroke={accentColor} strokeWidth="3" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
        );
    }
  };

  return (
    <div 
      className={`mascot-avatar-container ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: `${dim.width}px`, 
        height: `${dim.height}px`,
        position: 'relative', 
        ...style 
      }}
    >
      <style>{`
        @keyframes mascot-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes mascot-shake {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-1.2px) rotate(-1deg); }
          75% { transform: translateY(1.2px) rotate(1deg); }
        }
        @keyframes mascot-arm-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg); }
        }
        .mascot-head-group {
          transform-origin: 60px 58px;
          animation: ${isTyping ? 'mascot-shake 0.5s ease-in-out infinite' : 'mascot-bob 4s ease-in-out infinite'};
        }
        .mascot-waving-arm {
          transform-origin: 88px 72px;
          animation: mascot-arm-wave 1.6s ease-in-out infinite;
        }
        .mascot-screen-glow {
          filter: drop-shadow(0 0 2.5px ${glowHex}) drop-shadow(0 0 7px ${glowHex}cc);
        }
      `}</style>

      <svg 
        viewBox={dim.viewBox} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block',
          overflow: 'visible' 
        }}
      >
        <defs>
          {/* Glossy White/Grey Body & Head Gradient */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>

          {/* Dark face screen gradient */}
          <linearGradient id="screenBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1b22" />
            <stop offset="100%" stopColor="#08090c" />
          </linearGradient>

          {/* Silver metallic accents */}
          <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>

        {/* 1. Body & Arms - Only for lg and md */}
        {dim.showBody && (
          <g>
            {/* Glowing Base Underglow */}
            <ellipse cx="60" cy="116" rx="22" ry="2.5" fill={accentColor} opacity="0.3" className="mascot-screen-glow" />

            {/* Neck Collar */}
            <path d="M 46 60 Q 60 62 74 60 L 70 68 L 50 68 Z" fill="url(#bodyGrad)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            
            {/* Torso (Pear Shape Body) */}
            <path 
              d="M 50 66 C 36 66, 32 80, 32 108 C 32 118, 40 118, 60 118 C 80 118, 88 118, 88 108 C 88 80, 84 66, 70 66 Z" 
              fill="url(#bodyGrad)" 
              stroke="rgba(0,0,0,0.08)" 
              strokeWidth="0.5" 
            />

            {/* Torso 3D claymorphic reflection shadow */}
            <path d="M 36 100 C 36 80, 42 70, 56 68" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.55" strokeLinecap="round" />

            {/* Flipper Left Arm */}
            <path d="M 33 72 C 27 76, 25 88, 27 106 C 29 106, 33 90, 36 78 Z" fill="url(#bodyGrad)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            
            {/* Flipper Right Arm (Waving or Default) */}
            {expression === 'wink-smile' ? (
              <g className="mascot-waving-arm">
                <path d="M 87 72 C 95 68, 102 58, 100 48 C 96 48, 92 60, 87 72 Z" fill="url(#bodyGrad)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
              </g>
            ) : (
              <path d="M 87 72 C 93 76, 95 88, 93 106 C 91 106, 87 90, 84 78 Z" fill="url(#bodyGrad)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            )}

            {/* Upper Chest Indicator Screen */}
            <rect x="47" y="74" width="26" height="18" rx="4" fill="#0f1015" stroke="url(#metalGrad)" strokeWidth="0.75" />
            
            {/* Three small glowing vertical bars inside chest panel */}
            <line x1="53" y1="80" x2="53" y2="86" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" className="mascot-screen-glow" />
            <line x1="60" y1="80" x2="60" y2="86" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" className="mascot-screen-glow" />
            <line x1="67" y1="80" x2="67" y2="86" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" className="mascot-screen-glow" />

            {/* Custom EQ lettering at body base */}
            <text x="60" y="110" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif" fill="#94a3b8" textAnchor="middle" opacity="0.7">EQ.fi</text>
            <rect x="42" y="113" width="36" height="1.2" fill="url(#metalGrad)" />
          </g>
        )}

        {/* 2. Mascot Head & Screen Elements (Bobbing Group) */}
        <g className="mascot-head-group">
          {/* Rounded Squircle Head (CRT Bezel) */}
          <rect 
            x="25" 
            y="10" 
            width="70" 
            height="52" 
            rx="20" 
            fill="url(#bodyGrad)" 
            stroke="rgba(255, 255, 255, 0.95)" 
            strokeWidth="0.75" 
          />

          {/* 3D Highlight reflection on Head top-left */}
          <path 
            d="M 33 22 C 38 16, 50 16, 58 16" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            fill="none" 
            opacity="0.5" 
            strokeLinecap="round" 
          />

          {/* Dark Glass Screen */}
          <rect 
            x="29" 
            y="14" 
            width="62" 
            height="44" 
            rx="15" 
            fill="url(#screenBg)" 
            stroke="rgba(0,0,0,0.3)" 
            strokeWidth="1.5" 
          />

          {/* Screen Grid Details (Mesh effect / screen borders) */}
          <rect 
            x="31.5" 
            y="16.5" 
            width="57" 
            height="39" 
            rx="12.5" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.02)" 
            strokeWidth="1" 
          />

          {/* Eyes and Mouth Elements */}
          <g>
            {renderEyes()}
            {renderMouth()}
          </g>
        </g>
      </svg>
    </div>
  );
}

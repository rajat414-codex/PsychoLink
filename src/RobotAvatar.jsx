import React from 'react';

/**
 * 3D Claymorphism AI Astronaut Mascot Avatar
 * Inspired by high-fidelity 3D mascot aesthetics (Oppo Space Mascot)
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
    lg: { width: 140, height: 140, showBody: true, viewBox: '10 8 100 112' },
    md: { width: 100, height: 100, showBody: true, viewBox: '10 8 100 112' },
    sm: { width: 64,  height: 64,  showBody: false, viewBox: '10 8 100 86' },
    xs: { width: 36,  height: 36,  showBody: false, viewBox: '10 8 100 86' }
  };

  const dim = sizes[size] || sizes.md;

  // Theme colors based on Aura/Max profile
  const accentColor = isAura ? '#f43f5e' : '#14b8a6';
  const foreheadGemColor = isAura ? '#fca5a5' : '#5eead4';
  const glowHex = isAura ? '#f43f5e' : '#06b6d4';

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy arch eyes ^ ^ */}
            <path d="M 38 52 Q 45 42 52 52" stroke="#1c1e24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 68 52 Q 75 42 82 52" stroke="#1c1e24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Sleeping straight line eyes */}
            <line x1="39" y1="50" x2="49" y2="50" stroke="#1c1e24" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="71" y1="50" x2="81" y2="50" stroke="#1c1e24" strokeWidth="4.5" strokeLinecap="round" />
          </>
        );
      case 'dizzy':
        return (
          <>
            {/* X X eyes */}
            <path d="M 40 46 L 48 54 M 48 46 L 40 54" stroke="#1c1e24" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 72 46 L 80 54 M 80 46 L 72 54" stroke="#1c1e24" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad tilted vertical pill eyes */}
            <rect x="42" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" transform="rotate(10, 45.5, 51)" />
            <rect x="71" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" transform="rotate(-10, 74.5, 51)" />
          </>
        );
      case 'wink':
      case 'wink-smile':
        return (
          <>
            {/* Left eye vertical pill, right eye winking curve */}
            <rect x="43" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" />
            <path d="M 70 51 Q 75 56 80 51" stroke="#1c1e24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            {/* Crying eyes (vertical pills + blue teardrops) */}
            <rect x="43" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" />
            <rect x="70" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" />
            <path d="M 46.5 58 L 46.5 70" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 73.5 58 L 73.5 70" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'neutral':
      case 'smile':
      default:
        return (
          <>
            {/* Cute vertical pill eyes */}
            <rect x="43" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" />
            <rect x="70" y="44" width="7" height="14" rx="3.5" fill="#1c1e24" />
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
          <line x1="57" y1="65" x2="63" y2="65" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        );
      case 'sad':
      case 'cry':
        return (
          // Tiny sad downward curve
          <path d="M 56 67 Q 60 64 64 67" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        );
      case 'happy':
      case 'smile':
      case 'wink':
      case 'wink-smile':
      default:
        return (
          // Tiny happy upward smile
          <path d="M 56 64 Q 60 67.5 64 64" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        );
    }
  };

  // Determine gradients to map dynamically
  const headGrad = isAura ? 'url(#auraHeadGrad)' : 'url(#maxHeadGrad)';
  const earGrad = isAura ? 'url(#auraEarGrad)' : 'url(#maxEarGrad)';

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
        filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.16)) drop-shadow(0 0 12px ${glowHex}22)`,
        ...style 
      }}
    >
      <style>{`
        @keyframes mascot-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3.5px); }
        }
        @keyframes mascot-shake {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(-0.8deg); }
          75% { transform: translateY(1px) rotate(0.8deg); }
        }
        @keyframes mascot-arm-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        .mascot-head-group {
          transform-origin: 60px 80px;
          animation: ${isTyping ? 'mascot-shake 0.5s ease-in-out infinite' : 'mascot-bob 4s ease-in-out infinite'};
        }
        .mascot-waving-arm {
          transform-origin: 88px 94px;
          animation: mascot-arm-wave 1.6s ease-in-out infinite;
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
          {/* Aura Head Gradient: White and Light Pink */}
          <linearGradient id="auraHeadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fff2f5" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>

          {/* Max Head Gradient: White and Light Cyan/Blue */}
          <linearGradient id="maxHeadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f0fdff" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Suit Torso Gradient */}
          <linearGradient id="suitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          {/* Metal Gradients for Straps & Rings */}
          <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Aura Ears Gradient */}
          <linearGradient id="auraEarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>

          {/* Max Ears Gradient */}
          <linearGradient id="maxEarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Forehead Gem Gradient */}
          <linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={foreheadGemColor} />
          </linearGradient>
        </defs>

        {/* 1. Neck and Body (torso representation) - Only for lg and md */}
        {dim.showBody && (
          <g>
            {/* Neck Collar */}
            <ellipse cx="60" cy="94" rx="18" ry="4.5" fill="url(#metalGrad)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
            
            {/* Suit Torso */}
            <path 
              d="M 37 94 C 37 94, 30 100, 30 120 L 90 120 C 90 100, 83 94, 83 94 Z" 
              fill="url(#suitGrad)" 
              stroke="rgba(0,0,0,0.05)" 
              strokeWidth="0.5" 
            />

            {/* Silver shoulder straps */}
            <path d="M 37 94 C 39 101, 44 105, 49 105" stroke="url(#metalGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 83 94 C 81 101, 76 105, 71 105" stroke="url(#metalGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Left Arm */}
            <path d="M 33 94 C 26 99, 24 110, 28 120" stroke="url(#suitGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
            
            {/* Right Arm (Waving or Default) */}
            {expression === 'wink-smile' ? (
              <g className="mascot-waving-arm">
                <path d="M 87 94 C 95 91, 102 81, 100 70" stroke="url(#suitGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <path d="M 87 94 C 94 99, 96 110, 92 120" stroke="url(#suitGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
            )}

            {/* Chest Center Panel */}
            <rect x="49" y="99" width="22" height="19" rx="3" fill="rgba(255,255,255,0.4)" stroke="url(#metalGrad)" strokeWidth="0.8" />
            {/* EQ logo instead of Oppo to make it custom */}
            <text x="60" y="111" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif" fill={accentColor} textAnchor="middle" letterSpacing="0.4">EQ</text>

            {/* Belt strap */}
            <rect x="40" y="115" width="40" height="3" rx="1.5" fill="url(#metalGrad)" />
            <circle cx="46" cy="116.5" r="1" fill={accentColor} />
            <circle cx="74" cy="116.5" r="1" fill={accentColor} />
            <rect x="50" y="115.5" width="20" height="2" rx="1" fill={accentColor} />
          </g>
        )}

        {/* 2. Mascot Head & Face elements (Bobbing Group) */}
        <g className="mascot-head-group">
          {/* Side Bulbous Ears */}
          <ellipse cx="17" cy="52" rx="6.5" ry="9" fill={earGrad} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          <ellipse cx="103" cy="52" rx="6.5" ry="9" fill={earGrad} stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />

          {/* Main Teardrop Head Shape */}
          <path 
            d="M 60 12 C 73 12, 100 28, 100 52 C 100 74, 82 92, 60 92 C 38 92, 20 74, 20 52 C 20 28, 47 12, 60 12 Z" 
            fill={headGrad} 
            stroke="rgba(255, 255, 255, 0.9)" 
            strokeWidth="0.75" 
          />

          {/* 3D Highlight Curve on Head */}
          <path 
            d="M 30 52 C 30 35, 45 22, 60 22" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            fill="none" 
            opacity="0.5" 
            strokeLinecap="round" 
          />

          {/* Forehead Diamond Gem */}
          <polygon points="60,25 62,28 60,31 58,28" fill="url(#gemGrad)" opacity="0.85" />
          <circle cx="59.6" cy="27" r="0.5" fill="#ffffff" opacity="0.9" />

          {/* Eyes and Mouth */}
          <g>
            {renderEyes()}
            {renderMouth()}
          </g>
        </g>
      </svg>
    </div>
  );
}

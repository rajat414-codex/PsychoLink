import React from 'react';

/**
 * 3D Claymorphism AI CRT-Monitor Robot Avatar
 * Matches Yoo Family | RuiBo mascot design exactly:
 * Dark slate charcoal body/head, tiny top antennae pegs, capsule side pods,
 * and a dark screen showing bright glowing yellow/amber expressions.
 */
export default function RobotAvatar({
  expression = 'smile', // neutral, wink, smile, wink-smile, happy, sleep, dizzy, sad, cry
  size = 'md',          // lg, md, sm, xs
  glowColor = '#f43f5e', 
  isTyping = false,
  className = '',
  style = {}
}) {
  // Dimension mapping for the responsive container
  const sizes = {
    lg: { width: 140, height: 140, showBody: true, viewBox: '5 5 110 115' },
    md: { width: 100, height: 100, showBody: true, viewBox: '5 5 110 115' },
    sm: { width: 64,  height: 64,  showBody: false, viewBox: '5 5 110 88' },
    xs: { width: 36,  height: 36,  showBody: false, viewBox: '5 5 110 88' }
  };

  const dim = sizes[size] || sizes.md;

  // Exact RuiBo yellow/amber glow color for screen elements
  const accentColor = '#ffb900'; 
  const glowHex = '#ffaa00';

  // Uniform premium dark slate charcoal colors for both characters
  const headGrad = 'linear-gradient(135deg, #474f5d 0%, #2f3540 50%, #1c1f26 100%)';
  const earGrad = 'linear-gradient(135deg, #3f4652, #1e2229)';
  const bodyGrad = 'linear-gradient(135deg, #3f4652 0%, #252a33 60%, #171a21 100%)';

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy arch eyes ^ ^ */}
            <path d="M 35 48 Q 43 38 51 48" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
            <path d="M 69 48 Q 77 38 85 48" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Sleeping flat line eyes */}
            <line x1="36" y1="46" x2="48" y2="46" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" className="mascot-screen-glow" />
            <line x1="72" y1="46" x2="84" y2="46" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" className="mascot-screen-glow" />
          </>
        );
      case 'dizzy':
        return (
          <>
            {/* X X eyes */}
            <path d="M 37 40 L 49 52 M 49 40 L 37 52" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" className="mascot-screen-glow" />
            <path d="M 71 40 L 83 52 M 83 40 L 71 52" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" className="mascot-screen-glow" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downward arch eyes */}
            <path d="M 35 48 Q 43 39 51 48" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
            <path d="M 69 48 Q 77 39 85 48" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
          </>
        );
      case 'wink':
      case 'wink-smile':
        return (
          <>
            {/* Left eye circle, right eye winking curve */}
            <circle cx="43" cy="46" r="7.5" fill={accentColor} className="mascot-screen-glow" />
            <path d="M 69 46 Q 77 52 85 46" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" className="mascot-screen-glow" />
          </>
        );
      case 'cry':
        return (
          <>
            {/* Crying eyes (circles + drops) */}
            <circle cx="43" cy="46" r="7.5" fill={accentColor} className="mascot-screen-glow" />
            <circle cx="77" cy="46" r="7.5" fill={accentColor} className="mascot-screen-glow" />
            <path d="M 43 54 L 43 68" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 77 54 L 77 68" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
      case 'neutral':
      case 'smile':
      default:
        return (
          <>
            {/* Cute large round eyes */}
            <circle cx="43" cy="46" r="7.5" fill={accentColor} className="mascot-screen-glow" />
            <circle cx="77" cy="46" r="7.5" fill={accentColor} className="mascot-screen-glow" />
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
          <line x1="54" y1="65" x2="66" y2="65" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" className="mascot-screen-glow" />
        );
      case 'sad':
      case 'cry':
        return (
          // Solid downward crescent mouth
          <path d="M 50 69 Q 60 58 70 69 Z" fill={accentColor} className="mascot-screen-glow" />
        );
      case 'happy':
      case 'smile':
      case 'wink':
      case 'wink-smile':
      default:
        return (
          // Solid crescent smiling mouth
          <path d="M 50 61 Q 60 72 70 61 Z" fill={accentColor} className="mascot-screen-glow" />
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
        filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.22)) drop-shadow(0 0 10px ${glowHex}1a)`,
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
          50% { transform: rotate(-12deg); }
        }
        .mascot-head-group {
          transform-origin: 60px 80px;
          animation: ${isTyping ? 'mascot-shake 0.5s ease-in-out infinite' : 'mascot-bob 4s ease-in-out infinite'};
        }
        .mascot-waving-arm {
          transform-origin: 88px 90px;
          animation: mascot-arm-wave 1.6s ease-in-out infinite;
        }
        .mascot-screen-glow {
          filter: drop-shadow(0 0 3px ${glowHex}) drop-shadow(0 0 8px ${glowHex}dd);
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
          {/* Main Head Gradient: Slate Charcoal Grey */}
          <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4a5363" />
            <stop offset="45%" stopColor="#2c323d" />
            <stop offset="100%" stopColor="#15181e" />
          </linearGradient>

          {/* Torso Gradient */}
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d4452" />
            <stop offset="60%" stopColor="#222730" />
            <stop offset="100%" stopColor="#12151a" />
          </linearGradient>

          {/* Screen background gradient */}
          <linearGradient id="screenBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c1e24" />
            <stop offset="100%" stopColor="#08090b" />
          </linearGradient>

          {/* Metal accent elements */}
          <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Ears Gradient */}
          <linearGradient id="earGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#444b58" />
            <stop offset="100%" stopColor="#1a1c22" />
          </linearGradient>
        </defs>

        {/* 1. Body & Arms - Only for lg and md */}
        {dim.showBody && (
          <g>
            {/* Neck Collar */}
            <rect x="46" y="80" width="28" height="8" rx="4" fill="url(#metalGrad)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            
            {/* Torso */}
            <path 
              d="M 38 88 C 38 88, 30 94, 30 118 L 90 118 C 90 94, 82 88, 82 88 Z" 
              fill="url(#bodyGrad)" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="0.5" 
            />

            {/* Left Arm */}
            <path d="M 33 88 C 24 92, 20 104, 26 118" stroke="url(#bodyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            
            {/* Right Arm (Waving or Default) */}
            {expression === 'wink-smile' ? (
              <g className="mascot-waving-arm">
                <path d="M 87 88 C 95 84, 102 74, 100 64" stroke="url(#bodyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <path d="M 87 88 C 94 92, 98 104, 92 118" stroke="url(#bodyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            )}

            {/* Chest detailing (RuiBo-style solid buttons) */}
            <circle cx="48" cy="98" r="2.5" fill="url(#metalGrad)" />
            <circle cx="72" cy="98" r="2.5" fill="url(#metalGrad)" />
            <rect x="53" y="106" width="14" height="3" rx="1.5" fill="url(#metalGrad)" />
          </g>
        )}

        {/* 2. Mascot Head & Screen Elements (Bobbing Group) */}
        <g className="mascot-head-group">
          {/* Top Knobs / Pegs (Antennae) */}
          <ellipse cx="36" cy="14" rx="3.5" ry="5.5" transform="rotate(-15, 36, 14)" fill="url(#earGrad)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <circle cx="34.5" cy="10" r="1.5" fill={accentColor} className="mascot-screen-glow" />

          <ellipse cx="84" cy="14" rx="3.5" ry="5.5" transform="rotate(15, 84, 14)" fill="url(#earGrad)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <circle cx="85.5" cy="10" r="1.5" fill={accentColor} className="mascot-screen-glow" />

          {/* Side Capsule Pods / Ears */}
          <rect x="9" y="44" width="6.5" height="17" rx="3.25" fill="url(#earGrad)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <circle cx="12" cy="52.5" r="2.5" fill="url(#metalGrad)" />

          <rect x="104.5" y="44" width="6.5" height="17" rx="3.25" fill="url(#earGrad)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          <circle cx="108" cy="52.5" r="2.5" fill="url(#metalGrad)" />

          {/* Rounded Squircle Head (CRT Monitor Shape) */}
          <rect 
            x="15" 
            y="15" 
            width="90" 
            height="70" 
            rx="25" 
            ry="23" 
            fill="url(#headGrad)" 
            stroke="rgba(255, 255, 255, 0.08)" 
            strokeWidth="0.75" 
          />

          {/* 3D Highlight reflection on Head top-left */}
          <path 
            d="M 28 28 C 34 21, 48 21, 56 21" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            fill="none" 
            opacity="0.25" 
            strokeLinecap="round" 
          />

          {/* Face Screen Frame (Monitor Bezel shadow) */}
          <rect 
            x="22" 
            y="21" 
            width="76" 
            height="58" 
            rx="18" 
            fill="url(#screenBg)" 
            stroke="rgba(0,0,0,0.4)" 
            strokeWidth="1.5" 
          />

          {/* Screen Grid Details (Mesh effect / screen borders) */}
          <rect 
            x="24.5" 
            y="23.5" 
            width="71" 
            height="53" 
            rx="15" 
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

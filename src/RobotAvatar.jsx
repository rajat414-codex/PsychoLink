import React from 'react';

/**
 * 3D Claymorphism AI Robot Avatar (Restored Sleek Robot-Type Design)
 * High-tech rounded robot head, capsule offset ear pods, dark glossy screen, and floating limbs.
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

  // Dimension mappings for different sizes
  const sizes = {
    lg: { width: 130, height: 110, screenW: 94, screenH: 78, earW: 12, earH: 26, neckW: 24, neckH: 18, bodyW: 38, bodyH: 50, armW: 10, armH: 22, spacing: -8 },
    md: { width: 90,  height: 76,  screenW: 66, screenH: 54, earW: 8,  earH: 18, neckW: 16, neckH: 12, bodyW: 26, bodyH: 34, armW: 7,  armH: 15, spacing: -6 },
    sm: { width: 56,  height: 48,  screenW: 42, screenH: 34, earW: 5,  earH: 11, neckW: 10, neckH: 8,  bodyW: 16, bodyH: 22, armW: 4,  armH: 9,  spacing: -4 },
    xs: { width: 34,  height: 30,  screenW: 26, screenH: 20, earW: 3,  earH: 6,  neckW: 6,  neckH: 5,  bodyW: 10, bodyH: 12, armW: 2,  armH: 5,  spacing: -2 }
  };

  const dim = sizes[size] || sizes.md;

  // Theme colors
  const accentColor = isAura ? '#f43f5e' : '#14b8a6';
  const glowHex = isAura ? '#f43f5e' : '#06b6d4';

  // Gradients for Aura (white/pink) vs Max (white/blue-cyan)
  const headGrad = isAura
    ? 'linear-gradient(135deg, #ffffff 0%, #fff1f2 40%, #fecdd3 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #ecfeff 40%, #bae6fd 100%)';

  const earGrad = isAura
    ? 'linear-gradient(135deg, #ffffff, #fbcfe8)'
    : 'linear-gradient(135deg, #ffffff, #bae6fd)';

  const bodyGrad = isAura
    ? 'linear-gradient(135deg, #ffffff 0%, #ffe4e6 60%, #fbcfe8 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 60%, #bae6fd 100%)';

  // Render SVG Face Path depending on expression (colored in accent neon theme)
  const renderFace = () => {
    switch (expression) {
      case 'neutral':
        return (
          <>
            {/* Horizontal capsule eyes */}
            <rect x="23" y="32" width="16" height="8" rx="4" fill={accentColor} />
            <rect x="61" y="32" width="16" height="8" rx="4" fill={accentColor} />
            {/* Small round circle mouth */}
            <circle cx="50" cy="54" r="4.5" fill={accentColor} />
          </>
        );
      case 'wink':
        return (
          <>
            {/* Left eye circle */}
            <circle cx="33" cy="34" r="6.5" fill={accentColor} />
            {/* Right eye winking winking arch */}
            <path d="M 58 35 Q 66 26 74 35" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Curved smile mouth */}
            <path d="M 42 50 Q 50 58 58 50" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'wink-smile':
        return (
          <>
            {/* Left eye diagonal pill */}
            <path d="M 23 37 L 35 31" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            {/* Right eye circle */}
            <circle cx="67" cy="34" r="6.5" fill={accentColor} />
            {/* Curved smile mouth */}
            <path d="M 40 50 Q 50 58 60 50" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'happy':
        return (
          <>
            {/* Two happy upward arch eyes */}
            <path d="M 24 38 Q 32 25 40 38" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 60 38 Q 68 25 76 38" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            {/* Small happy curved mouth */}
            <path d="M 43 51 Q 50 57 57 51" stroke={accentColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Two downward curved sleeping arch eyes */}
            <path d="M 24 30 Q 32 40 40 30" stroke={accentColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 60 30 Q 68 40 76 30" stroke={accentColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Relaxed smile */}
            <path d="M 43 51 Q 50 57 57 51" stroke={accentColor} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'dizzy':
        return (
          <>
            {/* 'X' eyes */}
            <path d="M 25 28 L 37 40 M 37 28 L 25 40" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 63 28 L 75 40 M 75 28 L 63 40" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
            {/* Curved sad mouth */}
            <path d="M 43 54 Q 50 47 57 54" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Round eyes */}
            <circle cx="31" cy="34" r="6.5" fill={accentColor} />
            <circle cx="69" cy="34" r="6.5" fill={accentColor} />
            {/* Downward curved sad mouth */}
            <path d="M 41 54 Q 50 45 59 54" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            {/* Round eyes */}
            <circle cx="31" cy="34" r="6.5" fill={accentColor} />
            <circle cx="69" cy="34" r="6.5" fill={accentColor} />
            {/* Glowing teardrops */}
            <path d="M 31 42 Q 34 52 31 58 Q 28 52 31 42" fill="#60a5fa" opacity="0.9" />
            <path d="M 69 42 Q 72 52 69 58 Q 66 52 69 42" fill="#60a5fa" opacity="0.9" />
            {/* Sad mouth */}
            <path d="M 41 54 Q 50 45 59 54" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            {/* Round circle eyes */}
            <circle cx="31" cy="34" r="6.5" fill={accentColor} />
            <circle cx="69" cy="34" r="6.5" fill={accentColor} />
            {/* Curved smile mouth */}
            <path d="M 40 50 Q 50 58 60 50" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  // Claymorphism Outer Head style
  const headStyle = {
    width: `${dim.width}px`,
    height: `${dim.height}px`,
    borderRadius: '50% 50% 46% 46% / 56% 56% 44% 44%',
    background: headGrad,
    border: '1px solid rgba(255, 255, 255, 0.95)',
    boxShadow: `
      inset 3px 3px 5px rgba(255,255,255,0.9), 
      inset -4px -4px 8px rgba(0,0,0,0.12), 
      0 ${dim.width * 0.08}px ${dim.width * 0.16}px rgba(0,0,0,0.14),
      0 0 15px ${glowHex}22
    `,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    animation: isTyping ? 'robot-shake 0.5s ease-in-out infinite' : 'robot-bob 4s ease-in-out infinite'
  };

  // Ear style (Capsule side pods offset from the head)
  const earLeftStyle = {
    position: 'absolute',
    left: `-${dim.earW - 1}px`,
    top: '50%',
    transform: 'translateY(-50%)',
    width: `${dim.earW}px`,
    height: `${dim.earH}px`,
    borderRadius: '50% 30% 30% 50% / 50% 40% 40% 50%',
    background: earGrad,
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), -1.5px 2px 4px rgba(0,0,0,0.08)',
    borderLeft: '1px solid rgba(255,255,255,0.8)',
    zIndex: 9
  };

  const earRightStyle = {
    ...earLeftStyle,
    left: 'auto',
    right: `-${dim.earW - 1}px`,
    borderRadius: '30% 50% 50% 30% / 40% 50% 50% 40%',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), 1.5px 2px 4px rgba(0,0,0,0.08)',
    borderLeft: 'none',
    borderRight: '1px solid rgba(255,255,255,0.8)'
  };

  // Dark Face Screen style
  const screenStyle = {
    width: `${dim.screenW}px`,
    height: `${dim.screenH}px`,
    borderRadius: `${dim.screenW * 0.28}px`,
    background: 'radial-gradient(circle at 50% 30%, #1e2230 0%, #0d0f15 100%)',
    border: '1.5px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'inset 2.5px 2.5px 5px rgba(0,0,0,0.85), inset -1.5px -1.5px 3px rgba(255,255,255,0.06)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  // Body & Neck Styles (Only for lg and md sizes to match Canva element layout)
  const showBody = size === 'lg' || size === 'md';

  const neckStyle = {
    width: `${dim.neckW}px`,
    height: `${dim.neckH}px`,
    borderRadius: `${dim.neckW / 2}px`,
    background: earGrad,
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.06)',
    margin: `${dim.spacing}px auto 0`,
    position: 'relative',
    zIndex: 8
  };

  const bodyStyle = {
    width: `${dim.bodyW}px`,
    height: `${dim.bodyH}px`,
    borderRadius: `${dim.bodyW * 0.5}px ${dim.bodyW * 0.5}px ${dim.bodyW * 0.6}px ${dim.bodyW * 0.6}px`,
    background: bodyGrad,
    boxShadow: `
      inset 2px 2px 4px rgba(255,255,255,0.95), 
      inset -3px -3px 6px rgba(0,0,0,0.12), 
      0 6px 12px rgba(0,0,0,0.08)
    `,
    margin: '-4px auto 0',
    position: 'relative',
    zIndex: 7
  };

  // Arm styles
  const leftArmStyle = {
    position: 'absolute',
    left: `-${dim.armW + 1}px`,
    top: '25%',
    width: `${dim.armW}px`,
    height: `${dim.armH}px`,
    borderRadius: `${dim.armW / 2}px`,
    background: earGrad,
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), -1px 2px 4px rgba(0,0,0,0.06)',
    transform: expression === 'cry' || expression === 'dizzy' ? 'rotate(50deg)' : 'rotate(15deg)',
    transformOrigin: 'top center',
    transition: 'transform 0.4s ease'
  };

  const rightArmStyle = {
    position: 'absolute',
    right: `-${dim.armW + 1}px`,
    top: '25%',
    width: `${dim.armW}px`,
    height: `${dim.armH}px`,
    borderRadius: `${dim.armW / 2}px`,
    background: earGrad,
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), 1px 2px 4px rgba(0,0,0,0.06)',
    transform: expression === 'wink-smile' || expression === 'happy' ? 'rotate(-65deg)' : expression === 'cry' || expression === 'dizzy' ? 'rotate(-50deg)' : 'rotate(-15deg)',
    transformOrigin: 'top center',
    animation: expression === 'wink-smile' ? 'robot-arm-wave 1.5s ease-in-out infinite' : 'none',
    transition: 'transform 0.4s ease'
  };

  return (
    <div className={`robot-avatar-container ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', position: 'relative', ...style }}>
      {/* Styles Injection */}
      <style>{`
        @keyframes robot-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes robot-shake {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-1.5px) rotate(-1deg); }
          75% { transform: translateY(1.5px) rotate(1deg); }
        }
        @keyframes robot-arm-wave {
          0%, 100% { transform: rotate(-55deg); }
          50% { transform: rotate(-75deg); }
        }
        .robot-face-glow {
          filter: drop-shadow(0 0 2.5px ${glowHex}) drop-shadow(0 0 7px ${glowHex}bb);
          animation: robot-glow-pulse 2s ease-in-out infinite;
        }
        @keyframes robot-glow-pulse {
          0%, 100% { opacity: 0.95; filter: drop-shadow(0 0 2.5px ${glowHex}) drop-shadow(0 0 6px ${glowHex}aa); }
          50% { opacity: 1; filter: drop-shadow(0 0 4px ${glowHex}) drop-shadow(0 0 10px ${glowHex}dd); }
        }
      `}</style>

      {/* Robot Head */}
      <div style={headStyle}>
        {/* Ears */}
        <div style={earLeftStyle} />
        <div style={earRightStyle} />

        {/* Screen */}
        <div style={screenStyle}>
          <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%', display: 'block' }}>
            <g className="robot-face-glow">
              {renderFace()}
            </g>
          </svg>
        </div>
      </div>

      {/* Robot Body & Limbs */}
      {showBody && (
        <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={neckStyle} />
          <div style={bodyStyle}>
            <div style={leftArmStyle} />
            <div style={rightArmStyle} />
          </div>
        </div>
      )}
    </div>
  );
}

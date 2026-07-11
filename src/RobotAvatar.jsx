import React from 'react';

/**
 * 3D Claymorphism AI Robot Avatar
 * Matches set:nAFuuKFGAQU Canva element style
 */
export default function RobotAvatar({
  expression = 'smile', // neutral, wink, smile, wink-smile, happy, sleep, dizzy, sad, cry
  size = 'md',          // lg, md, sm, xs
  glowColor = '#f43f5e', // Aura (pink) or Max (teal) or custom
  isTyping = false,
  className = '',
  style = {}
}) {
  // Dimension mappings
  const sizes = {
    lg: { width: 130, height: 110, screenW: 94, screenH: 78, earW: 12, earH: 26, neckW: 24, neckH: 18, bodyW: 38, bodyH: 50, armW: 10, armH: 22, spacing: -8 },
    md: { width: 90,  height: 76,  screenW: 66, screenH: 54, earW: 8,  earH: 18, neckW: 16, neckH: 12, bodyW: 26, bodyH: 34, armW: 7,  armH: 15, spacing: -6 },
    sm: { width: 56,  height: 48,  screenW: 42, screenH: 34, earW: 5,  earH: 11, neckW: 10, neckH: 8,  bodyW: 16, bodyH: 22, armW: 4,  armH: 9,  spacing: -4 },
    xs: { width: 34,  height: 30,  screenW: 26, screenH: 20, earW: 3,  earH: 6,  neckW: 6,  neckH: 5,  bodyW: 10, bodyH: 12, armW: 2,  armH: 5,  spacing: -2 }
  };

  const dim = sizes[size] || sizes.md;

  // Render SVG Face Path depending on expression
  const renderFace = () => {
    switch (expression) {
      case 'neutral':
        return (
          <>
            {/* Horizontal capsule eyes */}
            <rect x="23" y="32" width="16" height="8" rx="4" fill="#fff" />
            <rect x="61" y="32" width="16" height="8" rx="4" fill="#fff" />
            {/* Small round circle mouth */}
            <circle cx="50" cy="54" r="4.5" fill="#fff" />
          </>
        );
      case 'wink':
        return (
          <>
            {/* Left eye circle */}
            <circle cx="33" cy="34" r="6" fill="#fff" />
            {/* Right eye winking arch */}
            <path d="M 58 35 Q 66 26 74 35" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Curved smile mouth */}
            <path d="M 42 50 Q 50 58 58 50" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'wink-smile':
        return (
          <>
            {/* Left eye diagonal pill */}
            <path d="M 23 37 L 35 31" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
            {/* Right eye circle */}
            <circle cx="67" cy="34" r="6" fill="#fff" />
            {/* Curved smile mouth */}
            <path d="M 40 50 Q 50 58 60 50" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'happy':
        return (
          <>
            {/* Two happy upward arch eyes */}
            <path d="M 24 38 Q 32 25 40 38" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 60 38 Q 68 25 76 38" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* No mouth, or just a small happy accent */}
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Two downward curved sleeping arch eyes */}
            <path d="M 24 30 Q 32 40 40 30" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 60 30 Q 68 40 76 30" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Relaxed smile */}
            <path d="M 43 51 Q 50 57 57 51" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'dizzy':
        return (
          <>
            {/* 'X' eyes */}
            <path d="M 25 28 L 37 40 M 37 28 L 25 40" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 63 28 L 75 40 M 75 28 L 63 40" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
            {/* Curved sad mouth */}
            <path d="M 43 54 Q 50 47 57 54" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Round eyes */}
            <circle cx="31" cy="34" r="6" fill="#fff" />
            <circle cx="69" cy="34" r="6" fill="#fff" />
            {/* Downward curved sad mouth */}
            <path d="M 41 54 Q 50 45 59 54" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            {/* Round eyes */}
            <circle cx="31" cy="34" r="6" fill="#fff" />
            <circle cx="69" cy="34" r="6" fill="#fff" />
            {/* Glowing teardrops */}
            <path d="M 31 42 Q 34 52 31 58 Q 28 52 31 42" fill="#60a5fa" opacity="0.9" />
            <path d="M 69 42 Q 72 52 69 58 Q 66 52 69 42" fill="#60a5fa" opacity="0.9" />
            {/* Sad mouth */}
            <path d="M 41 54 Q 50 45 59 54" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            {/* Round circle eyes */}
            <circle cx="31" cy="34" r="6" fill="#fff" />
            <circle cx="69" cy="34" r="6" fill="#fff" />
            {/* Curved smile mouth */}
            <path d="M 40 50 Q 50 58 60 50" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  // Claymorphism Outer Head style
  const headStyle = {
    width: `${dim.width}px`,
    height: `${dim.height}px`,
    borderRadius: `${dim.width * 0.32}px`,
    background: 'linear-gradient(135deg, #ffffff 0%, #edf1f7 50%, #ccd1df 100%)',
    border: '1px solid rgba(255, 255, 255, 0.95)',
    boxShadow: `
      inset 3px 3px 5px rgba(255,255,255,0.9), 
      inset -4px -4px 8px rgba(0,0,0,0.12), 
      0 ${dim.width * 0.08}px ${dim.width * 0.16}px rgba(0,0,0,0.14),
      0 0 15px ${glowColor}25
    `,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    animation: isTyping ? 'robot-shake 0.5s ease-in-out infinite' : 'robot-bob 3s ease-in-out infinite'
  };

  // Ear style (Capsule side pods)
  const earLeftStyle = {
    position: 'absolute',
    left: `-${dim.earW - 1}px`,
    top: '50%',
    transform: 'translateY(-50%)',
    width: `${dim.earW}px`,
    height: `${dim.earH}px`,
    borderRadius: `${dim.earW / 2}px`,
    background: 'linear-gradient(135deg, #ffffff, #dcdce6)',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), -1px 2px 4px rgba(0,0,0,0.08)',
    borderLeft: '1px solid rgba(255,255,255,0.8)',
    zIndex: 9
  };

  const earRightStyle = {
    ...earLeftStyle,
    left: 'auto',
    right: `-${dim.earW - 1}px`,
    background: 'linear-gradient(135deg, #ffffff, #ccd1df)',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), 1px 2px 4px rgba(0,0,0,0.08)',
    borderLeft: 'none',
    borderRight: '1px solid rgba(255,255,255,0.8)'
  };

  // Dark Face Screen style
  const screenStyle = {
    width: `${dim.screenW}px`,
    height: `${dim.screenH}px`,
    borderRadius: `${dim.screenW * 0.28}px`,
    background: 'linear-gradient(135deg, #18191e 0%, #090a0d 100%)',
    border: '1.5px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'inset 2.5px 2.5px 5px rgba(0,0,0,0.85), inset -1.5px -1.5px 3px rgba(255,255,255,0.06)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  // Body & Neck Styles (Only for lg and md sizes to match Canva element)
  const showBody = size === 'lg' || size === 'md';

  const neckStyle = {
    width: `${dim.neckW}px`,
    height: `${dim.neckH}px`,
    borderRadius: `${dim.neckW / 2}px`,
    background: 'linear-gradient(135deg, #ffffff, #d2d5e3)',
    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.06)',
    margin: `${dim.spacing}px auto 0`,
    position: 'relative',
    zIndex: 8
  };

  const bodyStyle = {
    width: `${dim.bodyW}px`,
    height: `${dim.bodyH}px`,
    borderRadius: `${dim.bodyW * 0.5}px ${dim.bodyW * 0.5}px ${dim.bodyW * 0.6}px ${dim.bodyW * 0.6}px`,
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e5ee 60%, #bec2d4 100%)',
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
    background: 'linear-gradient(135deg, #ffffff, #d2d5e3)',
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
    background: 'linear-gradient(135deg, #ffffff, #bec2d4)',
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
          filter: drop-shadow(0 0 3px #fff) drop-shadow(0 0 8px rgba(255,255,255,0.85));
          animation: robot-glow-pulse 2.2s ease-in-out infinite;
        }
        @keyframes robot-glow-pulse {
          0%, 100% { opacity: 0.95; filter: drop-shadow(0 0 2.5px #fff) drop-shadow(0 0 6px rgba(255,255,255,0.7)); }
          50% { opacity: 1; filter: drop-shadow(0 0 4.5px #fff) drop-shadow(0 0 11px rgba(255,255,255,0.95)); }
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

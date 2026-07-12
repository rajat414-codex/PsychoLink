import React from 'react';

/**
 * Ultra-Cute 3D CSS Robot Avatar (Faw/Eve style)
 * Features a smooth matte white 3D body, large dark visor,
 * expressive neon holographic face, and cute chubby proportions.
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#00e5ff',
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

  const scales = { lg: 1.1, md: 0.75, sm: 0.45, xs: 0.28 };
  const s = scales[size] || scales.md;
  const showBody = size === 'lg' || size === 'md';

  // Neon Colors for face
  const accent = isAura ? '#ff477e' : '#22d3ee'; // A bright cyan or pink
  const glow = isAura ? 'rgba(255, 71, 126, 0.6)' : 'rgba(34, 211, 238, 0.6)';
  const glowSoft = isAura ? 'rgba(255, 71, 126, 0.2)' : 'rgba(34, 211, 238, 0.2)';
  
  const u = (v) => `${v * s}px`;
  const id = `rv-${accent.replace('#', '')}-${size}`;

  const renderFace = () => {
    const strokeW = "10"; // Very thick, cute strokes
    switch (expression) {
      case 'happy':
        return (
          <>
            <path d="M 28 40 Q 35 25 42 40" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 58 40 Q 65 25 72 40" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 40 55 Q 50 65 60 55" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sleep':
        return (
          <>
            <line x1="28" y1="40" x2="42" y2="40" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <line x1="58" y1="40" x2="72" y2="40" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <circle cx="50" cy="55" r="4" fill={accent} opacity="0.6" />
          </>
        );
      case 'sad':
        return (
          <>
            <path d="M 28 32 Q 35 22 42 35" stroke={accent} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 72 32 Q 65 22 58 35" stroke={accent} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 42 60 Q 50 50 58 60" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            <path d="M 28 32 Q 35 22 42 35" stroke={accent} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 72 32 Q 65 22 58 35" stroke={accent} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 42 60 Q 50 50 58 60" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
            <line x1="35" y1="50" x2="35" y2="65" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
            <line x1="65" y1="50" x2="65" y2="65" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
          </>
        );
      case 'wink':
        return (
          <>
            <rect x="30" y="30" width="12" height="18" rx="6" fill={accent} />
            <path d="M 58 40 Q 65 28 72 40" stroke={accent} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 42 55 Q 50 62 58 55" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'wink-smile':
        return (
          <>
            <line x1="30" y1="33" x2="42" y2="40" stroke={accent} strokeWidth="8" strokeLinecap="round" />
            <line x1="42" y1="33" x2="30" y2="40" stroke={accent} strokeWidth="8" strokeLinecap="round" />
            <path d="M 58 40 Q 65 25 72 40" stroke={accent} strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 40 55 Q 50 68 60 55" stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M 30 30 L 42 42 M 42 30 L 30 42" stroke={accent} strokeWidth="8" strokeLinecap="round" />
            <path d="M 58 30 L 70 42 M 70 30 L 58 42" stroke={accent} strokeWidth="8" strokeLinecap="round" />
            <path d="M 42 60 Q 50 50 58 60" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'neutral':
        return (
          <>
            <rect x="30" y="30" width="12" height="18" rx="6" fill={accent} />
            <rect x="58" y="30" width="12" height="18" rx="6" fill={accent} />
            <line x1="42" y1="58" x2="58" y2="58" stroke={accent} strokeWidth="5" strokeLinecap="round" />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            {/* Cute thick pill-shaped eyes */}
            <rect x="30" y="28" width="14" height="22" rx="7" fill={accent} />
            <rect x="56" y="28" width="14" height="22" rx="7" fill={accent} />
            {/* Cute smile */}
            <path d="M 38 56 Q 50 68 62 56" stroke={accent} strokeWidth="7" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  const waveAnim = expression === 'wink-smile' || expression === 'happy';

  // --- PREMIUM 3D MATTE WHITE STYLES ---
  
  // The head is a smooth, rounded block with a soft gradient for 3D depth
  const headStyle = {
    background: 'linear-gradient(155deg, #ffffff 0%, #f4f6f8 40%, #e2e6ec 100%)',
    boxShadow: `
      inset 4px 4px 10px rgba(255,255,255,1),
      inset -6px -8px 16px rgba(150,160,175,0.4),
      0 12px 24px rgba(0,0,0,0.12),
      0 4px 8px rgba(0,0,0,0.06)
    `,
    border: '1px solid rgba(255,255,255,0.7)'
  };

  // The dark glossy visor
  const visorStyle = {
    background: 'linear-gradient(145deg, #1b2436 0%, #0d121c 100%)',
    boxShadow: `
      inset 0 6px 12px rgba(0,0,0,0.8),
      inset 0 -2px 6px rgba(255,255,255,0.1),
      0 2px 4px rgba(255,255,255,0.5)
    `,
    border: '2px solid #cbd5e1'
  };

  // Body and limbs share the matte white 3D look
  const bodyStyle = {
    background: 'linear-gradient(145deg, #ffffff 0%, #e2e6ec 100%)',
    boxShadow: `
      inset 3px 3px 8px rgba(255,255,255,1),
      inset -5px -8px 12px rgba(150,160,175,0.45),
      0 10px 20px rgba(0,0,0,0.1)
    `
  };

  const limbStyle = {
    background: 'linear-gradient(145deg, #ffffff 0%, #d5dae2 100%)',
    boxShadow: `
      inset 2px 2px 6px rgba(255,255,255,1),
      inset -4px -4px 8px rgba(150,160,175,0.5),
      2px 4px 8px rgba(0,0,0,0.15)
    `
  };

  return (
    <div className={`robot-wrap ${className}`} style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      ...style,
    }}>
      <style>{`
        @keyframes rv-float-${id} {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.01); }
        }
        @keyframes rv-shake-${id} {
          0%, 100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-2px) rotate(-1.5deg); }
          75% { transform: translateY(2px) rotate(1.5deg); }
        }
        @keyframes rv-wave-${id} {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(-65deg); }
        }
        @keyframes rv-glow-pulse-${id} {
          0%, 100% { filter: drop-shadow(0 0 ${4*s}px ${accent}) drop-shadow(0 0 ${12*s}px ${glowSoft}); }
          50% { filter: drop-shadow(0 0 ${8*s}px ${accent}) drop-shadow(0 0 ${20*s}px ${glow}); }
        }
        @keyframes rv-blink-${id} {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.05); }
        }
      `}</style>

      {/* Main floating container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: isTyping ? `rv-shake-${id} 0.5s ease-in-out infinite` : `rv-float-${id} 3.5s ease-in-out infinite`,
        position: 'relative'
      }}>
        
        {/* ═══ HEAD ═══ */}
        <div style={{
          width: u(160), height: u(125),
          borderRadius: `${u(75)} ${u(75)} ${u(60)} ${u(60)}`,
          ...headStyle,
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Slight tilt for cuteness
          transform: 'rotate(-2deg)', 
        }}>
          
          {/* Cute little antenna on top-left (robot's right) */}
          <div style={{
            position: 'absolute',
            top: u(-18), right: u(35),
            width: u(8), height: u(30),
            borderRadius: u(4),
            background: 'linear-gradient(90deg, #e2e6ec, #ffffff, #b0b8c5)',
            transform: 'rotate(25deg)',
            zIndex: -1,
            boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.1), 2px 2px 4px rgba(0,0,0,0.1)`
          }} />

          {/* Dark Glass Visor */}
          <div style={{
            width: u(135), height: u(90),
            borderRadius: u(40),
            ...visorStyle,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: u(5),
          }}>
            {/* Visor Glare (Glassmorphism Reflection) */}
            <div style={{
              position: 'absolute', top: u(3), left: u(15),
              width: u(90), height: u(30),
              borderRadius: u(15),
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
              pointerEvents: 'none',
              transform: 'rotate(-4deg)',
            }} />

            {/* Glowing Face Frame */}
            <svg viewBox="0 0 100 80" style={{
              width: '100%', height: '100%',
              animation: expression !== 'sleep' ? `rv-blink-${id} 5.5s infinite, rv-glow-pulse-${id} 3s infinite` : 'none',
              filter: expression === 'sleep' ? `drop-shadow(0 0 ${4*s}px ${accent}) drop-shadow(0 0 ${12*s}px ${glowSoft})` : 'none',
              transformOrigin: 'center'
            }}>
              <g>
                {renderFace()}
              </g>
            </svg>
          </div>
        </div>

        {/* ═══ BODY & LIMBS (lg/md only) ═══ */}
        {showBody && (
          <div style={{
            width: u(100), height: u(95),
            marginTop: u(-15), // Overlaps under head
            borderRadius: `${u(40)} ${u(40)} ${u(50)} ${u(50)}`,
            ...bodyStyle,
            position: 'relative',
            zIndex: 9, // Behind head
            display: 'flex',
            justifyContent: 'center',
          }}>
            {/* Soft shadow directly under head to add 3D depth */}
            <div style={{
              width: '80%', height: u(15),
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.1)',
              filter: 'blur(4px)',
              marginTop: u(5)
            }} />

            {/* Left Arm (Resting/pointing down slightly) */}
            <div style={{
              position: 'absolute', left: u(-18), top: u(20),
              width: u(32), height: u(65),
              borderRadius: u(16),
              ...limbStyle,
              transformOrigin: 'top center',
              transform: 'rotate(20deg)',
              zIndex: -1, // behind body
            }}>
               {/* Joint indent */}
               <div style={{
                 position: 'absolute', top: '50%', left: '10%', width: '80%', height: u(2),
                 background: 'rgba(0,0,0,0.06)', borderRadius: '50%'
               }} />
            </div>

            {/* Right Arm (Waving) */}
            <div style={{
              position: 'absolute', right: u(-22), top: u(15),
              width: u(32), height: u(65),
              borderRadius: u(16),
              ...limbStyle,
              transformOrigin: 'top center',
              transform: waveAnim ? 'rotate(-65deg)' : 'rotate(-25deg)',
              animation: waveAnim ? `rv-wave-${id} 1.6s ease-in-out infinite` : 'none',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 10, // in front of body
            }}>
               {/* Joint indent */}
               <div style={{
                 position: 'absolute', top: '50%', left: '10%', width: '80%', height: u(2),
                 background: 'rgba(0,0,0,0.06)', borderRadius: '50%'
               }} />
            </div>

            {/* Left Leg */}
            <div style={{
              position: 'absolute', bottom: u(-25), left: u(15),
              width: u(30), height: u(40),
              borderRadius: u(15),
              ...limbStyle,
              zIndex: -1,
              transform: 'rotate(5deg)'
            }} />

            {/* Right Leg (Slightly bent/lifted for a cute pose) */}
            <div style={{
              position: 'absolute', bottom: u(-22), right: u(15),
              width: u(30), height: u(40),
              borderRadius: u(15),
              ...limbStyle,
              zIndex: -1,
              transform: 'rotate(-15deg)'
            }} />

          </div>
        )}
      </div>

      {/* Soft Ground Shadow (lg/md only) */}
      {showBody && (
        <div style={{
          marginTop: u(25),
          width: u(90), height: u(12),
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.12)',
          filter: 'blur(5px)',
          animation: `rv-float-shadow-${id} 3.5s ease-in-out infinite`,
        }}>
           <style>{`
             @keyframes rv-float-shadow-${id} {
               0%, 100% { transform: scale(1); opacity: 1; }
               50% { transform: scale(0.85); opacity: 0.6; }
             }
           `}</style>
        </div>
      )}
    </div>
  );
}

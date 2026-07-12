import React from 'react';

/**
 * Ultra-Premium 3D CSS Robot Avatar
 * Features a sleek dark titanium and frosted glass aesthetic, 
 * neon holographic expressions, and smooth floating animations.
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

  const scales = { lg: 1.1, md: 0.75, sm: 0.45, xs: 0.28 };
  const s = scales[size] || scales.md;
  const showBody = size === 'lg' || size === 'md';

  // Premium Neon Colors
  const accent = isAura ? '#ff2a5f' : '#00e5ff';
  const glow = isAura ? 'rgba(255,42,95,0.6)' : 'rgba(0,229,255,0.6)';
  const glowSoft = isAura ? 'rgba(255,42,95,0.2)' : 'rgba(0,229,255,0.2)';
  
  const u = (v) => `${v * s}px`;

  const renderFace = () => {
    const strokeW = "6";
    switch (expression) {
      case 'happy':
        return (
          <>
            <path d="M 25 35 Q 35 15 45 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 55 35 Q 65 15 75 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 35 50 Q 50 65 65 50" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'sleep':
        return (
          <>
            <line x1="25" y1="35" x2="45" y2="35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <line x1="55" y1="35" x2="75" y2="35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <circle cx="50" cy="50" r="4" fill={accent} opacity="0.6" />
          </>
        );
      case 'sad':
        return (
          <>
            <path d="M 25 30 Q 35 20 45 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 75 30 Q 65 20 55 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 40 55 Q 50 45 60 55" stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'cry':
        return (
          <>
            <path d="M 25 30 Q 35 20 45 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 75 30 Q 65 20 55 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 40 55 Q 50 45 60 55" stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none" />
            <line x1="35" y1="45" x2="35" y2="60" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
            <line x1="65" y1="45" x2="65" y2="60" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
          </>
        );
      case 'wink':
        return (
          <>
            <rect x="28" y="25" width="10" height="15" rx="5" fill={accent} />
            <path d="M 55 35 Q 65 20 75 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 40 48 Q 50 55 60 48" stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'wink-smile':
        return (
          <>
            <line x1="28" y1="28" x2="42" y2="35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <line x1="42" y1="28" x2="28" y2="35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <path d="M 55 35 Q 65 15 75 35" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
            <path d="M 35 50 Q 50 65 65 50" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'dizzy':
        return (
          <>
            <path d="M 28 25 L 42 38 M 42 25 L 28 38" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <path d="M 58 25 L 72 38 M 72 25 L 58 38" stroke={accent} strokeWidth={strokeW} strokeLinecap="round" />
            <path d="M 40 55 Q 50 45 60 55" stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case 'neutral':
        return (
          <>
            <rect x="28" y="25" width="12" height="12" rx="4" fill={accent} />
            <rect x="60" y="25" width="12" height="12" rx="4" fill={accent} />
            <line x1="40" y1="50" x2="60" y2="50" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'smile':
      default:
        return (
          <>
            <rect x="28" y="22" width="10" height="20" rx="5" fill={accent} />
            <rect x="62" y="22" width="10" height="20" rx="5" fill={accent} />
            <path d="M 35 48 Q 50 60 65 48" stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  const waveAnim = expression === 'wink-smile' || expression === 'happy';

  // Premium Material Styles
  const darkGlass = {
    background: 'linear-gradient(135deg, rgba(35, 38, 48, 0.95) 0%, rgba(18, 20, 25, 0.98) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: `
      inset 0 1px 2px rgba(255,255,255,0.15),
      inset 0 -2px 5px rgba(0,0,0,0.8),
      0 12px 24px rgba(0,0,0,0.6)
    `
  };

  const bodyShell = {
    background: 'linear-gradient(145deg, #2c303b 0%, #171920 100%)',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: `
      inset -5px -5px 15px rgba(0,0,0,0.6),
      inset 5px 5px 15px rgba(255,255,255,0.06),
      0 15px 30px rgba(0,0,0,0.4)
    `
  };

  const visorGlass = {
    background: 'linear-gradient(145deg, #0c0d10 0%, #000000 100%)',
    boxShadow: `
      inset 0 5px 15px rgba(0,0,0,1),
      0 2px 5px rgba(255,255,255,0.04)
    `,
    border: '1px solid rgba(255,255,255,0.03)'
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
        @keyframes rv-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.01); }
        }
        @keyframes rv-shake {
          0%, 100% { transform: translateY(0) rotate(0); }
          25% { transform: translateY(-2px) rotate(-1.5deg); }
          75% { transform: translateY(2px) rotate(1.5deg); }
        }
        @keyframes rv-wave {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(-55deg); }
        }
        @keyframes rv-glow-pulse {
          0%, 100% { opacity: 0.6; filter: blur(8px); transform: scale(1); }
          50% { opacity: 1; filter: blur(12px); transform: scale(1.05); }
        }
        @keyframes rv-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.05); }
        }
        @keyframes rv-ears {
          0%, 100% { transform: scaleY(1); opacity: 0.7; }
          50% { transform: scaleY(1.15); opacity: 1; }
        }
      `}</style>

      {/* Main floating container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: isTyping ? 'rv-shake 0.5s ease-in-out infinite' : 'rv-float 4.5s ease-in-out infinite',
      }}>
        
        {/* ═══ HEAD ═══ */}
        <div style={{
          width: u(150), height: u(110),
          borderRadius: u(55),
          ...darkGlass,
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          
          {/* Glass Visor */}
          <div style={{
            width: u(130), height: u(75),
            borderRadius: u(35),
            ...visorGlass,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Visor Glare (Glassmorphism Reflection) */}
            <div style={{
              position: 'absolute', top: u(2), left: u(10),
              width: u(90), height: u(25),
              borderRadius: u(12),
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
              pointerEvents: 'none',
              transform: 'rotate(-4deg)',
            }} />

            {/* Glowing Face Frame */}
            <svg viewBox="0 0 100 80" style={{
              width: '90%', height: '90%',
              filter: `drop-shadow(0 0 ${6*s}px ${accent}) drop-shadow(0 0 ${16*s}px ${glow})`,
              animation: expression !== 'sleep' ? 'rv-blink 5.5s infinite' : 'none',
              transformOrigin: 'center',
            }}>
              {renderFace()}
            </svg>
          </div>

          {/* Left Ear */}
          <div style={{
            position: 'absolute', left: u(-14), top: '50%', marginTop: u(-20),
            width: u(20), height: u(40),
            borderRadius: u(10),
            ...bodyShell,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `inset 2px 2px 5px rgba(255,255,255,0.05), -4px 0 8px rgba(0,0,0,0.4)`
          }}>
             <div style={{
               width: u(4), height: u(20),
               background: accent,
               borderRadius: u(2),
               boxShadow: `0 0 ${8*s}px ${accent}`,
               animation: 'rv-ears 2.5s infinite'
             }} />
          </div>

          {/* Right Ear */}
          <div style={{
            position: 'absolute', right: u(-14), top: '50%', marginTop: u(-20),
            width: u(20), height: u(40),
            borderRadius: u(10),
            ...bodyShell,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `inset -2px 2px 5px rgba(255,255,255,0.05), 4px 0 8px rgba(0,0,0,0.4)`
          }}>
             <div style={{
               width: u(4), height: u(20),
               background: accent,
               borderRadius: u(2),
               boxShadow: `0 0 ${8*s}px ${accent}`,
               animation: 'rv-ears 2.5s infinite 1.25s'
             }} />
          </div>
        </div>

        {/* ═══ BODY (lg/md only) ═══ */}
        {showBody && (
          <div style={{
            width: u(120), height: u(95),
            marginTop: u(-15),
            borderRadius: u(40),
            ...bodyShell,
            position: 'relative',
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Neck joint */}
            <div style={{
              width: u(40), height: u(25),
              background: '#0d0f14',
              borderRadius: u(10),
              marginTop: u(-10),
              zIndex: -1,
              boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.8)'
            }} />

            {/* Glowing Core Engine */}
            <div style={{
              marginTop: u(12),
              width: u(45), height: u(45),
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accent} 0%, #000 90%)`,
              boxShadow: `0 0 ${15*s}px ${accent}, inset 0 0 ${10*s}px rgba(255,255,255,0.5)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'rv-glow-pulse 3s infinite',
              border: '2px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{
                width: u(22), height: u(22),
                borderRadius: '50%',
                background: '#fff',
                boxShadow: `0 0 ${15*s}px #fff, 0 0 ${25*s}px ${accent}`
              }} />
            </div>

            {/* Left Arm */}
            <div style={{
              position: 'absolute', left: u(-22), top: u(18),
              width: u(28), height: u(65),
              borderRadius: u(14),
              ...bodyShell,
              transformOrigin: 'top center',
              transform: 'rotate(12deg)',
            }}>
               <div style={{
                 position: 'absolute', bottom: u(-8), left: '50%', transform: 'translateX(-50%)',
                 width: u(20), height: u(20), borderRadius: '50%',
                 background: '#15171e',
                 border: `${2*s}px solid ${accent}`,
                 boxShadow: `0 0 ${10*s}px ${glow}, inset 0 0 ${5*s}px ${glow}`
               }}/>
            </div>

            {/* Right Arm (Waving) */}
            <div style={{
              position: 'absolute', right: u(-22), top: u(18),
              width: u(28), height: u(65),
              borderRadius: u(14),
              ...bodyShell,
              transformOrigin: 'top center',
              transform: waveAnim ? 'rotate(-45deg)' : 'rotate(-12deg)',
              animation: waveAnim ? 'rv-wave 1.6s ease-in-out infinite' : 'none',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
               <div style={{
                 position: 'absolute', bottom: u(-8), left: '50%', transform: 'translateX(-50%)',
                 width: u(20), height: u(20), borderRadius: '50%',
                 background: '#15171e',
                 border: `${2*s}px solid ${accent}`,
                 boxShadow: `0 0 ${10*s}px ${glow}, inset 0 0 ${5*s}px ${glow}`
               }}/>
            </div>

          </div>
        )}
      </div>

      {/* Holographic Projection Base (lg/md only) */}
      {showBody && (
        <div style={{
          marginTop: u(25),
          width: u(140), height: u(12),
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glow} 0%, transparent 75%)`,
          boxShadow: `0 0 ${25*s}px ${glowSoft}`,
          animation: 'rv-glow-pulse 4s infinite',
        }} />
      )}
    </div>
  );
}

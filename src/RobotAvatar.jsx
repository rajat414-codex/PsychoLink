import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium 3D Claymorphic & Iridescent Holographic AI Core Avatar
 * Implements:
 * - 3D Claymorphism (soft offset shading, bevel highlights, inner shadow crescents for a clay-like texture).
 * - Iridescent Holographic Rings (layered concentric rings with multi-stop pastel gradients and soft gaussian blur filters).
 * - Customized active core glows (Red/Orange gradient for Aura, Green/Emerald for Max).
 * - Symmetrical glowing white vertical oval eyes (retaining white eye spots as requested).
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#ff3b30',
  isTyping = false,
  className = '',
  style = {}
}) {
  const sizeMap = { lg: 220, md: 130, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  // Determine active AI (Max is Green, Aura is Red)
  const isMax = glowColor.toLowerCase() === '#34c759' || glowColor.toLowerCase() === '#22c55e' || glowColor.toLowerCase() === '#10b981';

  // Render SVG eye shapes (always solid white overlay with glowing white underlay)
  const renderEyes = () => {
    const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';
    
    if (isHappy) {
      return (
        <>
          {/* Happy arched closed white eyes ^ ^ */}
          <path d="M 63,105 Q 77,77 91,105" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
          <path d="M 109,105 Q 123,77 137,105" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
          <path d="M 63,105 Q 77,77 91,105" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          <path d="M 109,105 Q 123,77 137,105" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
        </>
      );
    }

    switch (expression) {
      case 'dizzy':
      case 'error':
        return (
          <>
            {/* Cross eyes X X */}
            <path d="M 67,90 L 87,110 M 87,90 L 67,110" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
            <path d="M 113,90 L 133,110 M 133,90 L 113,110" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
            <path d="M 67,90 L 87,110 M 87,90 L 67,110" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <path d="M 113,90 L 133,110 M 133,90 L 113,110" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Flat sleeping lines - - */}
            <line x1="63" y1="100" x2="91" y2="100" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
            <line x1="109" y1="100" x2="137" y2="100" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
            <line x1="63" y1="100" x2="91" y2="100" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
            <line x1="109" y1="100" x2="137" y2="100" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad eyes */}
            <path d="M 63,93 Q 77,121 91,93" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
            <path d="M 109,93 Q 123,121 137,93" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.65" filter="url(#eye-glow)" />
            <path d="M 63,93 Q 77,121 91,93" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
            <path d="M 109,93 Q 123,121 137,93" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            {/* Default Vertical Oval Eyes (White glowing capsules) */}
            <ellipse cx="77" cy="100" rx="14" ry="20" fill="#ffffff" opacity="0.65" filter="url(#eye-glow)" />
            <ellipse cx="123" cy="100" rx="14" ry="20" fill="#ffffff" opacity="0.65" filter="url(#eye-glow)" />
            <ellipse cx="77" cy="100" rx="14" ry="20" fill="#ffffff" />
            <ellipse cx="123" cy="100" rx="14" ry="20" fill="#ffffff" />
          </>
        );
    }
  };

  return (
    <motion.div
      className={`premium-3d-avatar ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: d, height: d,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Holographic / Iridescent Gradient */}
          <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff00c8" />
            <stop offset="25%" stopColor="#b900ff" />
            <stop offset="50%" stopColor="#00f0ff" />
            <stop offset="75%" stopColor="#00ff66" />
            <stop offset="100%" stopColor="#ffb900" />
          </linearGradient>

          {/* 3D Claymorphism Base shading (offset light source) */}
          <radialGradient id="clay-base" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Active AI Core Ring Gradients */}
          {/* Aura Red Gradient */}
          <linearGradient id="aura-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff453a" />
            <stop offset="45%" stopColor="#ff9f0a" />
            <stop offset="100%" stopColor="#ff2d55" />
          </linearGradient>

          {/* Max Green Gradient */}
          <linearGradient id="max-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#30d158" />
            <stop offset="55%" stopColor="#34c759" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Shading gradients for 3D Inset Display Screen */}
          <linearGradient id="screen-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0b0f19" />
            <stop offset="100%" stopColor="#02040a" />
          </linearGradient>

          {/* Blur Filters */}
          <filter id="holo-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="eye-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Holographic Soft Shadow Underlay */}
        <ellipse cx="100" cy="184" rx="55" ry="9" fill="rgba(0,0,0,0.1)" filter="blur(4px)" />

        {/* 2. Outer Iridescent Refracted Glass Ring (Holographic Foil style) */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="url(#holo-grad)" strokeWidth="6" opacity="0.65" filter="url(#holo-blur)" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="url(#holo-grad)" strokeWidth="1.5" opacity="0.8" />

        {/* 3. 3D Claymorphic Outer Sphere Shell */}
        <circle cx="100" cy="100" r="82" fill="url(#clay-base)" stroke="#cbd5e1" strokeWidth="1" />

        {/* 3D clay inner shadow simulation */}
        <path d="M 23,100 A 77,77 0 0 0 177,100 A 77,75 0 0 1 23,100" fill="#94a3b8" opacity="0.25" />
        {/* 3D clay highlight simulation */}
        <path d="M 23,100 A 77,77 0 0 1 177,100 A 77,79 0 0 0 23,100" fill="#ffffff" opacity="0.6" />

        {/* 4. Glowing Neon Active Ring (Pulsates slightly when typing) */}
        <motion.rect
          x="35" y="55" width="130" height="90" rx="45"
          fill="none"
          stroke={isMax ? "url(#max-ring)" : "url(#aura-ring)"}
          strokeWidth="6.5"
          filter="url(#ring-glow)"
          animate={isTyping ? { strokeWidth: [6.5, 9, 6.5] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* 5. Inset Matte Display Screen */}
        <rect
          x="39" y="59" width="122" height="82" rx="41"
          fill="url(#screen-grad)"
          stroke={isMax ? "#0f3a1f" : "#5a0f1b"}
          strokeWidth="1.5"
        />

        {/* 6. Beveled Edge Highlight for Matte Screen Inset */}
        <path d="M 40,100 A 41,41 0 0 0 160,100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* 7. Bright Glowing White Oval LED Eyes */}
        <g style={{ transformOrigin: '100px 100px' }}>
          {renderEyes()}
        </g>
      </svg>
    </motion.div>
  );
}

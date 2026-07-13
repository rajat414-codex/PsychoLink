import React from 'react';
import { motion } from 'framer-motion';
import premiumAiCore from './assets/premium_ai_core.png';

/**
 * Hyper-Realistic 3D Claymorphic & Holographic AI Core Avatar
 * Uses the pre-rendered 3D asset as a base with dynamic CSS filters and vector overlays.
 * Features:
 * - 100% photorealistic 3D claymorphic body and iridescent glass rings.
 * - Dynamic color filters (Red/Pink for Aura, Emerald Green for Max).
 * - Vector eye-mask overlay to support responsive morphing expressions.
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

  // Determine active AI color shift
  const isMax = glowColor.toLowerCase() === '#34c759' || glowColor.toLowerCase() === '#22c55e' || glowColor.toLowerCase() === '#10b981';
  
  // Aura (Red) shifts orange/gold to red/pink; Max (Green) shifts orange/gold to emerald green
  const colorFilter = isMax 
    ? 'hue-rotate(85deg) saturate(1.5) contrast(1.05)' 
    : 'hue-rotate(320deg) saturate(1.6) contrast(1.05)';

  // Render SVG override eyes depending on expression
  const renderInteractiveEyes = () => {
    const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';
    
    // For happy, we can either use the pre-rendered eyes or draw glowing arches
    if (isHappy) {
      return (
        <>
          {/* Glowing Arches matching the pre-render */}
          <path d="M 72,106 Q 85,82 98,106" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
          <path d="M 108,106 Q 121,82 134,106" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
          <path d="M 72,106 Q 85,82 98,106" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          <path d="M 108,106 Q 121,82 134,106" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
        </>
      );
    }

    switch (expression) {
      case 'dizzy':
      case 'error':
        return (
          <>
            {/* Cross eyes X X */}
            <path d="M 74,90 L 92,108 M 92,90 L 74,108" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 112,90 L 130,108 M 130,90 L 112,108" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 74,90 L 92,108 M 92,90 L 74,108" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
            <path d="M 112,90 L 130,108 M 130,90 L 112,108" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Flat sleeping lines - - */}
            <line x1="72" y1="99" x2="94" y2="99" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <line x1="110" y1="99" x2="132" y2="99" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <line x1="72" y1="99" x2="94" y2="99" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <line x1="110" y1="99" x2="132" y2="99" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad eyes */}
            <path d="M 72,93 Q 85,119 98,93" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 108,93 Q 121,119 134,93" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 72,93 Q 85,119 98,93" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
            <path d="M 108,93 Q 121,119 134,93" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            {/* Default Vertical Oval Eyes (White glowing capsules) */}
            <ellipse cx="80" cy="100" rx="13" ry="19" fill="#ffffff" opacity="0.65" filter="url(#eye-glow)" />
            <ellipse cx="120" cy="100" rx="13" ry="19" fill="#ffffff" opacity="0.65" filter="url(#eye-glow)" />
            <ellipse cx="80" cy="100" rx="13" ry="19" fill="#ffffff" />
            <ellipse cx="120" cy="100" rx="13" ry="19" fill="#ffffff" />
          </>
        );
    }
  };

  return (
    <motion.div
      className={`premium-3d-claymorphic-avatar ${className}`}
      animate={{ y: [0, -5, 0] }}
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
      {/* 1. Pre-rendered 3D claymorphism asset with hue color filters */}
      <img 
        src={premiumAiCore} 
        alt="AI Core" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: colorFilter,
          transition: 'filter 0.5s ease'
        }}
      />

      {/* 2. Interactive SVG Overlay for morphing eye expressions */}
      <svg
        viewBox="0 0 200 200"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <filter id="eye-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 
          Mask Overlay:
          We overlay a dark capsule mask matching the pre-render's display slot.
          This covers the default happy eyes so we can dynamically paint the exact eye expressions (pills, crosses, lines) on top!
        */}
        <rect 
          x="56" 
          y="74" 
          width="88" 
          height="52" 
          rx="26" 
          fill="#0c0e18" 
          opacity="0.99"
        />

        {/* Interactive Glowing White Eyes */}
        <g style={{ transformOrigin: '100px 100px' }}>
          {renderInteractiveEyes()}
        </g>
      </svg>
    </motion.div>
  );
}

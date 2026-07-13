import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium 3D Glossy Sphere Robot Avatar
 * Renders the exact futuristic robot head from the reference image.
 * Features:
 * - 3D white glossy ceramic outer sphere.
 * - Horizontal dark display faceplate screen.
 * - Glowing neon border ring (glowing Red for Aura, glowing Green for Max).
 * - High-contrast glowing white vertical oval eyes.
 * - Soft drop-shadow and screen gloss highlights.
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

  // Determine if active AI is Max (Green theme) or Aura (Red theme)
  const isMax = glowColor.toLowerCase() === '#34c759' || glowColor.toLowerCase() === '#22c55e' || glowColor.toLowerCase() === '#10b981';

  // Render SVG eye shapes based on emotion (eyes are always glowing white, matching the visual)
  const renderEyes = () => {
    const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';
    
    if (isHappy) {
      return (
        <>
          {/* Happy arched closed white eyes ^ ^ */}
          {/* Glow Underlay */}
          <path d="M 61,107 Q 75,77 89,107" fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
          <path d="M 111,107 Q 125,77 139,107" fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
          {/* Sharp Overlay */}
          <path d="M 61,107 Q 75,77 89,107" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
          <path d="M 111,107 Q 125,77 139,107" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" />
        </>
      );
    }

    switch (expression) {
      case 'dizzy':
      case 'error':
        return (
          <>
            {/* Cross eyes X X */}
            {/* Glow Underlay */}
            <path d="M 65,90 L 85,110 M 85,90 L 65,110" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 115,90 L 135,110 M 135,90 L 115,110" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <path d="M 65,90 L 85,110 M 85,90 L 65,110" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <path d="M 115,90 L 135,110 M 135,90 L 115,110" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Flat sleeping lines - - */}
            {/* Glow Underlay */}
            <line x1="61" y1="100" x2="89" y2="100" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <line x1="111" y1="100" x2="139" y2="100" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <line x1="61" y1="100" x2="89" y2="100" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
            <line x1="111" y1="100" x2="139" y2="100" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downward slanted eyes */}
            {/* Glow Underlay */}
            <path d="M 61,93 Q 75,123 89,93" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 111,93 Q 125,123 139,93" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <path d="M 61,93 Q 75,123 89,93" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
            <path d="M 111,93 Q 125,123 139,93" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            {/* Default Vertical Oval Eyes matching the image */}
            {/* Glow Underlay */}
            <ellipse cx="75" cy="100" rx="14" ry="20" fill="#ffffff" opacity="0.6" filter="url(#eye-glow)" />
            <ellipse cx="125" cy="100" rx="14" ry="20" fill="#ffffff" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <ellipse cx="75" cy="100" rx="14" ry="20" fill="#ffffff" />
            <ellipse cx="125" cy="100" rx="14" ry="20" fill="#ffffff" />
          </>
        );
    }
  };

  return (
    <motion.div
      className={`premium-3d-avatar ${className}`}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }}
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
          {/* Sphere reflection/shading for 3D body effect */}
          <linearGradient id="sphere-shading" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#d1d5db" />
          </linearGradient>

          {/* Glossy glass screen gradient */}
          <linearGradient id="screen-gloss" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Glowing Aura (Red) ring gradient */}
          <linearGradient id="aura-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff453a" />
            <stop offset="50%" stopColor="#ff2d55" />
            <stop offset="100%" stopColor="#ff3b30" />
          </linearGradient>

          {/* Glowing Max (Green) ring gradient */}
          <linearGradient id="max-ring" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#30d158" />
            <stop offset="50%" stopColor="#34c759" />
            <stop offset="100%" stopColor="#24b045" />
          </linearGradient>

          {/* Neon glow filters */}
          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="eye-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Subtle shadow under the body to give floating height */}
        <ellipse cx="100" cy="184" rx="55" ry="9" fill="rgba(0,0,0,0.12)" filter="blur(4px)" />

        {/* 2. Outer Glossy White Sphere Body */}
        <circle cx="100" cy="100" r="86" fill="url(#sphere-shading)" stroke="#e5e7eb" strokeWidth="1" />

        {/* 3. Glowing Neon Border Ring (Scales on typing/speaking) */}
        <motion.rect
          x="31" y="51" width="138" height="98" rx="49"
          fill="none"
          stroke={isMax ? "url(#max-ring)" : "url(#aura-ring)"}
          strokeWidth="6"
          filter="url(#ring-glow)"
          animate={isTyping ? { strokeWidth: [6, 9, 6] } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* 4. Horizontal Black Glossy Faceplate Display Screen */}
        <rect
          x="35" y="55" width="130" height="90" rx="45"
          fill="url(#screen-gloss)"
          stroke={isMax ? "#0f371e" : "#500e19"}
          strokeWidth="1.5"
        />

        {/* 5. Glass Reflection Highlight overlay */}
        <path
          d="M 45,75 A 40,40 0 0 1 155,75 A 35,35 0 0 0 45,75 Z"
          fill="#ffffff"
          opacity="0.08"
          pointerEvents="none"
        />

        {/* 6. White Glowing LED Eyes */}
        <g style={{ transformOrigin: '100px 100px' }}>
          {renderEyes()}
        </g>
      </svg>
    </motion.div>
  );
}

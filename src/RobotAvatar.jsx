import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Chat Bubble AI Avatar
 * Renders the exact chat bubble shape with glowing vertical pill eyes from the user's reference image.
 * Features:
 * - High-fidelity squarish chat bubble path.
 * - Dynamic pill-shaped LED eyes that morph expressions (happy arches, dizzy crosses, sleep lines, default vertical pills).
 * - Interactive hover floating animation.
 * - Rich color theme gradients matching the active AI core.
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#3b82f6',
  isTyping = false,
  className = '',
  style = {}
}) {
  const sizeMap = { lg: 220, md: 130, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  // Determine active theme colors based on AI type
  const isAura = glowColor.toLowerCase() === '#ff007f' || glowColor.toLowerCase() === '#e0524d';
  const colorStart = isAura ? '#ff4b8d' : '#38bdf8'; // Sky blue from image
  const colorEnd = isAura ? '#c026d3' : '#1d4ed8';   // Deep blue
  const glow = isAura ? '#ff007f' : '#3b82f6';

  // Render SVG eye shapes based on emotion
  const renderEyes = () => {
    // Left eye center at X=84, Right eye center at X=116 (out of viewBox 200x200)
    const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';
    
    if (isHappy) {
      return (
        <>
          {/* Happy arched closed eyes ^ ^ */}
          <path d="M 72,100 Q 84,78 96,100" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" filter="url(#eye-glow)" />
          <path d="M 104,100 Q 116,78 128,100" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" filter="url(#eye-glow)" />
        </>
      );
    }

    switch (expression) {
      case 'dizzy':
      case 'error':
        return (
          <>
            {/* Cross eyes X X */}
            <path d="M 76,82 L 92,98 M 92,82 L 76,98" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" filter="url(#eye-glow)" />
            <path d="M 108,82 L 124,98 M 124,82 L 108,98" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" filter="url(#eye-glow)" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Flat sleeping lines - - */}
            <line x1="74" y1="90" x2="94" y2="90" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" filter="url(#eye-glow)" />
            <line x1="106" y1="90" x2="126" y2="90" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" filter="url(#eye-glow)" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downward slanted eyes */}
            <path d="M 72,90 Q 84,112 96,90" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" filter="url(#eye-glow)" />
            <path d="M 104,90 Q 116,112 128,90" fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" filter="url(#eye-glow)" />
          </>
        );
      default:
        return (
          <>
            {/* Default Vertical Pill-Shaped Eyes from Reference Image */}
            <rect x="75" y="72" width="18" height="46" rx="9" fill="#ffffff" filter="url(#eye-glow)" />
            <rect x="107" y="72" width="18" height="46" rx="9" fill="#ffffff" filter="url(#eye-glow)" />
          </>
        );
    }
  };

  return (
    <motion.div
      className={`chat-bubble-ai-avatar ${className}`}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: d, height: d,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 4px 20px ${glow}44) drop-shadow(0 0 12px ${glow}33)`,
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
          {/* Subtle glow for the eyes */}
          <filter id="eye-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Bubble background gradient */}
          <linearGradient id="bubble-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>

        {/* 1. CHAT BUBBLE OUTER BODY (Morphs scale slightly if typing) */}
        <motion.path
          d="M 55,45 L 145,45 A 35,35 0 0 1 180,80 L 180,110 A 35,35 0 0 1 145,145 L 145,168 L 125,145 L 55,145 A 35,35 0 0 1 20,110 L 20,80 A 35,35 0 0 1 55,45 Z"
          fill="url(#bubble-grad)"
          animate={isTyping ? {
            scale: [1, 1.04, 1],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* 2. INNER GLOWING LED EYES */}
        <g style={{ transformOrigin: '100px 95px' }}>
          {renderEyes()}
        </g>
      </svg>
    </motion.div>
  );
}

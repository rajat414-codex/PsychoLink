import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Chat Bubble AI Avatar
 * Renders the exact chat bubble shape with glowing vertical pill eyes from the user's reference image.
 * Enhancements:
 * - Sharp high-contrast double-rendered eyes (glow underlay + sharp white overlay).
 * - Perfectly proportioned eye spacing for maximum clarity.
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
    // Left eye center at X=83, Right eye center at X=117 (out of viewBox 200x200)
    const isHappy = expression === 'happy' || expression === 'smile' || expression === 'laughing';
    
    if (isHappy) {
      return (
        <>
          {/* Happy arched closed eyes ^ ^ */}
          {/* Glow Underlay */}
          <path d="M 70,102 Q 83,76 96,102" fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
          <path d="M 104,102 Q 117,76 130,102" fill="none" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
          {/* Sharp Overlay */}
          <path d="M 70,102 Q 83,76 96,102" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <path d="M 104,102 Q 117,76 130,102" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
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
            <path d="M 73,81 L 93,101 M 93,81 L 73,101" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 107,81 L 127,101 M 127,81 L 107,101" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <path d="M 73,81 L 93,101 M 93,81 L 73,101" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <path d="M 107,81 L 127,101 M 127,81 L 107,101" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Flat sleeping lines - - */}
            {/* Glow Underlay */}
            <line x1="72" y1="91" x2="94" y2="91" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <line x1="106" y1="91" x2="128" y2="91" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <line x1="72" y1="91" x2="94" y2="91" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
            <line x1="106" y1="91" x2="128" y2="91" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad downward slanted eyes */}
            {/* Glow Underlay */}
            <path d="M 70,90 Q 83,114 96,90" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            <path d="M 104,90 Q 117,114 130,90" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <path d="M 70,90 Q 83,114 96,90" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
            <path d="M 104,90 Q 117,114 130,90" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            {/* Default Vertical Pill-Shaped Eyes from Reference Image */}
            {/* Glow Underlay */}
            <rect x="73" y="71" width="20" height="48" rx="10" fill="#ffffff" opacity="0.6" filter="url(#eye-glow)" />
            <rect x="107" y="71" width="20" height="48" rx="10" fill="#ffffff" opacity="0.6" filter="url(#eye-glow)" />
            {/* Sharp Overlay */}
            <rect x="73" y="71" width="20" height="48" rx="10" fill="#ffffff" />
            <rect x="107" y="71" width="20" height="48" rx="10" fill="#ffffff" />
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
        filter: `drop-shadow(0 4px 20px ${glow}33) drop-shadow(0 0 10px ${glow}22)`,
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
          <filter id="eye-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
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

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium Futuristic AI Robot Avatar
 * Replaces the old circular pulsing aura with a cute, high-tech, vector robot face.
 * Features:
 * - Glowing customizable LED eyes that morph based on the current expression (smile, happy, sad, dizzy, sleep, default).
 * - Glowing communication antenna on top.
 * - Digital speaker/mouth wave that animates into a speaking wave when typing/processing.
 * - Clean SVG layout with micro-shadows and rich gradients.
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#00e5ff',
  isTyping = false,
  className = '',
  style = {}
}) {
  const sizeMap = { lg: 220, md: 130, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  // Determine core theme color
  const isError = expression === 'dizzy' || expression === 'sad' || expression === 'cry';
  const color = isError ? '#f43f5e' : glowColor;

  // Render SVG eye shapes based on emotion
  const renderEyes = () => {
    // Left eye center at X=70, Right eye center at X=130 (out of viewBox 200x200)
    switch (expression) {
      case 'happy':
        return (
          <>
            {/* Happy arched eyes ^ ^ */}
            <path d="M 55,105 Q 70,85 85,105" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" filter="url(#led-glow)" />
            <path d="M 115,105 Q 130,85 145,105" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" filter="url(#led-glow)" />
          </>
        );
      case 'smile':
        return (
          <>
            {/* Soft smiling eyes */}
            <path d="M 58,102 Q 70,90 82,102" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" filter="url(#led-glow)" />
            <path d="M 118,102 Q 130,90 142,102" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" filter="url(#led-glow)" />
            {/* Cheerful small blush circles */}
            <circle cx="58" cy="115" r="7" fill={`${color}25`} filter="url(#blush-blur)" />
            <circle cx="142" cy="115" r="7" fill={`${color}25`} filter="url(#blush-blur)" />
          </>
        );
      case 'sad':
      case 'cry':
        return (
          <>
            {/* Sad downward slanting/arched eyes */}
            <path d="M 55,95 Q 70,110 85,95" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" filter="url(#led-glow)" />
            <path d="M 115,95 Q 130,110 145,95" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" filter="url(#led-glow)" />
          </>
        );
      case 'dizzy':
        return (
          <>
            {/* Cross eyes X X */}
            <path d="M 60,90 L 80,110 M 80,90 L 60,110" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" filter="url(#led-glow)" />
            <path d="M 120,90 L 140,110 M 140,90 L 120,110" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" filter="url(#led-glow)" />
          </>
        );
      case 'sleep':
        return (
          <>
            {/* Flat sleeping lines - - */}
            <line x1="58" y1="100" x2="82" y2="100" stroke={color} strokeWidth="6" strokeLinecap="round" filter="url(#led-glow)" />
            <line x1="118" y1="100" x2="142" y2="100" stroke={color} strokeWidth="6" strokeLinecap="round" filter="url(#led-glow)" />
          </>
        );
      default:
        return (
          <>
            {/* Default circular glowing eyes */}
            <circle cx="70" cy="100" r="11" fill={color} filter="url(#led-glow)" />
            <circle cx="130" cy="100" r="11" fill={color} filter="url(#led-glow)" />
            {/* Cute pupil highlight */}
            <circle cx="67" cy="97" r="3" fill="#ffffff" />
            <circle cx="127" cy="97" r="3" fill="#ffffff" />
          </>
        );
    }
  };

  return (
    <motion.div
      className={`ai-robot-avatar ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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
          {/* LED Eyes Glow Filter */}
          <filter id="led-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Blush blur effect */}
          <filter id="blush-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Helmet Gradient */}
          <linearGradient id="helmet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e2230" />
            <stop offset="50%" stopColor="#151722" />
            <stop offset="100%" stopColor="#0b0c12" />
          </linearGradient>

          {/* Visor Gradient */}
          <linearGradient id="visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#08090d" />
            <stop offset="100%" stopColor="#020305" />
          </linearGradient>

          {/* Ear Accent Gradient */}
          <linearGradient id="ear-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#0b0c12" />
          </linearGradient>
        </defs>

        {/* 1. ANTENNA */}
        {/* Stem */}
        <line x1="100" y1="50" x2="100" y2="25" stroke="#25293c" strokeWidth="6" strokeLinecap="round" />
        <line x1="100" y1="45" x2="100" y2="25" stroke={color} strokeWidth="2" opacity="0.6" />
        {/* Glowing bulb */}
        <motion.circle
          cx="100"
          cy="20"
          r="8"
          fill={color}
          filter="url(#led-glow)"
          animate={isTyping ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] } : { opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* 2. EARS / SIDE SENSORS */}
        {/* Left Ear */}
        <rect x="18" y="85" width="12" height="40" rx="6" fill={`url(#ear-grad)`} transform="rotate(10 18 85)" />
        <circle cx="23" cy="105" r="3" fill={color} filter="url(#led-glow)" />
        {/* Right Ear */}
        <rect x="170" y="85" width="12" height="40" rx="6" fill={`url(#ear-grad)`} transform="rotate(-10 170 85)" />
        <circle cx="177" cy="105" r="3" fill={color} filter="url(#led-glow)" />

        {/* 3. MAIN HELMET / SHELL */}
        <rect
          x="30"
          y="45"
          width="140"
          height="120"
          rx="40"
          fill="url(#helmet-grad)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* 4. BLACK SCREEN VISOR */}
        <rect
          x="42"
          y="62"
          width="116"
          height="86"
          rx="26"
          fill="url(#visor-grad)"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Visor shine accent */}
        <path
          d="M 52,72 Q 100,66 148,72"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* 5. LED EYES */}
        {renderEyes()}

        {/* 6. SPEAKING SOUNDWAVE / MOUTH */}
        {isTyping ? (
          /* Talking animated audio wave */
          <g>
            {[-12, -6, 0, 6, 12].map((offset, i) => (
              <motion.line
                key={i}
                x1={100 + offset}
                y1="125"
                x2={100 + offset}
                y2="135"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#led-glow)"
                animate={{
                  y1: [127, 122, 127],
                  y2: [133, 138, 133]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </g>
        ) : (
          /* Silent flat digital status mouth line */
          <line
            x1="90"
            y1="130"
            x2="110"
            y2="130"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
            filter="url(#led-glow)"
          />
        )}
      </svg>
    </motion.div>
  );
}

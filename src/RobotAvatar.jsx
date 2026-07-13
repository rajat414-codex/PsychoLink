import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium Morphing Liquid Metal Aura Avatar
 * Renders an organic 3D-effect fluid mercury/plasma droplet.
 * Features:
 * - Buttery-smooth vector morphing paths using Framer Motion.
 * - Multi-layered metallic gloss gradients and specular highlights.
 * - Dynamic pulsation, rotation, and morph speeds that react when the AI is typing.
 * - Translucent color dodge blending for an immersive sci-fi glow.
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

  // Determine active theme color highlights
  const isAura = glowColor.toLowerCase() === '#ff007f' || expression === 'happy' || expression === 'smile';
  const color1 = isAura ? '#ff007f' : '#00f2fe';
  const color2 = isAura ? '#7975d4' : '#4f46e5';
  const color3 = isAura ? '#be185d' : '#0e7490';

  // Specifying organic fluid shape keyframes (Blob shape transformations)
  const pathA = "M 100,30 C 145,30 170,55 170,100 C 170,145 145,170 100,170 C 55,170 30,145 30,100 C 30,55 55,30 100,30 Z";
  const pathB = "M 100,35 C 150,22 178,58 168,102 C 158,146 142,162 98,172 C 54,182 32,138 32,98 C 32,58 50,48 100,35 Z";
  const pathC = "M 100,26 C 138,36 178,48 174,98 C 170,148 136,158 106,164 C 76,170 28,148 28,98 C 28,48 62,16 100,26 Z";
  const pathD = "M 100,32 C 142,42 166,66 166,100 C 166,134 142,166 100,166 C 58,166 34,134 34,100 C 34,66 58,22 100,32 Z";

  // Control speed of the liquid morphing loop
  const morphDuration = isTyping ? 3.5 : 7.0;

  return (
    <motion.div
      className={`liquid-metal-avatar ${className}`}
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
          {/* Neon Glow Filter */}
          <filter id="aura-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core liquid metal chrome reflection */}
          <linearGradient id="chrome-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#8d94ba" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#1e2235" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0b0c16" stopOpacity="0.95" />
          </linearGradient>

          {/* Glowing liquid highlights */}
          <linearGradient id="neon-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="50%" stopColor={color2} />
            <stop offset="100%" stopColor={color3} />
          </linearGradient>

          {/* Core central light source */}
          <radialGradient id="center-core" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor={color1} stopOpacity="0.45" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* LAYER 1: Deep Background Glow (Blurry aura) */}
        <motion.path
          animate={{
            d: [pathA, pathB, pathC, pathD, pathA],
            rotate: [0, 90, 180, 270, 360],
            scale: isTyping ? [0.96, 1.08, 0.96] : [1, 1.03, 1]
          }}
          transition={{
            duration: morphDuration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: '100px 100px' }}
          d={pathA}
          fill="url(#neon-glow)"
          opacity="0.32"
          filter="url(#aura-blur)"
        />

        {/* LAYER 2: Secondary Intertwining Fluid Core (Opposite Rotation) */}
        <motion.path
          animate={{
            d: [pathC, pathD, pathA, pathB, pathC],
            rotate: [360, 270, 180, 90, 0],
            scale: isTyping ? [1.05, 0.95, 1.05] : [1, 0.98, 1]
          }}
          transition={{
            duration: morphDuration * 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: '100px 100px' }}
          d={pathC}
          fill="url(#neon-glow)"
          opacity="0.25"
          filter="url(#aura-blur)"
        />

        {/* LAYER 3: 3D Chrome Liquid Bubble Body */}
        <motion.path
          animate={{
            d: [pathA, pathC, pathB, pathD, pathA],
            scale: isTyping ? [0.97, 1.03, 0.97] : [1, 1.01, 1]
          }}
          transition={{
            duration: morphDuration * 1.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          d={pathA}
          fill="url(#chrome-grad)"
          stroke={`url(#neon-glow)`}
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* LAYER 4: Inner Glowing Core (Simulates active pulse / cognitive node) */}
        <motion.circle
          cx="100"
          cy="95"
          r={isTyping ? 36 : 28}
          fill="url(#center-core)"
          animate={isTyping ? {
            r: [30, 42, 30],
            opacity: [0.7, 1.0, 0.7]
          } : {
            r: [24, 28, 24],
            opacity: [0.8, 0.92, 0.8]
          }}
          transition={{
            duration: isTyping ? 1.2 : 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* LAYER 5: Specular 3D Gloss Highlight */}
        <motion.path
          animate={{
            d: [
              "M 65,65 Q 100,55 135,65",
              "M 62,68 Q 100,56 138,68",
              "M 65,65 Q 100,55 135,65"
            ]
          }}
          transition={{
            duration: morphDuration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.32"
        />
      </svg>
    </motion.div>
  );
}

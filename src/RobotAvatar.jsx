import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium SaaS AI Avatar: "The Modern Intelligence Aura"
 * Inspired by the absolute peak of current AI design (Apple Intelligence / ChatGPT Voice).
 * Features a deep, pure black core surrounded by a fluid, multi-colored, spinning holographic aura.
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#00e5ff',
  isTyping = false,
  className = '',
  style = {}
}) {
  const sizeMap = { lg: 240, md: 140, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  const isSleep = expression === 'sleep';
  const isError = expression === 'dizzy' || expression === 'sad' || expression === 'cry';

  // Base colors for the aura
  const primaryColor = isError ? '#f43f5e' : glowColor;
  
  // Create a stunning multi-color fluid gradient based on the primary color
  // If the primary color is teal, it blends teal, purple, deep blue, and white.
  // If it's pink, it blends pink, orange, purple, and white.
  const gradient = isError 
    ? `conic-gradient(from 0deg, #f43f5e, #fb923c, #9333ea, #f43f5e)`
    : `conic-gradient(from 0deg, ${primaryColor}, #8b5cf6, #3b82f6, #e0e7ff, ${primaryColor})`;

  // Animation timings
  const spinSpeed = isTyping ? 1.5 : isSleep ? 8 : 4;
  const pulseSpeed = isTyping ? 1 : isSleep ? 4 : 2;

  // When typing, the black core shrinks slightly, exposing MORE of the raging colorful energy
  const coreScale = isTyping ? 0.8 : isSleep ? 0.95 : 0.9;
  const auraScale = isTyping ? 1.15 : isSleep ? 0.95 : 1.05;

  return (
    <div className={`ai-modern-aura ${className}`} style={{
      width: d, height: d,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      
      {/* 1. The Raging Holographic Aura (The glowing edge) */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [auraScale * 0.98, auraScale * 1.02, auraScale * 0.98]
        }}
        transition={{ 
          rotate: { duration: spinSpeed, repeat: Infinity, ease: "linear" },
          scale: { duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          inset: '-5%', // Extend slightly beyond the container
          borderRadius: '50%',
          background: gradient,
          // Extreme blur creates the "Apple Intelligence" fluid light bleed
          filter: `blur(${d * 0.15}px)`,
          opacity: isSleep ? 0.4 : 1,
          zIndex: 0
        }}
      />

      {/* 2. Secondary Inner Aura (For intense brightness near the edge) */}
      <motion.div
        animate={{ 
          rotate: [360, 0]
        }}
        transition={{ 
          rotate: { duration: spinSpeed * 1.5, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: gradient,
          filter: `blur(${d * 0.05}px)`,
          opacity: isSleep ? 0.2 : 0.8,
          zIndex: 1
        }}
      />

      {/* 3. The Deep Void Core (The solid black center) */}
      <motion.div
        animate={{ 
          scale: [coreScale, coreScale * 0.98, coreScale] 
        }}
        transition={{ 
          duration: pulseSpeed * 0.5, repeat: Infinity, ease: "easeInOut" 
        }}
        style={{
          position: 'absolute',
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: '#000000',
          zIndex: 2,
          // Subtle physical rim light on the black sphere itself
          boxShadow: `inset 0 0 ${d * 0.05}px rgba(255,255,255,0.1), 0 0 ${d * 0.02}px rgba(0,0,0,0.5)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Subtle processing ring inside the core (Only visible when typing) */}
        {isTyping && (
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [0.8, 1, 0.8],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              width: '60%', height: '60%',
              borderRadius: '50%',
              border: `2px solid transparent`,
              borderTopColor: primaryColor,
              borderBottomColor: primaryColor,
              filter: 'blur(2px)'
            }}
          />
        )}
      </motion.div>
      
    </div>
  );
}
